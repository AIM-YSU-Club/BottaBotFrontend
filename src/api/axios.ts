import axios, { InternalAxiosRequestConfig } from 'axios';

// 🚀 2번 해결: TypeScript 에러 방지를 위해 기존 Axios 설정 타입에 _retry 속성 추가
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// 1. 명세서에 지정된 기본 API 주소 설정
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. 요청(Request) 인터셉터: 모든 API 요청을 보낼 때 토큰을 자동으로 붙여줍니다.
api.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      // TypeScript가 headers가 undefined일 수도 있다고 걱정하므로 안전하게 처리
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. 응답(Response) 인터셉터: 명세서의 공통 응답 포맷 및 토큰 만료(401) 처리
api.interceptors.response.use(
  (response) => {
    // 🚀 3번 해결: 명세서의 공통 포맷 { success: true, data: {...} } 에 맞게 처리하되, 
    // 예외적인 응답이라도 일관성 있게 data 안쪽을 리턴하도록 수정
    if (response.data && response.data.success !== undefined) {
      return response.data.success ? response.data.data : response.data;
    }
    return response.data; 
  },
  async (error) => {
    // 확정한 커스텀 타입으로 변환하여 _retry 에러 방지
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // 명세서 기준: 401 에러(UNAUTHORIZED) + TOKEN_EXPIRED 발생 시
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 무한 루프 방지

      try {
        const refreshToken = sessionStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        // 🚀 1번 해결: 하드코딩된 주소 대신 환경 변수(VITE_API_BASE_URL) 사용
        const refreshResponse = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        // 새 토큰 저장
        const newAccessToken = refreshResponse.data.data.accessToken; 
        sessionStorage.setItem('accessToken', newAccessToken);

        // 실패했던 원래 요청에 새 토큰을 붙여서 다시 시도
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return api(originalRequest);

      } catch (refreshError) {
        // 리프레시 토큰까지 만료되었거나 실패하면 완전히 로그아웃 처리
        console.error('토큰 갱신 실패:', refreshError);
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        window.location.href = '/login'; // 로그인 페이지로 강제 이동
        return Promise.reject(refreshError);
      }
    }

    // 그 외의 에러는 그대로 반환
    return Promise.reject(error);
  }
);

export default api;
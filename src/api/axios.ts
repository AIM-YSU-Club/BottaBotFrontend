import axios from 'axios';

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
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. 응답(Response) 인터셉터: 명세서의 공통 응답 포맷 및 토큰 만료(401) 처리
api.interceptors.response.use(
  (response) => {
    // 명세서의 공통 포맷 { success: true, data: {...} } 에 맞게 실제 데이터만 뽑아서 넘깁니다.
    return response.data.success ? response.data.data : response; 
  },
  async (error) => {
    const originalRequest = error.config;

    // 명세서 기준: 401 에러(UNAUTHORIZED) + TOKEN_EXPIRED 발생 시
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 무한 루프 방지

      try {
        const refreshToken = sessionStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        // 명세서 기준: POST /auth/refresh 로 새 토큰 발급 요청
        const refreshResponse = await axios.post('https://api.bottabot.com/api/v1/auth/refresh', {
          refreshToken,
        });

        // 새 토큰 저장
        const newAccessToken = refreshResponse.data.data.accessToken; // (명세서 응답 구조에 따라 조정 필요)
        sessionStorage.setItem('accessToken', newAccessToken);

        // 실패했던 원래 요청에 새 토큰을 붙여서 다시 시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
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
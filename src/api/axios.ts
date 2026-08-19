import axios from 'axios';
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

// 🚀 2번 해결: TypeScript 에러 방지를 위해 기존 Axios 설정 타입에 _retry 속성 추가
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

const unsetContentType = (headers: InternalAxiosRequestConfig['headers']) => {
  if (!headers) return;
  if (typeof headers.delete === 'function') {
    headers.delete('Content-Type');
    return;
  }
  delete (headers as Record<string, unknown>)['Content-Type'];
  delete (headers as Record<string, unknown>)['content-type'];
};

// 2. 요청(Request) 인터셉터: 모든 API 요청을 보낼 때 토큰을 자동으로 붙여줍니다.
api.interceptors.request.use(
  (config) => {
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      unsetContentType(config.headers);
    }

    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
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

// 응답 인터셉터가 실제로는 response.data(성공 포맷이면 response.data.data)를 반환하도록
// 언랩하는데, axios 기본 타입은 여전히 Promise<AxiosResponse<T>>라고 주장합니다.
// 그래서 `api.get(...).someField` 같은 코드가 `tsc -b`(실제 빌드)에서만 걸리는
// "Property does not exist on AxiosResponse" 에러로 계속 쌓였습니다. 런타임은 그대로 두고
// 내보내는 타입만 실제 동작(언랩된 데이터)에 맞게 다시 선언합니다.
// 호출부에서 제네릭을 안 넘기면 any로 느슨하게 받도록 둡니다(엄격한 unknown으로 바꾸면
// 기존의 타입 안 붙인 api 호출부가 전부 깨집니다).
/* eslint-disable @typescript-eslint/no-explicit-any */
interface UnwrappedApiClient {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  patch<T = any>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T = any>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export default api as unknown as UnwrappedApiClient;
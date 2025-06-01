import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:8080/api", // 로컬 개발용
});

// 요청 인터셉터: access token 자동 첨부
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 발생 시 refresh 시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // refreshToken으로 accessToken 재발급
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await axios.post(
          "https://a-log.site/api/user-service/refresh-token",
          { refreshToken }
        );
        const newAccessToken = res.data.data.accessToken;
        localStorage.setItem("jwtToken", newAccessToken);

        // 원래 요청에 새 토큰 적용 후 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // refresh도 실패하면 로그아웃 처리
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userId");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api; 
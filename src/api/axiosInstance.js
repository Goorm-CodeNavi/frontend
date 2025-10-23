import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    //const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzYxMDQ2NjkyLCJleHAiOjE3NjEwNTAyOTJ9.36LKcaonBy6mWroFQNh2crUI50xnNYcVY6_1VsoIjqmAbF8oaK0JSjSG3Mrc_yBMvFDwzRlcLJgjhk3yn8j8QQ";

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 액세스 토큰 만료 (401) 처리
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.log("로그인이 필요합니다.");
        return Promise.reject(error);
      }

      try {
        // 리프레시 토큰으로 새로운 액세스 토큰 요청
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/auth/refresh`,
          { refreshToken }
        );

        const newAccessToken = res.data.result.Access;
        localStorage.setItem("accessToken", newAccessToken);

        // 원래 요청 헤더에 새 토큰 추가 후 재요청
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.log("리프레시 토큰이 만료되었습니다. 다시 로그인해주세요.");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

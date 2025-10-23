import axios from "axios";

const CustomAxios = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키(리프레시 토큰) 자동 전송
});

const isAuthPath = (url = "") => url.includes("/api/auth/");

// 요청 인터셉터
CustomAxios.interceptors.request.use((config) => {
  // 로그인 등 토큰 불필요 요청
  if (config.skipAuth) {
    return config;
  }

  const token = localStorage.getItem("accessToken");
  const tokenType = localStorage.getItem("tokenType") || "Bearer";
  if (token) config.headers.Authorization = `${tokenType} ${token}`;
  return config;
});

// 응답 인터셉터
CustomAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // auth 경로는 리프레시 시도 X (루프 방지)
    if (isAuthPath(originalRequest?.url)) {
      return Promise.reject(error);
    }

    // 액세스 토큰 만료 (401)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 리프레시 토큰은 쿠키로 자동 전송됨
        const res = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/auth/refresh`,
          {},
          { withCredentials: true } // 쿠키 기반 인증
        );

        // 새 액세스 토큰 저장
        const { accessToken, tokenType } = res.data.result || {};
        if (!accessToken) throw new Error("액세스 토큰이 없습니다.");

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("tokenType", tokenType || "Bearer");

        // 원래 요청 다시 시도
        originalRequest.headers.Authorization = `${tokenType || "Bearer"} ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.log("리프레시 토큰이 만료되었습니다. 다시 로그인해주세요.");

        // 토큰 제거
        localStorage.removeItem("accessToken");
        localStorage.removeItem("tokenType");

        // 로그인 페이지로 이동
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default CustomAxios;

import CustomAxios from "./axios";

export const login = async ({ username, password }) => {
  const { data } = await CustomAxios.post(
    "/api/auth/login",
    { username, password },
    // 로그인은 JWT 필요 없음. 인터셉터가 Authorization을 붙이지 않게 플래그 전달
    { skipAuth: true }
  );
  return data;
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};
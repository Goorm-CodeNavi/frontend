import CustomAxios from "./axios";

// 로그인
export const login = async ({ username, password }) => {
  const { data } = await CustomAxios.post(
    "/api/auth/login",
    { username, password },
    // 로그인은 JWT 필요 없음. 인터셉터가 Authorization을 붙이지 않게 플래그 전달
    { skipAuth: true }
  );
  return data;
};

// 로그아웃
export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// 내 정보 조회
export const getUserinfo = async () => {
  const { data } = await CustomAxios.get("/api/users/me");

  if (!data?.isSuccess) {
    const msg = data?.message || "사용자 조회 실패";
    throw new Error(msg);
  }
  return data.result;
};

// 아이디 중복 확인
export const checkId = async (id) => {
  const { data, status } = await CustomAxios.get("/api/auth/check-id", {
    params: { id },
    skipAuth: true,
    validateStatus: (s) => [200, 400, 409].includes(s),
  });

  return { status, data };
};

// 내 제출 기록 조회
export const getMySubmissions = async ({ page = 0, size = 10 } = {}) => {
  const { data } = await CustomAxios.get("/api/users/me/submissions", {
    params: { page, size },
  });

  if (!data?.isSuccess) {
    throw new Error(data?.message || "제출 기록 조회 실패");
  }

  return data.result || {
    content: [],
    pageable: { pageNumber: page, pageSize: size },
    totalPages: 1,
    totalElements: 0,
    last: true,
  };
};
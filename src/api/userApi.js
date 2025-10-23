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
// (수정) username 파라미터에 기본값('')을 할당하여, undefined로 호출될 때 파라미터가 누락되는 것을 방지
export const checkId = async (username = '') => { // 파라미터 이름을 id에서 username으로 변경 (혹은 SignUp.js와 맞춤)
  const { data, status } = await CustomAxios.get("/api/auth/check-id", {
    params: { username }, // 백엔드 API의 @RequestParam("username")과 일치
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

// 회원가입
export const signUp = async ({ username, password, email }) => {
  try {
    const response = await CustomAxios.post(
      "/api/auth/signup",
      { username, password, email },
      {
        skipAuth: true,
        // 201, 400, 409를 "성공"으로 간주하여 try-catch에서 처리
        validateStatus: (s) => (s >= 200 && s < 300) || s === 400 || s === 409,
      }
    );
    // status와 data를 함께 반환하여 컴포넌트에서 분기 처리
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error("회원가입 요청 실패:", error);
    // 네트워크 오류 등 validateStatus 외의 예외
    if (error.response) {
      return { status: error.response.status, data: error.response.data };
    }
    // 네트워크 오류 등 알 수 없는 오류
    return {
      status: 500,
      data: { message: "알 수 없는 오류가 발생했습니다." }
    };
  }
};

// 아이디 찾기 - 인증코드 발송
export const sendVerificationCodeForId = async (email) => {
  const { data, status } = await CustomAxios.post(
    "/api/auth/find-id/send-code",
    { email },
    { skipAuth: true }
  );
  return { data, status };
};

// 아이디 찾기 - 코드 인증 및 아이디 확인
export const verifyCodeAndFindId = async (email, code) => {
  const { data, status } = await CustomAxios.post(
    "/api/auth/find-id/verify-code",
    { email, code },
    {
      skipAuth: true,
      // 400 (인증 실패) 에러를 catch에서 처리하기 위해 validateStatus 제거
      // (또는 400을 포함하도록 validateStatus를 설정할 수도 있습니다)
    }
  );
  // 누락된 반환 구문 추가
  return { data, status };
};
export const updateUserInfo = async (updateData) => {
  try {
    const response = await CustomAxios.put(
      "/api/users/me",
      updateData,
      {
        skipAuth: false,
        validateStatus: (s) => (s >= 200 && s < 300) || s === 400 || s === 404,
      }
    );
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error("정보 수정 요청 실패:", error);

    // ✅ 응답이 있을 때는 그대로 전달 (catch에서 reject 안 되게)
    if (error.response) {
      return { status: error.response.status, data: error.response.data };
    }

    // ✅ 네트워크 진짜 오류일 때만 catch 메시지로 보냄
    return {
      status: 500,
      data: { message: "네트워크 오류 또는 서버 응답 없음" },
    };
  }
};


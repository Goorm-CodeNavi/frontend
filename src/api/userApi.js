import axios from "axios";

const BASE_URL = "http://43.203.237.132:8080/api";

export const login = async (data) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/authenticateUser`,
      data
    );
    return response.data; // accessToken, tokenType 반환
  } catch (error) {
    console.error("로그인 API 오류:", error);
    throw error;
  }
};

import CustomAxios from "./axios";

// 문제 목록 조회
export const problemList = async (page = 0, size = 10) => {
  try {
    const response = await CustomAxios.get(`/api/problems`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("문제 목록 조회 실패", error);
    throw new Error("문제 목록을 불러오는 데 실패했습니다.");
  }
};

// 문제 상세 조회
export const problemDetails = async (problemNumber) => {
  try {
    const response = await CustomAxios.get(`/api/problems/${problemNumber}`);
    return response.data;
  } catch (error) {
    console.error("문제 상세 조회 실패", error);
    throw new Error("문제 상세 정보를 불러오는 데 실패했습니다.");
  }
};

// 사고 과정 캔버스 (최초)작성
export const createSolutions = async (problemNumber, data) => {
  try {
    const response = await CustomAxios.post(`/api/problems/${problemNumber}/solutions`, data);
    return response.data;
  } catch (error) {
    console.error("사고 과정 캔버스 작성 실패:", error);
    throw error;
  }
};

// 코드 실행
export const runJudgeCode = async (problemNumber, language, code) => {
  try {
    const response = await CustomAxios.post(`/api/problems/${problemNumber}/run`, {
      language,
      code,
    });
    return response.data;
  } catch (error) {
    console.error("코드 실행 실패:", error);
    throw error;
  }
};

// AI 해설 보기
export const fetchEditorial = async (problemNumber) => {
  try {
    const response = await CustomAxios.get(`/api/problem/${problemNumber}/editorial`);
    return response.data;
  } catch (error) {
    console.error("AI 해설보기 API 호출 실패:", error);
    throw error;
  }
};
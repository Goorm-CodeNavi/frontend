import CustomAxios from "./axios";

/// 사고 과정 캔버스 수정
export const updateSolution = async (solutionId, data) => {
  try {
    const response = await CustomAxios.post(`/api/solutions/${solutionId}/canvas`, data);
    return response.data;
  } catch (error) {
    console.error("사고 과정 캔버스 작성 실패:", error);
    throw error;
  }
};

// 코드 제출
export const submitJudgeCode = async (solutionId, {language, code, timeSpent}) => {
  try {
    const response = await CustomAxios.post(`/api/solutions/${solutionId}/submit`, {
      language,
      code,
      timeSpent,
    });
    return response.data;
  } catch (error) {
    console.error("코드 제출 실패:", error);
    throw error;
  }
};
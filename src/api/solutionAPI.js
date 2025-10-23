import axiosInstance from "./axiosInstance";

const API_URL = "/api/solutions";

/// 사고 과정 캔버스 수정
export const updateSolution = async (solutionId, data) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${solutionId}/canvas`, data);
    return response.data;
  } catch (error) {
    console.error("사고 과정 캔버스 작성 실패:", error);
    throw error;
  }
};

// 사고캔버스 제출
export const submitSolution = async (solutionId) => {
  const response = await axiosInstance.post(`${API_URL}/solutions/${solutionId}/submit`);
  return response.data;
};
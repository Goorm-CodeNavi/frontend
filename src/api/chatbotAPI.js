import chatAxios from './chatAxios';

export const sendChatMessage = async (message, sessionId) => {
  try {
    const response = await chatAxios.post(`/api/chat`, {
      message,
      session_id: sessionId,
    });

    console.log('API 응답 전체:', response.data);

    return {
      reply:
        response.data.reply ||
        response.data.message ||
        response.data.response ||
        '답변이 없습니다.',
      options: response.data.options || [],
    };
  } catch (error) {
    console.error('API 호출 에러:', error);
    throw error;
  }
};

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Chatbot.scss'; // 스타일 분리

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    // ✅ 로컬스토리지에서 기존 대화 불러오기
    const saved = localStorage.getItem('chatHistory');
    return saved
      ? JSON.parse(saved)
      : [{ sender: 'bot', text: '안녕하세요 👋 저는 사몽자입니다. 무엇을 도와드릴까요?' }];
  });
  const [input, setInput] = useState('');
  const chatRef = useRef(null);

  // ✅ 다른 영역 클릭 시 챗봇 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (chatRef.current && !chatRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    else document.removeEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // ✅ 대화 내용 저장
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  // ✅ 메시지 전송
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: input }]
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const aiReply = response.data.choices[0].message.content;
      setMessages((prev) => [...prev, { sender: 'bot', text: aiReply }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: '에러가 발생했어요 😢 다시 시도해주세요.' }
      ]);
    }
  };

  return (
    <div className="chatbot-container">
      {/* 💬 챗봇 아이콘 */}
      <button
        className="chatbot-icon"
        onClick={() => setIsOpen((prev) => !prev)} // ✅ 아이콘으로 토글
      >
        💬
      </button>

      {/* 💭 챗봇 창 */}
      <div
        className={`chat-window ${isOpen ? 'open' : ''}`} // ✅ 애니메이션 클래스
        ref={chatRef}
      >
        <div className="chat-header">사몽자 🤖</div>

        <div className="chat-body">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-message ${msg.sender === 'user' ? 'user' : 'bot'}`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="chat-input-area">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력하세요..."
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage}>전송</button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;

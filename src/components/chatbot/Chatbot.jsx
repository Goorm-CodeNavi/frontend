import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chatbot.scss';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('chatSessions');
    if (saved) return JSON.parse(saved);

    return [
      {
        id: crypto.randomUUID(),
        title: '새 채팅',
        messages: [
          { sender: 'bot', text: '안녕하세요. 무엇을 도와드릴까요?' },
        ],
      },
    ];
  });

  const [currentSessionId, setCurrentSessionId] = useState(sessions[0].id);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);
  const chatBodyRef = useRef(null); // <-- 실제 스크롤 컨테이너 ref

  const currentSession = sessions.find((s) => s.id === currentSessionId);

  // 로컬스토리지 저장
  useEffect(() => {
    localStorage.setItem('chatSessions', JSON.stringify(sessions));
  }, [sessions]);

  // 외부 클릭 시 닫기
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

  // 스크롤 함수 (안정적)
  const scrollToBottom = () => {
    const el = chatBodyRef.current;
    if (!el) return;
    // micro task로 보장 (DOM 업데이트 직후)
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  };

  // 메시지나 로딩 상태 변경 시 자동 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages.length, loading, currentSessionId]);

  // 새 채팅 생성
  const createNewSession = () => {
    const newSession = {
      id: crypto.randomUUID(),
      title: '새 채팅',
      messages: [
        { sender: 'bot', text: '안녕하세요. 새로운 대화를 시작합니다!' },
      ],
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  // 채팅 삭제
  const deleteSession = (id) => {
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      // 현재 보고 있던 세션을 삭제했으면 첫 세션으로 전환
      if (id === currentSessionId) {
        if (next.length > 0) setCurrentSessionId(next[0].id);
      }
      return next;
    });
  };

  // 메시지 전송
  const sendMessage = async () => {
    if (!input.trim()) return;

    const messageText = input;
    const userMessage = { sender: 'user', text: messageText, id: Date.now() };

    // 세션에 유저 메시지 추가 및 제목 자동 설정(첫 메시지)
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id === currentSessionId) {
          const updatedMessages = [...session.messages, userMessage];
          const updatedTitle =
            session.title === '새 채팅' ? messageText.slice(0, 20) : session.title;
          return { ...session, messages: updatedMessages, title: updatedTitle };
        }
        return session;
      })
    );
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: messageText }],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const aiReply = response.data.choices[0].message.content;
      const botMessage = { sender: 'bot', text: aiReply, id: Date.now() + 1 };

      setSessions((prev) =>
        prev.map((session) =>
          session.id === currentSessionId
            ? { ...session, messages: [...session.messages, botMessage] }
            : session
        )
      );
    } catch (error) {
      console.error(error);
      const errorMsg = { sender: 'bot', text: '에러가 발생했어요 😢 다시 시도해주세요.', id: Date.now() + 2 };
      setSessions((prev) =>
        prev.map((session) =>
          session.id === currentSessionId
            ? { ...session, messages: [...session.messages, errorMsg] }
            : session
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-icon" onClick={() => setIsOpen((p) => !p)}>
        💬
      </button>

      <div className={`chat-window ${isOpen ? 'open' : ''}`} ref={chatRef}>
        <div className="chat-header">사용자</div>

        <div className="chat-content">
          <div className="chat-sidebar">
            <button className="new-chat-btn" onClick={createNewSession}>
              ＋ 새 채팅
            </button>
            <div className="session-list">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`session-item ${session.id === currentSessionId ? 'active' : ''}`}
                  onClick={() => setCurrentSessionId(session.id)}
                >
                  <span className="session-title">{session.title}</span>
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(session.id);
                    }}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="chat-main">
            {/* 실제 스크롤 컨테이너에 ref 연결 */}
            <div className="chat-body" ref={chatBodyRef}>
              {currentSession?.messages.map((msg) => (
                <div key={msg.id ?? Math.random()} className={`chat-message ${msg.sender === 'user' ? 'user' : 'bot'}`}>
                  {msg.text}
                </div>
              ))}

              {loading && (
                <div className="chat-message bot loading">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              )}
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
      </div>
    </div>
  );
};

export default ChatBot;

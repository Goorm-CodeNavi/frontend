import React, { useState, useEffect, useRef } from 'react';
import { sendChatMessage } from '../../api/chatbotAPI';
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
  const chatBodyRef = useRef(null);

  const currentSession = sessions.find((s) => s.id === currentSessionId);

  useEffect(() => {
    localStorage.setItem('chatSessions', JSON.stringify(sessions));
  }, [sessions]);

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

  const scrollToBottom = () => {
    const el = chatBodyRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages.length, loading, currentSessionId]);

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

  const deleteSession = (id) => {
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      if (id === currentSessionId) {
        if (next.length > 0) setCurrentSessionId(next[0].id);
      }
      return next;
    });
  };

  const sendMessage = async (customMessage) => {
    const messageText = customMessage || input;
    if (!messageText.trim()) return;

    const userMessage = { sender: 'user', text: messageText, id: crypto.randomUUID() };

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
      const { reply, options } = await sendChatMessage(messageText, currentSessionId);

      const botMessage = {
        sender: 'bot',
        text: reply || '답변이 없습니다.',
        id: crypto.randomUUID(),
        options: options || [], // ✅ 옵션 추가 저장
      };

      setSessions((prev) =>
        prev.map((session) =>
          session.id === currentSessionId
            ? { ...session, messages: [...session.messages, botMessage] }
            : session
        )
      );
    } catch (error) {
      console.error(error);
      const errorMsg = {
        sender: 'bot',
        text: '에러가 발생했어요 😢 다시 시도해주세요.',
        id: crypto.randomUUID(),
      };
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
          {/* 사이드바 */}
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

          {/* 메인 채팅 영역 */}
          <div className="chat-main">
            <div className="chat-body" ref={chatBodyRef}>
              {currentSession?.messages.map((msg) => (
                <div
                  key={msg.id ?? Math.random()}
                  className={`chat-message ${msg.sender === 'user' ? 'user' : 'bot'}`}
                >
                  <div>{msg.text}</div>

                  {/* ✅ 옵션 버튼 표시 */}
                  {msg.options && msg.options.length > 0 && (
                    <div className="chat-options">
                      {msg.options.map((opt, idx) => (
                        <button
                          key={idx}
                          className="option-btn"
                          onClick={() => setInput(opt)} // 클릭 시 입력창에 자동 세팅
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
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
                disabled={loading}
              />
              <button onClick={() => sendMessage()} disabled={loading}>
                전송
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;

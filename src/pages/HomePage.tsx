import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'; 
import api from '../api/axios';

// ==========================================
// 🚀 [팀원 공유용]: 타입 정의 영역
// ==========================================
interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
}

const HomePage = () => {
  // ==========================================
  // 🚀 [팀원 공유용]: 상태 관리 영역
  // ==========================================
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'ai', text: '안녕하세요! RAG 챗봇 봇타봇(BottaBot)입니다. 분석하고 싶은 문서를 업로드하거나 질문해 주세요.' }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 자동 스크롤을 위한 참조
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 🚀 [추가됨]: 숨겨진 파일 입력창(input type="file")을 클릭하기 위한 참조
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 메시지가 추가될 때마다 맨 아래로 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ==========================================
  // 🚀 [팀원 공유용]: 1. 파일 업로드 API 연동
  // ==========================================
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 🚀 [팀원 공유용]: 백엔드로 파일을 전송하기 위해 FormData 객체를 생성합니다.
    const formData = new FormData();
    formData.append('file', file);

    try {
      alert(`"${file.name}" 파일을 업로드하는 중입니다... (백엔드 연동 필요)`);
      
      // TODO(백엔드): 문서 업로드 API 엔드포인트 수정 필요 (예: POST /api/document/upload)
      // await api.post('/document/upload', formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' }
      // });
      
      // 업로드 완료 메시지를 채팅창에 띄워줍니다.
      const aiMessage: Message = { 
        id: Date.now(), 
        sender: 'ai', 
        text: `📄 "${file.name}" 문서가 성공적으로 업로드 및 분석되었습니다. 무엇이든 물어보세요!` 
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error: unknown) {
      console.error('파일 업로드 에러:', error);
      if (axios.isAxiosError(error)) {
        alert('파일 업로드 중 서버 문제가 발생했습니다.');
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      // 업로드 후 input 초기화 (같은 파일을 다시 올릴 수 있도록)
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // 🚀 [추가됨]: 클립 아이콘이나 우측 상단 버튼을 누르면 숨겨진 파일 입력창을 강제로 클릭해주는 함수
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // ==========================================
  // 🚀 [팀원 공유용]: 2. AI 채팅(질문 전송) API 연동
  // ==========================================
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // 1. 유저가 보낸 메시지를 먼저 화면에 추가
    const userMessage: Message = { id: Date.now(), sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue(''); 
    setIsLoading(true); 

    try {
      // TODO(백엔드): AI 챗봇(RAG) 질문 전송 API 엔드포인트 수정 필요 (예: POST /api/chat/ask)
      const response = await api.post('/chat/ask', { prompt: userMessage.text });
      
      const aiMessage: Message = { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: response.data.answer || '답변을 생성할 수 없습니다.' 
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error: unknown) { 
      console.error('채팅 전송 에러:', error);
      
      let errorText = '서버와 통신하는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요. 😢';
      if (!axios.isAxiosError(error)) {
        errorText = '알 수 없는 오류가 발생했습니다. 😢';
      }

      const errorMessage: Message = { id: Date.now() + 1, sender: 'ai', text: errorText };
      setMessages(prev => [...prev, errorMessage]);
      
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#131314', color: '#e3e3e3' }}>
      
      {/* ========================================== */}
      {/* 🚀 [복구됨]: 상단 헤더 영역 (우측 상단 파일 업로드 버튼) */}
      {/* ========================================== */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '20px 40px', 
        borderBottom: '1px solid #444746',
        backgroundColor: '#1e1f20'
      }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '500' }}>현재 진행 중인 대화</h2>
        
        <button 
          onClick={triggerFileInput}
          style={{ 
            padding: '10px 20px', 
            borderRadius: '8px', 
            backgroundColor: '#303030', 
            color: '#a8c7fa', 
            border: '1px solid #444746', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 'bold'
          }}
        >
          <span style={{ fontSize: '16px' }}>+</span> 문서 업로드
        </button>
      </header>

      {/* 숨겨진 파일 입력창 (실제 파일 탐색기를 띄우는 역할) */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
        style={{ display: 'none' }} 
        accept=".pdf,.doc,.docx,.txt" // RAG 챗봇에서 주로 쓰이는 문서 확장자만 허용
      />

      {/* 1. 채팅 내역 출력 영역 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '40px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {messages.map((msg) => (
            <div key={msg.id} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              
              {msg.sender === 'ai' && (
                <div style={{ 
                  width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#303030', 
                  display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '15px', fontSize: '18px' 
                }}>
                  🤖
                </div>
              )}

              <div style={{ 
                maxWidth: '80%', padding: '15px 20px', borderRadius: '15px', lineHeight: '1.6',
                backgroundColor: msg.sender === 'user' ? '#1e1f20' : 'transparent', 
                border: msg.sender === 'user' ? '1px solid #444746' : 'none',
              }}>
                {msg.text}
              </div>
            </div>
          ))}

          {/* 로딩 표시기 */}
          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ 
                width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#303030', 
                display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '15px', fontSize: '18px' 
              }}>🤖</div>
              <div style={{ padding: '15px 20px', color: '#a8c7fa', animation: 'pulse 1.5s infinite' }}>
                답변을 생성하고 있습니다...
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} /> 
        </div>
      </div>

      {/* 2. 하단 입력창 (프롬프트 입력 영역) */}
      <div style={{ padding: '20px', backgroundColor: '#131314', display: 'flex', justifyContent: 'center' }}>
        <form 
          onSubmit={handleSendMessage} 
          style={{ width: '100%', maxWidth: '800px', position: 'relative', display: 'flex', alignItems: 'center' }}
        >
          {/* ========================================== */}
          {/* 🚀 [복구됨]: 입력창 좌측 클립(파일 첨부) 아이콘 */}
          {/* ========================================== */}
          <button 
            type="button" 
            onClick={triggerFileInput}
            style={{ 
              position: 'absolute', left: '15px', width: '30px', height: '30px', 
              background: 'transparent', border: 'none', color: '#c4c7c5', 
              cursor: 'pointer', fontSize: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center',
              zIndex: 10
            }}
          >
            📎
          </button>

          <input 
            type="text" 
            placeholder="업로드한 문서에 대해 질문해 보세요..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            style={{ 
              width: '100%', padding: '18px 60px 18px 55px', borderRadius: '30px', // 좌측 클립 아이콘 공간(55px) 확보
              backgroundColor: '#1e1f20', border: '1px solid #444746', 
              color: 'white', outline: 'none', fontSize: '15px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            }} 
          />

          <button 
            type="submit" 
            disabled={!inputValue.trim() || isLoading}
            style={{ 
              position: 'absolute', right: '10px', width: '40px', height: '40px', 
              borderRadius: '50%', backgroundColor: inputValue.trim() ? '#a8c7fa' : '#303030', 
              color: inputValue.trim() ? '#041e49' : '#7a7c7f', 
              border: 'none', cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
              display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'background-color 0.2s'
            }}
          >
            <span style={{ transform: 'rotate(45deg)', marginTop: '-2px', marginLeft: '-2px', fontSize: '18px' }}>🚀</span>
          </button>
        </form>
      </div>

    </div>
  );
};

export default HomePage;
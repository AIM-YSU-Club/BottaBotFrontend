import React, { useState } from 'react';

// 🚀 [팀원 공유용]: 나중에 types 폴더로 분리할 메시지 타입 정의입니다.
interface Message {
  id: number;
  text: string;
  isUser: boolean; // true면 사용자 질문, false면 AI(RAG) 답변
  source?: string; // AI 답변일 경우 참고한 출처 (SCR08 요구사항)
}

const HomePage = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // 🚀 [팀원 공유용]: 현재는 임시 상태(State)로 관리하지만, 나중에는 Zustand나 Redux 같은 전역 상태로 빼거나 API 응답으로 덮어씌워야 하는 부분입니다.
  const [messages, setMessages] = useState<Message[]>([]);

  // 🚀 [팀원 공유용]: 폼 제출(엔터 키 또는 보내기 버튼) 시 실행되는 함수입니다. 백엔드(AI 서버)와 통신하는 핵심 로직이 들어갈 자리입니다.
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // 1. 내가 보낸 질문을 화면에 먼저 띄움
    const newUserMsg: Message = { id: Date.now(), text: inputValue, isUser: true };
    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue(''); // 입력창 비우기

    // 2. 🚀 [팀원 공유용]: 여기서 백엔드(RAG API)로 newUserMsg.text 를 전송(axios.post 등)해야 합니다!
    // 아래는 백엔드에서 응답이 왔다고 가정한 임시(Dummy) 로직입니다. (1초 뒤에 답변 도착)
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: '해당 내용에 대해 분석한 결과입니다. 업로드하신 소스에 따르면...',
        isUser: false,
        source: '[문서 1] 자바 프로그래밍 기본.pdf (p.15)', // RAG 출처 표시
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center',       
      justifyContent: 'center', background: 'radial-gradient(circle at 50% 50%, rgba(30, 45, 90, 0.3) 0%, #131314 40%)',
      position: 'relative', padding: '0 15%' // 🚀 [팀원 공유용]: 채팅이 너무 넓게 퍼지지 않도록 좌우 패딩을 주었습니다.
    }}>
      
      {/* 우측 상단 소스 업로드 버튼 (SCR07) */}
      <div className="icon-wrapper" style={{ position: 'absolute', top: '15px', right: '15px', color: '#c4c7c5' }} onClick={() => setIsUploadModalOpen(true)}>
        <span style={{ fontSize: '20px' }}>🖋️</span>
        <span className="tooltip left-side">소스 업로드</span>
      </div>

      {/* ========================================== */}
      {/* 메인 영역 (메시지가 없으면 인사말, 있으면 채팅창 출력) */}
      {/* ========================================== */}
      <div style={{ flex: 1, width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '40px 0', scrollbarWidth: 'none' }}>
        
        {messages.length === 0 ? (
          // 1. 채팅 내역이 없을 때 (초기 화면)
          <div style={{ margin: 'auto', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '400', color: '#e3e3e3', marginBottom: '40px' }}>무엇을 도와드릴까요?</h1>
          </div>
        ) : (
          // 2. 채팅 내역이 있을 때 (대화 화면 - SCR08)
          // 🚀 [팀원 공유용]: 나중에 이 맵핑(map) 부분 전체를 <ChatMessageList /> 같은 독립적인 컴포넌트로 분리하면 코드가 더 깔끔해집니다!
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.isUser ? 'flex-end' : 'flex-start' }}>
                
                {/* 사용자 혹은 AI 아이콘 */}
                {!msg.isUser && <div style={{ fontSize: '20px', marginBottom: '10px' }}>✨</div>}
                
                {/* 말풍선 */}
                <div style={{ 
                  backgroundColor: msg.isUser ? '#303030' : 'transparent', // 사용자는 박스형, AI는 투명 배경
                  padding: msg.isUser ? '15px 20px' : '0',
                  borderRadius: '20px', color: '#e3e3e3', maxWidth: '90%', lineHeight: '1.6'
                }}>
                  {msg.text}
                </div>

                {/* 🚀 [팀원 공유용]: RAG 모델에서 넘어온 출처(Source)를 렌더링하는 부분입니다. */}
                {!msg.isUser && msg.source && (
                  <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#1e1f20', borderRadius: '8px', border: '1px solid #444746', fontSize: '12px', color: '#a8c7fa', display: 'inline-block' }}>
                    🔍 출처: {msg.source}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* 하단 입력창 (폼 형태로 변경하여 엔터키 지원) */}
      {/* ========================================== */}
      <form onSubmit={handleSendMessage} style={{ 
        display: 'flex', alignItems: 'center', backgroundColor: '#1e1f20', 
        borderRadius: '35px', padding: '10px 20px', width: '100%', maxWidth: '800px', 
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)', marginBottom: '30px'
      }}>
        <span style={{ fontSize: '24px', marginRight: '15px', color: '#c4c7c5', cursor: 'pointer', fontWeight: '300' }} onClick={() => setIsUploadModalOpen(true)}>＋</span>
        <input 
          type="text" 
          placeholder="Gemini에게 물어보기" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} // 입력값 상태 업데이트
          style={{ flex: 1, backgroundColor: 'transparent', border: 'none', color: '#e3e3e3', fontSize: '16px', outline: 'none', padding: '10px 0' }} 
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* 🚀 [팀원 공유용]: 텍스트가 있을 때만 보내기(비행기) 아이콘이 뜨도록 처리했습니다. */}
          {inputValue.trim() ? (
            <button type="submit" style={{ background: 'transparent', border: 'none', color: '#a8c7fa', fontSize: '20px', cursor: 'pointer' }}>전송🚀</button>
          ) : (
            <span style={{ fontSize: '18px', color: '#c4c7c5', cursor: 'pointer' }}>🎤</span>
          )}
        </div>
      </form>

      {/* 소스 업로드 모달 (기존 코드와 동일하여 생략 없이 전체 유지) */}
      {isUploadModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#1e1f20', padding: '30px', borderRadius: '15px', width: '500px', border: '1px solid #444746', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: '#e3e3e3', fontSize: '20px', fontWeight: '500' }}>새 소스 추가</h2>
              <button type="button" onClick={() => setIsUploadModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#c4c7c5', fontSize: '20px', cursor: 'pointer' }}>✖</button>
            </div>
            <div style={{ border: '2px dashed #444746', borderRadius: '10px', padding: '40px', textAlign: 'center', marginBottom: '20px', cursor: 'pointer', backgroundColor: '#131314' }}>
              <div style={{ fontSize: '30px', marginBottom: '10px' }}>📄</div>
              <div style={{ color: '#e3e3e3', marginBottom: '5px' }}>클릭하거나 파일을 여기로 드래그하세요</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" placeholder="또는 분석할 웹사이트 URL 입력" style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: 'white', outline: 'none', boxSizing: 'border-box' }} />
              <button type="button" style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#a8c7fa', color: '#041e49', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>소스 업로드하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
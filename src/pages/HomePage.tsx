import React, { useState, useRef } from 'react';

// 대화 기록 데이터 타입 정의
interface ChatHistory {
  id: number;
  tag: string;
  time: string;
  summary: string;
  msgCount: number;
}

const HomePage = () => {
  // ==========================================
  // 💡 상태(State) 및 참조(Ref) 설정
  // ==========================================
  const [msgInput, setMsgInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 초기 더미 데이터 세팅 (HTML에 있던 내용 그대로)
  const [histories, setHistories] = useState<ChatHistory[]>([
    { id: 1, tag: '문서 분석', time: '오늘 오전 10:24', summary: '업로드한 데이터베이스 설계 PDF를 요약해달라고 요청했고, ERD 정규화 관련 질문을 이어서 물어봤어요.', msgCount: 8 },
    { id: 2, tag: '일반 질문', time: '어제 오후 6:47', summary: 'JetPack 설치 중 발생한 오류에 대해 물어보고, WSL2 Docker 연동 관련 해결 방법을 안내받았어요.', msgCount: 5 },
    { id: 3, tag: '과제 도움', time: '7월 12일', summary: 'React와 FastAPI를 WebSocket으로 연결하는 구조에 대해 질문하고 예시 코드를 받았어요.', msgCount: 12 },
  ]);

  // ==========================================
  // ⚙️ 기능 로직 (HTML의 자바스크립트 완벽 번역)
  // ==========================================
  
  // 현재 시간 구하기 함수
  const getNowLabel = () => {
    const d = new Date();
    let h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, '0');
    const ampm = h < 12 ? '오전' : '오후';
    h = h % 12 || 12;
    return `오늘 ${ampm} ${h}:${m}`;
  };

  // 메시지 전송(Submit) 처리
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim()) return;

    // 새 대화 카드 맨 앞에 추가
    const newHistory: ChatHistory = {
      id: Date.now(),
      tag: '새 대화',
      time: getNowLabel(),
      summary: msgInput.trim(),
      msgCount: 1
    };
    setHistories([newHistory, ...histories]);
    setMsgInput(''); // 입력창 비우기
  };

  // 문서 업로드 버튼 클릭 시 숨겨진 input[type="file"] 클릭 유도
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // 파일이 선택되었을 때 처리
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const names = Array.from(files).map(f => f.name).join(', ');
      
      const newHistory: ChatHistory = {
        id: Date.now(),
        tag: '문서 업로드',
        time: getNowLabel(),
        summary: `📎 파일 첨부: ${names}`,
        msgCount: 1
      };
      setHistories([newHistory, ...histories]);
    }
  };

  // ==========================================
  // 🎨 UI 렌더링 (HTML 태그 리액트화)
  // ==========================================
  return (
    <div style={{ height: '100%', backgroundColor: 'var(--bg)', overflowY: 'auto' }}>
      
      {/* 1. 상단바 (Topbar) */}
      <header className="topbar">
        <div className="topbar-inner container">
          
          <div className="topbar-row">
            <div className="brand">
              <div className="mascot"><span className="eyes"><span></span><span></span></span></div>
              <div className="brand-text">
                <h1 className="name">BottaBot</h1>
                <span className="status"><span className="dot"></span>온라인</span>
              </div>
            </div>
            
            <button className="upload-btn" type="button" onClick={handleUploadClick}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12"/><path d="M7 8l5-5 5 5"/><path d="M5 21h14a2 2 0 0 0 2-2v-4"/><path d="M3 15v4a2 2 0 0 0 2 2"/></svg>
              문서 업로드
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              multiple 
              onChange={handleFileChange} 
            />
          </div>

          {/* 입력창 (Composer) */}
          <form className="composer" onSubmit={handleChatSubmit}>
            <input 
              type="text" 
              placeholder="메시지를 입력하면 새 대화 기록이 생성돼요..." 
              autoComplete="off" 
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
            />
            <button type="submit" aria-label="전송">
              <svg viewBox="0 0 24 24" fill="none"><path d="M4 12L20 4L14 20L11 13L4 12Z" fill="white"/></svg>
            </button>
          </form>

        </div>
      </header>

      {/* 2. 메인 콘텐츠 영역 */}
      <main className="dashboard-main container">
        <div className="section-head">
          <h2>대화 기록</h2>
          <span>총 {histories.length}개</span>
        </div>

        <div className="history-grid">
          
          {/* 동적으로 대화 기록 카드 렌더링 */}
          {histories.map((history) => (
            <div className="history-card" key={history.id}>
              <div className="row-top">
                <span className="tag">{history.tag}</span>
                <span className="time">{history.time}</span>
              </div>
              <div className="summary">{history.summary}</div>
              <div className="meta">메시지 {history.msgCount}개</div>
            </div>
          ))}

          {/* 대화 추가(+) 카드 */}
          <div className="history-card add-card" onClick={() => document.querySelector<HTMLInputElement>('.composer input')?.focus()}>
            <span className="plus-circle">
              <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
            </span>
          </div>

        </div>
      </main>

      {/* 우측 하단 도움말 플로팅 버튼 */}
      <div className="help-fab">?</div>

    </div>
  );
};

export default HomePage;
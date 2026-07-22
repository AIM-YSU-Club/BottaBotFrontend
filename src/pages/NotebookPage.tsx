import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// 대화 기록 데이터 타입 정의
interface ChatHistory {
  id: number;
  tag: string;
  time: string;
  summary: string;
  msgCount: number;
}

const NotebookPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  // ==========================================
  // 💡 상태(State) 및 참조(Ref) 설정
  // ==========================================
  const [msgInput, setMsgInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 🚀 로딩 상태 추가: 처음에 방에 들어오면 무조건 '로딩 중(true)' 상태로 시작합니다.
  const [isLoading, setIsLoading] = useState(true);

  // 초기 더미 데이터
  const [histories, setHistories] = useState<ChatHistory[]>([
    { id: 1, tag: '문서 분석', time: '오늘 오전 10:24', summary: '업로드한 데이터베이스 설계 PDF를 요약해달라고 요청했고, ERD 정규화 관련 질문을 이어서 물어봤어요.', msgCount: 8 },
    { id: 2, tag: '일반 질문', time: '어제 오후 6:47', summary: 'JetPack 설치 중 발생한 오류에 대해 물어보고, WSL2 Docker 연동 관련 해결 방법을 안내받았어요.', msgCount: 5 },
  ]);

  // ==========================================
  // ⏳ 라이프사이클 (백엔드 통신 시뮬레이션)
  // ==========================================
  useEffect(() => {
    // URL의 방 번호(id)가 바뀔 때마다 무조건 로딩을 true로 켭니다.
    setIsLoading(true);

    // 가짜 통신 타이머: 0.8초(800ms) 뒤에 데이터를 다 받아온 것처럼 로딩을 끕니다.
    // (실제 백엔드를 붙일 때는 이 자리에 api.get('/notebook/...') 코드가 들어갑니다!)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [id]);

  // ==========================================
  // ⚙️ 기능 로직
  // ==========================================
  const getNowLabel = () => {
    const d = new Date();
    let h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, '0');
    const ampm = h < 12 ? '오전' : '오후';
    h = h % 12 || 12;
    return `오늘 ${ampm} ${h}:${m}`;
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim()) return;

    const newHistory: ChatHistory = {
      id: Date.now(),
      tag: '새 대화',
      time: getNowLabel(),
      summary: msgInput.trim(),
      msgCount: 1
    };
    setHistories([newHistory, ...histories]);
    setMsgInput(''); 
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // ==========================================
  // 📦 파일이 선택되었을 때 처리 (진짜 FormData 통신 로직)
  // ==========================================
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const names = Array.from(files).map(f => f.name).join(', ');
    
    // 1. UX 향상: 화면에 먼저 "⏳ 업로드 중..." 카드를 띄워줍니다.
    const tempId = Date.now();
    const uploadingHistory: ChatHistory = {
      id: tempId,
      tag: '문서 업로드',
      time: getNowLabel(),
      summary: `⏳ 업로드 중...: ${names}`,
      msgCount: 0
    };
    
    // 기존 대화 기록 맨 앞에 임시 카드 추가
    setHistories(prev => [uploadingHistory, ...prev]);

    // 2. 📦 백엔드로 보낼 택배 상자(FormData) 포장하기
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      // 'documents'라는 키값으로 파일을 상자에 넣습니다. (나중에 백엔드 명세서에 맞춰 이름 변경 가능!)
      formData.append('documents', file); 
    });

    try {
      // ==========================================
      // 🚀 실제 서버 연동 시 아래 주석을 풀어주시면 됩니다!
      // ==========================================
      /*
      const token = sessionStorage.getItem('accessToken');
      
      // 파라미터로 받은 노트북 id를 주소에 넣어 해당 방으로 파일을 보냅니다.
      const response = await fetch(`http://localhost:8080/api/notebook/${id}/upload`, {
        method: 'POST',
        headers: {
          // 💡 꿀팁: FormData를 보낼 때는 'Content-Type'을 안 적는 것이 규칙입니다! (브라우저가 알아서 Boundary 설정)
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('업로드 서버 에러');
      // const data = await response.json(); 
      */

      // ⏳ 현재는 백엔드 서버가 켜져 있지 않으므로 1.5초 동안 통신하는 척(시뮬레이션) 대기합니다.
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 3. 통신이 완료되면 '업로드 중' 카드를 '✅ 완료' 상태로 싹 바꿔줍니다.
      setHistories(prev => prev.map(history => 
        history.id === tempId 
          ? { ...history, summary: `✅ 파일 업로드 완료: ${names}`, msgCount: 1 }
          : history
      ));

    } catch (error) {
      console.error("파일 전송 실패:", error);
      
      // 에러 발생 시 '❌ 실패' 상태로 변경
      setHistories(prev => prev.map(history => 
        history.id === tempId 
          ? { ...history, summary: `❌ 업로드 실패: ${names}` }
          : history
      ));
    }
  };

  // ==========================================
  // 🎨 UI 렌더링 
  // ==========================================

  // 🚀 로딩 중일 때 보여줄 '스피너 화면' (본래 화면 대신 렌더링)
  if (isLoading) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg)' }}>
        {/* CSS 애니메이션이 포함된 SVG 스피너 아이콘 */}
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--leaf-deep)" strokeWidth="3" strokeLinecap="round" strokeDasharray="16 16" style={{ animation: 'spin 1s linear infinite' }}>
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          <circle cx="12" cy="12" r="10" />
        </svg>
        <div style={{ marginTop: '20px', fontSize: '15.5px', fontWeight: 700, color: 'var(--ink)' }}>
          {id === 'new' ? '새로운 캔버스를 준비하는 중...' : '노트북 데이터를 불러오는 중...'}
        </div>
      </div>
    );
  }

  // 로딩이 끝나면 보여줄 '진짜 채팅방 화면'
  return (
    <div style={{ height: '100%', backgroundColor: 'var(--bg)', overflowY: 'auto', animation: 'fadeIn 0.3s ease-in-out' }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
      
      <header className="topbar">
        <div className="topbar-inner container">
          <div className="topbar-row">
            
            <button 
              type="button" 
              onClick={() => navigate('/')} 
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginRight: '16px', display: 'flex', alignItems: 'center', color: 'var(--ink)' }}
            >
              <svg viewBox="0 0 24 24" style={{ width: '24px', height: '24px', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>

            <div className="brand">
              <div className="mascot"><span className="eyes"><span></span><span></span></span></div>
              <div className="brand-text">
                <h1 className="name">{id === 'new' ? '새 노트북' : '작업 노트북'}</h1>
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

      <main className="dashboard-main container">
        <div className="section-head">
          <h2>대화 기록</h2>
          <span>총 {histories.length}개</span>
        </div>

        <div className="history-grid">
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

          <div className="history-card add-card" onClick={() => document.querySelector<HTMLInputElement>('.composer input')?.focus()}>
            <span className="plus-circle">
              <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
            </span>
          </div>
        </div>
      </main>

      <div className="help-fab">?</div>
    </div>
  );
};

export default NotebookPage;
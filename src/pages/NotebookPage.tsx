import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import BrandBlock from '../components/notebook/BrandBlock';
import SectionHead from '../components/notebook/SectionHead';
import HistoryCard from '../components/notebook/HistoryCard';
import AddCard from '../components/notebook/AddCard';
import ChatComposer from '../components/notebook/ChatComposer';

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

  const [msgInput, setMsgInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [histories, setHistories] = useState<ChatHistory[]>([
    {
      id: 1,
      tag: '문서 분석',
      time: '오늘 오전 10:24',
      summary:
        '업로드한 데이터베이스 설계 PDF를 요약해달라고 요청했고, ERD 정규화 관련 질문을 이어서 물어봤어요.',
      msgCount: 8,
    },
    {
      id: 2,
      tag: '일반 질문',
      time: '어제 오후 6:47',
      summary:
        'JetPack 설치 중 발생한 오류에 대해 물어보고, WSL2 Docker 연동 관련 해결 방법을 안내받았어요.',
      msgCount: 5,
    },
  ]);

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [id]);

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
      msgCount: 1,
    };
    setHistories([newHistory, ...histories]);
    setMsgInput('');
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const names = Array.from(files)
      .map((f) => f.name)
      .join(', ');

    const tempId = Date.now();
    const uploadingHistory: ChatHistory = {
      id: tempId,
      tag: '문서 업로드',
      time: getNowLabel(),
      summary: `⏳ 업로드 중...: ${names}`,
      msgCount: 0,
    };

    setHistories((prev) => [uploadingHistory, ...prev]);

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('documents', file);
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setHistories((prev) =>
        prev.map((history) =>
          history.id === tempId
            ? { ...history, summary: `✅ 파일 업로드 완료: ${names}`, msgCount: 1 }
            : history
        )
      );
    } catch (error) {
      console.error('파일 전송 실패:', error);

      setHistories((prev) =>
        prev.map((history) =>
          history.id === tempId ? { ...history, summary: `❌ 업로드 실패: ${names}` } : history
        )
      );
    }
  };

  if (isLoading) {
    return (
      <LoadingSpinner
        message={id === 'new' ? '새로운 캔버스를 준비하는 중...' : '노트북 데이터를 불러오는 중...'}
      />
    );
  }

  return (
    <div
      style={{
        height: '100%',
        backgroundColor: 'var(--bg)',
        overflowY: 'auto',
        animation: 'fadeIn 0.3s ease-in-out',
      }}
    >
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>

      <header className="topbar">
        <div className="topbar-inner container">
          <div className="topbar-row">
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                marginRight: '16px',
                display: 'flex',
                alignItems: 'center',
                color: 'var(--ink)',
              }}
            >
              <svg
                viewBox="0 0 24 24"
                style={{
                  width: '24px',
                  height: '24px',
                  fill: 'none',
                  stroke: 'currentColor',
                  strokeWidth: 2,
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                }}
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <BrandBlock
              name={id === 'new' ? '새 노트북' : '작업 노트북'}
              status="온라인"
            />

            <button className="upload-btn" type="button" onClick={handleUploadClick}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v12" />
                <path d="M7 8l5-5 5 5" />
                <path d="M5 21h14a2 2 0 0 0 2-2v-4" />
                <path d="M3 15v4a2 2 0 0 0 2 2" />
              </svg>
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

          <ChatComposer value={msgInput} onChange={setMsgInput} onSubmit={handleChatSubmit} />
        </div>
      </header>

      <main className="dashboard-main container">
        <SectionHead title="대화 기록" subtitle={`총 ${histories.length}개`} />

        <div className="history-grid">
          {histories.map((history) => (
            <HistoryCard
              key={history.id}
              tag={history.tag}
              time={history.time}
              title={history.summary}
              meta={`메시지 ${history.msgCount}개`}
            />
          ))}

          <AddCard
            onClick={() => document.querySelector<HTMLInputElement>('.composer input')?.focus()}
          />
        </div>
      </main>

      <div className="help-fab">?</div>
    </div>
  );
};

export default NotebookPage;

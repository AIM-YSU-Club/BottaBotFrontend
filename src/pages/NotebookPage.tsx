import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Mascot from '../components/common/Mascot';
import ChatComposer from '../components/notebook/ChatComposer';
import { loadAllNotebooks, saveNotebook, type NotebookRecord, type Source } from '../utils/notebookStore';

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

const suggestions = ['새로운 주제에 관해 알아보기', '새로운 항목 만들기', '프로젝트 진행하기'];

const NotebookPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [notebookId, setNotebookId] = useState<string | null>(null);
  const [title, setTitle] = useState('제목 없는 노트북');
  const [sources, setSources] = useState<Source[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [msgInput, setMsgInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isReplying, setIsReplying] = useState(false);

  const [sourceModalOpen, setSourceModalOpen] = useState(false);
  const [sourceModalMode, setSourceModalMode] = useState<'menu' | 'website' | 'paste'>('menu');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [pasteText, setPasteText] = useState('');

  useEffect(() => {
    if (!id) return;

    if (id === 'new') {
      // ponytail: 여기서 바로 저장하지 않습니다. React StrictMode는 개발 모드에서 이 effect를
      // 두 번 실행하는데, 미리 저장해버리면 사용자가 아무 것도 안 했는데도
      // 빈 "제목 없는 노트북" 유령 레코드가 두 개 생겨서 홈 화면 "최근 노트북"에 뜹니다.
      // 실제로 제목을 바꾸거나 소스를 추가하는 등 편집을 해야 그때 저장되도록 미룹니다.
      navigate(`/notebook/${crypto.randomUUID()}`, { replace: true });
      return;
    }

    const existing = loadAllNotebooks()[id];
    setNotebookId(id);
    setTitle(existing?.title ?? '제목 없는 노트북');
    setSources(existing?.sources ?? []);
  }, [id, navigate]);

  const persist = (patch: Partial<Pick<NotebookRecord, 'title' | 'sources'>>) => {
    if (!notebookId) return;
    // 기존 레코드와 병합해서 저장합니다. 그냥 새 객체로 덮어쓰면 홈 화면에서 설정한
    // pinned(고정)/collections(컬렉션) 값이 여기서 제목만 바꿔도 날아가 버립니다.
    const existing = loadAllNotebooks()[notebookId];
    saveNotebook({ ...existing, id: notebookId, title, sources, updatedAt: Date.now(), ...patch });
  };

  const handleTitleBlur = () => persist({ title });

  const addSource = (name: string) => {
    const nextSources = [...sources, { id: Date.now() + Math.random(), name }];
    setSources(nextSources);
    persist({ sources: nextSources });
  };

  const openSourceModal = () => {
    setSourceModalMode('menu');
    setSourceModalOpen(true);
  };
  const closeSourceModal = () => {
    setSourceModalOpen(false);
    setWebsiteUrl('');
    setPasteText('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const nextSources = [
      ...sources,
      ...Array.from(files).map((f) => ({ id: Date.now() + Math.random(), name: f.name })),
    ];
    setSources(nextSources);
    persist({ sources: nextSources });
    e.target.value = '';
    closeSourceModal();
  };

  const handleAddWebsite = () => {
    if (!websiteUrl.trim()) return;
    addSource(websiteUrl.trim());
    closeSourceModal();
  };

  const handleAddPastedText = () => {
    if (!pasteText.trim()) return;
    const preview = pasteText.trim().slice(0, 24);
    addSource(`📋 ${preview}${pasteText.trim().length > 24 ? '…' : ''}`);
    closeSourceModal();
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || !notebookId) return;

    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', content: text.trim() }]);
    setMsgInput('');
    setIsReplying(true);

    try {
      // ponytail: 채팅 백엔드 스펙이 아직 없어 임시 경로로 호출합니다.
      // 공용 api 인스턴스(src/api/axios.ts)는 401을 받으면 토큰 재발급을 시도하다
      // 실패 시 전체 로그아웃까지 시켜버려서, 아직 존재하지 않는 이 엔드포인트가
      // 실패할 때마다 사용자가 로그인 화면으로 튕겨나가는 문제가 있었습니다.
      // 그래서 이 호출은 인터셉터가 없는 일반 axios로 분리했습니다.
      // 실제 API 스펙이 나오면 경로/응답 파싱만 바꾸면 됩니다.
      const token = sessionStorage.getItem('accessToken');
      const res = await axios.post<{ reply?: string }>(
        `${import.meta.env.VITE_API_BASE_URL}/notebooks/${notebookId}/chat`,
        { message: text.trim() },
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      );
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', content: res.data?.reply ?? '(빈 응답)' },
      ]);
    } catch (error) {
      console.error('채팅 응답 실패:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: '⚠️ 아직 백엔드와 연결되지 않아 응답을 받지 못했습니다.',
        },
      ]);
    } finally {
      setIsReplying(false);
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(msgInput);
  };

  const handleCreateNotebook = () => {
    persist({}); // 지금 작업 중이던 노트북을 먼저 저장
    navigate('/notebook/new');
  };

  if (!notebookId) return null;

  return (
    <div style={{ height: '100vh', backgroundColor: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <header className="topbar">
        <div className="topbar-inner" style={{ padding: '14px 20px' }}>
          <div className="topbar-row">
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                marginRight: '10px',
                display: 'flex',
                alignItems: 'center',
                color: 'var(--ink)',
              }}
            >
              <svg
                viewBox="0 0 24 24"
                style={{ width: '22px', height: '22px', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }}
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <Mascot size="sm" />

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              style={{
                fontSize: '20px',
                fontWeight: 800,
                color: 'var(--black)',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontFamily: 'inherit',
                marginLeft: '10px',
                padding: '4px 6px',
                borderRadius: '8px',
                minWidth: '80px',
              }}
              onFocus={(e) => (e.currentTarget.style.background = 'var(--leaf-soft)')}
              onBlurCapture={(e) => (e.currentTarget.style.background = 'transparent')}
            />

            <div style={{ flex: 1 }} />

            <button className="upload-btn" type="button" onClick={handleCreateNotebook}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              노트북 만들기
            </button>
          </div>
        </div>
      </header>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1px', backgroundColor: 'var(--leaf-line)', overflow: 'hidden' }}>
        {/* 출처 */}
        <section style={{ backgroundColor: 'var(--bg)', padding: '20px', overflowY: 'auto' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 14px' }}>출처</h2>

          <button type="button" className="btn btn-outline" onClick={openSourceModal} style={{ marginBottom: '16px' }}>
            + 소스 추가
          </button>
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} multiple onChange={handleFileChange} />

          {sources.length === 0 ? (
            <div style={{ marginTop: '32px', textAlign: 'center', color: 'var(--ink-soft)', fontSize: '13px', lineHeight: 1.6 }}>
              <p style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '8px' }}>저장된 소스가 여기에 표시됩니다</p>
              <p>파일, 웹사이트 등을 추가한 후 이러한 소스를 기반으로 질문하거나 콘텐츠를 만드세요.</p>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sources.map((s) => (
                <li key={s.id} style={{ fontSize: '13px', color: 'var(--ink)', padding: '8px 10px', border: '1px solid var(--leaf-line)', borderRadius: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {s.name}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* 채팅 */}
        <section style={{ backgroundColor: 'var(--bg)', display: 'flex', flexDirection: 'column', padding: '20px', minHeight: 0 }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 14px' }}>채팅</h2>

          {messages.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '18px', textAlign: 'center' }}>
              <span style={{ fontSize: '40px' }}>👋</span>
              <div>
                <h1 style={{ fontSize: '22px', margin: '0 0 10px' }}>노트북을 시작해 보세요...</h1>
                <p style={{ fontSize: '14px', color: 'var(--ink-soft)', maxWidth: '360px', margin: '0 auto' }}>
                  새로운 것을 이해하고, 만들고, 발전시킬 수 있는 나만의 빈 캔버스입니다. 소스를 추가해서 시작해보세요.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '260px' }}>
                {suggestions.map((s) => (
                  <button key={s} type="button" className="btn btn-outline" onClick={() => sendMessage(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', padding: '4px 4px 12px' }}>
              {messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '70%',
                    backgroundColor: m.role === 'user' ? 'var(--black)' : 'var(--leaf-soft)',
                    color: m.role === 'user' ? '#fff' : 'var(--ink)',
                    padding: '10px 14px',
                    borderRadius: '16px',
                    fontSize: '14px',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {m.content}
                </div>
              ))}
              {isReplying && (
                <div style={{ alignSelf: 'flex-start', color: 'var(--ink-soft)', fontSize: '13px', padding: '4px 6px' }}>
                  답변을 생성하는 중...
                </div>
              )}
            </div>
          )}

          <ChatComposer value={msgInput} onChange={setMsgInput} onSubmit={handleChatSubmit} placeholder="질문하거나 창작하세요" />
        </section>
      </div>

      {sourceModalOpen && (
        <div
          onClick={closeSourceModal}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg)',
              borderRadius: '24px',
              padding: '28px',
              width: '90%',
              maxWidth: '560px',
              boxShadow: 'var(--shadow)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={closeSourceModal}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--ink-soft)', fontSize: '18px' }}
              >
                ✕
              </button>
            </div>

            {sourceModalMode === 'menu' && (
              <>
                <h2 style={{ textAlign: 'center', fontSize: '19px', margin: '0 0 20px' }}>소스 추가</h2>

                <div
                  title="웹 검색 연동 준비 중입니다"
                  style={{
                    display: 'flex',
                    gap: '8px',
                    backgroundColor: 'var(--leaf-soft)',
                    border: '1.5px solid var(--leaf-line)',
                    borderRadius: '14px',
                    padding: '10px 14px',
                    marginBottom: '18px',
                    opacity: 0.55,
                    cursor: 'not-allowed',
                  }}
                >
                  <input
                    disabled
                    placeholder="웹에서 새 소스를 검색하세요 (준비 중)"
                    style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '13.5px', cursor: 'not-allowed' }}
                  />
                </div>

                <div
                  style={{
                    border: '2px dashed var(--leaf-line)',
                    borderRadius: '16px',
                    padding: '28px 16px',
                    textAlign: 'center',
                    marginBottom: '18px',
                  }}
                >
                  <p style={{ fontWeight: 700, margin: '0 0 4px' }}>또는 파일 드롭</p>
                  <p style={{ fontSize: '12.5px', color: 'var(--ink-soft)', margin: 0 }}>PDF, 이미지, 문서, 오디오 등</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  <button type="button" className="btn btn-outline" onClick={() => fileInputRef.current?.click()}>
                    ⬆ 파일 업로드
                  </button>
                  <button type="button" className="btn btn-outline" onClick={() => setSourceModalMode('website')}>
                    🔗 웹사이트
                  </button>
                  <button type="button" className="btn btn-outline" disabled title="준비 중" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                    ☁ Drive
                  </button>
                  <button type="button" className="btn btn-outline" onClick={() => setSourceModalMode('paste')}>
                    📋 붙여넣은 텍스트
                  </button>
                </div>
              </>
            )}

            {sourceModalMode === 'website' && (
              <>
                <h2 style={{ fontSize: '17px', margin: '0 0 14px' }}>웹사이트 URL 추가</h2>
                <input
                  autoFocus
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://example.com"
                  style={{ width: '100%', border: '1.5px solid var(--leaf-line)', borderRadius: '12px', padding: '11px 14px', fontSize: '14px', marginBottom: '14px' }}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setSourceModalMode('menu')}>
                    뒤로
                  </button>
                  <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={handleAddWebsite}>
                    추가
                  </button>
                </div>
              </>
            )}

            {sourceModalMode === 'paste' && (
              <>
                <h2 style={{ fontSize: '17px', margin: '0 0 14px' }}>텍스트 붙여넣기</h2>
                <textarea
                  autoFocus
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder="여기에 텍스트를 붙여넣으세요"
                  rows={6}
                  style={{ width: '100%', border: '1.5px solid var(--leaf-line)', borderRadius: '12px', padding: '11px 14px', fontSize: '14px', marginBottom: '14px', fontFamily: 'inherit', resize: 'vertical' }}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setSourceModalMode('menu')}>
                    뒤로
                  </button>
                  <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={handleAddPastedText}>
                    추가
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotebookPage;

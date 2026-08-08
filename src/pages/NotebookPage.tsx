import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Mascot from '../components/common/Mascot';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ChatComposer from '../components/notebook/ChatComposer';
import {
  createNotebook,
  getNotebook,
  updateNotebook,
  uploadFileSource,
  addUrlSource,
  addTextSource,
  createChatSession,
  streamChatAnswer,
  inferFileSourceType,
  type Source,
  type Citation,
} from '../utils/notebookStore';

interface ChatMessage {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  citations?: Citation[];
}

const suggestions = ['새로운 주제에 관해 알아보기', '새로운 항목 만들기', '프로젝트 진행하기'];

const NotebookPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [notebookId, setNotebookId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [title, setTitle] = useState('제목 없는 노트북');
  const [description, setDescription] = useState('');
  const [sources, setSources] = useState<Source[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [msgInput, setMsgInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isReplying, setIsReplying] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const [sourceModalOpen, setSourceModalOpen] = useState(false);
  const [sourceModalMode, setSourceModalMode] = useState<'menu' | 'website' | 'paste'>('menu');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [pasteText, setPasteText] = useState('');
  const [sourceBusy, setSourceBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setLoadError(false);
      try {
        if (id === 'new') {
          // NB01_NOTE01: POST /notebooks — 서버가 진짜 notebookId를 내려줄 때까지는
          // 아무것도 로컬에 만들지 않고, 받은 id로 바로 갈아탑니다.
          const created = await createNotebook('제목 없는 노트북');
          if (!cancelled) navigate(`/notebook/${created.notebookId}`, { replace: true });
          return;
        }

        const detail = await getNotebook(id);
        if (cancelled) return;
        setNotebookId(detail.id);
        setTitle(detail.title);
        setDescription(detail.description ?? '');
        setSources(detail.sources ?? []);
      } catch (error) {
        console.error('노트북 로딩 실패:', error);
        if (!cancelled) setLoadError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  const handleMetaBlur = async () => {
    if (!notebookId || !title.trim()) return;
    try {
      // NB01_NOTE03: title/description 둘 다 넘길 수 있어서 같이 저장합니다.
      await updateNotebook(notebookId, { title: title.trim(), description: description.trim() || undefined });
    } catch (error) {
      console.error('노트북 정보 저장 실패:', error);
    }
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !notebookId) return;

    setSourceBusy(true);
    try {
      // SRC01_UPLOAD01
      for (const file of Array.from(files)) {
        const res = await uploadFileSource(notebookId, file);
        setSources((prev) => [
          ...prev,
          { id: res.sourceId, name: file.name, type: inferFileSourceType(file.name), status: res.status },
        ]);
      }
      closeSourceModal();
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      alert('파일 업로드에 실패했습니다.');
    } finally {
      setSourceBusy(false);
      e.target.value = '';
    }
  };

  const handleAddWebsite = async () => {
    if (!websiteUrl.trim() || !notebookId) return;
    setSourceBusy(true);
    try {
      // SRC01_UPLOAD02
      const res = await addUrlSource(notebookId, websiteUrl.trim());
      setSources((prev) => [
        ...prev,
        { id: res.sourceId, name: res.title ?? websiteUrl.trim(), type: 'URL', status: res.status },
      ]);
      closeSourceModal();
    } catch (error) {
      console.error('URL 소스 추가 실패:', error);
      alert('URL 소스를 추가하지 못했습니다. 크롤링이 차단됐을 수 있어요.');
    } finally {
      setSourceBusy(false);
    }
  };

  const handleAddPastedText = async () => {
    if (!pasteText.trim() || !notebookId) return;
    setSourceBusy(true);
    try {
      // SRC01_UPLOAD03
      const preview = pasteText.trim().slice(0, 24);
      const title = `📋 ${preview}${pasteText.trim().length > 24 ? '…' : ''}`;
      const res = await addTextSource(notebookId, pasteText.trim(), title);
      setSources((prev) => [...prev, { id: res.sourceId, name: title, type: 'TEXT', status: res.status }]);
      closeSourceModal();
    } catch (error) {
      console.error('텍스트 소스 추가 실패:', error);
      alert('텍스트 소스를 추가하지 못했습니다.');
    } finally {
      setSourceBusy(false);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || !notebookId) return;

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'USER', content: text.trim() }]);
    setMsgInput('');
    setIsReplying(true);

    const assistantId = crypto.randomUUID();
    let received = false;

    try {
      // CHAT01_CHAT03: 세션이 없으면 먼저 만들고, 있으면 재사용합니다.
      let sid = sessionId;
      if (!sid) {
        const session = await createChatSession(notebookId);
        sid = session.sessionId;
        setSessionId(sid);
      }

      setMessages((prev) => [...prev, { id: assistantId, role: 'ASSISTANT', content: '' }]);

      // CHAT01_CHAT01/CHAT02: 질문 전송 → RAG 답변 스트리밍 + 출처 인용
      await streamChatAnswer(
        sid,
        text.trim(),
        (token) => {
          received = true;
          setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + token } : m)));
        },
        (citations) => {
          setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, citations } : m)));
        }
      );

      if (!received) {
        setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, content: '(빈 응답)' } : m)));
      }
    } catch (error) {
      console.error('채팅 응답 실패:', error);
      setMessages((prev) => {
        const withoutEmptyPlaceholder = prev.filter((m) => m.id !== assistantId || m.content);
        return [
          ...withoutEmptyPlaceholder,
          {
            id: crypto.randomUUID(),
            role: 'ASSISTANT',
            content: '⚠️ 아직 백엔드와 연결되지 않아 응답을 받지 못했습니다.',
          },
        ];
      });
    } finally {
      setIsReplying(false);
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(msgInput);
  };

  if (isLoading) return <LoadingSpinner message={id === 'new' ? '노트북을 만드는 중...' : '노트북을 불러오는 중...'} />;

  if (loadError || !notebookId) {
    return (
      <LoadingSpinner
        message="노트북을 불러오지 못했습니다. 홈으로 돌아가 다시 시도해 주세요."
      />
    );
  }

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

            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px', minWidth: '80px' }}>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleMetaBlur}
                style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  color: 'var(--black)',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontFamily: 'inherit',
                  padding: '4px 6px',
                  borderRadius: '8px',
                }}
                onFocus={(e) => (e.currentTarget.style.background = 'var(--leaf-soft)')}
                onBlurCapture={(e) => (e.currentTarget.style.background = 'transparent')}
              />
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleMetaBlur}
                placeholder="설명 추가 (선택)"
                style={{
                  fontSize: '12.5px',
                  color: 'var(--ink-soft)',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontFamily: 'inherit',
                  padding: '0 6px',
                }}
                onFocus={(e) => (e.currentTarget.style.background = 'var(--leaf-soft)')}
                onBlurCapture={(e) => (e.currentTarget.style.background = 'transparent')}
              />
            </div>

            <div style={{ flex: 1 }} />

            <button className="upload-btn" type="button" onClick={() => navigate('/notebook/new')}>
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
                <li
                  key={s.id}
                  style={{
                    fontSize: '13px',
                    color: 'var(--ink)',
                    padding: '8px 10px',
                    border: '1px solid var(--leaf-line)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                  }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</span>
                  {s.status !== 'DONE' && (
                    <span style={{ fontSize: '11px', color: 'var(--ink-soft)', flex: 'none' }}>
                      {s.status === 'ERROR' ? '오류' : s.status === 'PROCESSING' ? '처리 중' : '대기'}
                    </span>
                  )}
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
                <div key={m.id} style={{ alignSelf: m.role === 'USER' ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                  <div
                    style={{
                      backgroundColor: m.role === 'USER' ? 'var(--black)' : 'var(--leaf-soft)',
                      color: m.role === 'USER' ? '#fff' : 'var(--ink)',
                      padding: '10px 14px',
                      borderRadius: '16px',
                      fontSize: '14px',
                      lineHeight: 1.5,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {m.content}
                  </div>

                  {/* CHAT01_CHAT02: 출처 인용 표시 */}
                  {m.citations && m.citations.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                      {m.citations.map((c, i) => (
                        <span
                          key={i}
                          title={c.url}
                          style={{
                            fontSize: '11px',
                            padding: '3px 9px',
                            borderRadius: '999px',
                            border: '1px solid var(--leaf-line)',
                            color: 'var(--leaf-deep)',
                            fontWeight: 700,
                          }}
                        >
                          📄 {c.fileName ?? c.url ?? '출처'}
                          {c.page ? ` p.${c.page}` : ''}
                        </span>
                      ))}
                    </div>
                  )}
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
                  <p style={{ fontSize: '12.5px', color: 'var(--ink-soft)', margin: 0 }}>PDF, DOCX, TXT, PPTX, XLSX (최대 50MB)</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  <button type="button" className="btn btn-outline" disabled={sourceBusy} onClick={() => fileInputRef.current?.click()}>
                    ⬆ 파일 업로드
                  </button>
                  <button type="button" className="btn btn-outline" disabled={sourceBusy} onClick={() => setSourceModalMode('website')}>
                    🔗 웹사이트
                  </button>
                  <button type="button" className="btn btn-outline" disabled title="준비 중" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                    ☁ Drive
                  </button>
                  <button type="button" className="btn btn-outline" disabled={sourceBusy} onClick={() => setSourceModalMode('paste')}>
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
                  <button type="button" className="btn btn-primary" style={{ flex: 1 }} disabled={sourceBusy} onClick={handleAddWebsite}>
                    {sourceBusy ? '추가 중...' : '추가'}
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
                  <button type="button" className="btn btn-primary" style={{ flex: 1 }} disabled={sourceBusy} onClick={handleAddPastedText}>
                    {sourceBusy ? '추가 중...' : '추가'}
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

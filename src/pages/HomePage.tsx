import { useEffect, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandBlock from '../components/notebook/BrandBlock';
import SectionHead from '../components/notebook/SectionHead';
import HistoryCard from '../components/notebook/HistoryCard';
import AddCard from '../components/notebook/AddCard';
import UserMenu from '../components/common/UserMenu';
import { listNotebooks, deleteNotebook, updateNotebook, createNotebook, type NotebookSummary } from '../utils/notebookStore';


const menuBtnStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  textAlign: 'left',
  padding: '10px 14px',
  fontSize: '13px',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--ink)',
  fontFamily: 'inherit',
};

const HomePage = () => {
  const navigate = useNavigate();

  const recommendedNotebooks: {
    id: string;
    title: string;
    desc: string;
    tag: string;
    dot: { color: string; shape?: 'square' | 'circle' | 'diamond' };
  }[] = [
    {
      id: 't1',
      title: 'C / Java 알고리즘 패턴',
      desc: '초보자를 위한 핵심 문법과 기출문제 풀이 템플릿',
      tag: '프로그래밍',
      dot: { color: 'var(--leaf-deep)', shape: 'square' },
    },
    {
      id: 't2',
      title: '일러스트레이터 가이드',
      desc: '패스파인더 활용 및 캐릭터 타이포그래피 레퍼런스',
      tag: '디자인',
      dot: { color: 'var(--danger)', shape: 'circle' },
    },
    {
      id: 't3',
      title: '스키야키 황금 레시피',
      desc: '집에서 즐기는 완벽한 재료 손질과 육수 비법',
      tag: '요리',
      dot: { color: 'var(--leaf)', shape: 'diamond' },
    },
  ];

  // NB01_NOTE02: GET /notebooks (keyword 검색 지원)
  const [keyword, setKeyword] = useState('');
  const [recentNotebooks, setRecentNotebooks] = useState<NotebookSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // SCR06: 노트북 제목/설명 수정, 삭제 — 전용 모달
  const [editTarget, setEditTarget] = useState<NotebookSummary | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<NotebookSummary | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [creating, setCreating] = useState(false);

  const refresh = async (kw: string) => {
    setIsLoading(true);
    try {
      const data = await listNotebooks(kw || undefined);
      setRecentNotebooks(data);
    } catch (error) {
      console.error('노트북 목록 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => refresh(keyword), 250); // 타이핑마다 바로 쏘지 않도록 살짝 디바운스
    return () => clearTimeout(timer);
  }, [keyword]);

  const openEditModal = (nb: NotebookSummary) => {
    setEditTarget(nb);
    setEditTitle(nb.title);
    setEditDescription(nb.description ?? '');
    setMenuOpenId(null);
  };
  const closeEditModal = () => setEditTarget(null);

  const handleSaveEdit = async () => {
    if (!editTarget || !editTitle.trim()) return;
    setEditSaving(true);
    try {
      // NB01_NOTE03
      await updateNotebook(editTarget.id, { title: editTitle.trim(), description: editDescription.trim() || undefined });
      closeEditModal();
      refresh(keyword);
    } catch (error) {
      console.error('노트북 수정 실패:', error);
      alert('수정에 실패했습니다.');
    } finally {
      setEditSaving(false);
    }
  };
  // 노트북 추가 API 호출
  const handleCreateNotebook = async (title = '제목 없는 노트북') => {
    if (creating) return;
    setCreating(true);
    try {
      const created = await createNotebook(title);
      const newId = created?.notebookId;
      if (!newId) throw new Error('생성 응답에 notebookId가 없습니다.');
      navigate(`/notebook/${newId}`);
    } catch (error) {
      console.error('노트북 생성 실패:', error);
      alert('노트북을 만들지 못했습니다.');
    } finally {
      setCreating(false);
    }
  };

   // 노트북 삭제 API 호출
  const handleConfirmDelete = async () => {
    if (!deleteTarget?.id) {
      alert('노트북 ID를 알 수 없어 삭제할 수 없습니다. 목록을 새로고침해 주세요.');
      return;
    }
    setDeleting(true);
    try {
      // NB01_NOTE04
      await deleteNotebook(deleteTarget.id);
      setDeleteTarget(null);
      refresh(keyword);
    } catch (error) {
      console.error('노트북 삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ height: '100%', backgroundColor: 'var(--bg)', overflowY: 'auto' }}>
      <header className="topbar">
        <div className="topbar-inner container">
          <div className="topbar-row">
            <BrandBlock name="BottaBot" status="내 작업 공간 (로비)" />

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div className="composer" style={{ padding: '8px 16px', width: '260px', borderRadius: '12px' }}>
                <svg
                  viewBox="0 0 24 24"
                  style={{ width: '16px', fill: 'none', stroke: 'var(--ink-soft)', strokeWidth: 2 }}
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="노트북 검색..."
                  style={{ marginLeft: '8px', fontSize: '13.5px' }}
                />
              </div>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-main container">
        <SectionHead
          title="추천 노트북"
          subtitle="미리 준비된 템플릿으로 시작해보세요"
          style={{ marginTop: '10px' }}
        />

        <div className="history-grid" style={{ marginBottom: '48px' }}>
          {recommendedNotebooks.map((item) => (
            <HistoryCard
              key={item.id}
              tag={item.tag}
              title={item.title}
              meta={item.desc}
              highlighted
              onClick={() => handleCreateNotebook(item.title)}
              tagStyle={{ color: 'var(--black)' }}

              titleStyle={{
                fontSize: '16px',
                fontWeight: 800,
                marginBottom: '8px',
                color: 'var(--black)',
              }}
              metaStyle={{ color: 'var(--ink)', fontSize: '13px', lineHeight: 1.55 }}
            />
          ))}
        </div>

        <SectionHead title="최근 노트북" subtitle={isLoading ? '불러오는 중...' : `${recentNotebooks.length}개`} />

        <div className="history-grid">
          <AddCard label="새 노트북 만들기" onClick={() => handleCreateNotebook()} />

          {recentNotebooks.filter((nb) => nb.id).map((nb) => {
            const isMenuOpen = menuOpenId === nb.id;

            return (
              <div
                key={nb.id}
                className="history-card"
                style={{ position: 'relative' }}
                onClick={() => navigate(`/notebook/${nb.id}`)}
              >
                <div className="row-top">
                  <span className="tag">내 노트북</span>
                  <svg
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenId(isMenuOpen ? null : nb.id);
                    }}
                    viewBox="0 0 24 24"
                    style={{ width: '18px', cursor: 'pointer', stroke: 'var(--ink-soft)', fill: 'none', strokeWidth: 2 }}
                  >
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="5" r="1" />
                    <circle cx="12" cy="19" r="1" />
                  </svg>
                </div>

                <div className="summary" style={{ fontSize: '15.5px', fontWeight: 700, marginTop: '8px' }}>
                  {nb.title}
                </div>
                {nb.description && (
                  <div style={{ fontSize: '12px', color: 'var(--ink-soft)', marginTop: '4px' }}>{nb.description}</div>
                )}
                <div className="meta" style={{ marginTop: '18px', fontSize: '12px' }}>
                  {new Date(nb.updatedAt).toLocaleDateString('ko-KR')} • 소스 {nb.sourceCount}개
                </div>

                {isMenuOpen && (
                  <>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(null);
                      }}
                      style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                    />
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        position: 'absolute',
                        top: '38px',
                        right: '14px',
                        background: 'var(--bg)',
                        border: '1px solid var(--leaf-line)',
                        borderRadius: '14px',
                        boxShadow: 'var(--shadow)',
                        zIndex: 50,
                        minWidth: '150px',
                        overflow: 'hidden',
                      }}
                    >
                      <button
                        type="button"
                        style={menuBtnStyle}
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpenId(null);
                          setDeleteTarget(nb);
                        }}
                      >
                        🗑 삭제
                      </button>
                      <button
                        type="button"
                        style={menuBtnStyle}
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(nb);
                        }}
                      >
                        ✏️ 제목 수정
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* SCR06: 노트북 제목/설명 수정 모달 */}
      {editTarget && (
        <div
          onClick={closeEditModal}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: 'var(--bg)', borderRadius: '24px', padding: '28px', width: '90%', maxWidth: '440px', boxShadow: 'var(--shadow)' }}
          >
            <h2 style={{ fontSize: '18px', margin: '0 0 18px' }}>노트북 정보 수정</h2>

            <div className="field">
              <label>제목</label>
              <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} autoFocus />
            </div>

            <div className="field">
              <label>설명 (선택)</label>
              <input
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="이 노트북에 대한 설명을 입력하세요"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={closeEditModal}>
                취소
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 1 }}
                disabled={editSaving || !editTitle.trim()}
                onClick={handleSaveEdit}
              >
                {editSaving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCR06: 노트북 삭제 확인 모달 */}
      {deleteTarget && (
        <div
          onClick={() => setDeleteTarget(null)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: 'var(--bg)', borderRadius: '24px', padding: '28px', width: '90%', maxWidth: '400px', boxShadow: 'var(--shadow)', textAlign: 'center' }}
          >
            <h2 style={{ fontSize: '18px', margin: '0 0 10px' }}>노트북을 삭제할까요?</h2>
            <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', margin: '0 0 22px' }}>
              "{deleteTarget.title}"의 모든 소스와 대화 기록이 함께 삭제됩니다. 되돌릴 수 없습니다.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setDeleteTarget(null)}>
                취소
              </button>
              <button type="button" className="btn btn-danger ready" style={{ flex: 1 }} disabled={deleting} onClick={handleConfirmDelete}>
                {deleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;

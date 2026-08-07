import { useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandBlock from '../components/notebook/BrandBlock';
import SectionHead from '../components/notebook/SectionHead';
import HistoryCard from '../components/notebook/HistoryCard';
import AddCard from '../components/notebook/AddCard';
import {
  listNotebooks,
  deleteNotebook,
  renameNotebook,
  togglePin,
  addNotebookToCollection,
  removeNotebookFromCollection,
  listCollectionNames,
  type NotebookRecord,
} from '../utils/notebookStore';

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

  const recommendedNotebooks = [
    {
      id: 't1',
      title: 'C / Java 알고리즘 패턴',
      desc: '초보자를 위한 핵심 문법과 기출문제 풀이 템플릿',
      tag: '💻 프로그래밍',
    },
    {
      id: 't2',
      title: '일러스트레이터 가이드',
      desc: '패스파인더 활용 및 캐릭터 타이포그래피 레퍼런스',
      tag: '🎨 디자인',
    },
    {
      id: 't3',
      title: '스키야키 황금 레시피',
      desc: '집에서 즐기는 완벽한 재료 손질과 육수 비법',
      tag: '🍳 요리',
    },
  ];

  // 노트북 페이지에서 만들고 편집한 실제 노트북 목록 (localStorage 기반, notebookStore.ts 참고)
  const [recentNotebooks, setRecentNotebooks] = useState<NotebookRecord[]>(() => listNotebooks());
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [collectionPickerId, setCollectionPickerId] = useState<string | null>(null);
  const [newCollectionName, setNewCollectionName] = useState('');

  const refresh = () => setRecentNotebooks(listNotebooks());

  const closeMenus = () => {
    setMenuOpenId(null);
    setCollectionPickerId(null);
    setNewCollectionName('');
  };

  const handleDelete = (id: string, title: string) => {
    if (!window.confirm(`"${title}" 노트북을 삭제할까요? 되돌릴 수 없습니다.`)) return;
    deleteNotebook(id);
    refresh();
    closeMenus();
  };

  const handleRename = (id: string, currentTitle: string) => {
    const next = window.prompt('새 제목을 입력하세요', currentTitle);
    if (next && next.trim()) {
      renameNotebook(id, next.trim());
      refresh();
    }
    closeMenus();
  };

  const handlePin = (id: string) => {
    togglePin(id);
    refresh();
    closeMenus();
  };

  const handleToggleCollection = (id: string, name: string, isMember: boolean) => {
    if (isMember) removeNotebookFromCollection(id, name);
    else addNotebookToCollection(id, name);
    refresh();
  };

  const handleCreateCollection = (id: string) => {
    if (!newCollectionName.trim()) return;
    addNotebookToCollection(id, newCollectionName.trim());
    setNewCollectionName('');
    refresh();
  };

  return (
    <div style={{ height: '100%', backgroundColor: 'var(--bg)', overflowY: 'auto' }}>
      <header className="topbar">
        <div className="topbar-inner container">
          <div className="topbar-row">
            <BrandBlock name="BottaBot" status="내 작업 공간 (로비)" />

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
                placeholder="노트북 검색..."
                style={{ marginLeft: '8px', fontSize: '13.5px' }}
              />
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
              onClick={() => navigate(`/notebook/new?template=${item.id}`)}
              tagStyle={{ color: 'var(--black)' }}
              titleStyle={{
                fontSize: '16px',
                fontWeight: 800,
                marginBottom: '8px',
                color: 'var(--black)',
              }}
              metaStyle={{ color: 'var(--ink)' }}
            />
          ))}
        </div>

        <SectionHead title="최근 노트북" subtitle={`총 ${recentNotebooks.length}개`} />

        <div className="history-grid">
          <AddCard label="새 노트 만들기" onClick={() => navigate('/notebook/new')} />

          {recentNotebooks.map((nb) => {
            const isMenuOpen = menuOpenId === nb.id;
            const isCollectionPicker = collectionPickerId === nb.id;
            const collections = nb.collections ?? [];

            return (
              <div
                key={nb.id}
                className="history-card"
                style={{ position: 'relative' }}
                onClick={() => navigate(`/notebook/${nb.id}`)}
              >
                <div className="row-top">
                  <span className="tag">{nb.pinned ? '📌 고정됨' : '내 노트북'}</span>
                  <svg
                    onClick={(e) => {
                      e.stopPropagation();
                      setCollectionPickerId(null);
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
                <div className="meta" style={{ marginTop: '18px', fontSize: '12px' }}>
                  {new Date(nb.updatedAt).toLocaleDateString('ko-KR')} • 소스 {nb.sources.length}개
                </div>

                {collections.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                    {collections.map((c) => (
                      <span
                        key={c}
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: '999px',
                          background: 'var(--leaf-soft)',
                          color: 'var(--leaf-deep)',
                        }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                {isMenuOpen && (
                  <>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        closeMenus();
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
                        minWidth: '190px',
                        overflow: 'hidden',
                      }}
                    >
                      {isCollectionPicker ? (
                        <div style={{ padding: '12px' }}>
                          <p style={{ fontSize: '12px', fontWeight: 700, margin: '0 0 8px' }}>컬렉션에 추가</p>

                          {listCollectionNames().length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                              {listCollectionNames().map((c) => {
                                const isMember = collections.includes(c);
                                return (
                                  <button
                                    key={c}
                                    type="button"
                                    onClick={() => handleToggleCollection(nb.id, c, isMember)}
                                    style={{
                                      fontSize: '11px',
                                      fontWeight: 700,
                                      padding: '4px 10px',
                                      borderRadius: '999px',
                                      border: '1px solid var(--leaf-line)',
                                      background: isMember ? 'var(--leaf-deep)' : 'transparent',
                                      color: isMember ? '#fff' : 'var(--ink)',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    {c}
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          <div style={{ display: 'flex', gap: '6px' }}>
                            <input
                              value={newCollectionName}
                              onChange={(e) => setNewCollectionName(e.target.value)}
                              placeholder="새 컬렉션 이름"
                              style={{
                                flex: 1,
                                fontSize: '12px',
                                border: '1px solid var(--leaf-line)',
                                borderRadius: '8px',
                                padding: '6px 8px',
                                fontFamily: 'inherit',
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-primary"
                              style={{ width: 'auto', padding: '6px 12px', fontSize: '12px', margin: 0 }}
                              onClick={() => handleCreateCollection(nb.id)}
                            >
                              추가
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <button type="button" style={menuBtnStyle} onClick={() => handleDelete(nb.id, nb.title)}>
                            🗑 삭제
                          </button>
                          <button type="button" style={menuBtnStyle} onClick={() => handleRename(nb.id, nb.title)}>
                            ✏️ 제목 수정
                          </button>
                          <button type="button" style={menuBtnStyle} onClick={() => setCollectionPickerId(nb.id)}>
                            📁 컬렉션에 추가
                          </button>
                          <button type="button" style={menuBtnStyle} onClick={() => handlePin(nb.id)}>
                            📌 {nb.pinned ? '고정 해제' : '맨 위에 고정'}
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default HomePage;

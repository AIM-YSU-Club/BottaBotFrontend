import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandBlock from '../components/notebook/BrandBlock';
import UserMenu from '../components/common/UserMenu';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { listAllSources, type SourceType, type SourceWithNotebook } from '../utils/notebookStore';

const TYPE_LABEL: Record<SourceType, string> = {
  FILE_PDF: 'PDF',
  FILE_DOCX: 'DOCX',
  FILE_TXT: 'TXT',
  FILE_PPTX: 'PPTX',
  FILE_XLSX: 'XLSX',
  URL: '웹사이트',
  TEXT: '텍스트',
};

const STATUS_LABEL: Record<SourceWithNotebook['status'], string> = {
  PENDING: '대기',
  PROCESSING: '처리 중',
  DONE: '완료',
  ERROR: '오류',
};

const FILTERS: { label: string; match: (type: SourceType) => boolean }[] = [
  { label: '전체', match: () => true },
  { label: '파일', match: (t) => t.startsWith('FILE_') },
  { label: '웹사이트', match: (t) => t === 'URL' },
  { label: '텍스트', match: (t) => t === 'TEXT' },
];

const LibraryPage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [filterIndex, setFilterIndex] = useState(0);

  // 모든 노트북의 소스를 한 곳에서 모아보는 페이지. 전체 소스 목록 API가 명세에 없어서
  // 노트북 목록 → 각 노트북 상세를 조회해 펼칩니다 (notebookStore.ts의 listAllSources 참고).
  const [allSources, setAllSources] = useState<SourceWithNotebook[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listAllSources()
      .then(setAllSources)
      .catch((error) => console.error('소스 목록 조회 실패:', error))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = allSources.filter((s) => {
    if (!FILTERS[filterIndex].match(s.type)) return false;
    if (!keyword.trim()) return true;
    const k = keyword.trim().toLowerCase();
    return s.name.toLowerCase().includes(k) || s.notebookTitle.toLowerCase().includes(k);
  });

  if (isLoading) return <LoadingSpinner message="소스를 불러오는 중..." />;

  return (
    <div style={{ height: '100%', backgroundColor: 'var(--bg)', overflowY: 'auto' }}>
      <header className="topbar">
        <div className="topbar-inner container">
          <div className="topbar-row">
            <BrandBlock name="라이브러리" status="모든 노트북의 소스 모아보기" />

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div className="composer" style={{ padding: '8px 16px', width: '260px', borderRadius: '12px' }}>
                <svg viewBox="0 0 24 24" style={{ width: '16px', fill: 'none', stroke: 'var(--ink-soft)', strokeWidth: 2 }}>
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="소스/노트북 이름 검색..."
                  style={{ marginLeft: '8px', fontSize: '13.5px' }}
                />
              </div>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-main container">
        <div className="segment" style={{ maxWidth: '360px' }}>
          {FILTERS.map((f, i) => (
            <button key={f.label} type="button" className={filterIndex === i ? 'active' : ''} onClick={() => setFilterIndex(i)}>
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--ink-soft)', marginTop: '60px' }}>
            <p style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '8px' }}>
              {allSources.length === 0 ? '아직 추가된 소스가 없습니다' : '조건에 맞는 소스가 없습니다'}
            </p>
            <p style={{ fontSize: '13px' }}>
              노트북에서 파일·웹사이트·텍스트를 소스로 추가하면 여기 모아서 볼 수 있어요.
            </p>
          </div>
        ) : (
          <div className="history-grid">
            {filtered.map((s) => (
              <div
                key={`${s.notebookId}-${s.id}`}
                className="history-card"
                onClick={() => navigate(`/notebook/${s.notebookId}`)}
              >
                <div className="row-top">
                  <span className="tag">{TYPE_LABEL[s.type]}</span>
                  {s.status !== 'DONE' && <span className="time">{STATUS_LABEL[s.status]}</span>}
                </div>
                <div className="summary" style={{ fontSize: '14.5px', fontWeight: 700 }}>
                  {s.name}
                </div>
                <div className="meta">📓 {s.notebookTitle}</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default LibraryPage;

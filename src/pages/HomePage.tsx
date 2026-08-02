import { useNavigate } from 'react-router-dom';
import BrandBlock from '../components/notebook/BrandBlock';
import SectionHead from '../components/notebook/SectionHead';
import HistoryCard from '../components/notebook/HistoryCard';
import AddCard from '../components/notebook/AddCard';

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

  const recentNotebooks = [
    { id: 'n1', title: '리눅스(Ubuntu) 명령어 요약본', date: '2026. 4. 20.', sourceCount: 3 },
    { id: 'n2', title: '레이저 제모 후 스킨케어 루틴', date: '2026. 4. 15.', sourceCount: 1 },
    { id: 'n3', title: '제목 없는 노트북', date: '2026. 4. 10.', sourceCount: 0 },
  ];

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

          {recentNotebooks.map((nb) => (
            <HistoryCard
              key={nb.id}
              tag="내 노트북"
              title={nb.title}
              meta={`${nb.date} • 소스 ${nb.sourceCount}개`}
              showMore
              onClick={() => navigate(`/notebook/${nb.id}`)}
              titleStyle={{ fontSize: '15.5px', fontWeight: 700, marginTop: '8px' }}
              metaStyle={{ marginTop: '18px', fontSize: '12px' }}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;

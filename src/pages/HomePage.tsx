import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  // ==========================================
  // 💡 데이터 세팅 (나중에 백엔드 API로 받아올 부분)
  // ==========================================
  
  // 1. 추천 노트북 (미리 세팅된 템플릿 예시)
  const recommendedNotebooks = [
    { id: 't1', title: 'C / Java 알고리즘 패턴', desc: '초보자를 위한 핵심 문법과 기출문제 풀이 템플릿', tag: '💻 프로그래밍' },
    { id: 't2', title: '일러스트레이터 가이드', desc: '패스파인더 활용 및 캐릭터 타이포그래피 레퍼런스', tag: '🎨 디자인' },
    { id: 't3', title: '스키야키 황금 레시피', desc: '집에서 즐기는 완벽한 재료 손질과 육수 비법', tag: '🍳 요리' },
  ];

  // 2. 최근 노트북 (내가 예전에 만들었던 방들)
  const recentNotebooks = [
    { id: 'n1', title: '리눅스(Ubuntu) 명령어 요약본', date: '2026. 4. 20.', sourceCount: 3 },
    { id: 'n2', title: '레이저 제모 후 스킨케어 루틴', date: '2026. 4. 15.', sourceCount: 1 },
    { id: 'n3', title: '제목 없는 노트북', date: '2026. 4. 10.', sourceCount: 0 },
  ];

  return (
    <div style={{ height: '100%', backgroundColor: 'var(--bg)', overflowY: 'auto' }}>
      
      {/* 1. 상단바 (로비 전용 헤더) */}
      <header className="topbar">
        <div className="topbar-inner container">
          <div className="topbar-row">
            
            <div className="brand">
              <div className="mascot"><span className="eyes"><span></span><span></span></span></div>
              <div className="brand-text">
                <h1 className="name">BottaBot</h1>
                <span className="status"><span className="dot"></span>내 작업 공간 (로비)</span>
              </div>
            </div>
            
            {/* 우측 상단 검색창 (NotebookLM 스타일) */}
            <div className="composer" style={{ padding: '8px 16px', width: '260px', borderRadius: '12px' }}>
              <svg viewBox="0 0 24 24" style={{width:'16px', fill:'none', stroke:'var(--ink-soft)', strokeWidth:2}}>
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/>
              </svg>
              <input type="text" placeholder="노트북 검색..." style={{marginLeft: '8px', fontSize: '13.5px'}} />
            </div>

          </div>
        </div>
      </header>

      {/* 2. 메인 콘텐츠 영역 */}
      <main className="dashboard-main container">
        
        {/* --- 섹션 A: 추천 노트북 --- */}
        <div className="section-head" style={{ marginTop: '10px' }}>
          <h2>추천 노트북</h2>
          <span>미리 준비된 템플릿으로 시작해보세요</span>
        </div>
        
        <div className="history-grid" style={{ marginBottom: '48px' }}>
          {recommendedNotebooks.map((item) => (
            <div 
              className="history-card" 
              key={item.id} 
              onClick={() => navigate(`/notebook/new?template=${item.id}`)}
              style={{ backgroundColor: 'var(--leaf-soft)', border: 'none' }} // 추천 템플릿은 배경색을 넣어 구분감 부여
            >
              <div className="row-top">
                <span className="tag" style={{ color: 'var(--black)' }}>{item.tag}</span>
              </div>
              <div className="summary" style={{ fontSize: '16px', fontWeight: 800, marginBottom: '8px', color: 'var(--black)' }}>
                {item.title}
              </div>
              <div className="meta" style={{ color: 'var(--ink)' }}>{item.desc}</div>
            </div>
          ))}
        </div>

        {/* --- 섹션 B: 최근 노트북 --- */}
        <div className="section-head">
          <h2>최근 노트북</h2>
          <span>총 {recentNotebooks.length}개</span>
        </div>
        
        <div className="history-grid">
          
          {/* [ + 새 노트 만들기 ] 카드 (최우측 상단 우선 배치) */}
          <div 
            className="history-card add-card" 
            onClick={() => navigate('/notebook/new')}
            style={{ flexDirection: 'column', gap: '10px' }}
          >
            <span className="plus-circle" style={{ width: '48px', height: '48px', backgroundColor: '#fff', border: '1px solid var(--leaf-line)' }}>
              <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
            </span>
            <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--leaf-deep)' }}>새 노트 만들기</span>
          </div>

          {/* 내가 생성했던 기존 노트북들 */}
          {recentNotebooks.map((nb) => (
            <div className="history-card" key={nb.id} onClick={() => navigate(`/notebook/${nb.id}`)}>
              <div className="row-top">
                <span className="tag">내 노트북</span>
                {/* 우측 상단 더보기(점 3개) 버튼 */}
                <svg viewBox="0 0 24 24" style={{width:'18px', cursor:'pointer', stroke:'var(--ink-soft)', fill:'none', strokeWidth:2}}>
                  <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
                </svg>
              </div>
              <div className="summary" style={{ fontSize: '15.5px', fontWeight: 700, marginTop: '8px' }}>
                {nb.title}
              </div>
              <div className="meta" style={{ marginTop: '18px', fontSize: '12px' }}>
                {nb.date} • 소스 {nb.sourceCount}개
              </div>
            </div>
          ))}

        </div>
      </main>

    </div>
  );
};

export default HomePage;
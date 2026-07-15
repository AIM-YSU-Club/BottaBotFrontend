import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  // 🚀 기존 기능 100% 유지: 사이드바 열림/닫힘 상태
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  const menuItems = [
    { id: 'new', icon: '✨', label: '새 채팅', path: '/' },
    { id: 'memo', icon: '📝', label: '프롬프트 노트', path: '/' },
    { id: 'search', icon: '🔍', label: '채팅 검색', path: '/' },
    { id: 'chat', icon: '💬', label: '대화 기록', path: '/' },
    { id: 'library', icon: '📁', label: '라이브러리', path: '/' },
    { id: 'notice', icon: '🔔', label: '알림', path: '/' },
  ];

  const recentChats = [
    "한자 일본어 발음 및 뜻",
    "초보자를 위한 챗봇 개발 로드맵",
    "Git Push Error: `main` Refspec Not Found...",
    "FastAPI 강의 명령어 윈도우 CMD 변환",
  ];

  return (
    // 🎨 새 디자인: 전체를 감싸는 app-shell 클래스 적용
    <div className="app-shell">
      
      {/* 🎨 새 디자인: sidebar 클래스 적용 + 열림/닫힘 애니메이션 인라인 혼합 */}
      <aside 
        className="sidebar"
        style={{ 
          width: isSidebarOpen ? '260px' : 'var(--sidebar-w)', 
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          alignItems: isSidebarOpen ? 'stretch' : 'center',
          padding: isSidebarOpen ? '16px 20px' : '16px 0 20px'
        }}
      >
        <div className="sidebar-group" style={{ width: '100%' }}>
          
          {/* 1. 사이드바 토글 (열기/닫기) 버튼 */}
          <div 
            className="icon-btn ghost" 
            data-label={isSidebarOpen ? '' : '메뉴 열기/닫기'} // CSS 툴팁 활용!
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{ 
              width: isSidebarOpen ? '100%' : '44px',
              justifyContent: isSidebarOpen ? 'flex-start' : 'center',
              padding: isSidebarOpen ? '0 12px' : '0'
            }}
          >
            <span style={{ fontSize: '20px' }}>☰</span>
          </div>

          <div className="sidebar-divider" style={{ width: isSidebarOpen ? '100%' : '28px' }}></div>

          {/* 2. 상단 메인 메뉴들 */}
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path && item.id === 'new';
            return (
              <div 
                key={item.id} 
                className={`icon-btn ${isActive ? 'active' : ''}`}
                data-label={!isSidebarOpen ? item.label : ''} // 사이드바가 닫혀있을 때만 CSS 툴팁 표시
                onClick={() => navigate(item.path)}
                style={{
                  width: isSidebarOpen ? '100%' : '44px',
                  justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                  padding: isSidebarOpen ? '0 12px' : '0',
                }}
              >
                <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>
                  {item.icon}
                </span>
                
                {isSidebarOpen && (
                  <span style={{ fontSize: '14px', marginLeft: '12px', fontWeight: 600 }}>
                    {item.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* 3. 최근 대화 내역 (사이드바 열렸을 때만 표시) */}
        {isSidebarOpen && (
          <div style={{ flex: 1, width: '100%', overflowY: 'auto', marginTop: '20px', padding: '0 8px', animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ fontSize: '12px', color: 'var(--ink-soft)', fontWeight: 700, marginBottom: '8px', paddingLeft: '4px' }}>최근 대화</div>
            {recentChats.map((chatTitle, index) => (
              <div 
                key={index} 
                style={{ 
                  padding: '10px 12px', fontSize: '13px', color: 'var(--ink)', cursor: 'pointer', borderRadius: '8px',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--leaf-soft)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {chatTitle}
              </div>
            ))}
          </div>
        )}

        {/* 4. 하단 설정 및 프로필 */}
        <div className="sidebar-group" style={{ width: '100%', marginTop: 'auto', paddingTop: '10px', borderTop: isSidebarOpen ? '1px solid var(--leaf-line)' : 'none' }}>
          
          {/* 설정 버튼 */}
          <div 
            className={`icon-btn ghost ${location.pathname === '/settings' ? 'active' : ''}`}
            data-label={!isSidebarOpen ? '환경 설정' : ''}
            onClick={() => navigate('/settings')}
            style={{
              width: isSidebarOpen ? '100%' : '44px',
              justifyContent: isSidebarOpen ? 'flex-start' : 'center',
              padding: isSidebarOpen ? '0 12px' : '0',
            }}
          >
            <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>⚙️</span>
            {isSidebarOpen && <span style={{ fontSize: '14px', marginLeft: '12px', fontWeight: 600 }}>설정</span>}
          </div>

          {/* 프로필 버튼 */}
          <div 
            className={`icon-btn ghost ${location.pathname === '/profile' ? 'active' : ''}`}
            data-label={!isSidebarOpen ? '내 프로필 (계정 관리)' : ''}
            onClick={() => navigate('/profile')}
            style={{
              width: isSidebarOpen ? '100%' : '44px',
              justifyContent: isSidebarOpen ? 'flex-start' : 'center',
              padding: isSidebarOpen ? '0 12px' : '0',
              marginTop: '4px'
            }}
          >
            <div className="avatar" style={{ width: '28px', height: '28px', fontSize: '11px', flex: 'none' }}>
              범준
            </div>
            {isSidebarOpen && <span style={{ fontSize: '14px', marginLeft: '12px', fontWeight: 600 }}>내 프로필</span>}
          </div>
        </div>

      </aside>

      {/* 오른쪽 메인 화면 영역 */}
      <div className="main-area">
        <Outlet /> 
      </div>

    </div>
  );
};

export default MainLayout;
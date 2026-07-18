import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  // 🚀 기존 기능 및 디자인 100% 유지 (SVG 아이콘 완벽 적용)
  const menuItems = [
    { id: 'new', icon: <svg viewBox="0 0 24 24"><path d="M12 3l1.8 4.9L18.7 9.7l-4.9 1.8L12 16.4l-1.8-4.9L5.3 9.7l4.9-1.8L12 3z"/></svg>, label: '새 채팅', path: '/' },
    { id: 'search', icon: <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>, label: '검색', path: '/' },
    { id: 'memo', icon: <svg viewBox="0 0 24 24"><path d="M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5"/><path d="M8 13h8M8 17h5"/></svg>, label: '프롬프트 노트', path: '/' },
    { id: 'chat', icon: <svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 1 1-3.2-6.4"/><path d="M21 4v5h-5"/></svg>, label: '대화 기록', path: '/' },
    { id: 'library', icon: <svg viewBox="0 0 24 24"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/></svg>, label: '라이브러리', path: '/' },
    { id: 'notice', icon: <svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>, label: '알림', path: '/' },
  ];

  const recentChats = [
    "한자 일본어 발음 및 뜻",
    "초보자를 위한 챗봇 개발 로드맵",
    "Git Push Error: `main` Refspec Not Found...",
    "FastAPI 강의 명령어 윈도우 CMD 변환",
  ];

  return (
    <div className="app-shell">
      
      {/* 🚀 핵심 수정 구역: zIndex: 50 을 추가하여 사이드바(말풍선)가 메인 화면 위로 뜨게 만듭니다! */}
      <aside 
        className="sidebar"
        style={{ 
          width: isSidebarOpen ? '260px' : 'var(--sidebar-w)', 
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          alignItems: isSidebarOpen ? 'stretch' : 'center',
          padding: isSidebarOpen ? '16px 20px' : '16px 0 20px',
          zIndex: 50 
        }}
      >
        <div className="sidebar-group" style={{ width: '100%' }}>
          
          {/* 1. 사이드바 햄버거 토글 버튼 */}
          <div 
            className="icon-btn ghost" 
            data-label={!isSidebarOpen ? '메뉴 열기/닫기' : ''}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{ 
              width: isSidebarOpen ? '100%' : '44px',
              justifyContent: isSidebarOpen ? 'flex-start' : 'center',
              padding: isSidebarOpen ? '0 12px' : '0'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
            </span>
          </div>

          <div className="sidebar-divider" style={{ width: isSidebarOpen ? '100%' : '28px' }}></div>

          {/* 2. 상단 메인 메뉴들 */}
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path && item.id === 'new';
            return (
              <div 
                key={item.id} 
                className={`icon-btn ${isActive ? 'active' : ''}`}
                // 💡 닫혀있을 때(!isSidebarOpen)만 글씨가 들어가고, 열려있으면 빈칸('')이 되어 숨겨집니다.
                data-label={!isSidebarOpen ? item.label : ''}
                onClick={() => navigate(item.path)}
                style={{
                  width: isSidebarOpen ? '100%' : '44px',
                  justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                  padding: isSidebarOpen ? '0 12px' : '0',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

        {/* 3. 최근 대화 내역 */}
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
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>
            </span>
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
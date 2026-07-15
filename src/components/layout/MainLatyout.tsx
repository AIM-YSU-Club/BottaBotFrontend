import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  
  // ==========================================
  // 🚀 [추가됨]: 어떤 아이콘에 마우스가 올라가 있는지 추적하는 상태
  // ==========================================
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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

  // ==========================================
  // 🚀 [추가됨]: 말풍선(툴팁) 컴포넌트 분리
  // 반복되는 말풍선 UI를 깔끔하게 함수로 만들었습니다.
  // ==========================================
  const renderTooltip = (text: string) => (
    <div style={{
      position: 'absolute',
      left: '100%', // 아이콘의 오른쪽 끝을 기준으로 배치
      top: '50%',
      transform: 'translateY(-50%)',
      marginLeft: '15px', // 아이콘과 말풍선 사이의 간격
      backgroundColor: '#e3e3e3',
      color: '#131314',
      padding: '8px 12px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
      zIndex: 1000,
      boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      {/* 말풍선 왼쪽의 뾰족한 꼬리표(삼각형) 만들기 */}
      <div style={{
        position: 'absolute',
        left: '-6px',
        top: '50%',
        transform: 'translateY(-50%)',
        borderTop: '6px solid transparent',
        borderBottom: '6px solid transparent',
        borderRight: '6px solid #e3e3e3'
      }} />
      {text}
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#131314', color: '#e3e3e3', overflow: 'hidden' }}>
      
      <nav 
        style={{ 
          width: isSidebarOpen ? '280px' : '70px', 
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
          backgroundColor: '#1e1f20', 
          display: 'flex', 
          flexDirection: 'column', 
          borderRight: '1px solid #444746',
          whiteSpace: 'nowrap' 
        }}
      >
        {/* 1. 사이드바 토글 (열기/닫기) 버튼 */}
        <div style={{ padding: '15px', display: 'flex', alignItems: 'center', height: '60px', boxSizing: 'border-box' }}>
          <div 
            style={{ position: 'relative', display: 'inline-block' }}
            onMouseEnter={() => setHoveredId('toggle')}
            onMouseLeave={() => setHoveredId(null)}
          >
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{ 
                width: '40px', height: '40px', borderRadius: '50%', backgroundColor: hoveredId === 'toggle' ? '#303030' : 'transparent', border: 'none', 
                color: '#c4c7c5', fontSize: '20px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'background-color 0.2s'
              }}
            >
              ☰
            </button>
            {/* 햄버거 버튼 말풍선: 열려있든 닫혀있든 마우스 올리면 항상 뜹니다 */}
            {hoveredId === 'toggle' && renderTooltip(isSidebarOpen ? '사이드바 닫기' : '사이드바 열기')}
          </div>
        </div>

        {/* 2. 상단 메인 메뉴들 */}
        <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {menuItems.map((item) => (
            <div 
              key={item.id} 
              style={{ position: 'relative' }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <button
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex', alignItems: 'center', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', border: 'none',
                  backgroundColor: location.pathname === item.path && item.id === 'new' ? '#303030' : hoveredId === item.id ? '#2a2b2c' : 'transparent', 
                  color: '#e3e3e3', transition: 'background-color 0.2s', width: '100%', textAlign: 'left'
                }}
              >
                <span style={{ fontSize: '18px', width: '24px', textAlign: 'center', marginRight: isSidebarOpen ? '15px' : '0', transition: 'margin 0.3s' }}>
                  {item.icon}
                </span>
                
                <span style={{ fontSize: '14px', opacity: isSidebarOpen ? 1 : 0, transition: 'opacity 0.2s', pointerEvents: isSidebarOpen ? 'auto' : 'none' }}>
                  {item.label}
                </span>
              </button>
              {/* 🚀 메뉴 말풍선: 사이드바가 접혀있을 때(!isSidebarOpen)만 뜹니다 */}
              {hoveredId === item.id && !isSidebarOpen && renderTooltip(item.label)}
            </div>
          ))}
        </div>

        {/* 3. 최근 대화 내역 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px', marginTop: '10px' }}>
          {isSidebarOpen && (
            <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
              <div style={{ fontSize: '13px', color: '#c4c7c5', padding: '10px 12px', marginBottom: '5px' }}>최근</div>
              {recentChats.map((chatTitle, index) => (
                <div 
                  key={index} 
                  style={{ 
                    padding: '8px 12px', fontSize: '13px', color: '#e3e3e3', cursor: 'pointer', borderRadius: '8px',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' 
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#303030'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {chatTitle}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. 하단 설정 및 프로필 */}
        <div style={{ padding: '10px', borderTop: '1px solid #444746', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          
          {/* 설정 버튼 */}
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => setHoveredId('settings')}
            onMouseLeave={() => setHoveredId(null)}
          >
            <button
              onClick={() => navigate('/settings')}
              style={{
                display: 'flex', alignItems: 'center', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', border: 'none',
                backgroundColor: location.pathname === '/settings' ? '#303030' : hoveredId === 'settings' ? '#2a2b2c' : 'transparent', color: '#e3e3e3', width: '100%'
              }}
            >
              <span style={{ fontSize: '18px', width: '24px', textAlign: 'center', marginRight: isSidebarOpen ? '15px' : '0' }}>⚙️</span>
              <span style={{ fontSize: '14px', opacity: isSidebarOpen ? 1 : 0, transition: 'opacity 0.2s' }}>설정</span>
            </button>
            {hoveredId === 'settings' && !isSidebarOpen && renderTooltip('환경 설정')}
          </div>

          {/* 프로필 버튼 */}
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => setHoveredId('profile')}
            onMouseLeave={() => setHoveredId(null)}
          >
            <button
              onClick={() => navigate('/profile')}
              style={{
                display: 'flex', alignItems: 'center', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', border: 'none',
                backgroundColor: location.pathname === '/profile' ? '#303030' : hoveredId === 'profile' ? '#2a2b2c' : 'transparent', color: '#e3e3e3', width: '100%'
              }}
            >
              <div style={{ 
                width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#0b57d0', color: 'white', 
                display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '11px', fontWeight: 'bold',
                marginRight: isSidebarOpen ? '15px' : '0'
              }}>
                범준
              </div>
              <span style={{ fontSize: '14px', opacity: isSidebarOpen ? 1 : 0, transition: 'opacity 0.2s' }}>내 프로필</span>
            </button>
            {hoveredId === 'profile' && !isSidebarOpen && renderTooltip('내 프로필 (계정 관리)')}
          </div>
        </div>

      </nav>

      <main style={{ flex: 1, position: 'relative', overflowY: 'auto' }}>
        <Outlet /> 
      </main>

    </div>
  );
};

export default MainLayout;
import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom'; 
import '../../index.css'; 

interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  date: string;
}

const MainLayout = () => {
  const navigate = useNavigate(); 

  const [isNotebookModalOpen, setIsNotebookModalOpen] = useState(false);
  const [isNotiOpen, setIsNotiOpen] = useState(false);

  // ==========================================
  // 🚀 [팀원 공유용]: 인증(Auth) 상태 관리 영역
  // ==========================================
  // TODO(프론트/백엔드): 현재는 UI 테스트를 위해 임시로 'false(로그아웃 상태)'로 하드코딩 되어 있습니다.
  // 실제 연동 시에는 Zustand, Redux 같은 전역 상태나 localStorage.getItem('token') 등을 통해 
  // 사용자가 로그인했는지 여부를 판별하여 이 값을 true/false로 동적 업데이트해야 합니다.
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  
  // TODO(백엔드): 로그인 API 응답으로 받아온 유저의 이름(닉네임)을 전역 상태에서 불러와 여기에 넣어야 합니다.  
  const userName = "범준"; 

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, message: '📄 "자바 프로그래밍.pdf" 분석이 완료되었습니다.', isRead: false, date: '10분 전' },
    { id: 2, message: '🎉 회원가입을 환영합니다! 첫 프롬프트를 입력해 보세요.', isRead: true, date: '1일 전' },
  ]);

  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) => 
      prev.map((noti) => noti.id === id ? { ...noti, isRead: true } : noti)
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#131314', color: '#e3e3e3', margin: 0, overflow: 'hidden' }}>
      
      {/* 1. 좌측 얇은 아이콘 사이드바 */}
      <aside style={{ 
        width: '68px', backgroundColor: '#1e1f20', display: 'flex', flexDirection: 'column', 
        alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', margin: 0, zIndex: 50
      }}>
        
        {/* 상단 메인 메뉴들 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
          <div className="icon-wrapper"><span style={{ fontSize: '20px' }}>✨</span></div>
          <div className="icon-wrapper"><span style={{ fontSize: '18px' }}>📝</span><span className="tooltip">새 채팅</span></div>
          <div className="icon-wrapper"><span style={{ fontSize: '18px' }}>🔍</span><span className="tooltip">검색</span></div>
          <div className="icon-wrapper"><span style={{ fontSize: '18px' }}>💬</span><span className="tooltip">최근 대화</span></div>
          
          <div className="icon-wrapper" onClick={() => setIsNotebookModalOpen(true)}>
            <span style={{ fontSize: '18px' }}>📁</span><span className="tooltip">노트북 관리</span>
          </div>

          <div className="icon-wrapper" onClick={() => setIsNotiOpen(!isNotiOpen)} style={{ position: 'relative' }}>
            <span style={{ fontSize: '18px' }}>🔔</span>
            <span className="tooltip">알림 센터</span>
            {unreadCount > 0 && (
              <div style={{ position: 'absolute', top: '5px', right: '5px', width: '8px', height: '8px', backgroundColor: '#f28b82', borderRadius: '50%' }} />
            )}
          </div>
        </div>

        {/* 하단 유저 메뉴들 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
          <div className="icon-wrapper">
            <Link to="/profile" style={{ textDecoration: 'none', fontSize: '20px' }}>⚙️</Link>
            <span className="tooltip">설정</span>
          </div>
          
          {/* ========================================== */}
          {/* 🚀 [팀원 공유용]: 로그인 상태(isLoggedIn)에 따른 아이콘 조건부 렌더링 */}
          {/* ========================================== */}
          {isLoggedIn ? (
            // [상태 A] 로그인이 되어 있을 때: 유저의 이름이 적힌 파란색 동그라미를 보여줌
            <div 
              onClick={() => navigate('/profile')} // 로그인된 상태면 클릭 시 내 정보(프로필) 페이지로 이동
              style={{ 
                width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#005a9e', 
                display: 'flex', justifyContent: 'center', alignItems: 'center', 
                fontSize: '12px', fontWeight: 'bold', color: 'white', cursor: 'pointer' 
              }}
            >
              {userName}
            </div>
          ) : (
            // [상태 B] 로그인이 안 되어 있을 때: 열쇠(🔑) 아이콘을 보여주고, 클릭 시 로그인 페이지로 보냄
            <div className="icon-wrapper" onClick={() => navigate('/login')}>
              <span style={{ fontSize: '20px' }}>🔑</span>
              <span className="tooltip">로그인 하러가기</span>
            </div>
          )}
        </div>
      </aside>

      {/* 2. 알림 센터 우측 슬라이드 패널 */}
      {isNotiOpen && (
        <div style={{ 
          width: '300px', backgroundColor: '#1e1f20', borderRight: '1px solid #444746', 
          display: 'flex', flexDirection: 'column', padding: '20px', zIndex: 40,
          animation: 'slideIn 0.2s ease-out'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>알림 센터</h3>
            <button onClick={() => setIsNotiOpen(false)} style={{ background: 'transparent', border: 'none', color: '#c4c7c5', cursor: 'pointer', fontSize: '16px' }}>✖</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <p style={{ color: '#c4c7c5', fontSize: '14px', textAlign: 'center', marginTop: '20px' }}>새로운 알림이 없습니다.</p>
            ) : (
              notifications.map((noti) => (
                <div key={noti.id} style={{ 
                  padding: '12px', borderRadius: '8px', 
                  backgroundColor: noti.isRead ? 'transparent' : '#2a2b2f', 
                  border: '1px solid #444746', display: 'flex', flexDirection: 'column', gap: '5px' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '13px', color: '#e3e3e3', lineHeight: '1.4' }}>{noti.message}</span>
                    {!noti.isRead && (
                      <button onClick={() => handleMarkAsRead(noti.id)} style={{ background: 'transparent', border: 'none', color: '#a8c7fa', fontSize: '11px', cursor: 'pointer', whiteSpace: 'nowrap', marginLeft: '10px' }}>
                        읽음
                      </button>
                    )}
                  </div>
                  <span style={{ fontSize: '11px', color: '#7a7c7f' }}>{noti.date}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 3. 우측 메인 영역 */}
      <main style={{ flex: 1, position: 'relative' }}>
        <Outlet /> 
      </main>

      {/* 4. 내 노트북 관리 모달 */}
      {isNotebookModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#1e1f20', padding: '30px', borderRadius: '15px', width: '500px', border: '1px solid #444746', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: '#e3e3e3', fontSize: '20px', fontWeight: '500' }}>내 노트북 관리</h2>
              <button onClick={() => setIsNotebookModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#c4c7c5', fontSize: '20px', cursor: 'pointer' }}>✖</button>
            </div>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #444746' }}>
                <span style={{ color: '#e3e3e3' }}>📗 리눅스 명령어 모음</span>
                <div>
                  <button style={{ background: 'transparent', border: 'none', color: '#a8c7fa', cursor: 'pointer', marginRight: '10px' }}>수정</button>
                  <button style={{ background: 'transparent', border: 'none', color: '#f28b82', cursor: 'pointer' }}>삭제</button>
                </div>
              </li>
              
              <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #444746' }}>
                <span style={{ color: '#e3e3e3' }}>📘 자바 프로그래밍 정리</span>
                <div>
                  <button style={{ background: 'transparent', border: 'none', color: '#a8c7fa', cursor: 'pointer', marginRight: '10px' }}>수정</button>
                  <button style={{ background: 'transparent', border: 'none', color: '#f28b82', cursor: 'pointer' }}>삭제</button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
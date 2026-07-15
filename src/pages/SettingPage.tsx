import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const navigate = useNavigate();

  // ==========================================
  // 💡 각각의 토글(스위치) 작동을 위한 상태 관리
  // 백엔드 명세서가 나오면 이 상태값들을 DB와 연동하면 됩니다!
  // ==========================================
  const [pushEnabled, setPushEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [analytics, setAnalytics] = useState(false);

  return (
    <div className="settings-page">
      <div className="settings-wrap">
        
        {/* 뒤로 가기 버튼 (메인 대시보드로 이동) */}
        <div className="settings-back" onClick={() => navigate('/')}>
          <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg> 돌아가기
        </div>

        <div className="settings-header">
          <div className="mascot"><span className="eyes"><span></span><span></span></span></div>
          <h1>설정</h1>
        </div>

        {/* --- 섹션 1: 알림 --- */}
        <div className="settings-section">
          <div className="settings-label">알림</div>
          <div className="settings-card">
            <div className="settings-row">
              <div className="settings-row-text">
                <div className="title">푸시 알림</div>
                <div className="sub">새 메시지 및 업데이트 알림</div>
              </div>
              <div 
                className={`toggle ${pushEnabled ? 'on' : ''}`} 
                onClick={() => setPushEnabled(!pushEnabled)}
              >
                <div className="knob"></div>
              </div>
            </div>
          </div>
        </div>

        {/* --- 섹션 2: 화면 --- */}
        <div className="settings-section">
          <div className="settings-label">화면</div>
          <div className="settings-card">
            <div className="settings-row">
              <div className="settings-row-text">
                <div className="title">다크 모드</div>
                <div className="sub">어두운 테마로 전환 (현재는 준비 중입니다!)</div>
              </div>
              <div 
                className={`toggle ${darkMode ? 'on' : ''}`} 
                onClick={() => setDarkMode(!darkMode)}
              >
                <div className="knob"></div>
              </div>
            </div>
          </div>
        </div>

        {/* --- 섹션 3: 데이터 --- */}
        <div className="settings-section">
          <div className="settings-label">데이터</div>
          <div className="settings-card">
            <div className="settings-row">
              <div className="settings-row-text">
                <div className="title">자동 저장</div>
                <div className="sub">대화 기록 자동 저장</div>
              </div>
              <div 
                className={`toggle ${autoSave ? 'on' : ''}`} 
                onClick={() => setAutoSave(!autoSave)}
              >
                <div className="knob"></div>
              </div>
            </div>
            <div className="settings-row">
              <div className="settings-row-text">
                <div className="title">사용 분석 참여</div>
                <div className="sub">서비스 개선을 위한 익명 데이터 수집</div>
              </div>
              <div 
                className={`toggle ${analytics ? 'on' : ''}`} 
                onClick={() => setAnalytics(!analytics)}
              >
                <div className="knob"></div>
              </div>
            </div>
          </div>
        </div>

        {/* --- 섹션 4: 계정 --- */}
        {/* 💡 계정 관련 기능은 아까 만들어둔 명세서 연동 페이지(ProfilePage)로 보냅니다 */}
        <div className="settings-section">
          <div className="settings-label">계정</div>
          <div className="settings-card">
            
            <div className="settings-row clickable" onClick={() => navigate('/profile')}>
              <div className="settings-row-text"><div className="title">계정 정보 (내 프로필)</div></div>
              <svg className="chevron" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>
            </div>
            
            <div className="settings-row clickable" onClick={() => navigate('/profile')}>
              <div className="settings-row-text"><div className="title">비밀번호 변경</div></div>
              <svg className="chevron" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
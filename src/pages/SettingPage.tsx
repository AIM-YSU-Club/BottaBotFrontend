import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Mascot from '../components/common/Mascot';
import SettingsPageLayout from '../components/settings/SettingsPageLayout';
import SettingsBackLink from '../components/settings/SettingsBackLink';
import SettingsSection from '../components/settings/SettingsSection';
import SettingsToggleRow from '../components/settings/SettingsToggleRow';
import SettingsNavRow from '../components/settings/SettingsNavRow';

const SettingsPage = () => {
  const navigate = useNavigate();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [analytics, setAnalytics] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const toggleDarkMode = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);

    if (nextMode) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <SettingsPageLayout>
      <SettingsBackLink label="돌아가기" onClick={() => navigate('/')} />

      <div className="settings-header">
        <Mascot size="sm" />
        <h1>설정</h1>
      </div>

      <SettingsSection label="알림">
        <SettingsToggleRow
          title="푸시 알림"
          sub="새 메시지 및 업데이트 알림"
          checked={pushEnabled}
          onChange={() => setPushEnabled(!pushEnabled)}
        />
      </SettingsSection>

      <SettingsSection label="화면">
        <SettingsToggleRow
          title="다크 모드"
          sub="어두운 테마로 전환하여 눈의 피로를 줄입니다."
          checked={darkMode}
          onChange={toggleDarkMode}
        />
      </SettingsSection>

      <SettingsSection label="데이터">
        <SettingsToggleRow
          title="자동 저장"
          sub="대화 기록 자동 저장"
          checked={autoSave}
          onChange={() => setAutoSave(!autoSave)}
        />
        <SettingsToggleRow
          title="사용 분석 참여"
          sub="서비스 개선을 위한 익명 데이터 수집"
          checked={analytics}
          onChange={() => setAnalytics(!analytics)}
        />
      </SettingsSection>

      <SettingsSection label="계정">
        <SettingsNavRow title="계정 정보 (내 프로필)" onClick={() => navigate('/profile')} />
        <SettingsNavRow title="비밀번호 변경" onClick={() => navigate('/profile')} />
      </SettingsSection>
    </SettingsPageLayout>
  );
};

export default SettingsPage;

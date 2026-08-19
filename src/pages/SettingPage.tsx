import { useNavigate } from 'react-router-dom';
import SettingsPageLayout from '../components/settings/SettingsPageLayout';
import SettingsBackLink from '../components/settings/SettingsBackLink';
import SettingsSection from '../components/settings/SettingsSection';
import SettingsNavRow from '../components/settings/SettingsNavRow';

const SettingsPage = () => {
  const navigate = useNavigate();

  return (
    <SettingsPageLayout>
      <SettingsBackLink label="돌아가기" onClick={() => navigate('/')} />

      <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--black)', margin: '0 0 28px' }}>설정</h1>

      <SettingsSection label="계정">
        <SettingsNavRow title="계정 정보 (내 프로필)" onClick={() => navigate('/profile')} />
        <SettingsNavRow title="비밀번호 변경" onClick={() => navigate('/profile')} />
      </SettingsSection>
    </SettingsPageLayout>
  );
};

export default SettingsPage;

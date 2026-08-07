import { useNavigate } from 'react-router-dom';
import Mascot from '../components/common/Mascot';
import SettingsPageLayout from '../components/settings/SettingsPageLayout';
import SettingsBackLink from '../components/settings/SettingsBackLink';
import SettingsSection from '../components/settings/SettingsSection';
import SettingsNavRow from '../components/settings/SettingsNavRow';

const SettingsPage = () => {
  const navigate = useNavigate();

  return (
    <SettingsPageLayout>
      <SettingsBackLink label="돌아가기" onClick={() => navigate('/')} />

      <div className="settings-header">
        <Mascot size="sm" />
        <h1>설정</h1>
      </div>

      <SettingsSection label="계정">
        <SettingsNavRow title="계정 정보 (내 프로필)" onClick={() => navigate('/profile')} />
        <SettingsNavRow title="비밀번호 변경" onClick={() => navigate('/profile')} />
      </SettingsSection>
    </SettingsPageLayout>
  );
};

export default SettingsPage;

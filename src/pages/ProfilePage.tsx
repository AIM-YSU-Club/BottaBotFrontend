import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api/axios';
import { useUser } from '../context/UserContext';
import FormField from '../components/common/FormField';
import Mascot from '../components/common/Mascot';
import UserAvatar from '../components/common/UserAvatar';
import AuthPageLayout from '../components/auth/AuthPageLayout';
import AuthHeader from '../components/auth/AuthHeader';
import SettingsPageLayout from '../components/settings/SettingsPageLayout';
import SettingsBackLink from '../components/settings/SettingsBackLink';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [isVerified, setIsVerified] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');

  const [userInfo, setUserInfo] = useState({ name: '', studentId: '', email: '' });
  const [nickname, setNickname] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const data = await api.get('/members/me');
        setUserInfo({
          name: data.name,
          studentId: data.studentId,
          email: data.email,
        });
        setNickname(data.nickname || '범준');
        setUser((prev) => ({ ...prev, name: data.nickname || '범준' }));
      } catch (error) {
        console.warn('프로필 조회 실패, 회의용 더미 데이터로 대체합니다.', error);
        setUserInfo({
          name: '조범준',
          studentId: '20240001',
          email: 'jobeomjun1234@yeonsung.ac.kr',
        });
        setNickname('범준');
        setUser((prev) => ({ ...prev, name: '범준' }));
      }
    };

    fetchMyProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPassword) {
      setIsVerified(true);
    } else {
      alert('현재 비밀번호를 입력해 주세요.');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim()) {
      alert('닉네임은 최소 한 글자 이상 입력해야 합니다.');
      return;
    }

    try {
      // API 명세 2장(MEM03_MODIFY01): PATCH /members/me { currentPassword, email/phoneNumber/address/newPassword 중 선택 }
      // 닉네임은 명세에 없는 필드라 서버로 보내지 않습니다(로컬 표시용). 비밀번호를 바꿀 때만
      // 실제로 API를 호출하고, 닉네임만 바꾼 경우는 서버에 보낼 게 없어 로컬 상태만 갱신합니다.
      if (newPassword.trim()) {
        await api.patch('/members/me', { currentPassword, newPassword: newPassword.trim() });
      }

      setUser((prev) => ({ ...prev, name: nickname }));

      alert('회원 정보가 성공적으로 변경되었습니다!');
      setNewPassword('');
    } catch (error: unknown) {
      console.error('프로필 저장 에러:', error);
      if (axios.isAxiosError(error)) {
        alert(
          `저장 실패: ${error.response?.data?.error?.message || '비밀번호가 틀렸거나 문제가 발생했습니다.'}`
        );
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm('정말 로그아웃 하시겠습니까?');
    if (!confirmLogout) return;

    try {
      // API 명세 2장(MEM05_LOGOUT01): POST /auth/logout — 서버 측 세션/토큰 즉시 만료
      await api.post('/auth/logout');
    } catch (error) {
      console.error('로그아웃 API 실패, 로컬 세션만 정리합니다:', error);
    } finally {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      setUser({ name: '알 수 없음', role: '게스트' });
      navigate('/login', { replace: true });
    }
  };

  if (!isVerified) {
    return (
      <AuthPageLayout as="form" onSubmit={handleVerify}>
        <Mascot size="xl" />
        <AuthHeader heading="안전한 사용을 위해" sub="현재 비밀번호를 다시 입력해 주세요" />

        <FormField
          type="password"
          placeholder="현재 비밀번호 입력"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary">
          확인
        </button>

        <div className="link-row" style={{ marginTop: '20px' }}>
          <a onClick={() => navigate(-1)}>← 이전 페이지로 돌아가기</a>
        </div>
      </AuthPageLayout>
    );
  }

  return (
    <SettingsPageLayout>
      <SettingsBackLink label="설정으로 돌아가기" onClick={() => navigate('/settings')} />

      <form
        onSubmit={handleSaveProfile}
        className="auth-card"
        style={{ maxWidth: '600px', margin: '0 auto' }}
      >
        <UserAvatar name={nickname} size="lg" />
        <div
          className="account-name"
          style={{ textAlign: 'center', fontSize: '19px', fontWeight: 800, color: 'var(--black)' }}
        >
          {nickname}
        </div>
        <div
          className="account-email"
          style={{
            textAlign: 'center',
            fontSize: '12.5px',
            color: 'var(--ink-soft)',
            margin: '4px 0 24px',
          }}
        >
          {userInfo.email}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <FormField
            label="이름"
            type="text"
            value={userInfo.name}
            disabled
            style={{ color: 'var(--ink-soft)' }}
            containerStyle={{ flex: 1 }}
          />
          <FormField
            label="학번"
            type="text"
            value={userInfo.studentId}
            disabled
            style={{ color: 'var(--ink-soft)' }}
            containerStyle={{ flex: 1 }}
          />
        </div>

        <FormField
          label="학교 이메일 (아이디)"
          type="text"
          value={userInfo.email}
          disabled
          style={{ color: 'var(--ink-soft)' }}
        />

        <FormField
          label="닉네임 설정"
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />

        <FormField
          label="새 비밀번호 설정"
          type="password"
          placeholder="변경할 비밀번호 입력 (변경하지 않으려면 비워두세요)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button type="submit" className="btn btn-primary" style={{ marginTop: '20px' }}>
          변경 사항 저장
        </button>

        <button
          type="button"
          onClick={handleLogout}
          style={{
            marginTop: '12px',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid var(--line)',
            backgroundColor: 'var(--surface)',
            color: 'var(--ink)',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            width: '100%',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface)')}
        >
          로그아웃
        </button>

        <button
          type="button"
          className="btn btn-danger-outline"
          onClick={() => navigate('/deactivate')}
          style={{ marginTop: '12px' }}
        >
          회원 탈퇴 및 비활성화
        </button>
      </form>
    </SettingsPageLayout>
  );
};

export default ProfilePage;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api/axios';
import FormField from '../components/common/FormField';
import AuthPageLayout from '../components/auth/AuthPageLayout';
import AuthHeader from '../components/auth/AuthHeader';

const ChangeIdPage = () => {
  const navigate = useNavigate();
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    api
      .get('/members/me')
      .then((data) => setCurrentEmail(data.email))
      .catch((error) => console.warn('현재 이메일 조회 실패:', error));
  }, []);

  const handleChangeId = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !currentPassword) return;

    try {
      // API 명세 2장(MEM03_MODIFY01): 이메일 변경은 별도 엔드포인트가 아니라
      // PATCH /members/me { currentPassword, email } 로 처리합니다.
      await api.patch('/members/me', { currentPassword, email: newEmail });

      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      alert('이메일(아이디)이 성공적으로 변경되었습니다. 안전을 위해 다시 로그인해 주세요.');
      navigate('/login');
    } catch (error: unknown) {
      console.error('이메일 변경 에러:', error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          alert('이미 사용 중인 이메일입니다. 다른 이메일을 입력해 주세요.');
        } else if (error.response?.status === 401 || error.response?.status === 403) {
          alert('현재 비밀번호가 일치하지 않습니다.');
        } else {
          alert('변경 중 문제가 발생했습니다. 다시 시도해 주세요.');
        }
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <AuthPageLayout
      as="form"
      onSubmit={handleChangeId}
      side={<AuthHeader heading="이메일(아이디) 변경" sub="새로운 이메일을 입력해 주세요" />}
    >
      <FormField label="현재 이메일" type="text" value={currentEmail} disabled />

      <FormField
        label="현재 비밀번호"
        type="password"
        placeholder="본인 확인을 위해 입력해 주세요"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
      />

      <FormField
        label="새로운 이메일"
        type="email"
        placeholder="새로운 이메일 입력"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
        required
        containerStyle={{ marginBottom: '32px' }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <a onClick={() => navigate('/profile')} style={{ fontSize: '13.5px', fontWeight: 700, cursor: 'pointer' }}>
          ← 돌아가기
        </a>
        <button type="submit" className="btn btn-primary" style={{ display: 'inline-block', width: 'auto', padding: '14px 32px', margin: 0 }}>
          변경하기
        </button>
      </div>
    </AuthPageLayout>
  );
};

export default ChangeIdPage;

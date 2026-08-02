import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api/axios';
import FormField from '../components/common/FormField';
import Mascot from '../components/common/Mascot';
import AuthPageLayout from '../components/auth/AuthPageLayout';
import AuthHeader from '../components/auth/AuthHeader';

const ChangeIdPage = () => {
  const navigate = useNavigate();
  const [newEmail, setNewEmail] = useState('');
  const currentEmail = 'example@univ.ac.kr';

  const handleChangeId = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    try {
      await api.patch('/user/change-email', { newEmail });

      sessionStorage.removeItem('accessToken');
      alert('이메일(아이디)이 성공적으로 변경되었습니다. 안전을 위해 다시 로그인해 주세요.');
      navigate('/login');
    } catch (error: unknown) {
      console.error('이메일 변경 에러:', error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          alert('이미 사용 중인 이메일입니다. 다른 이메일을 입력해 주세요.');
        } else {
          alert('변경 중 문제가 발생했습니다. 다시 시도해 주세요.');
        }
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <AuthPageLayout as="form" onSubmit={handleChangeId}>
      <Mascot size="xl" />
      <AuthHeader heading="이메일(아이디) 변경" sub="새로운 이메일을 입력해 주세요" />

      <FormField
        label="현재 이메일"
        type="text"
        value={currentEmail}
        disabled
        style={{ color: 'var(--ink-soft)' }}
      />

      <FormField
        label="새로운 이메일"
        type="email"
        placeholder="새로운 이메일 입력"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
        required
      />

      <button type="submit" className="btn btn-primary">
        변경하기
      </button>

      <div className="link-row" style={{ marginTop: '20px' }}>
        <a onClick={() => navigate(-1)}>← 이전 페이지로 돌아가기</a>
      </div>
    </AuthPageLayout>
  );
};

export default ChangeIdPage;

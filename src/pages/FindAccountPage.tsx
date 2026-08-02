import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api/axios';
import FormField from '../components/common/FormField';
import Mascot from '../components/common/Mascot';
import SegmentTabs from '../components/common/SegmentTabs';
import AuthPageLayout from '../components/auth/AuthPageLayout';
import AuthHeader from '../components/auth/AuthHeader';

const FindAccountPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'findId' | 'resetPw'>('findId');

  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');

  const handleFindId = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !studentId) return;

    try {
      const response = await api.post('/auth/find-id', { name, studentId });
      const foundEmail = response.data.email;
      alert(`입력하신 정보로 등록된 이메일(아이디)은 '${foundEmail}' 입니다.`);
    } catch (error: unknown) {
      console.error('아이디 찾기 에러:', error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          alert('입력하신 이름과 학번으로 가입된 계정이 없습니다.');
        } else {
          alert('아이디 찾기 처리 중 문제가 발생했습니다.');
        }
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  const handleResetPw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await api.post('/auth/reset-password', { email });
      alert('입력하신 이메일로 비밀번호 재설정 안내가 발송되었습니다.');
      navigate('/login');
    } catch (error: unknown) {
      console.error('비밀번호 재설정 에러:', error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          alert('존재하지 않는 이메일(아이디)입니다.');
        } else {
          alert('요청 처리 중 문제가 발생했습니다. 다시 시도해 주세요.');
        }
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <AuthPageLayout>
      <Mascot size="xl" />
      <AuthHeader
        heading={activeTab === 'findId' ? '계정 찾기' : '비밀번호 재설정'}
        sub={
          activeTab === 'findId'
            ? '가입 시 사용한 이메일로 찾을 수 있어요'
            : '가입한 이메일을 입력하면 재설정 링크를 보내드려요'
        }
      />

      <SegmentTabs
        value={activeTab}
        onChange={setActiveTab}
        options={[
          { value: 'findId', label: '아이디 찾기' },
          { value: 'resetPw', label: '비밀번호 찾기' },
        ]}
      />

      {activeTab === 'findId' ? (
        <form onSubmit={handleFindId}>
          <FormField
            label="가입 시 등록한 이름"
            type="text"
            placeholder="홍길동"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <FormField
            label="학번"
            type="text"
            placeholder="20240001"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary">
            아이디 찾기
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPw}>
          <FormField
            label="가입한 이메일 (아이디)"
            type="email"
            placeholder="example@yeonsung.ac.kr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary">
            재설정 링크 받기
          </button>
        </form>
      )}

      <a className="link-back" onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>
        ← 로그인으로 돌아가기
      </a>
    </AuthPageLayout>
  );
};

export default FindAccountPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api/axios';
import FormField from '../components/common/FormField';
import SegmentTabs from '../components/common/SegmentTabs';
import AuthPageLayout from '../components/auth/AuthPageLayout';
import AuthHeader from '../components/auth/AuthHeader';

const FindAccountPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'findId' | 'resetPw'>('findId');

  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');

  // API 명세 2장: 비밀번호 재설정은 request(전화번호 인증) → confirm(코드+새 비밀번호) 2단계입니다.
  const [resetStep, setResetStep] = useState<'request' | 'confirm'>('request');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleFindId = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !studentId) return;

    try {
      // api 인스턴스가 공통 응답 포맷을 이미 한 번 풀어주므로(src/api/axios.ts), 여기서
      // 또 .data를 붙이면 실제로는 항상 undefined였습니다.
      const data = await api.post('/auth/find-id', { name, studentId });
      const foundEmail = data.email;
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

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phoneNumber) return;

    try {
      // POST /auth/password-reset/request { email, phoneNumber } → verificationId
      const data = await api.post('/auth/password-reset/request', { email, phoneNumber });
      setVerificationId(data.verificationId);
      setResetStep('confirm');
    } catch (error: unknown) {
      console.error('비밀번호 재설정 요청 에러:', error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          alert('입력하신 이메일과 전화번호로 가입된 계정이 없습니다.');
        } else {
          alert('요청 처리 중 문제가 발생했습니다. 다시 시도해 주세요.');
        }
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  const handleResetConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !newPassword) return;

    try {
      // PATCH /auth/password-reset/confirm { verificationId, code, newPassword }
      await api.patch('/auth/password-reset/confirm', { verificationId, code, newPassword });
      alert('비밀번호가 성공적으로 변경되었습니다. 새 비밀번호로 로그인해 주세요.');
      navigate('/login');
    } catch (error: unknown) {
      console.error('비밀번호 재설정 확인 에러:', error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401 || error.response?.status === 400) {
          alert('인증번호가 일치하지 않거나 만료되었습니다.');
        } else {
          alert('요청 처리 중 문제가 발생했습니다. 다시 시도해 주세요.');
        }
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <AuthPageLayout
      side={
        <AuthHeader
          heading={activeTab === 'findId' ? '계정 찾기' : '비밀번호 재설정'}
          sub={
            activeTab === 'findId'
              ? '가입 시 사용한 이름과 학번으로 찾을 수 있어요'
              : resetStep === 'request'
                ? '가입 시 등록한 이메일과 전화번호로 인증해 주세요'
                : '전화번호로 받은 인증번호와 새 비밀번호를 입력해 주세요'
          }
        />
      }
    >
      <SegmentTabs
        value={activeTab}
        onChange={(v) => {
          setActiveTab(v);
          setResetStep('request');
        }}
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
      ) : resetStep === 'request' ? (
        <form onSubmit={handleResetRequest}>
          <FormField
            label="가입한 이메일 (아이디)"
            type="email"
            placeholder="example@yeonsung.ac.kr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FormField
            label="가입 시 등록한 전화번호"
            type="text"
            placeholder="010-0000-0000"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary">
            인증번호 받기
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetConfirm}>
          <FormField
            label="인증번호"
            type="text"
            placeholder="전화번호로 받은 인증번호 입력"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <FormField
            label="새 비밀번호"
            type="password"
            placeholder="새로 사용할 비밀번호 입력"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary">
            비밀번호 변경
          </button>
          <a className="link-back" onClick={() => setResetStep('request')} style={{ cursor: 'pointer' }}>
            ← 이전 단계로
          </a>
        </form>
      )}

      <a className="link-back" onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>
        ← 로그인으로 돌아가기
      </a>
    </AuthPageLayout>
  );
};

export default FindAccountPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api/axios';
import FormField from '../components/common/FormField';
import InputWithAction from '../components/common/InputWithAction';
import Mascot from '../components/common/Mascot';
import TermsCheckbox from '../components/common/TermsCheckbox';
import AuthPageLayout from '../components/auth/AuthPageLayout';
import AuthHeader from '../components/auth/AuthHeader';

const SignUpPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');

  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleCheckNickname = async () => {
    if (!nickname.trim()) {
      alert('검사할 닉네임을 입력해 주세요.');
      return;
    }
    alert('[회의용] 사용 가능한 닉네임입니다!');
    setIsNicknameChecked(true);
  };

  const handleRequestCode = async () => {
    if (!email) {
      alert('이메일을 먼저 입력해주세요.');
      return;
    }
    try {
      await api.post('/members/email-verification', { email, agreeTerms: true });
      alert(`${email}로 인증번호가 발송되었습니다. (테스트 진행 중)`);
    } catch (error: unknown) {
      console.error('인증번호 발송 에러:', error);
      alert('인증번호 발송 테스트 (콘솔을 확인해 주세요)');
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert('이용약관에 동의해 주세요.');
      return;
    }
    if (!isNicknameChecked) {
      alert('닉네임 중복 확인을 먼저 진행해 주세요.');
      return;
    }
    if (!verificationCode) {
      alert('인증번호를 입력해주세요.');
      return;
    }

    try {
      const signupPayload = {
        name,
        studentId,
        email,
        password,
        nickname,
        loginId: email,
        phoneNumber: '010-0000-0000',
        address: '미입력',
        payDay: '1',
      };

      await api.post('/members', signupPayload);
      alert('회원가입이 성공적으로 완료되었습니다! 로그인 페이지로 이동합니다.');
      navigate('/login');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          alert('이미 가입된 이메일 또는 학번입니다.');
        } else {
          alert(`서버 에러 발생: ${error.response?.data?.error?.message || '알 수 없는 오류'}`);
        }
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <AuthPageLayout as="form" onSubmit={handleSignUpSubmit}>
      <Mascot size="xl" />
      <AuthHeader heading="회원가입" sub="BottaBot과 함께 시작해요" />

      <div style={{ display: 'flex', gap: '12px' }}>
        <FormField
          label="이름"
          type="text"
          placeholder="홍길동"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          containerStyle={{ flex: 1 }}
        />
        <FormField
          label="학번"
          type="text"
          placeholder="20240001"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
          containerStyle={{ flex: 1 }}
        />
      </div>

      <InputWithAction
        label="닉네임"
        type="text"
        placeholder="서비스 사용할 닉네임"
        value={nickname}
        onChange={(e) => {
          setNickname(e.target.value);
          setIsNicknameChecked(false);
        }}
        required
        actionLabel={isNicknameChecked ? '확인 완료' : '중복 확인'}
        onAction={handleCheckNickname}
        actionClassName="btn"
        actionStyle={{
          backgroundColor: isNicknameChecked ? 'var(--leaf-deep)' : 'var(--black)',
          color: 'white',
        }}
      />

      <InputWithAction
        label="학교 이메일 (아이디)"
        type="email"
        placeholder="example@yeonsung.ac.kr"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        actionLabel="인증받기"
        onAction={handleRequestCode}
      />

      <FormField
        label="인증번호 (테스트용: 1234)"
        type="text"
        placeholder="이메일로 발송된 인증번호 입력"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        required
      />

      <FormField
        label="비밀번호"
        type="password"
        placeholder="8자 이상 입력"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <TermsCheckbox
        checked={agreeTerms}
        onChange={setAgreeTerms}
        label="이용약관 및 개인정보처리방침에 동의합니다"
      />

      <button
        type="submit"
        className={`btn ${agreeTerms ? 'btn-primary' : 'btn-muted'}`}
        disabled={!agreeTerms}
      >
        가입하기
      </button>

      <div className="link-row">
        <a onClick={() => navigate('/login')}>이미 계정이 있어요</a>
      </div>
    </AuthPageLayout>
  );
};

export default SignUpPage;

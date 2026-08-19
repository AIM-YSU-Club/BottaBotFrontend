import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api/axios';
import FormField from '../components/common/FormField';
import InputWithAction from '../components/common/InputWithAction';
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

    try {
      // ponytail: 명세서엔 닉네임 자체가 회원 데이터에 없어서 중복확인 API도 없습니다.
      // 임시 경로로 실제 호출을 시도하고, 백엔드에 진짜 엔드포인트가 생기면
      // 이 경로/응답 파싱만 바꾸면 됩니다. 인증 전 단계라 공용 api 인스턴스 대신
      // 인터셉터 없는 axios를 씁니다(다른 임시 엔드포인트에서 겪은 것과 같은 이유).
      const res = await axios.get<{ available?: boolean }>(
        `${import.meta.env.VITE_API_BASE_URL}/members/nickname-check`,
        { params: { nickname: nickname.trim() } }
      );

      if (res.data?.available === false) {
        alert('이미 사용 중인 닉네임입니다.');
        setIsNicknameChecked(false);
        return;
      }
      setIsNicknameChecked(true);
    } catch (error) {
      console.error('닉네임 중복 확인 실패:', error);
      alert('지금은 실시간 중복 확인이 되지 않아요. 가입 시 서버에서 다시 확인합니다.');
      setIsNicknameChecked(true); // 엔드포인트가 없다고 가입 자체를 막지는 않습니다.
    }
  };

  const handleRequestCode = async () => {
    if (!email) {
      alert('이메일을 먼저 입력해주세요.');
      return;
    }
    try {
      await api.post('/members/email-verification', { email, agreeTerms });
      alert(`${email}로 인증번호가 발송되었습니다.`);
    } catch (error: unknown) {
      console.error('인증번호 발송 에러:', error);
      alert('인증번호 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.');
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
        // ponytail: 명세의 /members 요청 바디엔 없는 필드입니다. 이메일 인증을
        // "링크 클릭"이 아니라 "코드 입력"형으로 쓰기로 합의한 만큼, 서버가 검증할 수 있게
        // 코드를 같이 보냅니다. 실제 필드명은 백엔드 확정되면 맞춰야 합니다.
        emailVerificationCode: verificationCode,
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
    <AuthPageLayout
      as="form"
      onSubmit={handleSignUpSubmit}
      cardStyle={{ maxWidth: '900px' }}
      side={<AuthHeader heading="회원가입" sub="BottaBot과 함께 시작해요" />}
    >
      <div style={{ display: 'flex', gap: '14px' }}>
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
        placeholder="서비스에서 사용할 닉네임"
        value={nickname}
        onChange={(e) => {
          setNickname(e.target.value);
          setIsNicknameChecked(false);
        }}
        required
        actionLabel={isNicknameChecked ? '확인 완료' : '중복 확인'}
        onAction={handleCheckNickname}
        actionStyle={{ backgroundColor: isNicknameChecked ? 'var(--leaf-deep)' : 'var(--black)' }}
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
        label="인증번호"
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
        containerStyle={{ marginBottom: '28px' }}
      />

      <TermsCheckbox
        checked={agreeTerms}
        onChange={setAgreeTerms}
        label="이용약관 및 개인정보처리방침에 동의합니다"
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginTop: '28px' }}>
        <a onClick={() => navigate('/login')} style={{ fontSize: '13.5px', fontWeight: 700, cursor: 'pointer' }}>
          이미 계정이 있어요
        </a>
        <button type="submit" className="btn btn-primary" style={{ display: 'inline-block', width: 'auto', padding: '14px 32px', margin: 0 }}>
          가입하기
        </button>
      </div>
    </AuthPageLayout>
  );
};

export default SignUpPage;

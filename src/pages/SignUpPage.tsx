import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import api from '../api/axios'; 

const SignUpPage = () => {
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState(''); 
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  // 💡 새 디자인에 추가된 '약관 동의' 상태 관리
  const [agreeTerms, setAgreeTerms] = useState(false); 

  // ==========================================
  // 🚀 기존에 만들어둔 로직 100% 그대로 유지
  // ==========================================
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
      // 💡 [핵심] 백엔드 연동을 위한 더미 데이터 포함 (유지)
      const signupPayload = {
        name, studentId, email, password, nickname,
        loginId: email,               
        phoneNumber: "010-0000-0000", 
        address: "미입력",            
        payDay: "1"                   
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
    <div className="auth-page">
      <form onSubmit={handleSignUpSubmit} className="auth-card">
        
        <div className="mascot-xl">
          <span className="eyes"><span></span><span></span></span>
        </div>
        
        <div className="auth-title">BottaBot</div>
        <div className="auth-heading">회원가입</div>
        <div className="auth-sub">BottaBot과 함께 시작해요</div>

        {/* 이름 & 학번: 나란히 배치 */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="field" style={{ flex: 1 }}>
            <label>이름</label>
            <input type="text" placeholder="홍길동" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label>학번</label>
            <input type="text" placeholder="20240001" value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
          </div>
        </div>

        {/* 닉네임 + 중복확인 버튼 */}
        <div className="field">
          <label>닉네임</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input type="text" placeholder="서비스 사용할 닉네임" value={nickname} onChange={(e) => {setNickname(e.target.value); setIsNicknameChecked(false);}} required style={{ flex: 1 }} />
            <button type="button" onClick={handleCheckNickname} className="btn" style={{ width: 'auto', padding: '0 16px', margin: 0, backgroundColor: isNicknameChecked ? 'var(--leaf-deep)' : 'var(--black)', color: 'white' }}>
              {isNicknameChecked ? '확인 완료' : '중복 확인'}
            </button>
          </div>
        </div>

        {/* 이메일 + 인증받기 버튼 */}
        <div className="field">
          <label>학교 이메일 (아이디)</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input type="email" placeholder="example@yeonsung.ac.kr" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ flex: 1 }} />
            <button type="button" onClick={handleRequestCode} className="btn btn-outline" style={{ width: 'auto', padding: '0 16px', margin: 0 }}>
              인증받기
            </button>
          </div>
        </div>

        <div className="field">
          <label>인증번호 (테스트용: 1234)</label>
          <input type="text" placeholder="이메일로 발송된 인증번호 입력" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} required />
        </div>

        <div className="field">
          <label>비밀번호</label>
          <input type="password" placeholder="8자 이상 입력" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        {/* 💡 새 디자인: 약관 동의 체크박스 로직 */}
        <div className="check-row" onClick={() => setAgreeTerms(!agreeTerms)}>
          <span className={`circle ${agreeTerms ? 'checked' : ''}`}></span>
          <span className="check-label">이용약관 및 개인정보처리방침에 동의합니다</span>
        </div>

        {/* 약관 동의 시에만 버튼 색상이 활성화됩니다 */}
        <button type="submit" className={`btn ${agreeTerms ? 'btn-primary' : 'btn-muted'}`} disabled={!agreeTerms}>
          가입하기
        </button>

        <div className="link-row">
          <a onClick={() => navigate('/login')}>이미 계정이 있어요</a>
        </div>

      </form>
    </div>
  );
};

export default SignUpPage;
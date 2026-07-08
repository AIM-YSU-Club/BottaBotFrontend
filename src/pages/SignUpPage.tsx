import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  // 🚀 [팀원 공유용]: SMS 인증번호 요청 API 연동 함수입니다.
  const handleRequestCode = () => {
    if (!phone) {
      alert('전화번호를 먼저 입력해주세요.');
      return;
    }
    // 🚀 [팀원 공유용]: 여기에 휴대폰 인증 요청 API(예: axios.post('/api/auth/sms', { phone }))를 연결합니다.
    // 나중에 시간이 된다면 3분 카운트다운 타이머 상태를 추가해서 화면에 그려주면 완성도가 훨씬 올라갑니다.
    alert(`${phone}으로 인증번호가 발송되었습니다. (테스트용 입력값: 1234)`);
  };

  // 🚀 [팀원 공유용]: 최종 가입 폼 제출 API 연동 함수입니다.
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🚀 [팀원 공유용]: 임시로 인증번호가 '1234'일 때만 통과되도록 막아두었습니다. 백엔드 연동 시 이 분기 처리를 수정하거나 통합하면 됩니다.
    if (verificationCode !== '1234') {
      alert('인증번호가 일치하지 않습니다.');
      return;
    }

    // 🚀 [팀원 공유용]: 여기에 최종 가입 API(예: axios.post('/api/auth/signup', { id, password, phone }))를 연결합니다.
    console.log('회원가입 시도 데이터:', { id, password, phone });
    
    alert('회원가입이 성공적으로 완료되었습니다! 로그인 페이지로 이동합니다.');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#131314', justifyContent: 'center', alignItems: 'center', color: '#e3e3e3' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '40px', backgroundColor: '#1e1f20', borderRadius: '15px', border: '1px solid #444746', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
        
        {/* 이전의 폰트 겹침 현상을 수정한 타이틀 여백 구조 */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ margin: '0 0 10px 0', lineHeight: '1.2', fontSize: '24px', fontWeight: '500' }}>
            회원가입 화면
          </h1>
          <p style={{ margin: '0', fontSize: '15px', color: '#7a7c7f' }}>
            (SCR02)
          </p>
        </div>

        <form onSubmit={handleSignUpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 아이디 입력 */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#c4c7c5' }}>아이디</label>
            <input 
              type="text" 
              placeholder="아이디를 입력하세요" 
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: 'white', outline: 'none', boxSizing: 'border-box' }} 
            />
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#c4c7c5' }}>비밀번호</label>
            <input 
              type="password" 
              placeholder="비밀번호를 입력하세요" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: 'white', outline: 'none', boxSizing: 'border-box' }} 
            />
          </div>

          {/* 전화번호 및 인증요청 버튼 */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#c4c7c5' }}>전화번호</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                placeholder="01012345678" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: 'white', outline: 'none', boxSizing: 'border-box' }} 
              />
              <button type="button" onClick={handleRequestCode} style={{ padding: '0 15px', borderRadius: '8px', backgroundColor: '#303030', color: '#e3e3e3', border: '1px solid #444746', cursor: 'pointer', fontSize: '13px' }}>
                인증받기
              </button>
            </div>
          </div>

          {/* 인증번호 입력 */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#c4c7c5' }}>인증번호 입력</label>
            <input 
              type="text" 
              placeholder="인증번호 4자리 입력" 
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: 'white', outline: 'none', boxSizing: 'border-box' }} 
            />
          </div>

          <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#a8c7fa', color: '#041e49', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '10px' }}>
            가입완료하기
          </button>
        </form>

        {/* 로그인 페이지 돌아가기 링크 */}
        <div style={{ textAlign: 'center', fontSize: '14px', marginTop: '20px' }}>
          <span style={{ color: '#c4c7c5' }}>이미 계정이 있으신가요? </span>
          <span onClick={() => navigate('/login')} style={{ color: '#a8c7fa', cursor: 'pointer', textDecoration: 'underline' }}>로그인 페이지로 돌아가기</span>
        </div>

      </div>
    </div>
  );
};

export default SignUpPage;
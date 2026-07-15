import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import api from '../api/axios'; 

const SignUpPage = () => {
  const navigate = useNavigate();
  
  // ==========================================
  // 🚀 여기서 선언된 상태와 함수들이 있어야 아래쪽 버튼에서 에러가 안나여
  // ==========================================
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [nickname, setNickname] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const handleCheckNickname = async () => {
    if (!nickname.trim()) {
      alert('검사할 닉네임을 입력해 주세요.');
      return;
    }
    // 회의 시연을 위해 무조건 성공으로 처리!
    alert('[회의용] 사용 가능한 닉네임입니다!');
    setIsNicknameChecked(true); 
  };

  const handleRequestCode = async () => {
    if (!email) {
      alert('이메일을 먼저 입력해주세요.');
      return;
    }

    try {
      // 💡 명세서 반영: POST /members/email-verification
      await api.post('/members/email-verification', { 
        email, 
        agreeTerms: true 
      });
      alert(`${email}로 인증번호가 발송되었습니다. (테스트 진행 중)`);
    } catch (error: unknown) { 
      console.error('인증번호 발송 에러:', error);
      alert('인증번호 발송 테스트 (콘솔을 확인해 주세요)');
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isNicknameChecked) {
      alert('닉네임 중복 확인을 먼저 진행해 주세요.');
      return;
    }
    if (!verificationCode) {
      alert('인증번호를 입력해주세요.');
      return;
    }

    try {
      // 💡 [핵심] 명세서 v1.0 기준 필수 데이터를 만족시키기 위해 가짜 데이터 주입
      const signupPayload = {
        name: name,
        studentId: studentId,
        email: email,
        password: password,
        nickname: nickname,
        
        loginId: email,               
        phoneNumber: "010-0000-0000", 
        address: "미입력",            
        payDay: "1"                   
      };

      console.log('백엔드로 전송하는 데이터:', signupPayload);

      // 💡 명세서 반영: POST /members
      await api.post('/members', signupPayload);
      
      alert('회원가입이 성공적으로 완료되었습니다! 로그인 페이지로 이동합니다.');
      navigate('/login');

    } catch (error: unknown) { 
      console.error('회원가입 에러:', error);
      
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
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#131314', justifyContent: 'center', alignItems: 'center', color: '#e3e3e3' }}>
      <div style={{ width: '100%', maxWidth: '450px', padding: '40px', backgroundColor: '#1e1f20', borderRadius: '15px', border: '1px solid #444746', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ margin: '0 0 10px 0', lineHeight: '1.2', fontSize: '24px', fontWeight: '500' }}>회원가입</h1>
        </div>

        <form onSubmit={handleSignUpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#c4c7c5', fontSize: '14px' }}>이름</label>
              <input type="text" placeholder="홍길동" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: 'white', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#c4c7c5', fontSize: '14px' }}>학번</label>
              <input type="text" placeholder="20240001" value={studentId} onChange={(e) => setStudentId(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: 'white', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#c4c7c5', fontSize: '14px' }}>닉네임</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                placeholder="서비스에서 사용할 닉네임 입력" 
                value={nickname} 
                onChange={(e) => {
                  setNickname(e.target.value);
                  setIsNicknameChecked(false);
                }} 
                required 
                style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: 'white', outline: 'none', boxSizing: 'border-box' }} 
              />
              <button 
                type="button" 
                onClick={handleCheckNickname} 
                style={{ 
                  padding: '0 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap', transition: 'all 0.2s',
                  backgroundColor: isNicknameChecked ? '#0f5223' : '#303030', 
                  color: isNicknameChecked ? '#a8fca8' : '#e3e3e3', 
                  border: `1px solid ${isNicknameChecked ? '#0f5223' : '#444746'}` 
                }}
              >
                {isNicknameChecked ? '확인 완료' : '중복 확인'}
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#c4c7c5', fontSize: '14px' }}>학교 이메일 (아이디)</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="email" placeholder="example@yeonsung.ac.kr" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: 'white', outline: 'none', boxSizing: 'border-box' }} />
              <button type="button" onClick={handleRequestCode} style={{ padding: '0 15px', borderRadius: '8px', backgroundColor: '#303030', color: '#e3e3e3', border: '1px solid #444746', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap' }}>인증받기</button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#c4c7c5', fontSize: '14px' }}>인증번호 입력 (회의 테스트용: 1234)</label>
            <input type="text" placeholder="이메일로 발송된 인증번호 입력" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: 'white', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#c4c7c5', fontSize: '14px' }}>비밀번호</label>
            <input type="password" placeholder="비밀번호를 입력하세요" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: 'white', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#a8c7fa', color: '#041e49', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '10px' }}>가입완료하기</button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '14px', marginTop: '20px' }}>
          <span style={{ color: '#c4c7c5' }}>이미 계정이 있으신가요? </span>
          <span onClick={() => navigate('/login')} style={{ color: '#a8c7fa', cursor: 'pointer', textDecoration: 'underline' }}>로그인 페이지로 돌아가기</span>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
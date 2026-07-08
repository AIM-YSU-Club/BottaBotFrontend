import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  // 🚀 [팀원 공유용]: 백엔드 로그인 API와 연동할 폼 제출 함수입니다.
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !password) return;

    // TODO(백엔드): 로그인 API 연동 (예: POST /api/auth/login)
    console.log('로그인 시도 데이터:', { id, password });
    
    alert('로그인에 성공했습니다!');
    navigate('/'); 
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#131314', justifyContent: 'center', alignItems: 'center', color: '#e3e3e3' }}>
      <form onSubmit={handleLoginSubmit} style={{ width: '100%', maxWidth: '400px', padding: '40px', backgroundColor: '#1e1f20', borderRadius: '15px', border: '1px solid #444746', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
        
        <h1 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: '500', fontSize: '24px' }}>로그인 (SCR01)</h1>

        <div style={{ marginBottom: '20px' }}>
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

        <div style={{ marginBottom: '30px' }}>
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

        <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#a8c7fa', color: '#041e49', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginBottom: '20px' }}>
          로그인하기
        </button>

        {/* 🚀 [팀원 공유용]: 계정 찾기 및 비밀번호 재설정 라우팅 추가 */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', fontSize: '13px', marginBottom: '20px', color: '#c4c7c5' }}>
          <span onClick={() => navigate('/find-account')} style={{ cursor: 'pointer', textDecoration: 'hover' }}>아이디 찾기</span>
          <span>|</span>
          <span onClick={() => navigate('/find-account')} style={{ cursor: 'pointer' }}>비밀번호 재설정</span>
        </div>

        <div style={{ textAlign: 'center', fontSize: '14px' }}>
          <span style={{ color: '#c4c7c5' }}>계정이 없으신가요? </span>
          <span onClick={() => navigate('/signup')} style={{ color: '#a8c7fa', cursor: 'pointer', textDecoration: 'underline' }}>회원가입</span>
        </div>

      </form>
    </div>
  );
};

export default LoginPage;
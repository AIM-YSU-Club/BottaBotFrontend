import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import api from '../api/axios'; 

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    // ==========================================
    // 🚀 [프론트엔드 테스트용 프리패스 로직]
    // 백엔드 API 연결 전, 화면 테스트를 위해 특정 계정은 무조건 통과시킵니다.
    // ==========================================
    if (email === 'jobeomjun1234@gmail.com' && password === '1234') {
      // 가짜 토큰을 세션 스토리지에 발급하여 라우터 가드(ProtectedRoute)를 통과하게 만듭니다.
      sessionStorage.setItem('accessToken', 'test-fake-token-12345');
      alert('테스트 계정으로 로그인되었습니다! (백엔드 통신 생략)');
      navigate('/'); 
      return; // 여기서 함수를 종료하여 아래의 실제 API 통신을 막습니다.
    }

    // ==========================================
    // 🚀 실제 API 통신 로직 (테스트 계정이 아닐 경우 실행)
    // ==========================================
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data && response.data.accessToken) {
        sessionStorage.setItem('accessToken', response.data.accessToken);
        alert('로그인에 성공했습니다!');
        navigate('/'); 
      } else {
        alert('로그인 처리 중 문제가 발생했습니다. 다시 시도해 주세요.');
      }
      
    } catch (error: unknown) { 
      console.error('로그인 에러:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          alert('이메일 또는 비밀번호가 일치하지 않습니다.');
        } else {
          alert('서버와 통신 중 문제가 발생했습니다.');
        }
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#131314', justifyContent: 'center', alignItems: 'center', color: '#e3e3e3' }}>
      <form onSubmit={handleLoginSubmit} style={{ width: '100%', maxWidth: '400px', padding: '40px', backgroundColor: '#1e1f20', borderRadius: '15px', border: '1px solid #444746', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
        
        <h1 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: '500', fontSize: '24px' }}>로그인</h1>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#c4c7c5' }}>이메일 (아이디)</label>
          <input 
            type="email" 
            placeholder="example@univ.ac.kr" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          {/* 💡 팀원들을 위한 작은 테스트 계정 안내 문구 */}
          <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#a8c7fa', textAlign: 'right' }}>
            * 테스트 계정: jobeomjun1234@gmail.com / 1234
          </p>
        </div>

        <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#a8c7fa', color: '#041e49', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginBottom: '20px' }}>
          로그인하기
        </button>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', fontSize: '13px', marginBottom: '20px', color: '#c4c7c5' }}>
          <span onClick={() => navigate('/find-account')} style={{ cursor: 'pointer' }}>아이디 찾기</span>
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
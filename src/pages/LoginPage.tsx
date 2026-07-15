import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import api from '../api/axios'; 

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 💡 [명세서 반영]: POST /auth/login 요청 시 선택(Optional) 파라미터인 자동 로그인 여부 상태 추가
  const [rememberMe, setRememberMe] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    // ==========================================
    // 🚀 [프론트엔드 테스트용 프리패스 로직]
    // ==========================================
    if (email === 'jobeomjun1234@gmail.com' && password === '1234') {
      sessionStorage.setItem('accessToken', 'test-fake-access-token');
      // 💡 [명세서 반영]: axios.ts의 토큰 갱신 에러 방지를 위해 가짜 refreshToken도 함께 세팅
      sessionStorage.setItem('refreshToken', 'test-fake-refresh-token'); 
      alert('테스트 계정으로 로그인되었습니다! (백엔드 통신 생략)');
      navigate('/'); 
      return; 
    }

    // ==========================================
    // 🚀 실제 API 통신 로직 (명세서 v1.0 기준)
    // ==========================================
    try {
      // 💡 [명세서 반영]: 요청 시 email, password와 함께 rememberMe 플래그 전송
      // 참고: axios.ts 인터셉터에서 response.data.data를 반환하도록 세팅했으므로 바로 변수에 담습니다.
      const data = await api.post('/auth/login', { 
        email, 
        password,
        rememberMe 
      });
      
      // 💡 [명세서 반영]: 응답으로 내려온 accessToken과 refreshToken을 모두 스토리지에 저장
      if (data && data.accessToken && data.refreshToken) {
        sessionStorage.setItem('accessToken', data.accessToken);
        sessionStorage.setItem('refreshToken', data.refreshToken);
        
        alert('로그인에 성공했습니다!');
        navigate('/'); 
      } else {
        alert('로그인 처리 중 문제가 발생했습니다. 응답 데이터를 확인해 주세요.');
      }
      
    } catch (error: unknown) { 
      console.error('로그인 에러:', error);
      
      if (axios.isAxiosError(error)) {
        // 💡 [명세서 반영]: 401 UNAUTHORIZED 에러 대응
        if (error.response?.status === 401 || error.response?.status === 404) {
          alert('이메일 또는 비밀번호가 일치하지 않습니다.');
        } else {
          alert(`서버 통신 오류: ${error.response?.data?.error?.message || '알 수 없는 오류'}`);
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
          <label style={{ display: 'block', marginBottom: '8px', color: '#c4c7c5' }}>학교 이메일 (아이디)</label>
          <input 
            type="email" 
            placeholder="example@yeonsung.ac.kr" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: 'white', outline: 'none', boxSizing: 'border-box' }} 
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
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

        {/* 💡 [명세서 반영]: rememberMe 옵션을 위한 UI 체크박스 추가 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', fontSize: '13px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#c4c7c5' }}>
            <input 
              type="checkbox" 
              checked={rememberMe} 
              onChange={(e) => setRememberMe(e.target.checked)} 
              style={{ cursor: 'pointer', accentColor: '#a8c7fa' }}
            />
            로그인 상태 유지
          </label>
          <span onClick={() => navigate('/find-account')} style={{ color: '#c4c7c5', cursor: 'pointer' }}>아이디 / 비밀번호 찾기</span>
        </div>

        <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#a8c7fa', color: '#041e49', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginBottom: '20px' }}>
          로그인하기
        </button>

        {/* 💡 팀원들을 위한 작은 테스트 계정 안내 문구 */}
        <p style={{ margin: '0 0 20px 0', fontSize: '12px', color: '#7a7c7f', textAlign: 'center' }}>
          * 테스트 계정: jobeomjun1234@gmail.com / 1234
        </p>

        <div style={{ textAlign: 'center', fontSize: '14px' }}>
          <span style={{ color: '#c4c7c5' }}>계정이 없으신가요? </span>
          <span onClick={() => navigate('/signup')} style={{ color: '#a8c7fa', cursor: 'pointer', textDecoration: 'underline' }}>회원가입</span>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
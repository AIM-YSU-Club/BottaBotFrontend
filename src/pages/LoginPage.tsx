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

  // ==========================================
  // 🚀 통신 로직은 올려주신 파일 내용 100% 그대로 유지했습니다!
  // ==========================================
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    // 🚀 [프론트엔드 테스트용 프리패스 로직]
    if (email === 'jobeomjun1234@gmail.com' && password === '1234') {
      sessionStorage.setItem('accessToken', 'test-fake-access-token');
      sessionStorage.setItem('refreshToken', 'test-fake-refresh-token'); 
      alert('테스트 계정으로 로그인되었습니다! (백엔드 통신 생략)');
      navigate('/'); 
      return; 
    }

    // 🚀 실제 API 통신 로직 (명세서 v1.0 기준)
    try {
      const data = await api.post('/auth/login', { 
        email, 
        password,
        rememberMe 
      });
      
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

  // ==========================================
  // 🎨 화면(UI) 부분만 새 디자인 클래스로 완벽하게 교체!
  // ==========================================
  return (
    <div className="auth-page">
      <form onSubmit={handleLoginSubmit} className="auth-card">
        
        {/* 새 디자인: BottaBot 마스코트 아이콘 */}
        <div className="mascot-xl">
          <span className="eyes"><span></span><span></span></span>
        </div>
        
        <div className="auth-title">BottaBot</div>
        <div className="auth-heading">로그인</div>
        <div className="auth-sub">계정에 로그인하세요</div>

        {/* 새 디자인: field 클래스 적용 */}
        <div className="field">
          <label>학교 이메일 (아이디)</label>
          <input 
            type="email" 
            placeholder="example@yeonsung.ac.kr" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="field" style={{ marginBottom: '10px' }}>
          <label>비밀번호</label>
          <input 
            type="password" 
            placeholder="비밀번호를 입력하세요" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* 로그인 상태 유지 체크박스 (새 디자인 톤에 맞춤) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '13px', color: 'var(--ink-soft)' }}>
          <input 
            type="checkbox" 
            checked={rememberMe} 
            onChange={(e) => setRememberMe(e.target.checked)} 
            style={{ width: 'auto', cursor: 'pointer', accentColor: 'var(--leaf-deep)' }}
          />
          <label 
            style={{ margin: 0, fontWeight: 'normal', color: 'inherit', cursor: 'pointer' }}
            onClick={() => setRememberMe(!rememberMe)}
          >
            로그인 상태 유지
          </label>
        </div>

        {/* 새 디자인: btn-primary, btn-outline 클래스 적용 */}
        <button type="submit" className="btn btn-primary">
          로그인하기
        </button>

        {/* 기존 테스트 계정 안내 문구 (자연스럽게 디자인에 녹임) */}
        <p style={{ margin: '12px 0', fontSize: '12px', color: 'var(--ink-soft)', textAlign: 'center' }}>
          * 테스트 계정: jobeomjun1234@gmail.com / 1234
        </p>

        <button type="button" className="btn btn-outline" onClick={() => navigate('/signup')}>
          회원가입
        </button>

        {/* 기존 아이디/비밀번호 찾기 링크 */}
        <div className="link-row" style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <a onClick={() => navigate('/find-account')}>아이디 찾기</a>
          <span style={{ color: 'var(--leaf-line)' }}>|</span>
          <a onClick={() => navigate('/find-account')}>비밀번호 재설정</a>
        </div>

      </form>
    </div>
  );
};

export default LoginPage;
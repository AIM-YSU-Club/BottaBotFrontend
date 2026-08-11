import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api/axios';
import FormField from '../components/common/FormField';
import Mascot from '../components/common/Mascot';
import AuthPageLayout from '../components/auth/AuthPageLayout';
import AuthHeader from '../components/auth/AuthHeader';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (email === 'jobeomjun1234@gmail.com' && password === '1234') {
      sessionStorage.setItem('accessToken', 'test-fake-access-token');
      sessionStorage.setItem('refreshToken', 'test-fake-refresh-token');
      alert('테스트 계정으로 로그인되었습니다! (백엔드 통신 생략)');
      navigate('/');
      return;
    }

    try {
      // API 명세 2장(MEM01_LOGIN_N01): POST /auth/login { email, password, rememberMe }
      // → { accessToken, refreshToken, member 요약 }
      const data = await api.post('/auth/login', {
        email,
        password,
        rememberMe,
      });

      if (data && data.accessToken) {
        sessionStorage.setItem('accessToken', data.accessToken);
        if (data.refreshToken) {
          sessionStorage.setItem('refreshToken', data.refreshToken);
        }

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

  return (
    <AuthPageLayout as="form" onSubmit={handleLoginSubmit}>
      <Mascot size="xl" />
      <AuthHeader heading="로그인" sub="계정에 로그인하세요" />

      <FormField
        label="학교 이메일 (아이디)"
        type="email"
        placeholder="example@yeonsung.ac.kr"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <FormField
        label="비밀번호"
        type="password"
        placeholder="비밀번호를 입력하세요"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        containerStyle={{ marginBottom: '10px' }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '24px',
          fontSize: '13px',
          color: 'var(--ink-soft)',
        }}
      >
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

      <button type="submit" className="btn btn-primary">
        로그인하기
      </button>

      <p style={{ margin: '12px 0', fontSize: '12px', color: 'var(--ink-soft)', textAlign: 'center' }}>
        * 테스트 계정: jobeomjun1234@gmail.com / 1234
      </p>

      <button type="button" className="btn btn-outline" onClick={() => navigate('/signup')}>
        회원가입
      </button>

      <div className="link-row" style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
        <a onClick={() => navigate('/find-account')}>아이디 찾기</a>
        <span style={{ color: 'var(--leaf-line)' }}>|</span>
        <a onClick={() => navigate('/find-account')}>비밀번호 재설정</a>
      </div>
    </AuthPageLayout>
  );
};

export default LoginPage;

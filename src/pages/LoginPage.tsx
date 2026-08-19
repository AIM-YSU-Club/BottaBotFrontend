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
  
  // 모달창 띄우기 상태 (추가)
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  // 이메일 재발송 API 호출 함수 (추가)
  const handleSendEmail = async () => {
    try {
      await api.post('/members/email-verification', {
        email: email,
        agreeTerms: true,
      });
      alert('인증 메일이 발송되었습니다! 메일함을 확인해주세요.');
      setShowVerificationModal(false);
    } catch (error: unknown) {
      alert(`메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요. \n에러: ${error}`);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

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
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401 || error.response?.status === 404) {
          alert('이메일 또는 비밀번호가 일치하지 않습니다.');
        } else if (error.response?.status === 403) {
          setShowVerificationModal(true);
        } else {
          alert(`서버 통신 오류: ${error.response?.data?.error?.message || '알 수 없는 오류'}`);
        }
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
        console.error('에러:', error);
      }
    }
  };

  return (
    <>
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
          * 테스트용 DB 연동 계정: jehee826@gmail.com / jehee826
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

      {/* 모달창 UI */}
      {showVerificationModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              maxWidth: '320px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            <h3 style={{ marginTop: 0, color: 'var(--ink-dark, #333)' }}>이메일 인증 안내</h3>
            <p style={{ fontSize: '14px', color: 'var(--ink-soft, #666)', marginBottom: '24px', lineHeight: '1.5' }}>
              해당 계정은 아직 이메일 인증이 완료되지 않았습니다.<br />
              인증 메일을 발송하시겠습니까?
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setShowVerificationModal(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  background: 'white',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSendEmail}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'var(--leaf-deep, #4CAF50)',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                인증 메일 받기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;
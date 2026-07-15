import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import api from '../api/axios';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  
  // 🚀 주소창의 쿼리 파라미터(?token=...)를 읽어오기 위한 훅 (기능 유지)
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // ==========================================
  // 🚀 기존 통신 및 검증 로직 (100% 유지)
  // ==========================================
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. 보안 토큰 확인
    if (!token) {
      alert('유효하지 않은 접근입니다. 비밀번호 재설정 이메일 링크를 다시 확인해 주세요.');
      return;
    }

    // 2. 비밀번호 일치 여부 확인
    if (newPassword !== confirmPassword) {
      alert('입력하신 새 비밀번호가 서로 일치하지 않습니다.');
      return;
    }

    try {
      await api.post('/auth/reset-password/confirm', { 
        token, 
        newPassword 
      });

      alert('비밀번호가 성공적으로 변경되었습니다! 새로운 비밀번호로 로그인해 주세요.');
      navigate('/login'); 
      
    } catch (error: unknown) {
      console.error('비밀번호 변경 에러:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          alert('비밀번호 변경 링크가 만료되었거나 유효하지 않습니다. 다시 요청해 주세요.');
        } else {
          alert('처리 중 서버 문제가 발생했습니다.');
        }
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  // ==========================================
  // 🎨 예외 화면: 토큰 없이 강제 접근한 경우 (새 디자인 적용)
  // ==========================================
  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          {/* 에러 느낌을 주기 위해 마스코트를 흑백 처리했습니다 */}
          <div className="mascot-xl" style={{ filter: 'grayscale(100%)' }}>
            <span className="eyes"><span></span><span></span></span>
          </div>
          <div className="auth-title">BottaBot</div>
          
          <div className="auth-heading" style={{ color: 'var(--danger)' }}>잘못된 접근입니다 🚫</div>
          <div className="auth-sub" style={{ marginBottom: '30px' }}>
            비밀번호 재설정 이메일의 링크를 통해서만 접근할 수 있습니다.
          </div>
          
          <button type="button" className="btn btn-primary" onClick={() => navigate('/login')}>
            로그인으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // 🎨 정상 화면: 비밀번호 재설정 폼 (새 디자인 적용)
  // ==========================================
  return (
    <div className="auth-page">
      <form onSubmit={handleResetSubmit} className="auth-card">
        
        <div className="mascot-xl">
          <span className="eyes"><span></span><span></span></span>
        </div>
        
        <div className="auth-title">BottaBot</div>
        <div className="auth-heading">새 비밀번호 설정</div>
        <div className="auth-sub">새롭게 사용할 비밀번호를 입력해 주세요.</div>

        <div className="field">
          <label>새 비밀번호</label>
          <input 
            type="password" 
            placeholder="새 비밀번호 입력" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label>새 비밀번호 확인</label>
          <input 
            type="password" 
            placeholder="새 비밀번호 다시 입력" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '20px' }}>
          비밀번호 변경하기
        </button>

      </form>
    </div>
  );
};

export default ResetPasswordPage;
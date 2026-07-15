import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import api from '../api/axios';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  
  // 🚀 주소창의 쿼리 파라미터(?token=...)를 읽어오기 위한 훅
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
      // TODO(백엔드): 실제 비밀번호를 변경하는 API (예: POST /api/auth/reset-password/confirm)
      // 전송(Request) 데이터: { token, newPassword }
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

  // 만약 이메일 링크를 통하지 않고 강제로 주소를 쳐서 들어온 경우 방어
  if (!token) {
    return (
      <div style={{ display: 'flex', height: '100vh', backgroundColor: '#131314', justifyContent: 'center', alignItems: 'center', color: '#e3e3e3', flexDirection: 'column', gap: '20px' }}>
        <h2>잘못된 접근입니다 🚫</h2>
        <p style={{ color: '#c4c7c5' }}>비밀번호 재설정 이메일의 링크를 통해서만 접근할 수 있습니다.</p>
        <button onClick={() => navigate('/login')} style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: '#a8c7fa', color: '#041e49', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>로그인으로 돌아가기</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#131314', justifyContent: 'center', alignItems: 'center', color: '#e3e3e3' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '40px', backgroundColor: '#1e1f20', borderRadius: '15px', border: '1px solid #444746', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
        
        <h1 style={{ textAlign: 'center', marginBottom: '10px', fontWeight: '500', fontSize: '20px' }}>새 비밀번호 설정</h1>
        <p style={{ textAlign: 'center', color: '#c4c7c5', fontSize: '13px', marginBottom: '30px' }}>새롭게 사용할 비밀번호를 입력해 주세요.</p>

        <form onSubmit={handleResetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#c4c7c5', fontSize: '14px' }}>새 비밀번호</label>
            <input 
              type="password" 
              placeholder="새 비밀번호 입력" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: 'white', outline: 'none', boxSizing: 'border-box' }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#c4c7c5', fontSize: '14px' }}>새 비밀번호 확인</label>
            <input 
              type="password" 
              placeholder="새 비밀번호 다시 입력" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: 'white', outline: 'none', boxSizing: 'border-box' }} 
            />
          </div>

          <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#a8c7fa', color: '#041e49', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '10px' }}>
            비밀번호 변경하기
          </button>
        </form>

      </div>
    </div>
  );
};

export default ResetPasswordPage;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api/axios';

const DeactivatePage = () => {
  const navigate = useNavigate();
  
  // 💡 탈퇴 진행 단계를 관리하는 상태 (1: 경고 화면, 2: 정보 입력, 3: 완료 화면)
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  // 💡 탈퇴 확인을 위한 입력 상태
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');

  // "탈퇴합니다" 문구와 비밀번호가 모두 입력되었는지 확인
  const isReadyToWithdraw = password.trim().length > 0 && confirmText.trim() === '탈퇴합니다';

  // ==========================================
  // 🚀 백엔드 통신: 실제 회원 탈퇴 로직
  // ==========================================
  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isReadyToWithdraw) return;

    try {
      // 💡 명세서 기준에 맞춰 DELETE 요청 시 비밀번호를 함께 전송합니다.
      // (백엔드 세팅에 따라 data 객체 안에 넣어서 보냅니다)
      await api.delete('/members/me', { 
        data: { password } 
      });

      // 탈퇴 성공 시: 스토리지 비우고 완료 화면(3단계)으로 이동
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      setStep(3);

    } catch (error: unknown) {
      console.error('회원 탈퇴 에러:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          alert('비밀번호가 일치하지 않습니다. 다시 확인해 주세요.');
        } else {
          alert(`탈퇴 처리 중 오류가 발생했습니다: ${error.response?.data?.error?.message || '알 수 없는 오류'}`);
        }
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  // ==========================================
  // 🎨 단계별 화면 렌더링
  // ==========================================

  // --- 1단계: 탈퇴 경고 안내 화면 ---
  if (step === 1) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="mascot-xl"><span className="eyes"><span></span><span></span></span></div>
          <div className="auth-title">BottaBot</div>
          <div className="auth-heading">회원 탈퇴</div>
          <div className="auth-sub">탈퇴 전 아래 내용을 확인해 주세요</div>

          <div className="warning-box">
            <div className="wtitle">⚠ 탈퇴 시 삭제되는 항목</div>
            <ul>
              <li><span className="x">✕</span> 모든 대화 기록 및 프롬프트 노트</li>
              <li><span className="x">✕</span> 업로드한 문서 및 파일 데이터</li>
              <li><span className="x">✕</span> 계정 프로필 정보 및 설정</li>
            </ul>
          </div>
          <div className="note-center">삭제된 데이터는 절대 복구할 수 없습니다.</div>

          <button type="button" className="btn btn-danger ready" onClick={() => setStep(2)}>
            탈퇴 진행하기
          </button>
          <button type="button" className="btn btn-outline" onClick={() => navigate('/profile')}>
            취소하고 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // --- 2단계: 비밀번호 및 확인 문구 입력 화면 ---
  if (step === 2) {
    return (
      <div className="auth-page">
        <form onSubmit={handleWithdrawSubmit} className="auth-card">
          <div className="mascot-xl"><span className="eyes"><span></span><span></span></span></div>
          <div className="auth-title">BottaBot</div>
          <div className="auth-heading">회원 탈퇴 확인</div>
          <div className="auth-sub">안전한 처리를 위해 정보를 입력해 주세요</div>

          <div className="field">
            <label>비밀번호 확인</label>
            <input 
              type="password" 
              placeholder="현재 비밀번호 입력" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="field">
            <label>아래에 <span style={{ color: 'var(--danger)' }}>"탈퇴합니다"</span>를 정확히 입력해 주세요</label>
            <input 
              type="text" 
              placeholder="탈퇴합니다" 
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              required
            />
          </div>

          {/* 조건이 충족되어야만 버튼 색상이 빨갛게 활성화(ready) 됩니다 */}
          <button 
            type="submit" 
            className={`btn ${isReadyToWithdraw ? 'btn-danger ready' : 'btn-danger'}`} 
            disabled={!isReadyToWithdraw}
            style={{ opacity: isReadyToWithdraw ? 1 : 0.5 }}
          >
            최종 탈퇴
          </button>
          <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>
            ← 이전 단계로
          </button>
        </form>
      </div>
    );
  }

  // --- 3단계: 탈퇴 완료 화면 ---
  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        {/* 마스코트를 흑백으로 처리하여 이별의 느낌(?)을 줍니다 */}
        <div className="mascot-xl" style={{ filter: 'grayscale(100%)' }}><span className="eyes"><span></span><span></span></span></div>
        <div className="auth-title">BottaBot</div>
        
        <div className="done-emoji">👋</div>
        <div className="done-title">탈퇴가 완료되었습니다</div>
        <div className="done-sub">그동안 BottaBot을 이용해 주셔서 진심으로 감사드립니다.<br/>언제든 다시 돌아오세요!</div>

        <button type="button" className="btn btn-primary" onClick={() => navigate('/login')}>
          처음 화면으로
        </button>
      </div>
    </div>
  );
};

export default DeactivatePage;
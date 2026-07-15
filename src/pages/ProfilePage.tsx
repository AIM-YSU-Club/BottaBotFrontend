import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import api from '../api/axios';

const ProfilePage = () => {
  const navigate = useNavigate();
  
  const [isVerified, setIsVerified] = useState(false);
  const [verifyPassword, setVerifyPassword] = useState(''); 
  
  const [newPassword, setNewPassword] = useState(''); 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [withdrawalReason, setWithdrawalReason] = useState('');

  // ==========================================
  // 🚀 [팀원 공유용]: 변경 가능한 닉네임 상태 추가
  // 기존 고정 정보와 다르게 사용자가 타이핑하여 수정할 수 있도록 지정합니다.
  // ==========================================
  const [nickname, setNickname] = useState('범준'); 

  // 변경 불가능한 시스템 고정 정보들
  const userInfo = {
    name: "조범준",
    studentId: "20251234",
    email: "jobeomjun1234@gmail.com"
  };

  // 비밀번호 확인 검증 (테스트용 하드코딩)
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyPassword === '1234') {
      setIsVerified(true); 
    } else {
      alert('비밀번호가 일치하지 않습니다. (테스트용 비밀번호: 1234)');
      setVerifyPassword(''); 
    }
  };

  // ==========================================
  // 🚀 회원 정보 수정 저장 API (비밀번호 + 닉네임 복합 전송)
  // ==========================================
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 닉네임 공백 검사 필수
    if (!nickname.trim()) {
      alert('닉네임은 최소 한 글자 이상 입력해야 합니다.');
      return;
    }

    try {
      // TODO(백엔드): 회원 프로필 수정 API (PUT /api/user/profile)
      // 전송(Request) 데이터: { newPassword, nickname }
      // 만약 사용자가 비밀번호를 입력하지 않았다면 빈 문자열 대신 undefined 혹은 처리를 백엔드 스펙에 맞춥니다.
      await api.put('/user/profile', { 
        newPassword: newPassword || undefined, 
        nickname: nickname 
      });
      
      alert('회원 정보 및 닉네임이 성공적으로 변경되었습니다!');
      setNewPassword(''); // 비밀번호 입력창만 리셋
    } catch (error: unknown) { 
      console.error('프로필 저장 에러:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          alert('이미 존재하는 닉네임입니다. 다른 닉네임을 설정해 주세요.');
        } else {
          alert('정보 저장 중 문제가 발생했습니다.');
        }
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  // 회원 탈퇴 API
  const handleDeleteAccount = async () => {
    if (!withdrawalReason) {
      alert('탈퇴 사유를 선택해 주세요.');
      return;
    }
    try {
      await api.patch('/user/deactivate', { reason: withdrawalReason });
      sessionStorage.removeItem('accessToken');
      alert('탈퇴 처리가 완료되었습니다. 30일 이내에 다시 로그인하시면 계정이 복구됩니다.');
      setIsDeleteModalOpen(false); 
      navigate('/login'); 
    } catch (error: unknown) { 
      console.error('회원 탈퇴 에러:', error);
      if (axios.isAxiosError(error)) alert('탈퇴 처리 중 서버 문제가 발생했습니다.');
      else alert('알 수 없는 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', color: '#e3e3e3', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      
      {!isVerified ? (
        /* 화면 A: 비밀번호 재확인 화면 */
        <div style={{ backgroundColor: '#1e1f20', padding: '40px', borderRadius: '15px', border: '1px solid #444746', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '20px' }}>🔒</div>
          <h2 style={{ margin: '0 0 10px 0', fontWeight: '500', color: '#e3e3e3' }}>안전한 사용을 위해<br/>비밀번호를 다시 입력해 주세요</h2>
          <p style={{ color: '#c4c7c5', fontSize: '14px', marginBottom: '30px' }}>회원님의 개인정보 보호를 위한 절차입니다.</p>
          
          <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="password" placeholder="현재 비밀번호 입력 (테스트용: 1234)" value={verifyPassword} onChange={(e) => setVerifyPassword(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: 'white', outline: 'none', boxSizing: 'border-box' }} />
            <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#a8c7fa', color: '#041e49', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>확인</button>
          </form>
        </div>
      ) : (
        /* 화면 B: 회원 정보 화면 */
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <h1 style={{ marginBottom: '30px', fontWeight: '400', textAlign: 'center' }}>설정 및 내 정보</h1>

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: '#1e1f20', padding: '30px', borderRadius: '15px', border: '1px solid #444746' }}>
            
            {/* 고정 인적사항: 이름 및 학번 */}
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#c4c7c5', fontSize: '14px' }}>이름</label>
                <input type="text" value={userInfo.name} disabled style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: '#7a7c7f', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#c4c7c5', fontSize: '14px' }}>학번</label>
                <input type="text" value={userInfo.studentId} disabled style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: '#7a7c7f', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>

            {/* 고정 인적사항: 이메일 */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#c4c7c5', fontSize: '14px' }}>가입 이메일 (아이디)</label>
              <input type="text" value={userInfo.email} disabled style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: '#7a7c7f', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            {/* ========================================== */}
            {/* 🚀 [추가됨]: 수정 가능한 닉네임 입력란 (disabled가 없음) */}
            {/* ========================================== */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#c4c7c5', fontSize: '14px' }}>닉네임 설정</label>
              <input 
                type="text" 
                value={nickname} 
                onChange={(e) => setNickname(e.target.value)} 
                required
                style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: 'white', outline: 'none', boxSizing: 'border-box' }} 
              />
            </div>
            
            {/* 수정 선택사항: 새 비밀번호 설정 */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#c4c7c5', fontSize: '14px' }}>새 비밀번호 설정</label>
              <input type="password" placeholder="변경할 비밀번호 입력 (변경하지 않으려면 비워두세요)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: 'white', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            
            <button type="submit" style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#a8c7fa', color: '#041e49', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '10px' }}>
              변경사항 저장하기
            </button>
          </form>

          <hr style={{ borderColor: '#444746', margin: '40px 0', borderTop: 'none' }} />

          {/* 위험 구역 */}
          <div style={{ backgroundColor: '#1e1f20', padding: '30px', borderRadius: '15px', border: '1px solid #5c2b29', textAlign: 'center' }}>
            <h3 style={{ color: '#f28b82', margin: '0 0 10px 0', fontWeight: '500' }}>위험 구역 (Danger Zone)</h3>
            <p style={{ color: '#c4c7c5', fontSize: '14px', marginBottom: '20px' }}>계정을 삭제하면 모든 노트북과 대화 기록이 삭제 대기 상태로 전환됩니다.</p>
            <button type="button" onClick={() => navigate('/deactivate')} style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: 'transparent', color: '#f28b82', border: '1px solid #f28b82', cursor: 'pointer', fontWeight: 'bold' }}>회원 비활성화 및 탈퇴 관리</button>
          </div>
        </div>
      )}

      {/* 탈퇴 모달 팝업 생략 (DeactivatePage 격리로 인해 ProfilePage에는 불필요하지만 에러 방지를 위해 상태 등은 보존) */}
    </div>
  );
};

export default ProfilePage;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  
  // ==========================================
  // 🚀 [팀원 공유용]: 상태 관리 영역
  // ==========================================
  // 1. 비밀번호 재확인 통과 여부 (true면 정보 수정 화면 표시)
  const [isVerified, setIsVerified] = useState(false);
  // 2. 재확인용 비밀번호 입력값
  const [verifyPassword, setVerifyPassword] = useState('');
  
  // 3. 회원 탈퇴 모달창 상태
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // ==========================================
  // 🚀 [팀원 공유용]: API 통신 및 핸들러 함수 영역
  // ==========================================
  
  // [1단계] 비밀번호 재확인 핸들러
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyPassword) return;

    // TODO(백엔드): 현재 사용자의 비밀번호가 맞는지 검증하는 API 호출 (예: POST /api/user/verify-password)
    // 임시로 비밀번호가 '1234'일 때만 통과되도록 작성해 두었습니다.
    if (verifyPassword === '1234') {
      setIsVerified(true); // 통과! 정보 수정 화면으로 전환
    } else {
      alert('비밀번호가 일치하지 않습니다. (테스트용: 1234)');
      setVerifyPassword(''); // 틀렸을 경우 입력창 비워주기
    }
  };

  // [2단계] 회원 정보 수정 저장 핸들러 (SCR03)
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO(백엔드): 새 비밀번호 등 회원 정보 수정 API 호출 (예: PUT /api/user/profile)
    alert('회원 정보가 안전하게 저장되었습니다.');
  };

  // [3단계] 최종 회원 탈퇴 핸들러 (SCR04)
  const handleDeleteAccount = () => {
    // TODO(백엔드): 회원 탈퇴 API 호출 (예: DELETE /api/user/account)
    alert('회원 탈퇴가 완료되었습니다. 지금까지 이용해 주셔서 감사합니다.');
    setIsDeleteModalOpen(false); 
    navigate('/login'); // 탈퇴 처리 후 로그인 화면으로 강제 리다이렉트
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', color: '#e3e3e3', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      
      {!isVerified ? (
        /* ========================================== */
        /* 화면 A: 비밀번호 재확인 화면 (보안 검증) */
        /* ========================================== */
        <div style={{ backgroundColor: '#1e1f20', padding: '40px', borderRadius: '15px', border: '1px solid #444746', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '20px' }}>🔒</div>
          <h2 style={{ margin: '0 0 10px 0', fontWeight: '500', color: '#e3e3e3' }}>안전한 사용을 위해<br/>비밀번호를 다시 입력해 주세요</h2>
          <p style={{ color: '#c4c7c5', fontSize: '14px', marginBottom: '30px' }}>회원님의 개인정보 보호를 위한 절차입니다.</p>
          
          <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              type="password" 
              placeholder="현재 비밀번호 입력 (테스트용: 1234)" 
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: 'white', outline: 'none', boxSizing: 'border-box' }} 
            />
            <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#a8c7fa', color: '#041e49', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
              확인
            </button>
          </form>
        </div>

      ) : (
        /* ========================================== */
        /* 화면 B: 회원 정보 수정 및 탈퇴 화면 (SCR03 & SCR04) */
        /* ========================================== */
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <h1 style={{ marginBottom: '30px', fontWeight: '400', textAlign: 'center' }}>설정 및 내 정보</h1>

          {/* 1. 회원 정보 수정 폼 */}
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: '#1e1f20', padding: '30px', borderRadius: '15px', border: '1px solid #444746' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#c4c7c5' }}>아이디 (이메일)</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  defaultValue="jobeomjun1234@gmail.com" 
                  disabled // 기본적으로 아이디는 수정 불가 처리
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: '#7a7c7f', outline: 'none', boxSizing: 'border-box' }} 
                />
                <button type="button" onClick={() => navigate('/change-id')} style={{ padding: '0 15px', borderRadius: '8px', backgroundColor: '#303030', color: '#e3e3e3', border: '1px solid #444746', cursor: 'pointer', fontSize: '13px' }}>
                  아이디 변경
                </button>
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#c4c7c5' }}>새 비밀번호 설정</label>
              <input 
                type="password" 
                placeholder="변경할 비밀번호 입력 (변경하지 않으려면 비워두세요)" 
                style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: 'white', outline: 'none', boxSizing: 'border-box' }} 
              />
            </div>
            
            <button type="submit" style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#a8c7fa', color: '#041e49', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '10px' }}>
              변경사항 저장하기
            </button>
          </form>

          {/* 구분선 */}
          <hr style={{ borderColor: '#444746', margin: '40px 0', borderTop: 'none' }} />

          {/* 2. 회원 탈퇴 영역 (위험 구역) */}
          <div style={{ backgroundColor: '#1e1f20', padding: '30px', borderRadius: '15px', border: '1px solid #5c2b29', textAlign: 'center' }}>
            <h3 style={{ color: '#f28b82', margin: '0 0 10px 0', fontWeight: '500' }}>위험 구역 (Danger Zone)</h3>
            <p style={{ color: '#c4c7c5', fontSize: '14px', marginBottom: '20px' }}>
              계정을 삭제하면 모든 노트북과 대화 기록이 영구적으로 삭제되며 복구할 수 없습니다.
            </p>
            <button 
              type="button"
              onClick={() => setIsDeleteModalOpen(true)} 
              style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: 'transparent', color: '#f28b82', border: '1px solid #f28b82', cursor: 'pointer', fontWeight: 'bold' }}
            >
              회원 탈퇴 진행하기
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 3. 탈퇴 최종 확인 모달 팝업 */}
      {/* ========================================== */}
      {isDeleteModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#1e1f20', padding: '30px', borderRadius: '15px', width: '400px', textAlign: 'center', border: '1px solid #f28b82', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
            <h2 style={{ marginTop: 0, color: '#e3e3e3', fontSize: '20px' }}>정말 탈퇴하시겠습니까?</h2>
            <p style={{ color: '#c4c7c5', marginBottom: '30px', fontSize: '14px', lineHeight: '1.5' }}>
              이 작업은 되돌릴 수 없으며,<br/>저장된 모든 데이터가 영구적으로 삭제됩니다.
            </p>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button 
                onClick={() => setIsDeleteModalOpen(false)} 
                style={{ padding: '12px 0', borderRadius: '8px', backgroundColor: 'transparent', color: '#e3e3e3', border: '1px solid #c4c7c5', cursor: 'pointer', flex: 1 }}
              >
                취소
              </button>
              <button 
                onClick={handleDeleteAccount} 
                style={{ padding: '12px 0', borderRadius: '8px', backgroundColor: '#f28b82', color: '#3f0f0a', fontWeight: 'bold', border: 'none', cursor: 'pointer', flex: 1 }}
              >
                영구 탈퇴하기
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import api from '../api/axios';

const ProfilePage = () => {
  const navigate = useNavigate();
  
  // 1. 잠금 화면(비밀번호 확인) 관련 상태
  const [isVerified, setIsVerified] = useState(false);
  const [currentPassword, setCurrentPassword] = useState(''); // 💡 명세서 반영: PATCH 요청 시 보낼 현재 비밀번호 저장용
  
  // 2. 회원 정보 상태
  const [userInfo, setUserInfo] = useState({ name: '', studentId: '', email: '' });
  const [nickname, setNickname] = useState(''); 
  const [newPassword, setNewPassword] = useState(''); 

  // ==========================================
  // 🚀 [명세서 반영]: GET /members/me (내 정보 조회)
  // ==========================================
  useEffect(() => {
    // 💡 회의 시연용 안전장치: 화면에 들어오자마자 백엔드에 내 정보를 요청합니다.
    const fetchMyProfile = async () => {
      try {
        const data = await api.get('/members/me');
        // 백엔드 통신 성공 시 실제 데이터 세팅
        setUserInfo({ 
          name: data.name, 
          studentId: data.studentId, 
          email: data.email 
        });
        setNickname(data.nickname || '범준');
      } catch (error) {
        console.warn('프로필 조회 실패, 회의용 더미 데이터로 대체합니다.', error);
        // 서버가 안 열려있어도 시연을 위해 화면에 기본 데이터를 깔아줍니다.
        setUserInfo({ 
          name: "조범준", 
          studentId: "20251234", 
          email: "jobeomjun1234@yeonsung.ac.kr" 
        });
        setNickname('범준');
      }
    };

    fetchMyProfile();
  }, []);

  // 잠금 화면 해제 로직 (UI 진입용)
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPassword) {
      // 실제 서비스에서는 여기서 비밀번호 확인 API를 쏠 수도 있지만, 
      // 명세서상 최종 수정(PATCH) 때 한 번에 검증하므로 화면만 넘겨줍니다.
      setIsVerified(true); 
    } else {
      alert('현재 비밀번호를 입력해 주세요.');
    }
  };

  // ==========================================
  // 🚀 [명세서 반영]: PATCH /members/me (회원 정보 수정)
  // ==========================================
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nickname.trim()) {
      alert('닉네임은 최소 한 글자 이상 입력해야 합니다.');
      return;
    }

    try {
      // 💡 [핵심]: 명세서에 따라 currentPassword를 필수로 보냅니다.
      // 변경할 항목(newPassword, nickname)만 선택적으로 보냅니다.
      const updatePayload = {
        currentPassword: currentPassword, 
        newPassword: newPassword || undefined, 
        nickname: nickname 
      };

      await api.patch('/members/me', updatePayload);
      
      alert('회원 정보가 성공적으로 변경되었습니다!');
      setNewPassword(''); // 새 비밀번호 입력창만 깔끔하게 초기화
    } catch (error: unknown) { 
      console.error('프로필 저장 에러:', error);
      if (axios.isAxiosError(error)) {
        alert(`저장 실패: ${error.response?.data?.error?.message || '비밀번호가 틀렸거나 문제가 발생했습니다.'}`);
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', color: '#e3e3e3', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      
      {!isVerified ? (
        /* 화면 A: 비밀번호 재확인 (잠금 화면) */
        <div style={{ backgroundColor: '#1e1f20', padding: '40px', borderRadius: '15px', border: '1px solid #444746', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '20px' }}>🔒</div>
          <h2 style={{ margin: '0 0 10px 0', fontWeight: '500', color: '#e3e3e3' }}>안전한 사용을 위해<br/>비밀번호를 다시 입력해 주세요</h2>
          <p style={{ color: '#c4c7c5', fontSize: '14px', marginBottom: '30px' }}>정보 수정 시 현재 비밀번호 확인이 필요합니다.</p>
          
          <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              type="password" 
              placeholder="현재 비밀번호 입력" 
              value={currentPassword} 
              onChange={(e) => setCurrentPassword(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: 'white', outline: 'none', boxSizing: 'border-box' }} 
            />
            <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#a8c7fa', color: '#041e49', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>확인</button>
          </form>
        </div>
      ) : (
        /* 화면 B: 회원 정보 수정 화면 */
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <h1 style={{ marginBottom: '30px', fontWeight: '400', textAlign: 'center' }}>설정 및 내 정보</h1>

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: '#1e1f20', padding: '30px', borderRadius: '15px', border: '1px solid #444746' }}>
            
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

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#c4c7c5', fontSize: '14px' }}>학교 이메일 (아이디)</label>
              <input type="text" value={userInfo.email} disabled style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: '#7a7c7f', outline: 'none', boxSizing: 'border-box' }} />
            </div>

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
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#c4c7c5', fontSize: '14px' }}>새 비밀번호 설정</label>
              <input type="password" placeholder="변경할 비밀번호 입력 (변경하지 않으려면 비워두세요)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: 'white', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            
            <button type="submit" style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#a8c7fa', color: '#041e49', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '10px' }}>
              변경사항 저장하기
            </button>
          </form>

          <hr style={{ borderColor: '#444746', margin: '40px 0', borderTop: 'none' }} />

          <div style={{ backgroundColor: '#1e1f20', padding: '30px', borderRadius: '15px', border: '1px solid #5c2b29', textAlign: 'center' }}>
            <h3 style={{ color: '#f28b82', margin: '0 0 10px 0', fontWeight: '500' }}>위험 구역 (Danger Zone)</h3>
            <p style={{ color: '#c4c7c5', fontSize: '14px', marginBottom: '20px' }}>계정을 삭제하면 모든 노트북과 대화 기록이 삭제 대기 상태로 전환됩니다.</p>
            <button type="button" onClick={() => navigate('/deactivate')} style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: 'transparent', color: '#f28b82', border: '1px solid #f28b82', cursor: 'pointer', fontWeight: 'bold' }}>회원 비활성화 및 탈퇴 관리</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
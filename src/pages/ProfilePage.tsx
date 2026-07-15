import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import api from '../api/axios';

const ProfilePage = () => {
  const navigate = useNavigate();
  
  // 1. 잠금 화면(비밀번호 확인) 관련 상태
  const [isVerified, setIsVerified] = useState(false);
  const [currentPassword, setCurrentPassword] = useState(''); 
  
  // 2. 회원 정보 상태
  const [userInfo, setUserInfo] = useState({ name: '', studentId: '', email: '' });
  const [nickname, setNickname] = useState(''); 
  const [newPassword, setNewPassword] = useState(''); 

  // ==========================================
  // 🚀 기존 통신 로직 100% 유지: GET /members/me (내 정보 조회)
  // ==========================================
  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const data = await api.get('/members/me');
        setUserInfo({ 
          name: data.name, 
          studentId: data.studentId, 
          email: data.email 
        });
        setNickname(data.nickname || '범준');
      } catch (error) {
        console.warn('프로필 조회 실패, 회의용 더미 데이터로 대체합니다.', error);
        // 서버가 열려있지 않을 때를 대비한 시연용 풀백(Fallback) 데이터
        setUserInfo({ 
          name: "조범준", 
          studentId: "20240001", 
          email: "jobeomjun1234@yeonsung.ac.kr" 
        });
        setNickname('범준');
      }
    };

    fetchMyProfile();
  }, []);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPassword) {
      setIsVerified(true); 
    } else {
      alert('현재 비밀번호를 입력해 주세요.');
    }
  };

  // ==========================================
  // 🚀 기존 통신 로직 100% 유지: PATCH /members/me (회원 정보 수정)
  // ==========================================
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nickname.trim()) {
      alert('닉네임은 최소 한 글자 이상 입력해야 합니다.');
      return;
    }

    try {
      const updatePayload = {
        currentPassword: currentPassword, 
        newPassword: newPassword || undefined, 
        nickname: nickname 
      };

      await api.patch('/members/me', updatePayload);
      
      alert('회원 정보가 성공적으로 변경되었습니다!');
      setNewPassword(''); 
    } catch (error: unknown) { 
      console.error('프로필 저장 에러:', error);
      if (axios.isAxiosError(error)) {
        alert(`저장 실패: ${error.response?.data?.error?.message || '비밀번호가 틀렸거나 문제가 발생했습니다.'}`);
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  // ==========================================
  // 🎨 화면(UI) 렌더링
  // ==========================================
  
  // 화면 A: 비밀번호 재확인 (잠금 화면) - auth-page 테마 재사용
  if (!isVerified) {
    return (
      <div className="auth-page">
        <form onSubmit={handleVerify} className="auth-card">
          <div className="mascot-xl"><span className="eyes"><span></span><span></span></span></div>
          <div className="auth-title">BottaBot</div>
          <div className="auth-heading">안전한 사용을 위해</div>
          <div className="auth-sub">현재 비밀번호를 다시 입력해 주세요</div>
          
          <div className="field">
            <input 
              type="password" 
              placeholder="현재 비밀번호 입력" 
              value={currentPassword} 
              onChange={(e) => setCurrentPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary">확인</button>
          
          {/* 뒤로가기 버튼 */}
          <div className="link-row" style={{ marginTop: '20px' }}>
            <a onClick={() => navigate(-1)}>← 이전 페이지로 돌아가기</a>
          </div>
        </form>
      </div>
    );
  }

  // 화면 B: 회원 정보 수정 화면 - settings-page 테마 사용
  return (
    <div className="settings-page">
      <div className="settings-wrap">
        
        <div className="settings-back" onClick={() => navigate('/settings')}>
          <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg> 설정으로 돌아가기
        </div>

        {/* 프로필 수정 폼 (auth-card 활용) */}
        <form onSubmit={handleSaveProfile} className="auth-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          
          {/* 둥근 대형 아바타 (이름의 첫 글자 노출) */}
          <div className="avatar-lg" style={{ backgroundColor: 'var(--black)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '32px', width: '96px', height: '96px', borderRadius: '50%', margin: '0 auto 14px' }}>
            {nickname ? nickname.charAt(0) : '봇'}
          </div>
          <div className="account-name" style={{ textAlign: 'center', fontSize: '19px', fontWeight: 800, color: 'var(--black)' }}>{nickname}</div>
          <div className="account-email" style={{ textAlign: 'center', fontSize: '12.5px', color: 'var(--ink-soft)', margin: '4px 0 24px' }}>{userInfo.email}</div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="field" style={{ flex: 1 }}>
              <label>이름</label>
              <input type="text" value={userInfo.name} disabled style={{ color: 'var(--ink-soft)' }} />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label>학번</label>
              <input type="text" value={userInfo.studentId} disabled style={{ color: 'var(--ink-soft)' }} />
            </div>
          </div>

          <div className="field">
            <label>학교 이메일 (아이디)</label>
            <input type="text" value={userInfo.email} disabled style={{ color: 'var(--ink-soft)' }} />
          </div>

          <div className="field">
            <label>닉네임 설정</label>
            <input 
              type="text" 
              value={nickname} 
              onChange={(e) => setNickname(e.target.value)} 
              required
            />
          </div>
          
          <div className="field">
            <label>새 비밀번호 설정</label>
            <input 
              type="password" 
              placeholder="변경할 비밀번호 입력 (변경하지 않으려면 비워두세요)" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ marginTop: '20px' }}>
            변경 사항 저장
          </button>

          {/* 위험 구역: 탈퇴 페이지로 이동 */}
          <button 
            type="button" 
            className="btn btn-danger-outline" 
            onClick={() => navigate('/deactivate')}
            style={{ marginTop: '12px' }}
          >
            회원 탈퇴 및 비활성화
          </button>
          
        </form>

      </div>
    </div>
  );
};

export default ProfilePage;
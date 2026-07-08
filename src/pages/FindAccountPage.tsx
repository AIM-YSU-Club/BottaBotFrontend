import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FindAccountPage = () => {
  const navigate = useNavigate();
  // 🚀 [팀원 공유용]: 탭 상태 (findId: 아이디 찾기, resetPw: 비밀번호 재설정)
  const [activeTab, setActiveTab] = useState<'findId' | 'resetPw'>('findId');
  const [phone, setPhone] = useState('');

  // 🚀 [팀원 공유용]: 아이디 찾기 API 연동 함수
  const handleFindId = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO(백엔드): 전화번호로 가입된 아이디 조회 API 호출 (예: GET /api/auth/find-id)
    alert(`입력하신 번호(${phone})로 등록된 아이디는 'user123' 입니다.`);
  };

  // 🚀 [팀원 공유용]: 비밀번호 재설정 링크 발송 API 연동 함수
  const handleResetPw = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO(백엔드): 전화번호(또는 이메일)로 임시 비밀번호 발급 또는 재설정 링크 발송 API 호출
    alert('입력하신 번호로 비밀번호 재설정 안내 문자가 발송되었습니다.');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#131314', justifyContent: 'center', alignItems: 'center', color: '#e3e3e3' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '40px', backgroundColor: '#1e1f20', borderRadius: '15px', border: '1px solid #444746', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
        
        <h1 style={{ textAlign: 'center', marginBottom: '20px', fontWeight: '500', fontSize: '20px' }}>계정 찾기</h1>

        {/* 탭 메뉴 */}
        <div style={{ display: 'flex', marginBottom: '30px', borderBottom: '1px solid #444746' }}>
          <button 
            onClick={() => setActiveTab('findId')}
            style={{ flex: 1, padding: '10px', background: 'transparent', border: 'none', borderBottom: activeTab === 'findId' ? '2px solid #a8c7fa' : 'none', color: activeTab === 'findId' ? '#a8c7fa' : '#c4c7c5', cursor: 'pointer', fontWeight: activeTab === 'findId' ? 'bold' : 'normal' }}
          >
            아이디 찾기
          </button>
          <button 
            onClick={() => setActiveTab('resetPw')}
            style={{ flex: 1, padding: '10px', background: 'transparent', border: 'none', borderBottom: activeTab === 'resetPw' ? '2px solid #a8c7fa' : 'none', color: activeTab === 'resetPw' ? '#a8c7fa' : '#c4c7c5', cursor: 'pointer', fontWeight: activeTab === 'resetPw' ? 'bold' : 'normal' }}
          >
            비밀번호 재설정
          </button>
        </div>

        {/* 탭 내용 */}
        {activeTab === 'findId' ? (
          <form onSubmit={handleFindId} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#c4c7c5', fontSize: '14px' }}>가입 시 등록한 전화번호</label>
              <input type="text" placeholder="01012345678" value={phone} onChange={(e) => setPhone(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: 'white', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#a8c7fa', color: '#041e49', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>아이디 찾기</button>
          </form>
        ) : (
          <form onSubmit={handleResetPw} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#c4c7c5', fontSize: '14px' }}>가입 시 등록한 전화번호</label>
              <input type="text" placeholder="01012345678" value={phone} onChange={(e) => setPhone(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: 'white', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#a8c7fa', color: '#041e49', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>재설정 링크 받기</button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <span onClick={() => navigate('/login')} style={{ color: '#c4c7c5', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline' }}>로그인으로 돌아가기</span>
        </div>
      </div>
    </div>
  );
};

export default FindAccountPage;
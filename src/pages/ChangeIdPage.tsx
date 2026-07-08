import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChangeIdPage = () => {
  const navigate = useNavigate();
  const [newId, setNewId] = useState('');

  // 🚀 [팀원 공유용]: 아이디 변경 API 연동 함수
  const handleChangeId = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newId) return;

    // TODO(백엔드): 새로운 아이디 중복 체크 및 변경 API 호출 (예: PATCH /api/user/change-id)
    console.log('변경할 아이디:', newId);
    alert('아이디가 성공적으로 변경되었습니다. 다시 로그인해 주세요.');
    navigate('/login'); // 아이디 변경 후 재로그인 유도
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#131314', justifyContent: 'center', alignItems: 'center', color: '#e3e3e3' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '40px', backgroundColor: '#1e1f20', borderRadius: '15px', border: '1px solid #444746', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
        
        <h1 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: '500', fontSize: '20px' }}>아이디 변경</h1>

        <form onSubmit={handleChangeId} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#c4c7c5', fontSize: '14px' }}>현재 아이디</label>
            <input type="text" value="jobeomjun123" disabled style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: '#7a7c7f', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#c4c7c5', fontSize: '14px' }}>새로운 아이디</label>
            <input type="text" placeholder="새로운 아이디 입력" value={newId} onChange={(e) => setNewId(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: 'white', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#a8c7fa', color: '#041e49', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '10px' }}>변경하기</button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <span onClick={() => navigate(-1)} style={{ color: '#c4c7c5', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline' }}>이전 페이지로 돌아가기</span>
        </div>
      </div>
    </div>
  );
};

export default ChangeIdPage;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // 🚀 에러 타입 가드용
import api from '../api/axios';

const ChangeIdPage = () => {
  const navigate = useNavigate();
  const [newEmail, setNewEmail] = useState('');
  
  // 현재 로그인된 사용자의 이메일 (예시)
  const currentEmail = "example@univ.ac.kr"; 

  const handleChangeId = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    try {
      // 전송(Request) 데이터: { newEmail }
      await api.patch('/user/change-email', { newEmail });
      
      sessionStorage.removeItem('accessToken');
      alert('이메일(아이디)이 성공적으로 변경되었습니다. 안전을 위해 다시 로그인해 주세요.');
      navigate('/login'); 
      
    } catch (error: unknown) { // 🚀 any 대신 unknown 적용
      console.error('이메일 변경 에러:', error);
      
      // 🚀 Type Guard: axios 통신 에러인지 명확히 확인
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          alert('이미 사용 중인 이메일입니다. 다른 이메일을 입력해 주세요.');
        } else {
          alert('변경 중 문제가 발생했습니다. 다시 시도해 주세요.');
        }
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#131314', justifyContent: 'center', alignItems: 'center', color: '#e3e3e3' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '40px', backgroundColor: '#1e1f20', borderRadius: '15px', border: '1px solid #444746', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
        
        <h1 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: '500', fontSize: '20px' }}>이메일(아이디) 변경</h1>

        <form onSubmit={handleChangeId} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#c4c7c5', fontSize: '14px' }}>현재 이메일</label>
            <input type="text" value={currentEmail} disabled style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: '#7a7c7f', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#c4c7c5', fontSize: '14px' }}>새로운 이메일</label>
            <input type="email" placeholder="새로운 이메일 입력" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: 'white', outline: 'none', boxSizing: 'border-box' }} />
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
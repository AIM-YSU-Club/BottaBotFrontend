import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // 🚀 에러 타입 가드용
import api from '../api/axios';

const FindAccountPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'findId' | 'resetPw'>('findId');
  
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');

  const handleFindId = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !studentId) return;

    try {
      const response = await api.post('/auth/find-id', { name, studentId });
      const foundEmail = response.data.email; 
      alert(`입력하신 정보로 등록된 이메일(아이디)은 '${foundEmail}' 입니다.`);
    } catch (error: unknown) { // 🚀 any 대신 unknown
      console.error('아이디 찾기 에러:', error);
      
      // 🚀 Type Guard
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          alert('입력하신 이름과 학번으로 가입된 계정이 없습니다.');
        } else {
          alert('아이디 찾기 처리 중 문제가 발생했습니다.');
        }
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  const handleResetPw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await api.post('/auth/reset-password', { email });
      alert('입력하신 이메일로 비밀번호 재설정 안내가 발송되었습니다.');
      navigate('/login'); 
    } catch (error: unknown) { // 🚀 any 대신 unknown
      console.error('비밀번호 재설정 에러:', error);
      
      // 🚀 Type Guard
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          alert('존재하지 않는 이메일(아이디)입니다.');
        } else {
          alert('요청 처리 중 문제가 발생했습니다. 다시 시도해 주세요.');
        }
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#131314', justifyContent: 'center', alignItems: 'center', color: '#e3e3e3' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '40px', backgroundColor: '#1e1f20', borderRadius: '15px', border: '1px solid #444746', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
        
        <h1 style={{ textAlign: 'center', marginBottom: '20px', fontWeight: '500', fontSize: '20px' }}>계정 찾기</h1>

        <div style={{ display: 'flex', marginBottom: '30px', borderBottom: '1px solid #444746' }}>
          <button 
            onClick={() => setActiveTab('findId')}
            type="button"
            style={{ flex: 1, padding: '10px', background: 'transparent', border: 'none', borderBottom: activeTab === 'findId' ? '2px solid #a8c7fa' : 'none', color: activeTab === 'findId' ? '#a8c7fa' : '#c4c7c5', cursor: 'pointer', fontWeight: activeTab === 'findId' ? 'bold' : 'normal' }}
          >
            아이디 찾기
          </button>
          <button 
            onClick={() => setActiveTab('resetPw')}
            type="button"
            style={{ flex: 1, padding: '10px', background: 'transparent', border: 'none', borderBottom: activeTab === 'resetPw' ? '2px solid #a8c7fa' : 'none', color: activeTab === 'resetPw' ? '#a8c7fa' : '#c4c7c5', cursor: 'pointer', fontWeight: activeTab === 'resetPw' ? 'bold' : 'normal' }}
          >
            비밀번호 재설정
          </button>
        </div>

        {activeTab === 'findId' ? (
          <form onSubmit={handleFindId} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#c4c7c5', fontSize: '14px' }}>가입 시 등록한 이름</label>
              <input type="text" placeholder="홍길동" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: 'white', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#c4c7c5', fontSize: '14px' }}>학번</label>
              <input type="text" placeholder="20240001" value={studentId} onChange={(e) => setStudentId(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: 'white', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#a8c7fa', color: '#041e49', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '10px' }}>아이디 찾기</button>
          </form>
        ) : (
          <form onSubmit={handleResetPw} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#c4c7c5', fontSize: '14px' }}>가입한 이메일 (아이디)</label>
              <input type="email" placeholder="example@univ.ac.kr" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #444746', color: 'white', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#a8c7fa', color: '#041e49', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '10px' }}>재설정 링크 받기</button>
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
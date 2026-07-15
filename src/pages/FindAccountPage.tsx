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

  // ==========================================
  // 🚀 기존 통신 로직 및 에러 처리 (100% 유지)
  // ==========================================
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

  // ==========================================
  // 🎨 화면(UI) 부분만 새 디자인 클래스로 완벽 교체
  // ==========================================
  return (
    <div className="auth-page">
      <div className="auth-card">
        
        {/* 새 디자인: 마스코트 */}
        <div className="mascot-xl">
          <span className="eyes"><span></span><span></span></span>
        </div>
        
        <div className="auth-title">BottaBot</div>
        
        {/* 탭 상태에 따라 제목과 설명이 자연스럽게 바뀝니다 */}
        <div className="auth-heading">
          {activeTab === 'findId' ? '계정 찾기' : '비밀번호 재설정'}
        </div>
        <div className="auth-sub">
          {activeTab === 'findId' 
            ? '가입 시 사용한 이메일로 찾을 수 있어요'
            : '가입한 이메일을 입력하면 재설정 링크를 보내드려요'}
        </div>

        {/* 🎨 새 디자인: 탭 UI 적용 (.segment) */}
        <div className="segment">
          <button 
            type="button" 
            className={activeTab === 'findId' ? 'active' : ''} 
            onClick={() => setActiveTab('findId')}
          >
            아이디 찾기
          </button>
          <button 
            type="button" 
            className={activeTab === 'resetPw' ? 'active' : ''} 
            onClick={() => setActiveTab('resetPw')}
          >
            비밀번호 찾기
          </button>
        </div>

        {/* 선택된 탭에 따라 폼을 렌더링 */}
        {activeTab === 'findId' ? (
          <form onSubmit={handleFindId}>
            <div className="field">
              <label>가입 시 등록한 이름</label>
              <input 
                type="text" 
                placeholder="홍길동" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            <div className="field">
              <label>학번</label>
              <input 
                type="text" 
                placeholder="20240001" 
                value={studentId} 
                onChange={(e) => setStudentId(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary">
              아이디 찾기
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPw}>
            <div className="field">
              <label>가입한 이메일 (아이디)</label>
              <input 
                type="email" 
                placeholder="example@yeonsung.ac.kr" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary">
              재설정 링크 받기
            </button>
          </form>
        )}

        {/* 하단 로그인 돌아가기 링크 */}
        <a className="link-back" onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>
          ← 로그인으로 돌아가기
        </a>
        
      </div>
    </div>
  );
};

export default FindAccountPage;
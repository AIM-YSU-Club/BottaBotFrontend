import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api/axios';

const DeactivatePage = () => {
  // 🚀 화면 이동을 담당하는 함수를 가져옵니다.
  const navigate = useNavigate();
  
  const [withdrawalReason, setWithdrawalReason] = useState('');
  const [isHardDeleteModalOpen, setIsHardDeleteModalOpen] = useState(false);

  // ==========================================
  // 🚀 1. 비활성화 API (30일 유예 - Soft Delete)
  // ==========================================
  const handleDeactivate = async () => {
    if (!withdrawalReason) {
      alert('비활성화 사유를 선택해 주세요.');
      return;
    }

    try {
      await api.patch('/user/deactivate', { reason: withdrawalReason });
      
      // 기존 출입증(토큰) 파기
      sessionStorage.removeItem('accessToken');
      
      alert('계정이 비활성화되었습니다. 30일 이내에 로그인하시면 복구됩니다.');
      
      // 🚀 [핵심]: 확인 버튼을 누르는 즉시 로그인 페이지로 튕겨냅니다!
      navigate('/login'); 
      
    } catch (error: unknown) {
      console.error('비활성화 에러:', error);
      if (axios.isAxiosError(error)) alert('처리 중 서버 문제가 발생했습니다.');
      else alert('알 수 없는 오류가 발생했습니다.');
    }
  };

  // ==========================================
  // 🚀 2. 영구 탈퇴 API (즉시 삭제 - Hard Delete)
  // ==========================================
  const handleHardDelete = async () => {
    try {
      await api.delete('/user/account');
      
      // 기존 출입증(토큰) 파기
      sessionStorage.removeItem('accessToken');
      
      alert('회원 탈퇴가 완료되었습니다. 그동안 이용해 주셔서 감사합니다.');
      setIsHardDeleteModalOpen(false);
      
      // 🚀 [핵심]: 확인 버튼을 누르는 즉시 로그인 페이지로 튕겨냅니다!
      navigate('/login'); 
      
    } catch (error: unknown) {
      console.error('영구 탈퇴 에러:', error);
      if (axios.isAxiosError(error)) alert('처리 중 서버 문제가 발생했습니다.');
      else alert('알 수 없는 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', color: '#e3e3e3', height: '100%', overflowY: 'auto' }}>
      
      <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
        <h1 style={{ marginBottom: '10px', fontWeight: '400', textAlign: 'center' }}>계정 비활성화</h1>
        <p style={{ textAlign: 'center', color: '#c4c7c5', fontSize: '14px', marginBottom: '40px' }}>잠시 서비스를 쉬어가고 싶으신가요?</p>

        {/* 1. 비활성화 (Soft Delete) 영역 */}
        <div style={{ backgroundColor: '#1e1f20', padding: '30px', borderRadius: '15px', border: '1px solid #444746', marginBottom: '40px' }}>
          <div style={{ backgroundColor: '#303030', padding: '15px', borderRadius: '8px', marginBottom: '25px' }}>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', textAlign: 'center', color: '#e3e3e3' }}>
              비활성화 시 계정은 즉시 숨김 처리 되며,<br/>
              <strong>30일 이내에 다시 로그인하시면 데이터가 100% 복구</strong>됩니다.
            </p>
          </div>

          <p style={{ color: '#e3e3e3', fontSize: '15px', marginBottom: '15px', fontWeight: '500' }}>떠나시는 이유를 알려주시면 개선하겠습니다.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
            {['쓰지 않는 계정이에요', '원하는 기능이 없어요', '이용 방법이 어려워요', '기타 사유'].map((reason) => (
              <label key={reason} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#c4c7c5', cursor: 'pointer', fontSize: '14px' }}>
                <input type="radio" name="withdrawReason" value={reason} onChange={(e) => setWithdrawalReason(e.target.value)} style={{ cursor: 'pointer' }} />
                {reason}
              </label>
            ))}
          </div>

          <button 
            onClick={handleDeactivate} 
            disabled={!withdrawalReason} 
            style={{ width: '100%', padding: '12px', borderRadius: '8px', fontWeight: 'bold', border: 'none', backgroundColor: withdrawalReason ? '#f28b82' : '#303030', color: withdrawalReason ? '#3f0f0a' : '#7a7c7f', cursor: withdrawalReason ? 'pointer' : 'not-allowed', transition: 'background-color 0.2s' }}
          >
            계정 비활성화하기
          </button>
        </div>

        <hr style={{ borderColor: '#444746', margin: '40px 0', borderTop: 'none' }} />

        {/* 2. 진짜 영구 탈퇴 (Hard Delete) 영역 */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <h3 style={{ color: '#f28b82', margin: '0 0 10px 0', fontWeight: '500' }}>영구 탈퇴</h3>
          <p style={{ color: '#7a7c7f', fontSize: '13px', marginBottom: '20px', lineHeight: '1.5' }}>
            비활성화 유예 기간 없이 즉시 모든 데이터를 영구적으로 삭제하고 떠나시려면<br/>아래 버튼을 눌러주세요. 이 작업은 절대 되돌릴 수 없습니다.
          </p>
          <button 
            onClick={() => setIsHardDeleteModalOpen(true)}
            style={{ padding: '8px 16px', background: 'transparent', border: 'none', color: '#f28b82', textDecoration: 'underline', cursor: 'pointer', fontSize: '14px' }}
          >
            회원 탈퇴 진행하기
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <span onClick={() => navigate('/profile')} style={{ color: '#a8c7fa', cursor: 'pointer', fontSize: '14px' }}>← 이전 페이지로 돌아가기</span>
        </div>
      </div>

      {/* 🚨 영구 탈퇴 최종 경고 모달창 */}
      {isHardDeleteModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#1e1f20', padding: '30px', borderRadius: '15px', width: '400px', border: '1px solid #f28b82', textAlign: 'center' }}>
            <h2 style={{ marginTop: 0, color: '#f28b82', fontSize: '20px' }}>정말 영구 탈퇴하시겠습니까?</h2>
            <p style={{ color: '#c4c7c5', fontSize: '14px', lineHeight: '1.6', marginBottom: '30px' }}>
              지금 탈퇴하시면 저장된 모든 노트북과 대화 내역이 <strong>즉시 삭제</strong>되며, 절대 복구할 수 없습니다.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setIsHardDeleteModalOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: 'transparent', color: '#e3e3e3', border: '1px solid #c4c7c5', cursor: 'pointer' }}>취소</button>
              <button onClick={handleHardDelete} style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: '#f28b82', color: '#3f0f0a', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>영구 탈퇴하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeactivatePage;
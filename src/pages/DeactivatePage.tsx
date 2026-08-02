import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api/axios';
import FormField from '../components/common/FormField';
import Mascot from '../components/common/Mascot';
import AuthPageLayout from '../components/auth/AuthPageLayout';
import AuthHeader from '../components/auth/AuthHeader';
import WarningBox from '../components/settings/WarningBox';

const DeactivatePage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');

  const isReadyToWithdraw = password.trim().length > 0 && confirmText.trim() === '탈퇴합니다';

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isReadyToWithdraw) return;

    try {
      await api.delete('/members/me', {
        data: { password },
      });

      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      setStep(3);
    } catch (error: unknown) {
      console.error('회원 탈퇴 에러:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          alert('비밀번호가 일치하지 않습니다. 다시 확인해 주세요.');
        } else {
          alert(
            `탈퇴 처리 중 오류가 발생했습니다: ${error.response?.data?.error?.message || '알 수 없는 오류'}`
          );
        }
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  if (step === 1) {
    return (
      <AuthPageLayout>
        <Mascot size="xl" />
        <AuthHeader heading="회원 탈퇴" sub="탈퇴 전 아래 내용을 확인해 주세요" />

        <WarningBox
          title="⚠ 탈퇴 시 삭제되는 항목"
          items={[
            '모든 대화 기록 및 프롬프트 노트',
            '업로드한 문서 및 파일 데이터',
            '계정 프로필 정보 및 설정',
          ]}
          note="삭제된 데이터는 절대 복구할 수 없습니다."
        />

        <button type="button" className="btn btn-danger ready" onClick={() => setStep(2)}>
          탈퇴 진행하기
        </button>
        <button type="button" className="btn btn-outline" onClick={() => navigate('/profile')}>
          취소하고 돌아가기
        </button>
      </AuthPageLayout>
    );
  }

  if (step === 2) {
    return (
      <AuthPageLayout as="form" onSubmit={handleWithdrawSubmit}>
        <Mascot size="xl" />
        <AuthHeader heading="회원 탈퇴 확인" sub="안전한 처리를 위해 정보를 입력해 주세요" />

        <FormField
          label="비밀번호 확인"
          type="password"
          placeholder="현재 비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <FormField
          label={
            <>
              아래에 <span style={{ color: 'var(--danger)' }}>"탈퇴합니다"</span>를 정확히 입력해 주세요
            </>
          }
          type="text"
          placeholder="탈퇴합니다"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          required
        />

        <button
          type="submit"
          className={`btn ${isReadyToWithdraw ? 'btn-danger ready' : 'btn-danger'}`}
          disabled={!isReadyToWithdraw}
          style={{ opacity: isReadyToWithdraw ? 1 : 0.5 }}
        >
          최종 탈퇴
        </button>
        <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>
          ← 이전 단계로
        </button>
      </AuthPageLayout>
    );
  }

  return (
    <AuthPageLayout cardStyle={{ textAlign: 'center' }}>
      <Mascot size="xl" grayscale />
      <div className="auth-title">BottaBot</div>

      <div className="done-emoji">👋</div>
      <div className="done-title">탈퇴가 완료되었습니다</div>
      <div className="done-sub">
        그동안 BottaBot을 이용해 주셔서 진심으로 감사드립니다.
        <br />
        언제든 다시 돌아오세요!
      </div>

      <button type="button" className="btn btn-primary" onClick={() => navigate('/login')}>
        처음 화면으로
      </button>
    </AuthPageLayout>
  );
};

export default DeactivatePage;

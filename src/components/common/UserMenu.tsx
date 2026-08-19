import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useUser } from '../../context/UserContext';
import UserAvatar from './UserAvatar';

/** 홈/라이브러리 등 상단 헤더에 쓰이는 아바타 + 드롭다운(내 프로필/설정/로그아웃) */
const UserMenu = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      // API 명세 2장(MEM05_LOGOUT01): POST /auth/logout — 서버 측 세션/토큰 즉시 만료
      await api.post('/auth/logout');
    } catch (error) {
      console.error('로그아웃 API 실패, 로컬 세션만 정리합니다:', error);
    } finally {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      setUser({ name: '알 수 없음', role: '게스트' });
      navigate('/login', { replace: true });
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <div onClick={() => setOpen((v) => !v)}>
        <UserAvatar name={user.name} size="sm" />
      </div>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
          <div className="avatar-menu">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate('/profile');
              }}
            >
              내 프로필
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate('/settings');
              }}
            >
              설정
            </button>
            <button type="button" className="danger" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;

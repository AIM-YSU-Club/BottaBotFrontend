import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import SidebarMenuItem from './SidebarMenuItem';
import UserAvatar from '../common/UserAvatar';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  {
    id: 'new',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M12 3l1.8 4.9L18.7 9.7l-4.9 1.8L12 16.4l-1.8-4.9L5.3 9.7l4.9-1.8L12 3z" />
      </svg>
    ),
    label: '새 채팅',
    path: '/',
  },
  {
    id: 'search',
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
    ),
    label: '검색',
    path: '/',
  },
  {
    id: 'chat',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M21 12a8 8 0 1 1-3.2-6.4" />
        <path d="M21 4v5h-5" />
      </svg>
    ),
    label: '대화 기록',
    path: '/',
  },
  {
    id: 'library',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
      </svg>
    ),
    label: '라이브러리',
    path: '/',
  },
];

const recentChats = [
  '한자 일본어 발음 및 뜻',
  '초보자를 위한 챗봇 개발 로드맵',
  'Git Push Error: `main` Refspec Not Found...',
  'FastAPI 강의 명령어 윈도우 CMD 변환',
];

const settingsIcon = (
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </svg>
);

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  return (
    <aside
      className="sidebar"
      style={{
        width: isOpen ? '260px' : 'var(--sidebar-w)',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        alignItems: isOpen ? 'stretch' : 'center',
        padding: isOpen ? '16px 20px' : '16px 0 20px',
        zIndex: 50,
      }}
    >
      <div className="sidebar-group" style={{ width: '100%' }}>
        <SidebarMenuItem
          icon={
            <svg viewBox="0 0 24 24">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          }
          label="메뉴 열기/닫기"
          isOpen={isOpen}
          onClick={onToggle}
          ghost
          showLabelWhenOpen={false}
        />

        <div className="sidebar-divider" style={{ width: isOpen ? '100%' : '28px' }}></div>

        {menuItems.map((item) => (
          <SidebarMenuItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isOpen={isOpen}
            active={location.pathname === item.path && item.id === 'new'}
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>

      {isOpen && (
        <div
          style={{
            flex: 1,
            width: '100%',
            overflowY: 'auto',
            marginTop: '20px',
            padding: '0 8px',
            animation: 'fadeIn 0.3s ease-out',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: 'var(--ink-soft)',
              fontWeight: 700,
              marginBottom: '8px',
              paddingLeft: '4px',
            }}
          >
            최근 대화
          </div>
          {recentChats.map((chatTitle) => (
            <div
              key={chatTitle}
              style={{
                padding: '10px 12px',
                fontSize: '13px',
                color: 'var(--ink)',
                cursor: 'pointer',
                borderRadius: '8px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--leaf-soft)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {chatTitle}
            </div>
          ))}
        </div>
      )}

      <div
        className="sidebar-group"
        style={{
          width: '100%',
          marginTop: 'auto',
          paddingTop: '10px',
          borderTop: isOpen ? '1px solid var(--leaf-line)' : 'none',
        }}
      >
        <SidebarMenuItem
          icon={settingsIcon}
          label="설정"
          isOpen={isOpen}
          active={location.pathname === '/settings'}
          onClick={() => navigate('/settings')}
          ghost
        />

        <div
          className={`icon-btn ghost ${location.pathname === '/profile' ? 'active' : ''}`}
          data-label={!isOpen ? '내 프로필 (계정 관리)' : ''}
          onClick={() => navigate('/profile')}
          style={{
            width: isOpen ? '100%' : '44px',
            justifyContent: isOpen ? 'flex-start' : 'center',
            padding: isOpen ? '0 12px' : '0',
            marginTop: '4px',
          }}
        >
          <UserAvatar name={user.name} size="sm" />
          {isOpen && <span style={{ fontSize: '14px', marginLeft: '12px', fontWeight: 600 }}>내 프로필</span>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

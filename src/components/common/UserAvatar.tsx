import React from 'react';

interface UserAvatarProps {
  name: string;
  size?: 'sm' | 'lg';
  style?: React.CSSProperties;
}

const UserAvatar = ({ name, size = 'sm', style }: UserAvatarProps) => {
  if (size === 'lg') {
    return (
      <div
        className="avatar-lg"
        style={{
          backgroundColor: 'var(--black)',
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '32px',
          width: '96px',
          height: '96px',
          borderRadius: '50%',
          margin: '0 auto 14px',
          ...style,
        }}
      >
        {name ? name.charAt(0) : '봇'}
      </div>
    );
  }

  return (
    <div className="avatar" style={{ width: '28px', height: '28px', fontSize: '11px', flex: 'none', ...style }}>
      {name}
    </div>
  );
};

export default UserAvatar;

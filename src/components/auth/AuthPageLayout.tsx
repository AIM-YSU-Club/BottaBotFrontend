import React from 'react';

interface AuthPageLayoutProps {
  children: React.ReactNode;
  as?: 'form' | 'div';
  onSubmit?: (e: React.FormEvent) => void;
  cardStyle?: React.CSSProperties;
  /** 좌측 컬럼 콘텐츠(브랜드/헤딩/설명). 전달되면 좌-우 2단 레이아웃으로 렌더링됩니다. */
  side?: React.ReactNode;
}

const AuthPageLayout = ({ children, as = 'div', onSubmit, cardStyle, side }: AuthPageLayoutProps) => {
  const cardClassName = side ? 'auth-card auth-card--split' : 'auth-card';

  const content = side ? (
    <>
      <div className="auth-side">{side}</div>
      <div className="auth-main">{children}</div>
    </>
  ) : (
    children
  );

  return (
    <div className="auth-page">
      {as === 'form' ? (
        <form onSubmit={onSubmit} className={cardClassName} style={cardStyle}>
          {content}
        </form>
      ) : (
        <div className={cardClassName} style={cardStyle}>
          {content}
        </div>
      )}
    </div>
  );
};

export default AuthPageLayout;

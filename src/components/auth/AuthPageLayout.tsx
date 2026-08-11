import React from 'react';

interface AuthPageLayoutProps {
  children: React.ReactNode;
  as?: 'form' | 'div';
  onSubmit?: (e: React.FormEvent) => void;
  cardStyle?: React.CSSProperties;
}

const AuthPageLayout = ({ children, as = 'div', onSubmit, cardStyle }: AuthPageLayoutProps) => {
  const cardClassName = 'auth-card';

  return (
    <div className="auth-page">
      {as === 'form' ? (
        <form onSubmit={onSubmit} className={cardClassName} style={cardStyle}>
          {children}
        </form>
      ) : (
        <div className={cardClassName} style={cardStyle}>
          {children}
        </div>
      )}
    </div>
  );
};

export default AuthPageLayout;

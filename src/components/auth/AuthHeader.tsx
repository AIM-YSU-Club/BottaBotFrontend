interface AuthHeaderProps {
  title?: string;
  heading: string;
  sub: string;
}

const AuthHeader = ({ title = 'BottaBot', heading, sub }: AuthHeaderProps) => {
  return (
    <>
      <div className="auth-title">{title}</div>
      <div className="auth-heading">{heading}</div>
      <div className="auth-sub">{sub}</div>
    </>
  );
};

export default AuthHeader;

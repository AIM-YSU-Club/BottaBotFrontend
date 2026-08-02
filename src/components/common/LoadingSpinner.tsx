interface LoadingSpinnerProps {
  message: string;
}

const LoadingSpinner = ({ message }: LoadingSpinnerProps) => {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg)',
      }}
    >
      <svg
        width="44"
        height="44"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--leaf-deep)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="16 16"
        style={{ animation: 'spin 1s linear infinite' }}
      >
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        <circle cx="12" cy="12" r="10" />
      </svg>
      <div style={{ marginTop: '20px', fontSize: '15.5px', fontWeight: 700, color: 'var(--ink)' }}>
        {message}
      </div>
    </div>
  );
};

export default LoadingSpinner;

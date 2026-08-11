import React from 'react';

interface AddCardProps {
  label?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const AddCard = ({ label, onClick, style }: AddCardProps) => {
  return (
    <div
      className="history-card add-card"
      onClick={onClick}
      style={label ? { flexDirection: 'column', gap: '10px', ...style } : style}
    >
      <span
        className="plus-circle"
        style={
          label
            ? { width: '48px', height: '48px', backgroundColor: '#fff', border: '1px solid var(--leaf-line)' }
            : undefined
        }
      >
        <svg viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </span>
      {label && (
        <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--leaf-deep)' }}>{label}</span>
      )}
    </div>
  );
};

export default AddCard;

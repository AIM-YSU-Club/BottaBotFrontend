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
      style={label ? { flexDirection: 'column', gap: '8px', color: 'var(--leaf-deep)', ...style } : style}
    >
      {label ? (
        <>
          <span style={{ fontSize: '22px', fontWeight: 800, lineHeight: 1 }}>+</span>
          <span style={{ fontSize: '13px', fontWeight: 700 }}>{label}</span>
        </>
      ) : (
        <span className="plus-circle">
          <svg viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      )}
    </div>
  );
};

export default AddCard;

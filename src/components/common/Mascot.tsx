import React from 'react';

interface MascotProps {
  size?: 'sm' | 'xl';
  grayscale?: boolean;
  style?: React.CSSProperties;
}

const Mascot = ({ size = 'sm', grayscale = false, style }: MascotProps) => {
  return (
    <div
      className={size === 'xl' ? 'mascot-xl' : 'mascot'}
      style={{
        ...(grayscale ? { filter: 'grayscale(100%)' } : {}),
        ...style,
      }}
    >
      <span className="eyes">
        <span></span>
        <span></span>
      </span>
    </div>
  );
};

export default Mascot;

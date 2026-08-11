import React from 'react';

interface SectionHeadProps {
  title: string;
  subtitle: string;
  style?: React.CSSProperties;
}

const SectionHead = ({ title, subtitle, style }: SectionHeadProps) => {
  return (
    <div className="section-head" style={style}>
      <h2>{title}</h2>
      <span>{subtitle}</span>
    </div>
  );
};

export default SectionHead;

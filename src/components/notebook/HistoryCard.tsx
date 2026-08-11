import React from 'react';

interface HistoryCardProps {
  tag: string;
  title: string;
  meta?: string;
  time?: string;
  onClick?: () => void;
  showMore?: boolean;
  highlighted?: boolean;
  tagStyle?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  metaStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}

const HistoryCard = ({
  tag,
  title,
  meta,
  time,
  onClick,
  showMore = false,
  highlighted = false,
  tagStyle,
  titleStyle,
  metaStyle,
  style,
}: HistoryCardProps) => {
  return (
    <div
      className="history-card"
      onClick={onClick}
      style={{
        ...(highlighted ? { backgroundColor: 'var(--leaf-soft)', border: 'none' } : {}),
        ...style,
      }}
    >
      <div className="row-top">
        <span className="tag" style={tagStyle}>
          {tag}
        </span>
        {time && <span className="time">{time}</span>}
        {showMore && (
          <svg
            viewBox="0 0 24 24"
            style={{ width: '18px', cursor: 'pointer', stroke: 'var(--ink-soft)', fill: 'none', strokeWidth: 2 }}
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        )}
      </div>
      <div className="summary" style={titleStyle}>
        {title}
      </div>
      {meta && (
        <div className="meta" style={metaStyle}>
          {meta}
        </div>
      )}
    </div>
  );
};

export default HistoryCard;

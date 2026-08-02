import React from 'react';

interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
}

const ChatComposer = ({
  value,
  onChange,
  onSubmit,
  placeholder = '메시지를 입력하면 새 대화 기록이 생성돼요...',
}: ChatComposerProps) => {
  return (
    <form className="composer" onSubmit={onSubmit}>
      <input
        type="text"
        placeholder={placeholder}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button type="submit" aria-label="전송">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M4 12L20 4L14 20L11 13L4 12Z" fill="white" />
        </svg>
      </button>
    </form>
  );
};

export default ChatComposer;

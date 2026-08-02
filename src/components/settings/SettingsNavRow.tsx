interface SettingsNavRowProps {
  title: string;
  onClick: () => void;
}

const SettingsNavRow = ({ title, onClick }: SettingsNavRowProps) => {
  return (
    <div className="settings-row clickable" onClick={onClick}>
      <div className="settings-row-text">
        <div className="title">{title}</div>
      </div>
      <svg className="chevron" viewBox="0 0 24 24">
        <path d="M9 6l6 6-6 6" />
      </svg>
    </div>
  );
};

export default SettingsNavRow;

interface SettingsBackLinkProps {
  label: string;
  onClick: () => void;
}

const SettingsBackLink = ({ label, onClick }: SettingsBackLinkProps) => {
  return (
    <div className="settings-back" onClick={onClick}>
      <svg viewBox="0 0 24 24">
        <path d="M15 18l-6-6 6-6" />
      </svg>{' '}
      {label}
    </div>
  );
};

export default SettingsBackLink;

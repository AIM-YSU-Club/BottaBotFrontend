import ToggleSwitch from '../common/ToggleSwitch';

interface SettingsToggleRowProps {
  title: string;
  sub: string;
  checked: boolean;
  onChange: () => void;
}

const SettingsToggleRow = ({ title, sub, checked, onChange }: SettingsToggleRowProps) => {
  return (
    <div className="settings-row">
      <div className="settings-row-text">
        <div className="title">{title}</div>
        <div className="sub">{sub}</div>
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} />
    </div>
  );
};

export default SettingsToggleRow;

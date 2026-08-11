interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
}

const ToggleSwitch = ({ checked, onChange }: ToggleSwitchProps) => {
  return (
    <div className={`toggle ${checked ? 'on' : ''}`} onClick={onChange}>
      <div className="knob"></div>
    </div>
  );
};

export default ToggleSwitch;

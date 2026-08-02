interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

const TermsCheckbox = ({ checked, onChange, label }: TermsCheckboxProps) => {
  return (
    <div className="check-row" onClick={() => onChange(!checked)}>
      <span className={`circle ${checked ? 'checked' : ''}`}></span>
      <span className="check-label">{label}</span>
    </div>
  );
};

export default TermsCheckbox;

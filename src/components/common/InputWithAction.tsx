import React from 'react';

interface InputWithActionProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  actionLabel: string;
  onAction: () => void;
  actionClassName?: string;
  actionStyle?: React.CSSProperties;
}

const InputWithAction = ({
  label,
  actionLabel,
  onAction,
  actionClassName = 'field-inline-btn',
  actionStyle,
  ...inputProps
}: InputWithActionProps) => {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="field-inline-box">
        <input {...inputProps} />
        <button type="button" onClick={onAction} className={actionClassName} style={actionStyle}>
          {actionLabel}
        </button>
      </div>
    </div>
  );
};

export default InputWithAction;

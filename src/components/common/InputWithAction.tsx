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
  actionClassName = 'btn btn-outline',
  actionStyle,
  ...inputProps
}: InputWithActionProps) => {
  return (
    <div className="field">
      <label>{label}</label>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input {...inputProps} style={{ flex: 1, ...inputProps.style }} />
        <button
          type="button"
          onClick={onAction}
          className={actionClassName}
          style={{ width: 'auto', padding: '0 16px', margin: 0, ...actionStyle }}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
};

export default InputWithAction;

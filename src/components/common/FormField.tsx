import React from 'react';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  containerStyle?: React.CSSProperties;
}

const FormField = ({ label, containerStyle, id, ...inputProps }: FormFieldProps) => {
  const inputId = id ?? inputProps.name;

  return (
    <div className="field" style={containerStyle}>
      {label != null && <label htmlFor={inputId}>{label}</label>}
      <input id={inputId} {...inputProps} />
    </div>
  );
};

export default FormField;

import React from 'react';

interface SettingsSectionProps {
  label: string;
  children: React.ReactNode;
}

const SettingsSection = ({ label, children }: SettingsSectionProps) => {
  return (
    <div className="settings-section">
      <div className="settings-label">{label}</div>
      <div className="settings-card">{children}</div>
    </div>
  );
};

export default SettingsSection;

import React from 'react';

interface SettingsPageLayoutProps {
  children: React.ReactNode;
}

const SettingsPageLayout = ({ children }: SettingsPageLayoutProps) => {
  return (
    <div className="settings-page">
      <div className="settings-wrap">{children}</div>
    </div>
  );
};

export default SettingsPageLayout;

import React from 'react';

interface SidebarMenuItemProps {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  active?: boolean;
  onClick: () => void;
  ghost?: boolean;
  showLabelWhenOpen?: boolean;
  style?: React.CSSProperties;
}

const SidebarMenuItem = ({
  icon,
  label,
  isOpen,
  active = false,
  onClick,
  ghost = false,
  showLabelWhenOpen = true,
  style,
}: SidebarMenuItemProps) => {
  return (
    <div
      className={`icon-btn ${ghost ? 'ghost' : ''} ${active ? 'active' : ''}`}
      data-label={!isOpen ? label : ''}
      onClick={onClick}
      style={{
        width: isOpen ? '100%' : '44px',
        justifyContent: isOpen ? 'flex-start' : 'center',
        padding: isOpen ? '0 12px' : '0',
        ...style,
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</span>
      {isOpen && showLabelWhenOpen && (
        <span style={{ fontSize: '14px', marginLeft: '12px', fontWeight: 600 }}>{label}</span>
      )}
    </div>
  );
};

export default SidebarMenuItem;

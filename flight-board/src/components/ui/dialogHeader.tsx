import React from 'react';

interface DialogHeaderProps {
  children: React.ReactNode;
}

const DialogHeader: React.FC<DialogHeaderProps> = ({ children }) => {
  return <div className="dialog-header">{children}</div>;
};

export default DialogHeader; 
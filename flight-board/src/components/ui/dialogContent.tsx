import React from 'react';

interface DialogContentProps {
  children: React.ReactNode;
}

const DialogContent: React.FC<DialogContentProps> = ({ children }) => {
  return <div className="dialog-content">{children}</div>;
};

export default DialogContent; 
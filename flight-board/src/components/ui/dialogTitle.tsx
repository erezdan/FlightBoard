import React from 'react';

interface DialogTitleProps {
  children: React.ReactNode;
}

const DialogTitle: React.FC<DialogTitleProps> = ({ children }) => {
  return <div className="dialog-title">{children}</div>;
};

export default DialogTitle; 
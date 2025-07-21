import React from 'react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ open, onClose, title, children, actions }) => {
  if (!open) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.dialog} onClick={e => e.stopPropagation()}>
        {title && <div style={styles.title}>{title}</div>}
        <div style={styles.content}>{children}</div>
        {actions && <div style={styles.actions}>{actions}</div>}
        <button style={styles.closeButton} onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  dialog: {
    background: '#fff',
    borderRadius: 8,
    minWidth: 320,
    maxWidth: '90vw',
    padding: 24,
    boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
    position: 'relative',
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 16,
  },
  content: {
    marginBottom: 16,
  },
  actions: {
    display: 'flex',
    gap: 8,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    background: 'transparent',
    border: 'none',
    fontSize: 16,
    cursor: 'pointer',
  },
};

export default Dialog; 
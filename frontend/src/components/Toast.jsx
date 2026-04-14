import React, { useEffect } from 'react';
import './css/Toast.css';

const Toast = ({ id, message, type, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, onClose, duration]);

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '💬';
    }
  };

  return (
    <div className={`toast toast-${type}`}>
      <span style={{ marginRight: '10px' }}>{getIcon()}</span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={() => onClose(id)}>×</button>
    </div>
  );
};

export default Toast;

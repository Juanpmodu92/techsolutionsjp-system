import { createContext, useContext, useMemo, useState } from 'react';
import ToastContainer from '../components/feedback/ToastContainer';

const ToastContext = createContext(null);

function buildToast(title, message = '', type = 'info') {
  return {
    id: crypto.randomUUID(),
    title,
    message,
    type
  };
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function removeToast(id) {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }

  function showToast({ title, message = '', type = 'info', duration = 3500 }) {
    const toast = buildToast(title, message, type);

    setToasts((prev) => [...prev, toast]);

    window.setTimeout(() => {
      removeToast(toast.id);
    }, duration);
  }

  const value = useMemo(
    () => ({
      showToast,
      success(title, message = '') {
        showToast({ title, message, type: 'success' });
      },
      error(title, message = '') {
        showToast({ title, message, type: 'error' });
      },
      info(title, message = '') {
        showToast({ title, message, type: 'info' });
      }
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
}
import React, { createContext, useState, useCallback } from 'react';

export const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const dismissToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 2000,
        display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 340,
      }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            className="fade-in"
            onClick={() => dismissToast(t.id)}
            style={{
              padding: '14px 18px', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 500,
              cursor: 'pointer', boxShadow: 'var(--shadow-lg)',
              background: t.type === 'error' ? 'var(--error)' : t.type === 'warning' ? 'var(--warning)' : 'var(--success)',
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

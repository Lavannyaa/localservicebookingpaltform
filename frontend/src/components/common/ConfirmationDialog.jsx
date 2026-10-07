import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

export const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed with this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="450px">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '20px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          background: danger ? 'var(--danger-bg)' : 'var(--warning-bg)',
          color: danger ? 'var(--danger)' : 'var(--warning-text)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <AlertTriangle size={22} />
        </div>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
          {message}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <Button variant="secondary" onClick={onClose}>{cancelText}</Button>
        <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>{confirmText}</Button>
      </div>
    </Modal>
  );
};

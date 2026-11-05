import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) {
  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return <AlertCircle className="w-6 h-6 text-[#D64B4B] dark:text-rose-400" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-[#C58A27] dark:text-amber-400" />;
      default:
        return <Info className="w-6 h-6 text-[#3157D5] dark:text-[#6B8CFF]" />;
    }
  };

  const getIconBg = () => {
    switch (variant) {
      case 'danger':
        return 'bg-rose-50 border-rose-100 dark:bg-rose-950/40 dark:border-rose-900/60';
      case 'warning':
        return 'bg-amber-50 border-amber-100 dark:bg-amber-950/40 dark:border-amber-900/60';
      default:
        return 'bg-blue-50 border-blue-100 dark:bg-blue-950/40 dark:border-blue-900/60';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={isLoading ? undefined : onClose} maxWidth="max-w-md">
      <div className="flex items-start gap-4">
        <div className={`p-2.5 rounded-xl border shrink-0 ${getIconBg()}`}>{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-semibold text-[#172033] dark:text-[#F1F5F9]">{title}</h4>
          <p className="text-sm text-[#687386] dark:text-[#A0AEC0] mt-1.5 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#E6E9F0] dark:border-[#30394A]">
        <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button
          variant={variant === 'danger' ? 'danger' : 'primary'}
          size="sm"
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}


import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  const confirmColors = {
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white',
    default: 'bg-brand-500 hover:bg-brand-600 text-white',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[90]"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[91] flex items-center justify-center p-4"
          >
            <div
              className="bg-white rounded-card shadow-modal max-w-sm w-full p-6"
              role="dialog"
              aria-modal="true"
              aria-labelledby="dialog-title"
            >
              <div className="flex items-start gap-3">
                {variant !== 'default' && (
                  <div className={`p-2 rounded-full flex-shrink-0 ${variant === 'danger' ? 'bg-red-50' : 'bg-amber-50'}`}>
                    <AlertTriangle className={`w-5 h-5 ${variant === 'danger' ? 'text-red-500' : 'text-amber-500'}`} />
                  </div>
                )}
                <div className="flex-1">
                  <h3 id="dialog-title" className="font-semibold text-ink">
                    {title}
                  </h3>
                  <p className="text-sm text-ink-muted mt-1">{message}</p>
                </div>
                <button onClick={onCancel} className="btn-icon -mt-1 -mr-1" aria-label="Close">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-3 mt-5 justify-end">
                <button onClick={onCancel} className="btn-secondary text-sm px-4 py-2">
                  {cancelLabel}
                </button>
                <button
                  onClick={onConfirm}
                  className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-btn transition-colors ${confirmColors[variant]}`}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

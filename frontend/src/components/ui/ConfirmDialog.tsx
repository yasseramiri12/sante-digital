import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
}

const ConfirmDialog: React.FC<Props> = ({
  open, onClose, onConfirm, title = 'Confirmer la suppression',
  message, confirmLabel = 'Supprimer', loading,
}) => (
  <Modal
    open={open}
    onClose={onClose}
    title={title}
    size="sm"
    footer={
      <>
        <button onClick={onClose} className="btn-secondary" disabled={loading}>Annuler</button>
        <button onClick={onConfirm} className="btn-danger" disabled={loading}>
          {loading ? 'Suppression…' : confirmLabel}
        </button>
      </>
    }
  >
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
        <AlertTriangle size={18} className="text-red-600" />
      </div>
      <p className="text-sm text-slate-600 leading-relaxed pt-2">{message}</p>
    </div>
  </Modal>
);

export default ConfirmDialog;

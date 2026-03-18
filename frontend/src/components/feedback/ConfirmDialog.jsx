export default function ConfirmDialog({
  open,
  title = 'Confirmar acción',
  message = '¿Deseas continuar?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmVariant = 'danger',
  onConfirm,
  onCancel
}) {
  if (!open) return null;

  const confirmClasses =
    confirmVariant === 'danger'
      ? 'bg-red-600 hover:bg-red-700 text-white'
      : 'bg-slate-900 hover:bg-slate-800 text-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2 text-sm font-medium ${confirmClasses}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
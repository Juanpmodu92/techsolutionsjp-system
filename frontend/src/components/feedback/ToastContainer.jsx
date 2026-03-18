export default function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => {
        const colorClasses = {
          success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
          error: 'border-red-200 bg-red-50 text-red-800',
          info: 'border-slate-200 bg-white text-slate-800'
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-sm ${colorClasses[toast.type] || colorClasses.info}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.message ? (
                  <p className="mt-1 text-sm">{toast.message}</p>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => onRemove(toast.id)}
                className="text-xs font-medium opacity-70 hover:opacity-100"
              >
                Cerrar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
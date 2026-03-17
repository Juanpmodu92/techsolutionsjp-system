const statusLabels = {
  draft: 'Borrador',
  sent: 'Enviada',
  approved: 'Aprobada',
  rejected: 'Rechazada',
  expired: 'Expirada'
};

const transitions = {
  draft: ['sent', 'approved', 'rejected', 'expired'],
  sent: ['approved', 'rejected', 'expired'],
  approved: [],
  rejected: [],
  expired: []
};

export default function QuoteStatusActions({
  quote,
  onChangeStatus,
  processingId
}) {
  const nextStatuses = transitions[quote.status] ?? [];

  if (!nextStatuses.length) {
    return (
      <span className="text-xs text-slate-500">
        Estado final: {statusLabels[quote.status] || quote.status}
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {nextStatuses.map((status) => (
        <button
          key={status}
          type="button"
          disabled={processingId === quote.id}
          onClick={() => onChangeStatus(quote, status)}
          className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60"
        >
          {processingId === quote.id
            ? 'Procesando...'
            : `Pasar a ${statusLabels[status] || status}`}
        </button>
      ))}
    </div>
  );
}
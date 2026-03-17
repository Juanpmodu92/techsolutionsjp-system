const statusLabels = {
  received: 'Recibido',
  diagnosis: 'Diagnóstico',
  in_progress: 'En proceso',
  waiting_parts: 'Esperando repuestos',
  completed: 'Completado',
  delivered: 'Entregado',
  cancelled: 'Cancelado'
};

const transitions = {
  received: ['diagnosis', 'cancelled'],
  diagnosis: ['in_progress', 'waiting_parts', 'cancelled'],
  in_progress: ['waiting_parts', 'completed', 'cancelled'],
  waiting_parts: ['in_progress', 'cancelled'],
  completed: ['delivered'],
  delivered: [],
  cancelled: []
};

export default function TechnicalServiceStatusActions({
  technicalService,
  onChangeStatus,
  processingId
}) {
  const nextStatuses = transitions[technicalService.status] ?? [];

  if (!nextStatuses.length) {
    return (
      <span className="text-xs text-slate-500">
        Estado final: {statusLabels[technicalService.status] || technicalService.status}
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {nextStatuses.map((status) => (
        <button
          key={status}
          type="button"
          disabled={processingId === technicalService.id}
          onClick={() => onChangeStatus(technicalService, status)}
          className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60"
        >
          {processingId === technicalService.id
            ? 'Procesando...'
            : `Pasar a ${statusLabels[status] || status}`}
        </button>
      ))}
    </div>
  );
}
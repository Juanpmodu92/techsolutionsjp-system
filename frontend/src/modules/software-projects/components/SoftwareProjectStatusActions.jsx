const statusLabels = {
  quotation: 'Cotización',
  in_development: 'En desarrollo',
  testing: 'En pruebas',
  delivered: 'Entregado',
  finished: 'Finalizado',
  cancelled: 'Cancelado'
};

const transitions = {
  quotation: ['in_development', 'cancelled'],
  in_development: ['testing', 'cancelled'],
  testing: ['delivered', 'in_development', 'cancelled'],
  delivered: ['finished'],
  finished: [],
  cancelled: []
};

export default function SoftwareProjectStatusActions({
  project,
  onChangeStatus,
  processingId
}) {
  const nextStatuses = transitions[project.status] ?? [];

  if (!nextStatuses.length) {
    return (
      <span className="text-xs text-slate-500">
        Estado final: {statusLabels[project.status] || project.status}
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {nextStatuses.map((status) => (
        <button
          key={status}
          type="button"
          disabled={processingId === project.id}
          onClick={() => onChangeStatus(project, status)}
          className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60"
        >
          {processingId === project.id
            ? 'Procesando...'
            : `Pasar a ${statusLabels[status] || status}`}
        </button>
      ))}
    </div>
  );
}
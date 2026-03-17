import TechnicalServiceStatusActions from './TechnicalServiceStatusActions';

function getClientName(item) {
  if (item.client_type === 'company') {
    return item.company_name;
  }

  return `${item.first_name ?? ''} ${item.last_name ?? ''}`.trim();
}

function getStatusBadgeClass(status) {
  const classes = {
    received: 'bg-slate-200 text-slate-700',
    diagnosis: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-indigo-100 text-indigo-700',
    waiting_parts: 'bg-amber-100 text-amber-700',
    completed: 'bg-emerald-100 text-emerald-700',
    delivered: 'bg-emerald-200 text-emerald-800',
    cancelled: 'bg-red-100 text-red-700'
  };

  return classes[status] || 'bg-slate-200 text-slate-700';
}

export default function TechnicalServicesTable({
  technicalServices,
  selectedTechnicalServiceId,
  onSelectTechnicalService,
  onChangeStatus,
  processingId
}) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="px-4 py-3">Ticket</th>
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Equipo</th>
            <th className="px-4 py-3">Tipo</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Costo</th>
            <th className="px-4 py-3">Acciones</th>
            <th className="px-4 py-3">Detalle</th>
          </tr>
        </thead>
        <tbody>
          {technicalServices.length ? (
            technicalServices.map((item) => (
              <tr key={item.id} className="border-b border-slate-100 align-top">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {item.ticket_number}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {getClientName(item)}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  <div>{item.device_type}</div>
                  <div className="text-xs text-slate-500">
                    {[item.device_brand, item.device_model].filter(Boolean).join(' ')}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700">{item.service_type}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeClass(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-700">
                  $ {Number(item.service_cost).toLocaleString('es-CO')}
                </td>
                <td className="px-4 py-3">
                  <TechnicalServiceStatusActions
                    technicalService={item}
                    onChangeStatus={onChangeStatus}
                    processingId={processingId}
                  />
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onSelectTechnicalService(item)}
                    className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    {selectedTechnicalServiceId === item.id ? 'Viendo' : 'Ver detalle'}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="px-4 py-6 text-center text-slate-500">
                No hay órdenes técnicas para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
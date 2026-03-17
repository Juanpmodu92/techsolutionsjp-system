function formatMoney(value) {
  return `$ ${Number(value).toLocaleString('es-CO')}`;
}

function getCategoryLabel(category) {
  const labels = {
    maintenance: 'Mantenimiento',
    installation: 'Instalación',
    diagnostic: 'Diagnóstico',
    network: 'Redes',
    software: 'Software',
    infrastructure: 'Infraestructura'
  };

  return labels[category] || category;
}

export default function ServicesTable({
  services,
  onEdit,
  onDeactivate,
  onActivate,
  isProcessingId
}) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="px-4 py-3">Servicio</th>
            <th className="px-4 py-3">Categoría</th>
            <th className="px-4 py-3">Precio base</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {services.length ? (
            services.map((service) => (
              <tr key={service.id} className="border-b border-slate-100">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">{service.name}</div>
                  <div className="text-xs text-slate-500">
                    {service.description || 'Sin descripción'}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {getCategoryLabel(service.category)}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {formatMoney(service.base_price)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      service.is_active
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {service.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(service)}
                      className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Editar
                    </button>

                    {service.is_active ? (
                      <button
                        onClick={() => onDeactivate(service)}
                        disabled={isProcessingId === service.id}
                        className="rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                      >
                        {isProcessingId === service.id
                          ? 'Procesando...'
                          : 'Desactivar'}
                      </button>
                    ) : (
                      <button
                        onClick={() => onActivate(service)}
                        disabled={isProcessingId === service.id}
                        className="rounded-lg border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
                      >
                        {isProcessingId === service.id
                          ? 'Procesando...'
                          : 'Activar'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-4 py-6 text-center text-slate-500">
                No hay servicios para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
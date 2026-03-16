export default function ClientsTable({
  clients,
  onEdit,
  onDeactivate,
  onActivate,
  isProcessingId
}) {
  function getClientName(client) {
    if (client.client_type === 'company') {
      return client.company_name;
    }

    return `${client.first_name ?? ''} ${client.last_name ?? ''}`.trim();
  }

  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Tipo</th>
            <th className="px-4 py-3">Correo</th>
            <th className="px-4 py-3">Teléfono</th>
            <th className="px-4 py-3">Ciudad</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.length ? (
            clients.map((client) => (
              <tr key={client.id} className="border-b border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {getClientName(client)}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {client.client_type === 'company' ? 'Empresa' : 'Persona'}
                </td>
                <td className="px-4 py-3 text-slate-700">{client.email || '-'}</td>
                <td className="px-4 py-3 text-slate-700">{client.phone || '-'}</td>
                <td className="px-4 py-3 text-slate-700">{client.city || '-'}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      client.is_active
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {client.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(client)}
                      className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Editar
                    </button>

                    {client.is_active ? (
                      <button
                        onClick={() => onDeactivate(client)}
                        disabled={isProcessingId === client.id}
                        className="rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                      >
                        {isProcessingId === client.id ? 'Procesando...' : 'Desactivar'}
                      </button>
                    ) : (
                      <button
                        onClick={() => onActivate(client)}
                        disabled={isProcessingId === client.id}
                        className="rounded-lg border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
                      >
                        {isProcessingId === client.id ? 'Procesando...' : 'Activar'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="px-4 py-6 text-center text-slate-500">
                No hay clientes para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
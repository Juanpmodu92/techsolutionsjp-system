function getRoleLabel(role) {
  const labels = {
    admin: 'Administrador',
    seller: 'Vendedor',
    technician: 'Técnico',
    developer: 'Desarrollador'
  };

  return labels[role] || role;
}

export default function UsersTable({
  users,
  onEdit,
  onActivate,
  onDeactivate,
  isProcessingId
}) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="px-4 py-3">Usuario</th>
            <th className="px-4 py-3">Correo</th>
            <th className="px-4 py-3">Rol</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.length ? (
            users.map((user) => (
              <tr key={user.id} className="border-b border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {user.first_name} {user.last_name}
                </td>
                <td className="px-4 py-3 text-slate-700">{user.email}</td>
                <td className="px-4 py-3 text-slate-700">
                  {getRoleLabel(user.role)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      user.is_active
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {user.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Editar
                    </button>

                    {user.is_active ? (
                      <button
                        onClick={() => onDeactivate(user)}
                        disabled={isProcessingId === user.id}
                        className="rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                      >
                        {isProcessingId === user.id ? 'Procesando...' : 'Desactivar'}
                      </button>
                    ) : (
                      <button
                        onClick={() => onActivate(user)}
                        disabled={isProcessingId === user.id}
                        className="rounded-lg border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
                      >
                        {isProcessingId === user.id ? 'Procesando...' : 'Activar'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-4 py-6 text-center text-slate-500">
                No hay usuarios para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
function getTypeLabel(type) {
  const labels = {
    entry: 'Entrada',
    exit: 'Salida',
    adjustment: 'Ajuste'
  };

  return labels[type] || type;
}

function getTypeBadgeClass(type) {
  const classes = {
    entry: 'bg-emerald-100 text-emerald-700',
    exit: 'bg-red-100 text-red-700',
    adjustment: 'bg-amber-100 text-amber-700'
  };

  return classes[type] || 'bg-slate-200 text-slate-700';
}

export default function InventoryMovementsTable({ movements }) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3">Producto</th>
            <th className="px-4 py-3">Tipo</th>
            <th className="px-4 py-3">Cantidad</th>
            <th className="px-4 py-3">Stock anterior</th>
            <th className="px-4 py-3">Stock nuevo</th>
            <th className="px-4 py-3">Motivo</th>
            <th className="px-4 py-3">Usuario</th>
          </tr>
        </thead>
        <tbody>
          {movements.length ? (
            movements.map((movement) => (
              <tr key={movement.id} className="border-b border-slate-100">
                <td className="px-4 py-3 text-slate-700">
                  {new Date(movement.created_at).toLocaleString('es-CO')}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">
                    {movement.product_name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {movement.product_sku || '-'}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getTypeBadgeClass(
                      movement.movement_type
                    )}`}
                  >
                    {getTypeLabel(movement.movement_type)}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-700">{movement.quantity}</td>
                <td className="px-4 py-3 text-slate-700">
                  {movement.previous_stock}
                </td>
                <td className="px-4 py-3 text-slate-700">{movement.new_stock}</td>
                <td className="px-4 py-3 text-slate-700">
                  {movement.reason || '-'}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {movement.created_by_first_name
                    ? `${movement.created_by_first_name} ${movement.created_by_last_name ?? ''}`.trim()
                    : '-'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="px-4 py-6 text-center text-slate-500">
                No hay movimientos para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
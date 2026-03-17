export default function InventorySummaryCard({ data }) {
  const totals = data?.totals ?? {};
  const lowStockProducts = data?.low_stock_products ?? [];
  const recentMovements = data?.recent_movements ?? [];

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">
        Resumen de inventario
      </h3>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Total productos</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {totals.total_products ?? 0}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Productos activos</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {totals.active_products ?? 0}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <h4 className="text-sm font-semibold text-slate-900">
          Productos con stock bajo
        </h4>

        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-3 py-2">SKU</th>
                <th className="px-3 py-2">Producto</th>
                <th className="px-3 py-2">Stock</th>
                <th className="px-3 py-2">Mínimo</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.length ? (
                lowStockProducts.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100">
                    <td className="px-3 py-3 text-slate-700">{item.sku || '-'}</td>
                    <td className="px-3 py-3 text-slate-900">{item.name}</td>
                    <td className="px-3 py-3 text-slate-700">
                      {item.stock_quantity}
                    </td>
                    <td className="px-3 py-3 text-slate-700">
                      {item.minimum_stock}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-3 py-4 text-center text-slate-500">
                    Sin alertas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-semibold text-slate-900">
          Movimientos recientes
        </h4>

        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-3 py-2">Producto</th>
                <th className="px-3 py-2">Tipo</th>
                <th className="px-3 py-2">Cantidad</th>
                <th className="px-3 py-2">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {recentMovements.length ? (
                recentMovements.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100">
                    <td className="px-3 py-3 text-slate-900">{item.product_name}</td>
                    <td className="px-3 py-3 text-slate-700">{item.movement_type}</td>
                    <td className="px-3 py-3 text-slate-700">{item.quantity}</td>
                    <td className="px-3 py-3 text-slate-700">
                      {new Date(item.created_at).toLocaleString('es-CO')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-3 py-4 text-center text-slate-500">
                    Sin movimientos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
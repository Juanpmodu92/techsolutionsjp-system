function money(value) {
  return `$ ${Number(value || 0).toLocaleString('es-CO')}`;
}

export default function SalesSummaryCard({ data }) {
  const totals = data?.totals ?? {};
  const byDay = data?.by_day ?? [];

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Resumen de ventas</h3>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Total ventas</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {totals.total_sales ?? 0}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Monto vendido</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {money(totals.total_amount)}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Ticket promedio</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {money(totals.average_ticket)}
          </p>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="px-3 py-2">Fecha</th>
              <th className="px-3 py-2">Ventas</th>
              <th className="px-3 py-2">Monto</th>
            </tr>
          </thead>
          <tbody>
            {byDay.length ? (
              byDay.map((item) => (
                <tr key={item.sale_date} className="border-b border-slate-100">
                  <td className="px-3 py-3 text-slate-700">
                    {new Date(item.sale_date).toLocaleDateString('es-CO')}
                  </td>
                  <td className="px-3 py-3 text-slate-700">{item.total_sales}</td>
                  <td className="px-3 py-3 text-slate-700">
                    {money(item.total_amount)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-3 py-4 text-center text-slate-500">
                  Sin datos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
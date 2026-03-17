function money(value) {
  return `$ ${Number(value || 0).toLocaleString('es-CO')}`;
}

export default function TechnicalServicesSummaryCard({ data }) {
  const totals = data?.totals ?? {};
  const byStatus = data?.by_status ?? [];

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">
        Resumen de servicio técnico
      </h3>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Órdenes técnicas</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {totals.total_technical_services ?? 0}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Monto estimado</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {money(totals.total_estimated_amount)}
          </p>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {byStatus.length ? (
              byStatus.map((item) => (
                <tr key={item.status} className="border-b border-slate-100">
                  <td className="px-3 py-3 text-slate-700">{item.status}</td>
                  <td className="px-3 py-3 text-slate-700">{item.total}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="px-3 py-4 text-center text-slate-500">
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
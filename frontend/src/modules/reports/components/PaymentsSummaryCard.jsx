function money(value) {
  return `$ ${Number(value || 0).toLocaleString('es-CO')}`;
}

function methodLabel(method) {
  const labels = {
    cash: 'Efectivo',
    bank_transfer: 'Transferencia',
    card: 'Tarjeta',
    nequi: 'Nequi',
    daviplata: 'Daviplata',
    other: 'Otro'
  };

  return labels[method] || method;
}

export default function PaymentsSummaryCard({ data }) {
  const totals = data?.totals ?? {};
  const byMethod = data?.by_method ?? [];

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Resumen de pagos</h3>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Total pagos</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {totals.total_payments ?? 0}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Total recaudado</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {money(totals.total_amount)}
          </p>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="px-3 py-2">Método</th>
              <th className="px-3 py-2">Pagos</th>
              <th className="px-3 py-2">Monto</th>
            </tr>
          </thead>
          <tbody>
            {byMethod.length ? (
              byMethod.map((item) => (
                <tr key={item.payment_method} className="border-b border-slate-100">
                  <td className="px-3 py-3 text-slate-700">
                    {methodLabel(item.payment_method)}
                  </td>
                  <td className="px-3 py-3 text-slate-700">
                    {item.total_payments}
                  </td>
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
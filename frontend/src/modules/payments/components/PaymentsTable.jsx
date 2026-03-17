function getClientName(payment) {
  if (payment.client_type === 'company') {
    return payment.company_name;
  }

  return `${payment.first_name ?? ''} ${payment.last_name ?? ''}`.trim();
}

function getPaymentMethodLabel(method) {
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

export default function PaymentsTable({ payments }) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="px-4 py-3">Pago</th>
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Destino</th>
            <th className="px-4 py-3">Método</th>
            <th className="px-4 py-3">Monto</th>
            <th className="px-4 py-3">Referencia</th>
            <th className="px-4 py-3">Recibido por</th>
            <th className="px-4 py-3">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {payments.length ? (
            payments.map((payment) => (
              <tr key={payment.id} className="border-b border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {payment.payment_number}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {getClientName(payment)}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {payment.sale_number || payment.ticket_number || '-'}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {getPaymentMethodLabel(payment.payment_method)}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  $ {Number(payment.amount).toLocaleString('es-CO')}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {payment.reference || '-'}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {payment.received_by_first_name
                    ? `${payment.received_by_first_name} ${payment.received_by_last_name ?? ''}`.trim()
                    : '-'}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {new Date(payment.payment_date).toLocaleDateString('es-CO')}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="px-4 py-6 text-center text-slate-500">
                No hay pagos para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
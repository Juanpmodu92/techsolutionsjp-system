import QuoteStatusActions from './QuoteStatusActions';

function getClientName(quote) {
  if (quote.client_type === 'company') {
    return quote.company_name;
  }

  return `${quote.first_name ?? ''} ${quote.last_name ?? ''}`.trim();
}

function getStatusBadgeClass(status) {
  const classes = {
    draft: 'bg-slate-200 text-slate-700',
    sent: 'bg-blue-100 text-blue-700',
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
    expired: 'bg-amber-100 text-amber-700'
  };

  return classes[status] || 'bg-slate-200 text-slate-700';
}

export default function QuotesTable({
  quotes,
  selectedQuoteId,
  onSelectQuote,
  onChangeStatus,
  processingId
}) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="px-4 py-3">Número</th>
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Acciones</th>
            <th className="px-4 py-3">Detalle</th>
          </tr>
        </thead>
        <tbody>
          {quotes.length ? (
            quotes.map((quote) => (
              <tr key={quote.id} className="border-b border-slate-100 align-top">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {quote.quote_number}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {getClientName(quote)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeClass(
                      quote.status
                    )}`}
                  >
                    {quote.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-700">
                  $ {Number(quote.total).toLocaleString('es-CO')}
                </td>
                <td className="px-4 py-3">
                  <QuoteStatusActions
                    quote={quote}
                    onChangeStatus={onChangeStatus}
                    processingId={processingId}
                  />
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onSelectQuote(quote)}
                    className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    {selectedQuoteId === quote.id ? 'Viendo' : 'Ver detalle'}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-4 py-6 text-center text-slate-500">
                No hay cotizaciones para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
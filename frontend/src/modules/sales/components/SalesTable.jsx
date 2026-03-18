import { formatClientName, formatCurrency } from "../../../utils/format";

export default function SalesTable({ sales, selectedSaleId, onSelectSale }) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="px-4 py-3">Número</th>
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Detalle</th>
          </tr>
        </thead>
        <tbody>
          {sales.length ? (
            sales.map((sale) => (
              <tr key={sale.id} className="border-b border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {sale.sale_number}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {formatClientName(sale)}
                </td>
                <td className="px-4 py-3 text-slate-700">{sale.status}</td>
                <td className="px-4 py-3 text-slate-700">
                  {formatCurrency(sale.total)}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onSelectSale(sale)}
                    className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    {selectedSaleId === sale.id ? "Viendo" : "Ver detalle"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-4 py-6 text-center text-slate-500">
                No hay ventas para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

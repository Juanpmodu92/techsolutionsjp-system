function formatMoney(value) {
  return `$ ${Number(value).toLocaleString('es-CO')}`;
}

export default function ProductsTable({
  products,
  onEdit,
  onDeactivate,
  isProcessingId
}) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="px-4 py-3">SKU</th>
            <th className="px-4 py-3">Producto</th>
            <th className="px-4 py-3">Categoría</th>
            <th className="px-4 py-3">Costo</th>
            <th className="px-4 py-3">Precio</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Mínimo</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.length ? (
            products.map((product) => (
              <tr key={product.id} className="border-b border-slate-100">
                <td className="px-4 py-3 text-slate-700">{product.sku || '-'}</td>
                <td className="px-4 py-3 font-medium text-slate-900">
                  {product.name}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {product.category_name || '-'}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {formatMoney(product.cost)}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {formatMoney(product.price)}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {product.stock_quantity}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {product.minimum_stock}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      product.is_active
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {product.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Editar
                    </button>

                    {product.is_active ? (
                      <button
                        onClick={() => onDeactivate(product)}
                        disabled={isProcessingId === product.id}
                        className="rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                      >
                        {isProcessingId === product.id
                          ? 'Procesando...'
                          : 'Desactivar'}
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="px-4 py-6 text-center text-slate-500">
                No hay productos para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
import { useMemo, useState } from 'react';

const movementOptions = [
  { value: 'entry', label: 'Entrada' },
  { value: 'exit', label: 'Salida' },
  { value: 'adjustment', label: 'Ajuste' }
];

export default function InventoryMovementForm({
  products,
  onSubmit,
  isSubmitting
}) {
  const [form, setForm] = useState({
    product_id: '',
    movement_type: 'entry',
    quantity: '',
    reason: ''
  });

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === form.product_id) || null,
    [products, form.product_id]
  );

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit({
      product_id: form.product_id,
      movement_type: form.movement_type,
      quantity: Number(form.quantity),
      reason: form.reason.trim() || undefined
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Producto
        </label>
        <select
          className="w-full rounded-xl border border-slate-300 px-4 py-2"
          value={form.product_id}
          onChange={(e) => updateField('product_id', e.target.value)}
        >
          <option value="">Selecciona un producto</option>
          {products
            .filter((product) => product.is_active)
            .map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} {product.sku ? `(${product.sku})` : ''}
              </option>
            ))}
        </select>
      </div>

      {selectedProduct ? (
        <div className="rounded-2xl bg-slate-100 p-4 text-sm">
          <p className="text-slate-500">Stock actual</p>
          <p className="text-xl font-bold text-slate-900">
            {selectedProduct.stock_quantity}
          </p>
          <p className="mt-1 text-slate-500">
            Stock mínimo: {selectedProduct.minimum_stock}
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Tipo de movimiento
          </label>
          <select
            className="w-full rounded-xl border border-slate-300 px-4 py-2"
            value={form.movement_type}
            onChange={(e) => updateField('movement_type', e.target.value)}
          >
            {movementOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            {form.movement_type === 'adjustment' ? 'Nuevo stock' : 'Cantidad'}
          </label>
          <input
            type="number"
            min="1"
            className="w-full rounded-xl border border-slate-300 px-4 py-2"
            value={form.quantity}
            onChange={(e) => updateField('quantity', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Motivo
        </label>
        <textarea
          rows="3"
          className="w-full rounded-xl border border-slate-300 px-4 py-2"
          value={form.reason}
          onChange={(e) => updateField('reason', e.target.value)}
          placeholder="Ingreso inicial, ajuste por conteo, venta mostrador..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {isSubmitting ? 'Guardando...' : 'Registrar movimiento'}
      </button>
    </form>
  );
}
import { useEffect, useState } from 'react';

const initialForm = {
  category_id: '',
  sku: '',
  name: '',
  description: '',
  cost: '',
  price: '',
  stock_quantity: '',
  minimum_stock: ''
};

export default function ProductForm({
  categories,
  mode = 'create',
  initialValues = null,
  onSubmit,
  onCancel,
  isSubmitting
}) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (initialValues) {
      setForm({
        category_id: initialValues.category_id ?? '',
        sku: initialValues.sku ?? '',
        name: initialValues.name ?? '',
        description: initialValues.description ?? '',
        cost: initialValues.cost ?? '',
        price: initialValues.price ?? '',
        stock_quantity: initialValues.stock_quantity ?? '',
        minimum_stock: initialValues.minimum_stock ?? ''
      });
    } else {
      setForm(initialForm);
    }
  }, [initialValues]);

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit({
      category_id: form.category_id || null,
      sku: form.sku.trim() || undefined,
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      cost: Number(form.cost),
      price: Number(form.price),
      stock_quantity: Number(form.stock_quantity),
      minimum_stock: Number(form.minimum_stock)
    });
  }

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Categoría
        </label>
        <select
          className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
          value={form.category_id}
          onChange={(e) => updateField('category_id', e.target.value)}
        >
          <option value="">Sin categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            SKU
          </label>
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
            value={form.sku}
            onChange={(e) => updateField('sku', e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Nombre
          </label>
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Descripción
        </label>
        <textarea
          rows="3"
          className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Costo
          </label>
          <input
            type="number"
            className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
            value={form.cost}
            onChange={(e) => updateField('cost', e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Precio
          </label>
          <input
            type="number"
            className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
            value={form.price}
            onChange={(e) => updateField('price', e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Stock actual
          </label>
          <input
            type="number"
            className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
            value={form.stock_quantity}
            onChange={(e) => updateField('stock_quantity', e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Stock mínimo
          </label>
          <input
            type="number"
            className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
            value={form.minimum_stock}
            onChange={(e) => updateField('minimum_stock', e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {isSubmitting
            ? 'Guardando...'
            : mode === 'edit'
              ? 'Actualizar producto'
              : 'Crear producto'}
        </button>

        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Cancelar
          </button>
        ) : null}
      </div>
    </form>
  );
}
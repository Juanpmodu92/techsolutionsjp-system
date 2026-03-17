import { useEffect, useState } from 'react';

const initialForm = {
  name: '',
  description: '',
  category: 'installation',
  base_price: ''
};

const categoryOptions = [
  { value: 'maintenance', label: 'Mantenimiento' },
  { value: 'installation', label: 'Instalación' },
  { value: 'diagnostic', label: 'Diagnóstico' },
  { value: 'network', label: 'Redes' },
  { value: 'software', label: 'Software' },
  { value: 'infrastructure', label: 'Infraestructura' }
];

export default function ServiceForm({
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
        name: initialValues.name ?? '',
        description: initialValues.description ?? '',
        category: initialValues.category ?? 'installation',
        base_price: initialValues.base_price ?? ''
      });
    } else {
      setForm(initialForm);
    }
  }, [initialValues]);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit({
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      category: form.category,
      base_price: Number(form.base_price)
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
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

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Categoría
          </label>
          <select
            className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
            value={form.category}
            onChange={(e) => updateField('category', e.target.value)}
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Precio base
          </label>
          <input
            type="number"
            className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
            value={form.base_price}
            onChange={(e) => updateField('base_price', e.target.value)}
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
              ? 'Actualizar servicio'
              : 'Crear servicio'}
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
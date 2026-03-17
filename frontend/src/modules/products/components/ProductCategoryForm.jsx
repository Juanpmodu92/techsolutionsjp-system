import { useState } from 'react';

export default function ProductCategoryForm({ onSubmit, isSubmitting }) {
  const [form, setForm] = useState({
    name: '',
    description: ''
  });

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit({
      name: form.name.trim(),
      description: form.description.trim() || undefined
    });

    setForm({
      name: '',
      description: ''
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Nombre de categoría
        </label>
        <input
          className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
          value={form.name}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="SSD"
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
          onChange={(e) =>
            setForm((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Unidades de estado sólido"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {isSubmitting ? 'Guardando...' : 'Crear categoría'}
      </button>
    </form>
  );
}
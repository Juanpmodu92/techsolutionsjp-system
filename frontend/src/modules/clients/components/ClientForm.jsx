import { useEffect, useState } from 'react';

const initialForm = {
  client_type: 'person',
  first_name: '',
  last_name: '',
  company_name: '',
  document_number: '',
  tax_id: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  notes: ''
};

export default function ClientForm({
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
        client_type: initialValues.client_type ?? 'person',
        first_name: initialValues.first_name ?? '',
        last_name: initialValues.last_name ?? '',
        company_name: initialValues.company_name ?? '',
        document_number: initialValues.document_number ?? '',
        tax_id: initialValues.tax_id ?? '',
        phone: initialValues.phone ?? '',
        email: initialValues.email ?? '',
        address: initialValues.address ?? '',
        city: initialValues.city ?? '',
        notes: initialValues.notes ?? ''
      });
    } else {
      setForm(initialForm);
    }
  }, [initialValues]);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function buildPayload() {
    return {
      client_type: form.client_type,
      first_name: form.first_name.trim() || undefined,
      last_name: form.last_name.trim() || undefined,
      company_name: form.company_name.trim() || undefined,
      document_number: form.document_number.trim() || undefined,
      tax_id: form.tax_id.trim() || undefined,
      phone: form.phone.trim() || undefined,
      email: form.email.trim() || undefined,
      address: form.address.trim() || undefined,
      city: form.city.trim() || undefined,
      notes: form.notes.trim() || undefined
    };
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(buildPayload());
  }

  const isPerson = form.client_type === 'person';

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Tipo de cliente
        </label>
        <select
          className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
          value={form.client_type}
          onChange={(e) => updateField('client_type', e.target.value)}
        >
          <option value="person">Persona</option>
          <option value="company">Empresa</option>
        </select>
      </div>

      {isPerson ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Nombres
            </label>
            <input
              className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
              value={form.first_name}
              onChange={(e) => updateField('first_name', e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Apellidos
            </label>
            <input
              className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
              value={form.last_name}
              onChange={(e) => updateField('last_name', e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Razón social
          </label>
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
            value={form.company_name}
            onChange={(e) => updateField('company_name', e.target.value)}
          />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Documento
          </label>
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
            value={form.document_number}
            onChange={(e) => updateField('document_number', e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            NIT
          </label>
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
            value={form.tax_id}
            onChange={(e) => updateField('tax_id', e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Teléfono
          </label>
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
            value={form.phone}
            onChange={(e) => updateField('phone', e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Correo
          </label>
          <input
            type="email"
            className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Dirección
          </label>
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
            value={form.address}
            onChange={(e) => updateField('address', e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Ciudad
          </label>
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
            value={form.city}
            onChange={(e) => updateField('city', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Notas
        </label>
        <textarea
          rows="3"
          className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
          value={form.notes}
          onChange={(e) => updateField('notes', e.target.value)}
        />
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
              ? 'Actualizar cliente'
              : 'Crear cliente'}
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
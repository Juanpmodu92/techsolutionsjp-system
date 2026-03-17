import { useMemo, useState } from 'react';

const projectTypeOptions = [
  { value: 'landing_page', label: 'Landing page' },
  { value: 'corporate_website', label: 'Web corporativa' },
  { value: 'web_system', label: 'Sistema web' },
  { value: 'ecommerce', label: 'Ecommerce' },
  { value: 'blog', label: 'Blog' },
  { value: 'wordpress', label: 'WordPress' }
];

const stackOptions = [
  { value: 'html_css_js', label: 'HTML/CSS/JS' },
  { value: 'react_node', label: 'React + Node' },
  { value: 'wordpress', label: 'WordPress' },
  { value: 'other', label: 'Otro' }
];

export default function SoftwareProjectForm({
  clients,
  quotes,
  onSubmit,
  isSubmitting
}) {
  const [form, setForm] = useState({
    client_id: '',
    quote_id: '',
    name: '',
    project_type: 'landing_page',
    stack: 'react_node',
    description: '',
    scope: '',
    start_date: '',
    estimated_delivery_date: '',
    total_cost: '',
    notes: ''
  });

  const filteredQuotes = useMemo(() => {
    if (!form.client_id) return [];
    return quotes.filter((quote) => quote.client_id === form.client_id);
  }, [quotes, form.client_id]);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit({
      client_id: form.client_id,
      quote_id: form.quote_id || null,
      name: form.name.trim(),
      project_type: form.project_type,
      stack: form.stack,
      description: form.description.trim() || undefined,
      scope: form.scope.trim() || undefined,
      start_date: form.start_date || null,
      estimated_delivery_date: form.estimated_delivery_date || null,
      total_cost: Number(form.total_cost),
      notes: form.notes.trim() || undefined
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Cliente
          </label>
          <select
            className="w-full rounded-xl border border-slate-300 px-4 py-2"
            value={form.client_id}
            onChange={(e) => updateField('client_id', e.target.value)}
          >
            <option value="">Selecciona un cliente</option>
            {clients
              .filter((client) => client.is_active)
              .map((client) => (
                <option key={client.id} value={client.id}>
                  {client.client_type === 'company'
                    ? client.company_name
                    : `${client.first_name ?? ''} ${client.last_name ?? ''}`.trim()}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Cotización opcional
          </label>
          <select
            className="w-full rounded-xl border border-slate-300 px-4 py-2"
            value={form.quote_id}
            onChange={(e) => updateField('quote_id', e.target.value)}
          >
            <option value="">Sin cotización</option>
            {filteredQuotes.map((quote) => (
              <option key={quote.id} value={quote.id}>
                {quote.quote_number}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Nombre del proyecto
          </label>
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-2"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Costo total
          </label>
          <input
            type="number"
            min="0"
            className="w-full rounded-xl border border-slate-300 px-4 py-2"
            value={form.total_cost}
            onChange={(e) => updateField('total_cost', e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Tipo de proyecto
          </label>
          <select
            className="w-full rounded-xl border border-slate-300 px-4 py-2"
            value={form.project_type}
            onChange={(e) => updateField('project_type', e.target.value)}
          >
            {projectTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Stack
          </label>
          <select
            className="w-full rounded-xl border border-slate-300 px-4 py-2"
            value={form.stack}
            onChange={(e) => updateField('stack', e.target.value)}
          >
            {stackOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Fecha inicio
          </label>
          <input
            type="date"
            className="w-full rounded-xl border border-slate-300 px-4 py-2"
            value={form.start_date}
            onChange={(e) => updateField('start_date', e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Entrega estimada
          </label>
          <input
            type="date"
            className="w-full rounded-xl border border-slate-300 px-4 py-2"
            value={form.estimated_delivery_date}
            onChange={(e) =>
              updateField('estimated_delivery_date', e.target.value)
            }
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Descripción
        </label>
        <textarea
          rows="3"
          className="w-full rounded-xl border border-slate-300 px-4 py-2"
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Alcance
        </label>
        <textarea
          rows="3"
          className="w-full rounded-xl border border-slate-300 px-4 py-2"
          value={form.scope}
          onChange={(e) => updateField('scope', e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Notas
        </label>
        <input
          className="w-full rounded-xl border border-slate-300 px-4 py-2"
          value={form.notes}
          onChange={(e) => updateField('notes', e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {isSubmitting ? 'Guardando...' : 'Crear proyecto'}
      </button>
    </form>
  );
}
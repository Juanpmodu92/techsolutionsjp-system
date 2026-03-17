import { useState } from 'react';

const serviceTypeOptions = [
  { value: 'maintenance', label: 'Mantenimiento' },
  { value: 'diagnostic', label: 'Diagnóstico' },
  { value: 'installation', label: 'Instalación' },
  { value: 'repair', label: 'Reparación' },
  { value: 'upgrade', label: 'Actualización' },
  { value: 'network', label: 'Redes' }
];

export default function TechnicalServiceForm({
  clients,
  products,
  onSubmit,
  isSubmitting
}) {
  const [form, setForm] = useState({
    client_id: '',
    related_product_id: '',
    service_type: 'maintenance',
    device_type: '',
    device_brand: '',
    device_model: '',
    serial_number: '',
    problem_description: '',
    estimated_delivery_date: '',
    service_cost: '',
    notes: ''
  });

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit({
      client_id: form.client_id,
      related_product_id: form.related_product_id || null,
      service_type: form.service_type,
      device_type: form.device_type.trim(),
      device_brand: form.device_brand.trim() || undefined,
      device_model: form.device_model.trim() || undefined,
      serial_number: form.serial_number.trim() || undefined,
      problem_description: form.problem_description.trim(),
      estimated_delivery_date: form.estimated_delivery_date || null,
      service_cost: Number(form.service_cost || 0),
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
            Producto relacionado
          </label>
          <select
            className="w-full rounded-xl border border-slate-300 px-4 py-2"
            value={form.related_product_id}
            onChange={(e) => updateField('related_product_id', e.target.value)}
          >
            <option value="">Sin producto relacionado</option>
            {products
              .filter((product) => product.is_active)
              .map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Tipo de servicio
          </label>
          <select
            className="w-full rounded-xl border border-slate-300 px-4 py-2"
            value={form.service_type}
            onChange={(e) => updateField('service_type', e.target.value)}
          >
            {serviceTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Tipo de equipo
          </label>
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-2"
            value={form.device_type}
            onChange={(e) => updateField('device_type', e.target.value)}
            placeholder="Laptop"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Marca
          </label>
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-2"
            value={form.device_brand}
            onChange={(e) => updateField('device_brand', e.target.value)}
            placeholder="Lenovo"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Modelo
          </label>
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-2"
            value={form.device_model}
            onChange={(e) => updateField('device_model', e.target.value)}
            placeholder="ThinkPad T480"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Serial
          </label>
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-2"
            value={form.serial_number}
            onChange={(e) => updateField('serial_number', e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Costo del servicio
          </label>
          <input
            type="number"
            min="0"
            className="w-full rounded-xl border border-slate-300 px-4 py-2"
            value={form.service_cost}
            onChange={(e) => updateField('service_cost', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Descripción del problema
        </label>
        <textarea
          rows="4"
          className="w-full rounded-xl border border-slate-300 px-4 py-2"
          value={form.problem_description}
          onChange={(e) => updateField('problem_description', e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Fecha estimada de entrega
          </label>
          <input
            type="date"
            className="w-full rounded-xl border border-slate-300 px-4 py-2"
            value={form.estimated_delivery_date}
            onChange={(e) => updateField('estimated_delivery_date', e.target.value)}
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
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {isSubmitting ? 'Guardando...' : 'Crear orden técnica'}
      </button>
    </form>
  );
}
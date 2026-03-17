import { useMemo, useState } from 'react';

const paymentMethodOptions = [
  { value: 'cash', label: 'Efectivo' },
  { value: 'bank_transfer', label: 'Transferencia' },
  { value: 'card', label: 'Tarjeta' },
  { value: 'nequi', label: 'Nequi' },
  { value: 'daviplata', label: 'Daviplata' },
  { value: 'other', label: 'Otro' }
];

export default function PaymentForm({
  clients,
  sales,
  technicalServices,
  onSubmit,
  isSubmitting
}) {
  const [form, setForm] = useState({
    client_id: '',
    target_type: 'sale',
    sale_id: '',
    technical_service_id: '',
    payment_method: 'cash',
    amount: '',
    reference: '',
    notes: ''
  });

  const filteredSales = useMemo(() => {
    if (!form.client_id) return [];
    return sales.filter((sale) => sale.client_id === form.client_id);
  }, [sales, form.client_id]);

  const filteredTechnicalServices = useMemo(() => {
    if (!form.client_id) return [];
    return technicalServices.filter(
      (item) => item.client_id === form.client_id
    );
  }, [technicalServices, form.client_id]);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleTargetTypeChange(value) {
    setForm((prev) => ({
      ...prev,
      target_type: value,
      sale_id: '',
      technical_service_id: ''
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit({
      client_id: form.client_id,
      sale_id: form.target_type === 'sale' ? form.sale_id || null : null,
      technical_service_id:
        form.target_type === 'technical_service'
          ? form.technical_service_id || null
          : null,
      payment_method: form.payment_method,
      amount: Number(form.amount),
      reference: form.reference.trim() || undefined,
      notes: form.notes.trim() || undefined
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
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

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Tipo de pago
          </label>
          <select
            className="w-full rounded-xl border border-slate-300 px-4 py-2"
            value={form.target_type}
            onChange={(e) => handleTargetTypeChange(e.target.value)}
          >
            <option value="sale">Venta</option>
            <option value="technical_service">Servicio técnico</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Método de pago
          </label>
          <select
            className="w-full rounded-xl border border-slate-300 px-4 py-2"
            value={form.payment_method}
            onChange={(e) => updateField('payment_method', e.target.value)}
          >
            {paymentMethodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {form.target_type === 'sale' ? (
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Venta
          </label>
          <select
            className="w-full rounded-xl border border-slate-300 px-4 py-2"
            value={form.sale_id}
            onChange={(e) => updateField('sale_id', e.target.value)}
          >
            <option value="">Selecciona una venta</option>
            {filteredSales.map((sale) => (
              <option key={sale.id} value={sale.id}>
                {sale.sale_number} - $ {Number(sale.total).toLocaleString('es-CO')}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Servicio técnico
          </label>
          <select
            className="w-full rounded-xl border border-slate-300 px-4 py-2"
            value={form.technical_service_id}
            onChange={(e) => updateField('technical_service_id', e.target.value)}
          >
            <option value="">Selecciona una orden técnica</option>
            {filteredTechnicalServices.map((item) => (
              <option key={item.id} value={item.id}>
                {item.ticket_number} - $ {Number(item.service_cost).toLocaleString('es-CO')}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Monto
          </label>
          <input
            type="number"
            min="0"
            className="w-full rounded-xl border border-slate-300 px-4 py-2"
            value={form.amount}
            onChange={(e) => updateField('amount', e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Referencia
          </label>
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-2"
            value={form.reference}
            onChange={(e) => updateField('reference', e.target.value)}
            placeholder="TRX-001"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Notas
        </label>
        <textarea
          rows="3"
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
        {isSubmitting ? 'Guardando...' : 'Registrar pago'}
      </button>
    </form>
  );
}
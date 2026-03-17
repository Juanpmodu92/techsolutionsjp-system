import { useMemo, useState } from 'react';
import QuoteItemsBuilder from './QuoteItemsBuilder';

export default function QuoteForm({
  clients,
  products,
  services,
  onSubmit,
  isSubmitting
}) {
  const [form, setForm] = useState({
    client_id: '',
    expiration_date: '',
    discount: 0,
    tax: 0,
    notes: ''
  });

  const [items, setItems] = useState([
    {
      item_type: 'product',
      reference_id: '',
      description: '',
      quantity: 1,
      unit_price: 0
    }
  ]);

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.quantity) * Number(item.unit_price),
      0
    );
    const total = subtotal - Number(form.discount || 0) + Number(form.tax || 0);

    return {
      subtotal,
      total
    };
  }, [items, form.discount, form.tax]);

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit({
      client_id: form.client_id,
      expiration_date: form.expiration_date || null,
      discount: Number(form.discount || 0),
      tax: Number(form.tax || 0),
      notes: form.notes.trim() || undefined,
      items: items.map((item) => ({
        item_type: item.item_type,
        reference_id: item.reference_id || null,
        description: item.description,
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price)
      }))
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="xl:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Cliente
          </label>
          <select
            className="w-full rounded-xl border border-slate-300 px-4 py-2"
            value={form.client_id}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, client_id: e.target.value }))
            }
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
            Fecha vencimiento
          </label>
          <input
            type="date"
            className="w-full rounded-xl border border-slate-300 px-4 py-2"
            value={form.expiration_date}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, expiration_date: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Descuento
          </label>
          <input
            type="number"
            min="0"
            className="w-full rounded-xl border border-slate-300 px-4 py-2"
            value={form.discount}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, discount: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Impuesto
          </label>
          <input
            type="number"
            min="0"
            className="w-full rounded-xl border border-slate-300 px-4 py-2"
            value={form.tax}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, tax: e.target.value }))
            }
          />
        </div>

        <div className="xl:col-span-3">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Notas
          </label>
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-2"
            value={form.notes}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, notes: e.target.value }))
            }
          />
        </div>
      </div>

      <QuoteItemsBuilder
        items={items}
        setItems={setItems}
        products={products}
        services={services}
      />

      <div className="rounded-2xl bg-slate-100 p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <div>
            <p className="text-sm text-slate-500">Subtotal</p>
            <p className="text-lg font-semibold text-slate-900">
              $ {totals.subtotal.toLocaleString('es-CO')}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Descuento</p>
            <p className="text-lg font-semibold text-slate-900">
              $ {Number(form.discount || 0).toLocaleString('es-CO')}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Impuesto</p>
            <p className="text-lg font-semibold text-slate-900">
              $ {Number(form.tax || 0).toLocaleString('es-CO')}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Total</p>
            <p className="text-xl font-bold text-slate-900">
              $ {totals.total.toLocaleString('es-CO')}
            </p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {isSubmitting ? 'Guardando...' : 'Crear cotización'}
      </button>
    </form>
  );
}
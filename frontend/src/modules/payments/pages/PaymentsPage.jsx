import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import PaymentForm from '../components/PaymentForm';
import PaymentsTable from '../components/PaymentsTable';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [clients, setClients] = useState([]);
  const [sales, setSales] = useState([]);
  const [technicalServices, setTechnicalServices] = useState([]);
  const [filters, setFilters] = useState({
    client_id: '',
    sale_id: '',
    technical_service_id: ''
  });
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadPayments(nextFilters = filters) {
    const params = {};

    if (nextFilters.client_id) params.client_id = nextFilters.client_id;
    if (nextFilters.sale_id) params.sale_id = nextFilters.sale_id;
    if (nextFilters.technical_service_id) {
      params.technical_service_id = nextFilters.technical_service_id;
    }

    const response = await api.get('/payments', { params });
    setPayments(response.data.data);
  }

  async function loadDependencies() {
    const [clientsResponse, salesResponse, technicalServicesResponse] =
      await Promise.all([
        api.get('/clients'),
        api.get('/sales'),
        api.get('/technical-services')
      ]);

    setClients(clientsResponse.data.data);
    setSales(salesResponse.data.data);
    setTechnicalServices(technicalServicesResponse.data.data);
  }

  async function loadData(nextFilters = filters) {
    try {
      setFetchError('');
      await Promise.all([loadPayments(nextFilters), loadDependencies()]);
    } catch (err) {
      setFetchError(
        err?.response?.data?.message || 'No fue posible cargar pagos'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreatePayment(payload) {
    try {
      setSubmitError('');
      setIsSubmitting(true);
      await api.post('/payments', payload);
      await loadPayments(filters);
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message || 'No fue posible registrar el pago'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleFilter(event) {
    event.preventDefault();
    setLoading(true);
    await loadData(filters);
  }

  function updateFilter(name, value) {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Pagos</h2>
        <p className="mt-1 text-sm text-slate-500">
          Registra y consulta pagos de ventas y servicios técnicos.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.35fr]">
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Nuevo pago</h3>

          {submitError ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          ) : null}

          <div className="mt-5">
            <PaymentForm
              clients={clients}
              sales={sales}
              technicalServices={technicalServices}
              onSubmit={handleCreatePayment}
              isSubmitting={isSubmitting}
            />
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <form
              className="grid gap-3 md:grid-cols-3"
              onSubmit={handleFilter}
            >
              <select
                className="w-full rounded-xl border border-slate-300 px-4 py-2"
                value={filters.client_id}
                onChange={(e) => updateFilter('client_id', e.target.value)}
              >
                <option value="">Todos los clientes</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.client_type === 'company'
                      ? client.company_name
                      : `${client.first_name ?? ''} ${client.last_name ?? ''}`.trim()}
                  </option>
                ))}
              </select>

              <select
                className="w-full rounded-xl border border-slate-300 px-4 py-2"
                value={filters.sale_id}
                onChange={(e) => updateFilter('sale_id', e.target.value)}
              >
                <option value="">Todas las ventas</option>
                {sales.map((sale) => (
                  <option key={sale.id} value={sale.id}>
                    {sale.sale_number}
                  </option>
                ))}
              </select>

              <select
                className="w-full rounded-xl border border-slate-300 px-4 py-2"
                value={filters.technical_service_id}
                onChange={(e) =>
                  updateFilter('technical_service_id', e.target.value)
                }
              >
                <option value="">Todos los servicios técnicos</option>
                {technicalServices.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.ticket_number}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 md:col-span-3"
              >
                Filtrar
              </button>
            </form>
          </div>

          {fetchError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {fetchError}
            </div>
          ) : null}

          {loading ? (
            <div className="rounded-2xl bg-white p-6 text-sm text-slate-600 shadow-sm">
              Cargando pagos...
            </div>
          ) : (
            <PaymentsTable payments={payments} />
          )}
        </section>
      </div>
    </section>
  );
}
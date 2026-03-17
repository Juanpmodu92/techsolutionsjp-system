import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import SaleForm from '../components/SaleForm';
import SalesTable from '../components/SalesTable';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadSales() {
    const response = await api.get('/sales');
    setSales(response.data.data);
  }

  async function loadDependencies() {
    const [clientsResponse, productsResponse, servicesResponse] = await Promise.all([
      api.get('/clients'),
      api.get('/products'),
      api.get('/services')
    ]);

    setClients(clientsResponse.data.data);
    setProducts(productsResponse.data.data);
    setServices(servicesResponse.data.data);
  }

  async function loadData() {
    try {
      setFetchError('');
      await Promise.all([loadSales(), loadDependencies()]);
    } catch (err) {
      setFetchError(
        err?.response?.data?.message || 'No fue posible cargar ventas'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreateSale(payload) {
    try {
      setSubmitError('');
      setIsSubmitting(true);
      await api.post('/sales', payload);
      await loadSales();
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message || 'No fue posible crear la venta'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSelectSale(sale) {
    try {
      const response = await api.get(`/sales/${sale.id}`);
      setSelectedSale(response.data.data);
    } catch (err) {
      setFetchError(
        err?.response?.data?.message || 'No fue posible cargar el detalle'
      );
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Ventas</h2>
        <p className="mt-1 text-sm text-slate-500">
          Registra ventas directas y consulta su detalle.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_1.35fr]">
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Nueva venta</h3>

          {submitError ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          ) : null}

          <div className="mt-5">
            <SaleForm
              clients={clients}
              products={products}
              services={services}
              onSubmit={handleCreateSale}
              isSubmitting={isSubmitting}
            />
          </div>
        </section>

        <section className="space-y-4">
          {fetchError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {fetchError}
            </div>
          ) : null}

          {loading ? (
            <div className="rounded-2xl bg-white p-6 text-sm text-slate-600 shadow-sm">
              Cargando ventas...
            </div>
          ) : (
            <SalesTable
              sales={sales}
              selectedSaleId={selectedSale?.id}
              onSelectSale={handleSelectSale}
            />
          )}

          {selectedSale ? (
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Detalle de {selectedSale.sale_number}
              </h3>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-slate-500">Estado</p>
                  <p className="font-medium text-slate-900">{selectedSale.status}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total</p>
                  <p className="font-medium text-slate-900">
                    $ {Number(selectedSale.total).toLocaleString('es-CO')}
                  </p>
                </div>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="px-3 py-2">Tipo</th>
                      <th className="px-3 py-2">Descripción</th>
                      <th className="px-3 py-2">Cantidad</th>
                      <th className="px-3 py-2">Valor</th>
                      <th className="px-3 py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSale.items.map((item) => (
                      <tr key={item.id} className="border-b border-slate-100">
                        <td className="px-3 py-3 text-slate-700">{item.item_type}</td>
                        <td className="px-3 py-3 text-slate-900">{item.description}</td>
                        <td className="px-3 py-3 text-slate-700">{item.quantity}</td>
                        <td className="px-3 py-3 text-slate-700">
                          $ {Number(item.unit_price).toLocaleString('es-CO')}
                        </td>
                        <td className="px-3 py-3 text-slate-700">
                          $ {Number(item.line_total).toLocaleString('es-CO')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
        </section>
      </div>
    </section>
  );
}
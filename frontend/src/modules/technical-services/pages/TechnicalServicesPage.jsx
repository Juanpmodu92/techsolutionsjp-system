import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import TechnicalServiceForm from '../components/TechnicalServiceForm';
import TechnicalServicesTable from '../components/TechnicalServicesTable';

export default function TechnicalServicesPage() {
  const [technicalServices, setTechnicalServices] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedTechnicalService, setSelectedTechnicalService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingTechnicalServiceId, setProcessingTechnicalServiceId] = useState('');

  async function loadTechnicalServices() {
    const response = await api.get('/technical-services');
    setTechnicalServices(response.data.data);
  }

  async function loadDependencies() {
    const [clientsResponse, productsResponse] = await Promise.all([
      api.get('/clients'),
      api.get('/products')
    ]);

    setClients(clientsResponse.data.data);
    setProducts(productsResponse.data.data);
  }

  async function loadData() {
    try {
      setFetchError('');
      await Promise.all([loadTechnicalServices(), loadDependencies()]);
    } catch (err) {
      setFetchError(
        err?.response?.data?.message || 'No fue posible cargar órdenes técnicas'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreateTechnicalService(payload) {
    try {
      setSubmitError('');
      setIsSubmitting(true);
      await api.post('/technical-services', payload);
      await loadTechnicalServices();
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message || 'No fue posible crear la orden técnica'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSelectTechnicalService(item) {
    try {
      const response = await api.get(`/technical-services/${item.id}`);
      setSelectedTechnicalService(response.data.data);
    } catch (err) {
      setFetchError(
        err?.response?.data?.message || 'No fue posible cargar el detalle'
      );
    }
  }

  async function handleChangeStatus(item, status) {
    try {
      setProcessingTechnicalServiceId(item.id);
      await api.patch(`/technical-services/${item.id}/status`, { status });
      await loadTechnicalServices();

      if (selectedTechnicalService?.id === item.id) {
        const refreshed = await api.get(`/technical-services/${item.id}`);
        setSelectedTechnicalService(refreshed.data.data);
      }
    } catch (err) {
      setFetchError(
        err?.response?.data?.message ||
          'No fue posible actualizar el estado de la orden técnica'
      );
    } finally {
      setProcessingTechnicalServiceId('');
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Servicio técnico</h2>
        <p className="mt-1 text-sm text-slate-500">
          Registra, consulta y gestiona órdenes de servicio técnico.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_1.35fr]">
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            Nueva orden técnica
          </h3>

          {submitError ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          ) : null}

          <div className="mt-5">
            <TechnicalServiceForm
              clients={clients}
              products={products}
              onSubmit={handleCreateTechnicalService}
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
              Cargando órdenes técnicas...
            </div>
          ) : (
            <TechnicalServicesTable
              technicalServices={technicalServices}
              selectedTechnicalServiceId={selectedTechnicalService?.id}
              onSelectTechnicalService={handleSelectTechnicalService}
              onChangeStatus={handleChangeStatus}
              processingId={processingTechnicalServiceId}
            />
          )}

          {selectedTechnicalService ? (
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Detalle de {selectedTechnicalService.ticket_number}
              </h3>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-slate-500">Estado</p>
                  <p className="font-medium text-slate-900">
                    {selectedTechnicalService.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Costo</p>
                  <p className="font-medium text-slate-900">
                    $ {Number(selectedTechnicalService.service_cost).toLocaleString('es-CO')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Equipo</p>
                  <p className="font-medium text-slate-900">
                    {selectedTechnicalService.device_type}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Producto relacionado</p>
                  <p className="font-medium text-slate-900">
                    {selectedTechnicalService.related_product_name || '-'}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4">
                <div>
                  <p className="text-sm text-slate-500">Problema reportado</p>
                  <p className="text-sm text-slate-900">
                    {selectedTechnicalService.problem_description}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Diagnóstico</p>
                  <p className="text-sm text-slate-900">
                    {selectedTechnicalService.diagnosis || '-'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Solución</p>
                  <p className="text-sm text-slate-900">
                    {selectedTechnicalService.solution || '-'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Notas</p>
                  <p className="text-sm text-slate-900">
                    {selectedTechnicalService.notes || '-'}
                  </p>
                </div>
              </div>
            </section>
          ) : null}
        </section>
      </div>
    </section>
  );
}
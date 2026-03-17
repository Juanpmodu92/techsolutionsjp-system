import { useEffect, useMemo, useState } from 'react';
import { api } from '../../../lib/api';
import ServiceForm from '../components/ServiceForm';
import ServicesTable from '../components/ServicesTable';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingServiceId, setProcessingServiceId] = useState('');
  const [editingService, setEditingService] = useState(null);

  async function fetchServices(nextSearch = '') {
    try {
      setFetchError('');

      const response = await api.get('/services', {
        params: nextSearch ? { search: nextSearch } : {}
      });

      setServices(response.data.data);
    } catch (err) {
      setFetchError(
        err?.response?.data?.message || 'No fue posible cargar servicios'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchServices();
  }, []);

  async function handleSearch(event) {
    event.preventDefault();
    setLoading(true);
    await fetchServices(search);
  }

  async function handleCreateService(payload) {
    try {
      setSubmitError('');
      setIsSubmitting(true);
      await api.post('/services', payload);
      await fetchServices(search);
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message || 'No fue posible crear el servicio'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateService(payload) {
    if (!editingService) return;

    try {
      setSubmitError('');
      setIsSubmitting(true);
      await api.put(`/services/${editingService.id}`, payload);
      setEditingService(null);
      await fetchServices(search);
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message || 'No fue posible actualizar el servicio'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeactivate(service) {
    try {
      setProcessingServiceId(service.id);
      await api.patch(`/services/${service.id}/deactivate`);
      await fetchServices(search);
    } catch (err) {
      setFetchError(
        err?.response?.data?.message || 'No fue posible desactivar el servicio'
      );
    } finally {
      setProcessingServiceId('');
    }
  }

  async function handleActivate(service) {
    try {
      setProcessingServiceId(service.id);
      await api.patch(`/services/${service.id}/activate`);
      await fetchServices(search);
    } catch (err) {
      setFetchError(
        err?.response?.data?.message || 'No fue posible activar el servicio'
      );
    } finally {
      setProcessingServiceId('');
    }
  }

  const formTitle = useMemo(
    () => (editingService ? 'Editar servicio' : 'Nuevo servicio'),
    [editingService]
  );

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Servicios</h2>
        <p className="mt-1 text-sm text-slate-500">
          Administra el catálogo de servicios técnicos y digitales.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.4fr]">
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">{formTitle}</h3>

          {submitError ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          ) : null}

          <div className="mt-5">
            <ServiceForm
              mode={editingService ? 'edit' : 'create'}
              initialValues={editingService}
              onSubmit={editingService ? handleUpdateService : handleCreateService}
              onCancel={editingService ? () => setEditingService(null) : undefined}
              isSubmitting={isSubmitting}
            />
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <form
              className="flex flex-col gap-3 md:flex-row"
              onSubmit={handleSearch}
            >
              <input
                className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
                placeholder="Buscar por nombre del servicio"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Buscar
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
              Cargando servicios...
            </div>
          ) : (
            <ServicesTable
              services={services}
              onEdit={setEditingService}
              onDeactivate={handleDeactivate}
              onActivate={handleActivate}
              isProcessingId={processingServiceId}
            />
          )}
        </section>
      </div>
    </section>
  );
}
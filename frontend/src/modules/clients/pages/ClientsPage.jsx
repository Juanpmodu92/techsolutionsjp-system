import { useEffect, useMemo, useState } from 'react';
import { api } from '../../../lib/api';
import ClientForm from '../components/ClientForm';
import ClientsTable from '../components/ClientsTable';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingClientId, setProcessingClientId] = useState('');
  const [editingClient, setEditingClient] = useState(null);

  async function fetchClients(nextSearch = '') {
    try {
      setFetchError('');

      const response = await api.get('/clients', {
        params: nextSearch ? { search: nextSearch } : {}
      });

      setClients(response.data.data);
    } catch (err) {
      setFetchError(
        err?.response?.data?.message || 'No fue posible cargar clientes'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchClients();
  }, []);

  async function handleSearch(event) {
    event.preventDefault();
    setLoading(true);
    await fetchClients(search);
  }

  async function handleCreateClient(payload) {
    try {
      setSubmitError('');
      setIsSubmitting(true);
      await api.post('/clients', payload);
      await fetchClients(search);
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message || 'No fue posible crear el cliente'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateClient(payload) {
    if (!editingClient) return;

    try {
      setSubmitError('');
      setIsSubmitting(true);
      await api.put(`/clients/${editingClient.id}`, payload);
      setEditingClient(null);
      await fetchClients(search);
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message || 'No fue posible actualizar el cliente'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeactivate(client) {
    try {
      setProcessingClientId(client.id);
      await api.patch(`/clients/${client.id}/deactivate`);
      await fetchClients(search);
    } catch (err) {
      setFetchError(
        err?.response?.data?.message || 'No fue posible desactivar el cliente'
      );
    } finally {
      setProcessingClientId('');
    }
  }


  async function handleActivate(client) {
  try {
    setProcessingClientId(client.id);
    await api.patch(`/clients/${client.id}/activate`);
    await fetchClients(search);
  } catch (err) {
    setFetchError(
      err?.response?.data?.message || 'No fue posible activar el cliente'
    );
  } finally {
    setProcessingClientId('');
  }
}

  const formTitle = useMemo(
    () => (editingClient ? 'Editar cliente' : 'Nuevo cliente'),
    [editingClient]
  );

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Clientes</h2>
        <p className="mt-1 text-sm text-slate-500">
          Gestiona clientes, empresas y contactos del sistema.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_1.4fr]">
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">{formTitle}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {editingClient
              ? 'Actualiza la información del cliente seleccionado.'
              : 'Registra un nuevo cliente en el sistema.'}
          </p>

          {submitError ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          ) : null}

          <div className="mt-5">
            <ClientForm
              mode={editingClient ? 'edit' : 'create'}
              initialValues={editingClient}
              isSubmitting={isSubmitting}
              onSubmit={editingClient ? handleUpdateClient : handleCreateClient}
              onCancel={editingClient ? () => setEditingClient(null) : undefined}
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
                placeholder="Buscar por nombre, empresa, correo, documento o NIT"
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
              Cargando clientes...
            </div>
          ) : (
            <ClientsTable
              clients={clients}
              onEdit={setEditingClient}
              onDeactivate={handleDeactivate}
              onActivate={handleActivate}
              isProcessingId={processingClientId}
            />
          )}
        </section>
      </div>
    </section>
  );
}
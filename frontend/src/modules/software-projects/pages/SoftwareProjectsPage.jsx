import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import SoftwareProjectForm from '../components/SoftwareProjectForm';
import SoftwareProjectsTable from '../components/SoftwareProjectsTable';

export default function SoftwareProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingProjectId, setProcessingProjectId] = useState('');

  async function loadProjects() {
    const response = await api.get('/software-projects');
    setProjects(response.data.data);
  }

  async function loadDependencies() {
    const [clientsResponse, quotesResponse] = await Promise.all([
      api.get('/clients'),
      api.get('/quotes')
    ]);

    setClients(clientsResponse.data.data);
    setQuotes(quotesResponse.data.data);
  }

  async function loadData() {
    try {
      setFetchError('');
      await Promise.all([loadProjects(), loadDependencies()]);
    } catch (err) {
      setFetchError(
        err?.response?.data?.message || 'No fue posible cargar proyectos'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreateProject(payload) {
    try {
      setSubmitError('');
      setIsSubmitting(true);
      await api.post('/software-projects', payload);
      await loadProjects();
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message || 'No fue posible crear el proyecto'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSelectProject(project) {
    try {
      const response = await api.get(`/software-projects/${project.id}`);
      setSelectedProject(response.data.data);
    } catch (err) {
      setFetchError(
        err?.response?.data?.message || 'No fue posible cargar el detalle'
      );
    }
  }

  async function handleChangeStatus(project, status) {
    try {
      setProcessingProjectId(project.id);
      await api.patch(`/software-projects/${project.id}/status`, { status });
      await loadProjects();

      if (selectedProject?.id === project.id) {
        const refreshed = await api.get(`/software-projects/${project.id}`);
        setSelectedProject(refreshed.data.data);
      }
    } catch (err) {
      setFetchError(
        err?.response?.data?.message ||
          'No fue posible actualizar el estado del proyecto'
      );
    } finally {
      setProcessingProjectId('');
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Proyectos software
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Gestiona proyectos web, sistemas y soluciones personalizadas.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_1.35fr]">
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            Nuevo proyecto
          </h3>

          {submitError ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          ) : null}

          <div className="mt-5">
            <SoftwareProjectForm
              clients={clients}
              quotes={quotes}
              onSubmit={handleCreateProject}
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
              Cargando proyectos...
            </div>
          ) : (
            <SoftwareProjectsTable
              projects={projects}
              selectedProjectId={selectedProject?.id}
              onSelectProject={handleSelectProject}
              onChangeStatus={handleChangeStatus}
              processingId={processingProjectId}
            />
          )}

          {selectedProject ? (
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Detalle de {selectedProject.name}
              </h3>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-slate-500">Estado</p>
                  <p className="font-medium text-slate-900">
                    {selectedProject.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Costo total</p>
                  <p className="font-medium text-slate-900">
                    $ {Number(selectedProject.total_cost).toLocaleString('es-CO')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Stack</p>
                  <p className="font-medium text-slate-900">
                    {selectedProject.stack}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Tipo</p>
                  <p className="font-medium text-slate-900">
                    {selectedProject.project_type}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4">
                <div>
                  <p className="text-sm text-slate-500">Descripción</p>
                  <p className="text-sm text-slate-900">
                    {selectedProject.description || '-'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Alcance</p>
                  <p className="text-sm text-slate-900">
                    {selectedProject.scope || '-'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Notas</p>
                  <p className="text-sm text-slate-900">
                    {selectedProject.notes || '-'}
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
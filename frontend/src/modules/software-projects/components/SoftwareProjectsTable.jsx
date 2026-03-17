import SoftwareProjectStatusActions from './SoftwareProjectStatusActions';

function getClientName(project) {
  if (project.client_type === 'company') {
    return project.company_name;
  }

  return `${project.first_name ?? ''} ${project.last_name ?? ''}`.trim();
}

function getStatusBadgeClass(status) {
  const classes = {
    quotation: 'bg-slate-200 text-slate-700',
    in_development: 'bg-blue-100 text-blue-700',
    testing: 'bg-amber-100 text-amber-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    finished: 'bg-emerald-200 text-emerald-800',
    cancelled: 'bg-red-100 text-red-700'
  };

  return classes[status] || 'bg-slate-200 text-slate-700';
}

export default function SoftwareProjectsTable({
  projects,
  selectedProjectId,
  onSelectProject,
  onChangeStatus,
  processingId
}) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="px-4 py-3">Proyecto</th>
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Tipo</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Costo</th>
            <th className="px-4 py-3">Acciones</th>
            <th className="px-4 py-3">Detalle</th>
          </tr>
        </thead>
        <tbody>
          {projects.length ? (
            projects.map((project) => (
              <tr key={project.id} className="border-b border-slate-100 align-top">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {project.name}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {getClientName(project)}
                </td>
                <td className="px-4 py-3 text-slate-700">{project.project_type}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeClass(
                      project.status
                    )}`}
                  >
                    {project.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-700">
                  $ {Number(project.total_cost).toLocaleString('es-CO')}
                </td>
                <td className="px-4 py-3">
                  <SoftwareProjectStatusActions
                    project={project}
                    onChangeStatus={onChangeStatus}
                    processingId={processingId}
                  />
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onSelectProject(project)}
                    className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    {selectedProjectId === project.id ? 'Viendo' : 'Ver detalle'}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="px-4 py-6 text-center text-slate-500">
                No hay proyectos para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
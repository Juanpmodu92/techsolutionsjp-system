import { NavLink } from 'react-router';

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/clients", label: "Clientes" },
  { to: "/users", label: "Usuarios" },
  { to: "/products", label: "Productos" },
  { to: "/inventory", label: "Inventario" },
  { to: "/services", label: "Servicios" },
  { to: "/technical-services", label: "Servicio técnico" },
  { to: "/quotes", label: "Cotizaciones" },
  { to: "/sales", label: "Ventas" },
  { to: "/payments", label: "Pagos" },
  { to: "/software-projects", label: "Proyectos software" },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
      <div className="p-6">
        <h2 className="text-lg font-bold text-slate-900">Tech Solutions JP</h2>
        <p className="mt-1 text-sm text-slate-500">Panel administrativo</p>
      </div>

      <nav className="space-y-1 px-4 pb-6">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-2 text-sm font-medium ${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
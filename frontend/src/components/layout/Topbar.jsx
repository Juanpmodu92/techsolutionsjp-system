import { useAuth } from '../../modules/auth/context/AuthContext';

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Panel</h1>
        <p className="text-sm text-slate-500">
          Bienvenido, {user?.first_name} {user?.last_name}
        </p>
      </div>

      <button
        onClick={logout}
        className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
      >
        Cerrar sesión
      </button>
    </header>
  );
}
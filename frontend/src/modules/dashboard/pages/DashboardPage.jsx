import { useEffect, useState } from "react";
import { Link } from "react-router";
import QuickAccessCard from "../../../components/ui/QuickAccessCard";
import StatCard from "../../../components/ui/StatCard";
import { api } from "../../../lib/api";
import { formatCurrency } from "../../../utils/format";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await api.get("/dashboard/metrics");
        setMetrics(response.data.data);
      } catch (err) {
        setError(
          err?.response?.data?.message || "No fue posible cargar las métricas",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <section className="rounded-2xl bg-white p-6 text-sm text-slate-600 shadow-sm">
        Cargando dashboard...
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </section>
    );
  }

  const totals = metrics?.totals ?? {};
  const quotesByStatus = metrics?.quotes_by_status ?? [];
  const projectsByStatus = metrics?.software_projects_by_status ?? [];
  const lowStockProducts = metrics?.low_stock_products ?? [];

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
          <p className="mt-1 text-sm text-slate-500">
            Vista general de operación, ventas, proyectos y alertas.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/quotes"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Nueva cotización
          </Link>
          <Link
            to="/sales"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Ir a ventas
          </Link>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Clientes" value={totals.clients ?? 0} />
        <StatCard title="Clientes activos" value={totals.active_clients ?? 0} />
        <StatCard
          title="Productos activos"
          value={totals.active_products ?? 0}
        />
        <StatCard
          title="Servicios activos"
          value={totals.active_services ?? 0}
        />
        <StatCard title="Cotizaciones" value={totals.quotes ?? 0} />
        <StatCard title="Ventas" value={totals.sales ?? 0} />
        <StatCard
          title="Ingresos registrados"
          value={formatCurrency(totals.sales_amount)}
        />
        <StatCard
          title="Proyectos software"
          value={totals.software_projects ?? 0}
        />
      </div>

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Accesos rápidos
          </h3>
          <p className="text-sm text-slate-500">
            Navegación rápida a los módulos más usados.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <QuickAccessCard
            to="/clients"
            title="Clientes"
            description="Gestiona personas, empresas y contactos."
          />
          <QuickAccessCard
            to="/technical-services"
            title="Servicio técnico"
            description="Controla tickets, estados y entregas."
          />
          <QuickAccessCard
            to="/payments"
            title="Pagos"
            description="Registra abonos y pagos completos."
          />
          <QuickAccessCard
            to="/reports"
            title="Reportes"
            description="Consulta resúmenes operativos y financieros."
          />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              Productos con stock bajo
            </h3>
            <Link
              to="/inventory"
              className="text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              Ver inventario
            </Link>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-3 py-2">SKU</th>
                  <th className="px-3 py-2">Producto</th>
                  <th className="px-3 py-2">Stock</th>
                  <th className="px-3 py-2">Mínimo</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.length ? (
                  lowStockProducts.map((product) => (
                    <tr key={product.id} className="border-b border-slate-100">
                      <td className="px-3 py-3 text-slate-700">
                        {product.sku || "-"}
                      </td>
                      <td className="px-3 py-3 font-medium text-slate-900">
                        {product.name}
                      </td>
                      <td className="px-3 py-3 text-red-700">
                        {product.stock_quantity}
                      </td>
                      <td className="px-3 py-3 text-slate-700">
                        {product.minimum_stock}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-3 py-4 text-center text-slate-500"
                    >
                      No hay alertas de stock bajo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Cotizaciones por estado
            </h3>

            <div className="mt-4 space-y-3">
              {quotesByStatus.length ? (
                quotesByStatus.map((item) => (
                  <div
                    key={item.status}
                    className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                  >
                    <span className="text-sm capitalize text-slate-700">
                      {item.status}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      {item.total}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">Sin datos.</p>
              )}
            </div>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Proyectos por estado
            </h3>

            <div className="mt-4 space-y-3">
              {projectsByStatus.length ? (
                projectsByStatus.map((item) => (
                  <div
                    key={item.status}
                    className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                  >
                    <span className="text-sm capitalize text-slate-700">
                      {item.status}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      {item.total}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">Sin datos.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

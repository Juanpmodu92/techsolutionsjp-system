import { createBrowserRouter } from "react-router";
import AppLayout from "../components/layout/AppLayout";
import ProtectedRoute from "../modules/auth/components/ProtectedRoute";
import LoginPage from "../modules/auth/pages/LoginPage";
import ClientsPage from "../modules/clients/pages/ClientsPage";
import DashboardPage from "../modules/dashboard/pages/DashboardPage";
import ProductsPage from "../modules/products/pages/ProductsPage";

function PlaceholderPage({ title }) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-500">Módulo en construcción.</p>
    </section>
  );
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <DashboardPage />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/clients",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <ClientsPage />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/products",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <ProductsPage />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/services",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <PlaceholderPage title="Servicios" />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/quotes",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <PlaceholderPage title="Cotizaciones" />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/sales",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <PlaceholderPage title="Ventas" />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/software-projects",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <PlaceholderPage title="Proyectos software" />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
]);

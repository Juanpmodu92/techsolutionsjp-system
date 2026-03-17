import { createBrowserRouter } from "react-router";
import AppLayout from "../components/layout/AppLayout";
import ProtectedRoute from "../modules/auth/components/ProtectedRoute";
import LoginPage from "../modules/auth/pages/LoginPage";
import ClientsPage from "../modules/clients/pages/ClientsPage";
import DashboardPage from "../modules/dashboard/pages/DashboardPage";
import InventoryPage from "../modules/inventory/pages/InventoryPage";
import ProductsPage from "../modules/products/pages/ProductsPage";
import QuotesPage from "../modules/quotes/pages/QuotesPage";
import SalesPage from "../modules/sales/pages/SalesPage";
import ServicesPage from "../modules/services/pages/ServicesPage";
import SoftwareProjectsPage from "../modules/software-projects/pages/SoftwareProjectsPage";

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
          <ServicesPage />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/quotes",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <QuotesPage />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/sales",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <SalesPage />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/software-projects",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <SoftwareProjectsPage />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/inventory",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <InventoryPage />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
]);

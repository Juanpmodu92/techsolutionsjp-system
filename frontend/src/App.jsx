import { RouterProvider } from "react-router";
import { router } from "./app/router";
import { AuthProvider } from "./modules/auth/context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ToastProvider>
  );
}

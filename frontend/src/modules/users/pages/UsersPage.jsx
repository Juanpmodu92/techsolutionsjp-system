import { useEffect, useMemo, useState } from "react";
import ConfirmDialog from "../../../components/feedback/ConfirmDialog";
import { useToast } from "../../../context/ToastContext";
import { api } from "../../../lib/api";
import UserForm from "../components/UserForm";
import UsersTable from "../components/UsersTable";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingUserId, setProcessingUserId] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [confirmState, setConfirmState] = useState({
    open: false,
    user: null,
    action: null,
  });

  const toast = useToast();

  async function loadUsers() {
    try {
      setFetchError("");
      const response = await api.get("/users");
      setUsers(response.data.data);
    } catch (err) {
      const message =
        err?.response?.data?.message || "No fue posible cargar usuarios";

      setFetchError(message);
      toast.error("Error al cargar usuarios", message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleCreateUser(payload) {
    try {
      setSubmitError("");
      setIsSubmitting(true);
      await api.post("/users", payload);
      await loadUsers();
      toast.success("Usuario creado", "El usuario fue registrado.");
    } catch (err) {
      const message =
        err?.response?.data?.message || "No fue posible crear el usuario";

      setSubmitError(message);
      toast.error("Error al crear usuario", message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateUser(payload) {
    if (!editingUser) return;

    try {
      setSubmitError("");
      setIsSubmitting(true);
      await api.put(`/users/${editingUser.id}`, payload);
      setEditingUser(null);
      await loadUsers();
      toast.success("Usuario actualizado", "Los cambios fueron guardados.");
    } catch (err) {
      const message =
        err?.response?.data?.message || "No fue posible actualizar el usuario";

      setSubmitError(message);
      toast.error("Error al actualizar usuario", message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function requestActivate(user) {
    setConfirmState({
      open: true,
      user,
      action: "activate",
    });
  }

  function requestDeactivate(user) {
    setConfirmState({
      open: true,
      user,
      action: "deactivate",
    });
  }

  function closeConfirm() {
    setConfirmState({
      open: false,
      user: null,
      action: null,
    });
  }

  async function handleConfirmAction() {
    const { user, action } = confirmState;
    if (!user || !action) return;

    try {
      setProcessingUserId(user.id);

      if (action === "activate") {
        await api.patch(`/users/${user.id}/activate`);
        toast.success("Usuario activado", "El usuario volvió a estar activo.");
      }

      if (action === "deactivate") {
        await api.patch(`/users/${user.id}/deactivate`);
        toast.success("Usuario desactivado", "El usuario quedó inactivo.");
      }

      closeConfirm();
      await loadUsers();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        `No fue posible ${action === "activate" ? "activar" : "desactivar"} el usuario`;

      setFetchError(message);
      toast.error("Operación no completada", message);
    } finally {
      setProcessingUserId("");
    }
  }

  const formTitle = useMemo(
    () => (editingUser ? "Editar usuario" : "Nuevo usuario"),
    [editingUser],
  );

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Usuarios</h2>
        <p className="mt-1 text-sm text-slate-500">
          Administra usuarios internos del sistema.
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
            <UserForm
              mode={editingUser ? "edit" : "create"}
              initialValues={editingUser}
              onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
              onCancel={editingUser ? () => setEditingUser(null) : undefined}
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
              Cargando usuarios...
            </div>
          ) : (
            <UsersTable
              users={users}
              onEdit={setEditingUser}
              onActivate={requestActivate}
              onDeactivate={requestDeactivate}
              isProcessingId={processingUserId}
            />
          )}
        </section>
      </div>

      <ConfirmDialog
        open={confirmState.open}
        title={
          confirmState.action === "activate"
            ? "Activar usuario"
            : "Desactivar usuario"
        }
        message={
          confirmState.action === "activate"
            ? "¿Deseas activar este usuario?"
            : "¿Deseas desactivar este usuario?"
        }
        confirmText={
          confirmState.action === "activate" ? "Activar" : "Desactivar"
        }
        confirmVariant={
          confirmState.action === "activate" ? "primary" : "danger"
        }
        onConfirm={handleConfirmAction}
        onCancel={closeConfirm}
      />
    </section>
  );
}
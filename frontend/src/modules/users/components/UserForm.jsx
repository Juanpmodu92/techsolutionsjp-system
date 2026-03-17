import { useEffect, useState } from 'react';

const roleOptions = [
  { value: 'admin', label: 'Administrador' },
  { value: 'seller', label: 'Vendedor' },
  { value: 'technician', label: 'Técnico' },
  { value: 'developer', label: 'Desarrollador' }
];

const initialForm = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  role: 'seller'
};

export default function UserForm({
  mode = 'create',
  initialValues = null,
  onSubmit,
  onCancel,
  isSubmitting
}) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (initialValues) {
      setForm({
        first_name: initialValues.first_name ?? '',
        last_name: initialValues.last_name ?? '',
        email: initialValues.email ?? '',
        password: '',
        role: initialValues.role ?? 'seller'
      });
    } else {
      setForm(initialForm);
    }
  }, [initialValues]);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const payload =
      mode === 'edit'
        ? {
            first_name: form.first_name.trim(),
            last_name: form.last_name.trim(),
            email: form.email.trim(),
            role: form.role
          }
        : {
            first_name: form.first_name.trim(),
            last_name: form.last_name.trim(),
            email: form.email.trim(),
            password: form.password,
            role: form.role
          };

    onSubmit(payload);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Nombres
          </label>
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-2"
            value={form.first_name}
            onChange={(e) => updateField('first_name', e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Apellidos
          </label>
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-2"
            value={form.last_name}
            onChange={(e) => updateField('last_name', e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Correo
          </label>
          <input
            type="email"
            className="w-full rounded-xl border border-slate-300 px-4 py-2"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Rol
          </label>
          <select
            className="w-full rounded-xl border border-slate-300 px-4 py-2"
            value={form.role}
            onChange={(e) => updateField('role', e.target.value)}
          >
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {mode === 'create' ? (
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Contraseña
          </label>
          <input
            type="password"
            className="w-full rounded-xl border border-slate-300 px-4 py-2"
            value={form.password}
            onChange={(e) => updateField('password', e.target.value)}
          />
        </div>
      ) : null}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {isSubmitting
            ? 'Guardando...'
            : mode === 'edit'
              ? 'Actualizar usuario'
              : 'Crear usuario'}
        </button>

        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Cancelar
          </button>
        ) : null}
      </div>
    </form>
  );
}
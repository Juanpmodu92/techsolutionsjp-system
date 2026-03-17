export default function DateRangeFilter({
  value,
  onChange,
  onSubmit,
  title = 'Filtro por fechas'
}) {
  function updateField(name, nextValue) {
    onChange({
      ...value,
      [name]: nextValue
    });
  }

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>

      <form className="mt-4 grid gap-3 md:grid-cols-3" onSubmit={onSubmit}>
        <input
          type="date"
          className="w-full rounded-xl border border-slate-300 px-4 py-2"
          value={value.date_from}
          onChange={(e) => updateField('date_from', e.target.value)}
        />

        <input
          type="date"
          className="w-full rounded-xl border border-slate-300 px-4 py-2"
          value={value.date_to}
          onChange={(e) => updateField('date_to', e.target.value)}
        />

        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Aplicar filtro
        </button>
      </form>
    </section>
  );
}
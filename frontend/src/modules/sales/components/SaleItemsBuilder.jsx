const ITEM_TYPE_OPTIONS = [
  { value: 'product', label: 'Producto' },
  { value: 'service', label: 'Servicio' },
  { value: 'software_project', label: 'Proyecto software' },
  { value: 'hosting', label: 'Hosting' },
  { value: 'web_maintenance', label: 'Mantenimiento web' }
];

function getCatalogOptions(itemType, products, services) {
  if (itemType === 'product') return products;
  if (itemType === 'service') return services;
  return [];
}

export default function SaleItemsBuilder({
  items,
  setItems,
  products,
  services
}) {
  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        item_type: 'product',
        reference_id: '',
        description: '',
        quantity: 1,
        unit_price: 0
      }
    ]);
  }

  function updateItem(index, field, value) {
    setItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );
  }

  function updateReference(index, itemType, referenceId) {
    const options = getCatalogOptions(itemType, products, services);
    const found = options.find((item) => item.id === referenceId);

    setItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item;

        if (!found) {
          return {
            ...item,
            reference_id: referenceId,
            description: '',
            unit_price: 0
          };
        }

        if (itemType === 'product') {
          return {
            ...item,
            reference_id: referenceId,
            description: found.name,
            unit_price: Number(found.price)
          };
        }

        if (itemType === 'service') {
          return {
            ...item,
            reference_id: referenceId,
            description: found.name,
            unit_price: Number(found.base_price)
          };
        }

        return item;
      })
    );
  }

  function removeItem(index) {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const catalogOptions = getCatalogOptions(item.item_type, products, services);

        return (
          <div
            key={index}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Tipo
                </label>
                <select
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2"
                  value={item.item_type}
                  onChange={(e) =>
                    updateItem(index, 'item_type', e.target.value)
                  }
                >
                  {ITEM_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {(item.item_type === 'product' || item.item_type === 'service') && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Referencia
                  </label>
                  <select
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2"
                    value={item.reference_id}
                    onChange={(e) =>
                      updateReference(index, item.item_type, e.target.value)
                    }
                  >
                    <option value="">Selecciona una opción</option>
                    {catalogOptions
                      .filter((catalogItem) => catalogItem.is_active)
                      .map((catalogItem) => (
                        <option key={catalogItem.id} value={catalogItem.id}>
                          {catalogItem.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <div className="xl:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Descripción
                </label>
                <input
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2"
                  value={item.description}
                  onChange={(e) =>
                    updateItem(index, 'description', e.target.value)
                  }
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Cantidad
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(index, 'quantity', Number(e.target.value))
                  }
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Precio unitario
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2"
                  value={item.unit_price}
                  onChange={(e) =>
                    updateItem(index, 'unit_price', Number(e.target.value))
                  }
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Total línea:{' '}
                <span className="font-semibold text-slate-900">
                  $ {(Number(item.quantity) * Number(item.unit_price)).toLocaleString('es-CO')}
                </span>
              </p>

              <button
                type="button"
                onClick={() => removeItem(index)}
                className="rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
              >
                Eliminar
              </button>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={addItem}
        className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
      >
        Agregar ítem
      </button>
    </div>
  );
}
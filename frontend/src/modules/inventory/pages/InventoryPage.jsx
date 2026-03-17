import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import InventoryMovementForm from '../components/InventoryMovementForm';
import InventoryMovementsTable from '../components/InventoryMovementsTable';

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [filterProductId, setFilterProductId] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadProducts() {
    const response = await api.get('/products');
    setProducts(response.data.data);
  }

  async function loadMovements(productId = '') {
    const response = await api.get('/inventory/movements', {
      params: productId ? { product_id: productId } : {}
    });
    setMovements(response.data.data);
  }

  async function loadData(productId = '') {
    try {
      setFetchError('');
      await Promise.all([loadProducts(), loadMovements(productId)]);
    } catch (err) {
      setFetchError(
        err?.response?.data?.message ||
          'No fue posible cargar movimientos de inventario'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSubmit(payload) {
    try {
      setSubmitError('');
      setIsSubmitting(true);
      await api.post('/inventory/movements', payload);
      await loadData(filterProductId);
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message ||
          'No fue posible registrar el movimiento'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleFilter(event) {
    event.preventDefault();
    setLoading(true);
    await loadData(filterProductId);
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Inventario</h2>
        <p className="mt-1 text-sm text-slate-500">
          Registra entradas, salidas y ajustes de stock.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.4fr]">
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            Nuevo movimiento
          </h3>

          {submitError ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          ) : null}

          <div className="mt-5">
            <InventoryMovementForm
              products={products}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <form
              className="flex flex-col gap-3 md:flex-row"
              onSubmit={handleFilter}
            >
              <select
                className="w-full rounded-xl border border-slate-300 px-4 py-2"
                value={filterProductId}
                onChange={(e) => setFilterProductId(e.target.value)}
              >
                <option value="">Todos los productos</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} {product.sku ? `(${product.sku})` : ''}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Filtrar
              </button>
            </form>
          </div>

          {fetchError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {fetchError}
            </div>
          ) : null}

          {loading ? (
            <div className="rounded-2xl bg-white p-6 text-sm text-slate-600 shadow-sm">
              Cargando movimientos...
            </div>
          ) : (
            <InventoryMovementsTable movements={movements} />
          )}
        </section>
      </div>
    </section>
  );
}
import { useEffect, useMemo, useState } from 'react';
import { api } from '../../../lib/api';
import ProductCategoryForm from '../components/ProductCategoryForm';
import ProductForm from '../components/ProductForm';
import ProductsTable from '../components/ProductsTable';

export default function ProductsPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [productError, setProductError] = useState('');
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [processingProductId, setProcessingProductId] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);

  async function fetchCategories() {
    const response = await api.get('/products/categories');
    setCategories(response.data.data);
  }

  async function fetchProducts(nextSearch = '') {
    const response = await api.get('/products', {
      params: nextSearch ? { search: nextSearch } : {}
    });

    setProducts(response.data.data);
  }

  async function loadData(nextSearch = '') {
    try {
      setFetchError('');
      await Promise.all([fetchCategories(), fetchProducts(nextSearch)]);
    } catch (err) {
      setFetchError(
        err?.response?.data?.message || 'No fue posible cargar productos'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSearch(event) {
    event.preventDefault();
    setLoading(true);
    await loadData(search);
  }

  async function handleCreateCategory(payload) {
    try {
      setCategoryError('');
      setIsSubmittingCategory(true);
      await api.post('/products/categories', payload);
      await fetchCategories();
    } catch (err) {
      setCategoryError(
        err?.response?.data?.message || 'No fue posible crear la categoría'
      );
    } finally {
      setIsSubmittingCategory(false);
    }
  }

  async function handleCreateProduct(payload) {
    try {
      setProductError('');
      setIsSubmittingProduct(true);
      await api.post('/products', payload);
      await loadData(search);
    } catch (err) {
      setProductError(
        err?.response?.data?.message || 'No fue posible crear el producto'
      );
    } finally {
      setIsSubmittingProduct(false);
    }
  }

  async function handleUpdateProduct(payload) {
    if (!editingProduct) return;

    try {
      setProductError('');
      setIsSubmittingProduct(true);
      await api.put(`/products/${editingProduct.id}`, payload);
      setEditingProduct(null);
      await loadData(search);
    } catch (err) {
      setProductError(
        err?.response?.data?.message || 'No fue posible actualizar el producto'
      );
    } finally {
      setIsSubmittingProduct(false);
    }
  }

  async function handleDeactivateProduct(product) {
    try {
      setProcessingProductId(product.id);
      await api.patch(`/products/${product.id}/deactivate`);
      await loadData(search);
    } catch (err) {
      setFetchError(
        err?.response?.data?.message || 'No fue posible desactivar el producto'
      );
    } finally {
      setProcessingProductId('');
    }
  }

  const formTitle = useMemo(
    () => (editingProduct ? 'Editar producto' : 'Nuevo producto'),
    [editingProduct]
  );

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Productos</h2>
        <p className="mt-1 text-sm text-slate-500">
          Administra categorías, catálogo y stock base de productos.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.4fr]">
        <div className="space-y-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Nueva categoría
            </h3>

            {categoryError ? (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {categoryError}
              </div>
            ) : null}

            <div className="mt-5">
              <ProductCategoryForm
                onSubmit={handleCreateCategory}
                isSubmitting={isSubmittingCategory}
              />
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">{formTitle}</h3>

            {productError ? (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {productError}
              </div>
            ) : null}

            <div className="mt-5">
              <ProductForm
                categories={categories}
                mode={editingProduct ? 'edit' : 'create'}
                initialValues={editingProduct}
                onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
                onCancel={editingProduct ? () => setEditingProduct(null) : undefined}
                isSubmitting={isSubmittingProduct}
              />
            </div>
          </section>
        </div>

        <section className="space-y-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <form
              className="flex flex-col gap-3 md:flex-row"
              onSubmit={handleSearch}
            >
              <input
                className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
                placeholder="Buscar por nombre o SKU"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Buscar
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
              Cargando productos...
            </div>
          ) : (
            <ProductsTable
              products={products}
              onEdit={setEditingProduct}
              onDeactivate={handleDeactivateProduct}
              isProcessingId={processingProductId}
            />
          )}
        </section>
      </div>
    </section>
  );
}
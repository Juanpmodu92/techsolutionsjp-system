import { useEffect, useState } from "react";
import { useToast } from "../../../context/ToastContext";
import { api } from "../../../lib/api";
import { openPdfFromApi } from "../../../lib/file";
import QuoteForm from "../components/QuoteForm";
import QuotesTable from "../components/QuotesTable";

export default function QuotesPage() {
  const [quotes, setQuotes] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingQuoteId, setProcessingQuoteId] = useState("");
  const [processingPdfId, setProcessingPdfId] = useState("");

  const toast = useToast();

  async function loadQuotes() {
    const response = await api.get("/quotes");
    setQuotes(response.data.data);
  }

  async function loadDependencies() {
    const [clientsResponse, productsResponse, servicesResponse] =
      await Promise.all([
        api.get("/clients"),
        api.get("/products"),
        api.get("/services"),
      ]);

    setClients(clientsResponse.data.data);
    setProducts(productsResponse.data.data);
    setServices(servicesResponse.data.data);
  }

  async function loadData() {
    try {
      setFetchError("");
      await Promise.all([loadQuotes(), loadDependencies()]);
    } catch (err) {
      const message =
        err?.response?.data?.message || "No fue posible cargar cotizaciones";

      setFetchError(message);
      toast.error("Error al cargar cotizaciones", message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreateQuote(payload) {
    try {
      setSubmitError("");
      setIsSubmitting(true);
      await api.post("/quotes", payload);
      await loadQuotes();
      toast.success("Cotización creada", "La cotización fue registrada.");
    } catch (err) {
      const message =
        err?.response?.data?.message || "No fue posible crear la cotización";

      setSubmitError(message);
      toast.error("Error al crear cotización", message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSelectQuote(quote) {
    try {
      const response = await api.get(`/quotes/${quote.id}`);
      setSelectedQuote(response.data.data);
    } catch (err) {
      const message =
        err?.response?.data?.message || "No fue posible cargar el detalle";

      setFetchError(message);
      toast.error("Error al cargar detalle", message);
    }
  }

  async function handleChangeStatus(quote, status) {
    try {
      setProcessingQuoteId(quote.id);
      await api.patch(`/quotes/${quote.id}/status`, { status });
      await loadQuotes();
      toast.success("Estado actualizado", "La cotización cambió de estado.");

      if (selectedQuote?.id === quote.id) {
        const refreshed = await api.get(`/quotes/${quote.id}`);
        setSelectedQuote(refreshed.data.data);
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "No fue posible actualizar el estado de la cotización";

      setFetchError(message);
      toast.error("Error al actualizar estado", message);
    } finally {
      setProcessingQuoteId("");
    }
  }

  async function handleViewPdf(quote) {
    try {
      setProcessingPdfId(quote.id);
      await openPdfFromApi(`/quotes/${quote.id}/pdf`);
      toast.info("PDF abierto", `Se abrió el PDF de ${quote.quote_number}.`);
    } catch (err) {
      const message =
        err?.response?.data?.message || "No fue posible abrir el PDF";

      toast.error("Error al abrir PDF", message);
    } finally {
      setProcessingPdfId("");
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Cotizaciones</h2>
        <p className="mt-1 text-sm text-slate-500">
          Crea y administra cotizaciones con productos, servicios y proyectos.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_1.35fr]">
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            Nueva cotización
          </h3>

          {submitError ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          ) : null}

          <div className="mt-5">
            <QuoteForm
              clients={clients}
              products={products}
              services={services}
              onSubmit={handleCreateQuote}
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
              Cargando cotizaciones...
            </div>
          ) : (
            <QuotesTable
              quotes={quotes}
              selectedQuoteId={selectedQuote?.id}
              onSelectQuote={handleSelectQuote}
              onChangeStatus={handleChangeStatus}
              onViewPdf={handleViewPdf}
              processingId={processingQuoteId}
              processingPdfId={processingPdfId}
            />
          )}

          {selectedQuote ? (
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Detalle de {selectedQuote.quote_number}
              </h3>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-slate-500">Estado</p>
                  <p className="font-medium text-slate-900">
                    {selectedQuote.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total</p>
                  <p className="font-medium text-slate-900">
                    $ {Number(selectedQuote.total).toLocaleString("es-CO")}
                  </p>
                </div>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="px-3 py-2">Tipo</th>
                      <th className="px-3 py-2">Descripción</th>
                      <th className="px-3 py-2">Cantidad</th>
                      <th className="px-3 py-2">Valor</th>
                      <th className="px-3 py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedQuote.items.map((item) => (
                      <tr key={item.id} className="border-b border-slate-100">
                        <td className="px-3 py-3 text-slate-700">
                          {item.item_type}
                        </td>
                        <td className="px-3 py-3 text-slate-900">
                          {item.description}
                        </td>
                        <td className="px-3 py-3 text-slate-700">
                          {item.quantity}
                        </td>
                        <td className="px-3 py-3 text-slate-700">
                          $ {Number(item.unit_price).toLocaleString("es-CO")}
                        </td>
                        <td className="px-3 py-3 text-slate-700">
                          $ {Number(item.line_total).toLocaleString("es-CO")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
        </section>
      </div>
    </section>
  );
}
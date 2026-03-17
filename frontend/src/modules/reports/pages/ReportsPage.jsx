import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import DateRangeFilter from '../components/DateRangeFilter';
import InventorySummaryCard from '../components/InventorySummaryCard';
import PaymentsSummaryCard from '../components/PaymentsSummaryCard';
import SalesSummaryCard from '../components/SalesSummaryCard';
import TechnicalServicesSummaryCard from '../components/TechnicalServicesSummaryCard';

export default function ReportsPage() {
  const [salesRange, setSalesRange] = useState({
    date_from: '',
    date_to: ''
  });
  const [paymentsRange, setPaymentsRange] = useState({
    date_from: '',
    date_to: ''
  });
  const [technicalServicesRange, setTechnicalServicesRange] = useState({
    date_from: '',
    date_to: ''
  });

  const [salesSummary, setSalesSummary] = useState(null);
  const [paymentsSummary, setPaymentsSummary] = useState(null);
  const [inventorySummary, setInventorySummary] = useState(null);
  const [technicalServicesSummary, setTechnicalServicesSummary] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadSalesSummary(range = salesRange) {
    const response = await api.get('/reports/sales-summary', {
      params: {
        ...(range.date_from ? { date_from: range.date_from } : {}),
        ...(range.date_to ? { date_to: range.date_to } : {})
      }
    });

    setSalesSummary(response.data.data);
  }

  async function loadPaymentsSummary(range = paymentsRange) {
    const response = await api.get('/reports/payments-summary', {
      params: {
        ...(range.date_from ? { date_from: range.date_from } : {}),
        ...(range.date_to ? { date_to: range.date_to } : {})
      }
    });

    setPaymentsSummary(response.data.data);
  }

  async function loadInventorySummary() {
    const response = await api.get('/reports/inventory-summary');
    setInventorySummary(response.data.data);
  }

  async function loadTechnicalServicesSummary(range = technicalServicesRange) {
    const response = await api.get('/reports/technical-services-summary', {
      params: {
        ...(range.date_from ? { date_from: range.date_from } : {}),
        ...(range.date_to ? { date_to: range.date_to } : {})
      }
    });

    setTechnicalServicesSummary(response.data.data);
  }

  async function loadAll() {
    try {
      setError('');
      await Promise.all([
        loadSalesSummary(),
        loadPaymentsSummary(),
        loadInventorySummary(),
        loadTechnicalServicesSummary()
      ]);
    } catch (err) {
      setError(
        err?.response?.data?.message || 'No fue posible cargar reportes'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleSalesFilterSubmit(event) {
    event.preventDefault();

    try {
      await loadSalesSummary(salesRange);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'No fue posible cargar el reporte de ventas'
      );
    }
  }

  async function handlePaymentsFilterSubmit(event) {
    event.preventDefault();

    try {
      await loadPaymentsSummary(paymentsRange);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'No fue posible cargar el reporte de pagos'
      );
    }
  }

  async function handleTechnicalServicesFilterSubmit(event) {
    event.preventDefault();

    try {
      await loadTechnicalServicesSummary(technicalServicesRange);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'No fue posible cargar el reporte de servicio técnico'
      );
    }
  }

  if (loading) {
    return (
      <section className="rounded-2xl bg-white p-6 text-sm text-slate-600 shadow-sm">
        Cargando reportes...
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Reportes</h2>
        <p className="mt-1 text-sm text-slate-500">
          Consulta resúmenes operativos, comerciales y financieros del sistema.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="space-y-4">
        <DateRangeFilter
          title="Filtro reporte de ventas"
          value={salesRange}
          onChange={setSalesRange}
          onSubmit={handleSalesFilterSubmit}
        />
        <SalesSummaryCard data={salesSummary} />
      </div>

      <div className="space-y-4">
        <DateRangeFilter
          title="Filtro reporte de pagos"
          value={paymentsRange}
          onChange={setPaymentsRange}
          onSubmit={handlePaymentsFilterSubmit}
        />
        <PaymentsSummaryCard data={paymentsSummary} />
      </div>

      <InventorySummaryCard data={inventorySummary} />

      <div className="space-y-4">
        <DateRangeFilter
          title="Filtro reporte de servicio técnico"
          value={technicalServicesRange}
          onChange={setTechnicalServicesRange}
          onSubmit={handleTechnicalServicesFilterSubmit}
        />
        <TechnicalServicesSummaryCard data={technicalServicesSummary} />
      </div>
    </section>
  );
}
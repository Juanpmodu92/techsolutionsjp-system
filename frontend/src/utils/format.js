export function formatCurrency(value) {
  return `$ ${Number(value || 0).toLocaleString('es-CO')}`;
}

export function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('es-CO');
}

export function formatDateTime(value) {
  if (!value) return '-';
  return new Date(value).toLocaleString('es-CO');
}

export function formatClientName(item) {
  if (!item) return '-';

  if (item.client_type === 'company') {
    return item.company_name || '-';
  }

  const fullName = `${item.first_name ?? ''} ${item.last_name ?? ''}`.trim();
  return fullName || '-';
}

export function formatPaymentMethod(method) {
  const labels = {
    cash: 'Efectivo',
    bank_transfer: 'Transferencia',
    card: 'Tarjeta',
    nequi: 'Nequi',
    daviplata: 'Daviplata',
    other: 'Otro'
  };

  return labels[method] || method || '-';
}
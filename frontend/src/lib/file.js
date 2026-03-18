import { api } from './api';

export async function openPdfFromApi(url) {
  const response = await api.get(url, {
    responseType: 'blob'
  });

  const file = new Blob([response.data], { type: 'application/pdf' });
  const fileUrl = URL.createObjectURL(file);

  window.open(fileUrl, '_blank', 'noopener,noreferrer');

  window.setTimeout(() => {
    URL.revokeObjectURL(fileUrl);
  }, 60000);
}
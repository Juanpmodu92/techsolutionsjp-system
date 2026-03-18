import PDFDocument from 'pdfkit';

function formatCurrency(value) {
  return `$ ${Number(value || 0).toLocaleString('es-CO')}`;
}

function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('es-CO');
}

function getClientName(quote) {
  if (quote.client_type === 'company') {
    return quote.company_name || '-';
  }

  return `${quote.first_name ?? ''} ${quote.last_name ?? ''}`.trim() || '-';
}

export function generateQuotePdf(quote, res) {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 50
  });

  const fileName = `quote-${quote.quote_number}.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);

  doc.pipe(res);

  doc
    .fontSize(22)
    .text('Tech Solutions JP', { align: 'left' })
    .moveDown(0.3);

  doc
    .fontSize(10)
    .fillColor('#555')
    .text('Soluciones tecnológicas integrales')
    .text('Soporte técnico, infraestructura IT y desarrollo de software')
    .moveDown(1.2);

  doc
    .fillColor('#000')
    .fontSize(18)
    .text('Cotización', { align: 'right' })
    .fontSize(11)
    .text(`Número: ${quote.quote_number}`, { align: 'right' })
    .text(`Fecha emisión: ${formatDate(quote.issue_date)}`, { align: 'right' })
    .text(`Vence: ${formatDate(quote.expiration_date)}`, { align: 'right' })
    .text(`Estado: ${quote.status}`, { align: 'right' })
    .moveDown(1.5);

  doc
    .fontSize(12)
    .text('Cliente', { underline: true })
    .moveDown(0.4);

  doc
    .fontSize(11)
    .text(`Nombre: ${getClientName(quote)}`)
    .text(`Correo: ${quote.client_email || '-'}`)
    .text(`Teléfono: ${quote.phone || '-'}`)
    .text(`Ciudad: ${quote.city || '-'}`)
    .moveDown(1.2);

  const tableTop = doc.y;
  const colX = {
    type: 50,
    description: 110,
    qty: 360,
    unit: 420,
    total: 500
  };

  doc
    .fontSize(10)
    .text('Tipo', colX.type, tableTop)
    .text('Descripción', colX.description, tableTop)
    .text('Cant.', colX.qty, tableTop, { width: 40, align: 'right' })
    .text('Unitario', colX.unit, tableTop, { width: 70, align: 'right' })
    .text('Total', colX.total, tableTop, { width: 60, align: 'right' });

  doc
    .moveTo(50, tableTop + 15)
    .lineTo(545, tableTop + 15)
    .stroke();

  let y = tableTop + 25;

  quote.items.forEach((item) => {
    const lineTotal = Number(item.line_total || 0);
    const unitPrice = Number(item.unit_price || 0);

    doc
      .fontSize(9)
      .text(item.item_type, colX.type, y, { width: 50 })
      .text(item.description || '-', colX.description, y, { width: 230 })
      .text(String(item.quantity), colX.qty, y, { width: 40, align: 'right' })
      .text(formatCurrency(unitPrice), colX.unit, y, { width: 70, align: 'right' })
      .text(formatCurrency(lineTotal), colX.total, y, { width: 60, align: 'right' });

    y += 22;

    if (y > 700) {
      doc.addPage();
      y = 60;
    }
  });

  y += 10;

  doc
    .moveTo(340, y)
    .lineTo(545, y)
    .stroke();

  y += 12;

  doc
    .fontSize(10)
    .text(`Subtotal: ${formatCurrency(quote.subtotal)}`, 360, y, {
      width: 185,
      align: 'right'
    });

  y += 18;

  doc.text(`Descuento: ${formatCurrency(quote.discount)}`, 360, y, {
    width: 185,
    align: 'right'
  });

  y += 18;

  doc.text(`Impuesto: ${formatCurrency(quote.tax)}`, 360, y, {
    width: 185,
    align: 'right'
  });

  y += 22;

  doc
    .fontSize(12)
    .text(`Total: ${formatCurrency(quote.total)}`, 360, y, {
      width: 185,
      align: 'right'
    });

  y += 35;

  doc
    .fontSize(11)
    .text('Notas', 50, y, { underline: true });

  y += 18;

  doc
    .fontSize(10)
    .text(quote.notes || 'Sin notas adicionales.', 50, y, {
      width: 495,
      align: 'left'
    });

  doc.moveDown(2);

  doc
    .fontSize(9)
    .fillColor('#666')
    .text(
      'Documento generado automáticamente por el sistema de gestión de Tech Solutions JP.',
      50,
      760,
      { align: 'center', width: 495 }
    );

  doc.end();
}
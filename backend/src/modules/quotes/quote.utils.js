export function calculateQuoteTotals(items, discount = 0, tax = 0) {
  const normalizedItems = items.map((item) => {
    const line_total = Number((item.quantity * item.unit_price).toFixed(2));

    return {
      ...item,
      line_total
    };
  });

  const subtotal = Number(
    normalizedItems.reduce((sum, item) => sum + item.line_total, 0).toFixed(2)
  );

  const total = Number((subtotal - discount + tax).toFixed(2));

  return {
    items: normalizedItems,
    subtotal,
    discount: Number(discount.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    total
  };
}

export function buildNextQuoteNumber(lastQuoteNumber) {
  if (!lastQuoteNumber) {
    return 'Q-000001';
  }

  const numericPart = Number(lastQuoteNumber.split('-')[1] || 0);
  const nextNumber = numericPart + 1;

  return `Q-${String(nextNumber).padStart(6, '0')}`;
}
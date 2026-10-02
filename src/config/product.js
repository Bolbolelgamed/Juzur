export const product = Object.freeze({
  brand: 'Juzur',
  name: 'Juzur Sofa tray',
  listUnitPrice: 2500,
  finalUnitPrice: 2000,
  material: 'Zan wood',
  deliveryTime: 'Within 4\u20137 days',
  deliveryFeeMessage: 'No confirmation call required',
  paymentMethod: 'Cash on Delivery',
});

const englishNumberFormatter = new Intl.NumberFormat('en-EG', {
  maximumFractionDigits: 0,
});

export function formatPrice(value, language = 'en') {
  return language === 'ar'
    ? `${englishNumberFormatter.format(value)} جنيه`
    : `EGP ${englishNumberFormatter.format(value)}`;
}

export function calculateOrderTotals({ quantity, governorate, unitPrice = product.finalUnitPrice }) {
  const subtotal = unitPrice * quantity;
  const shippingFee = governorate
    ? (governorate === 'Cairo' || governorate === 'Giza' ? 50 : 75)
    : null;

  return {
    subtotal,
    shippingFee,
    total: shippingFee === null ? null : subtotal + shippingFee,
  };
}

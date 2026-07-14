export const product = Object.freeze({
  brand: 'Juzur',
  name: 'SofaTray by Juzur',
  originalUnitPrice: 2499,
  finalUnitPrice: 1999,
  discountLabel: '20% off',
  material: 'Zan wood',
  dimensions: '35 \u00d7 24 \u00d7 4.5 cm',
  deliveryTime: 'Within 4\u20137 days',
  deliveryFeeMessage: 'Confirmed by phone based on the governorate',
  paymentMethod: 'Cash on Delivery',
  offerMessage: 'Launch offer for the first 50 pieces',
});

const egpFormatter = new Intl.NumberFormat('en-EG', {
  style: 'currency',
  currency: 'EGP',
  currencyDisplay: 'code',
  maximumFractionDigits: 0,
});

export function formatPrice(value) {
  return egpFormatter.format(value).replace('EGP\u00a0', 'EGP ');
}

export const product = Object.freeze({
  brand: 'Juzur',
  name: 'SofaTray by Juzur',
  finalUnitPrice: 2000,
  material: 'Zan wood',
  deliveryTime: 'Within 4\u20137 days',
  deliveryFeeMessage: 'Confirmed by phone based on the governorate',
  paymentMethod: 'Cash on Delivery',
});

const englishNumberFormatter = new Intl.NumberFormat('en-EG', {
  maximumFractionDigits: 0,
});

const arabicNumberFormatter = new Intl.NumberFormat('ar-EG', {
  maximumFractionDigits: 0,
});

export function formatPrice(value, language = 'en') {
  return language === 'ar'
    ? `${arabicNumberFormatter.format(value)} ج.م`
    : `EGP ${englishNumberFormatter.format(value)}`;
}

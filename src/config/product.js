export const product = Object.freeze({
  brand: 'Juzur',
  name: 'Juzur Sofa tray',
  listUnitPrice: 2500,
  finalUnitPrice: 2000,
  material: 'Zan wood',
  deliveryTime: 'Within 4–7 days',
  deliveryFeeMessage: 'No confirmation call required',
  paymentMethod: 'Cash on Delivery',
});

const numberFormatter = new Intl.NumberFormat('en-EG', {
  maximumFractionDigits: 0,
});

export function formatPrice(value, language = 'en') {
  return language === 'ar'
    ? `${numberFormatter.format(value)} جنيه`
    : `EGP ${numberFormatter.format(value)}`;
}

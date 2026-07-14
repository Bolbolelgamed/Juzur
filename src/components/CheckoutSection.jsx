import { useRef, useState } from 'react';
import { formatPrice, product } from '../config/product.js';
import { isValidEgyptianMobile, normalizeEgyptianMobile } from '../utils/order.js';

const GOOGLE_SHEETS_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbwSe1QGurJhBKVmZCCwlsrltcZ6PTHpZlpQkqvt2sCAxdMQxjoCifCeC0ZDAqx9JEGxLA/exec';

const governorates = [
  'Alexandria',
  'Aswan',
  'Asyut',
  'Beheira',
  'Beni Suef',
  'Cairo',
  'Dakahlia',
  'Damietta',
  'Faiyum',
  'Gharbia',
  'Giza',
  'Ismailia',
  'Kafr El Sheikh',
  'Luxor',
  'Matrouh',
  'Minya',
  'Monufia',
  'New Valley',
  'North Sinai',
  'Port Said',
  'Qalyubia',
  'Qena',
  'Red Sea',
  'Sharqia',
  'Sohag',
  'South Sinai',
  'Suez',
];

const initialForm = {
  fullName: '',
  phone: '',
  governorate: '',
  areaCity: '',
  detailedAddress: '',
  landmark: '',
  quantity: '1',
};

function getFieldError(name, value) {
  const trimmedValue = String(value).trim();

  if (name === 'fullName' && !trimmedValue) return 'Enter your full name.';
  if (name === 'phone') {
    if (!trimmedValue) return 'Enter your mobile number.';
    if (!isValidEgyptianMobile(trimmedValue)) {
      return 'Enter a valid Egyptian mobile number beginning with 010, 011, 012, or 015.';
    }
  }
  if (name === 'governorate' && !trimmedValue) return 'Select your governorate.';
  if (name === 'areaCity' && !trimmedValue) return 'Enter your area or city.';
  if (name === 'detailedAddress' && !trimmedValue) return 'Enter the detailed delivery address.';
  if (name === 'quantity' && (!Number.isInteger(Number(value)) || Number(value) < 1)) {
    return 'Enter a quantity of 1 or more.';
  }

  return '';
}

function FormField({ id, label, error, children, className = '' }) {
  return (
    <div className={`form-field ${className}`.trim()}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && (
        <p className="field-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

export default function CheckoutSection() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const quantity = Math.max(1, Number(form.quantity) || 1);
  const subtotal = product.finalUnitPrice * quantity;

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: getFieldError(name, value) }));
    }
  }

  function validateField(event) {
    const { name, value } = event.target;
    setErrors((current) => ({ ...current, [name]: getFieldError(name, value) }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submittingRef.current) return;

    const nextErrors = Object.fromEntries(
      Object.entries(form)
        .filter(([name]) => name !== 'landmark')
        .map(([name, value]) => [name, getFieldError(name, value)])
        .filter(([, error]) => error),
    );

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setStatus({ message: 'Please correct the highlighted fields and try again.', type: 'error' });
      document.getElementById(Object.keys(nextErrors)[0])?.focus();
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    setStatus({ message: 'Sending your order request...', type: '' });

    const normalizedPhone = normalizeEgyptianMobile(form.phone);
    const submissionTimestamp = new Date().toISOString();
    const combinedAddress = `${form.detailedAddress}, ${form.areaCity}, ${form.governorate}`;
    const payload = {
      orderId: `JUZUR-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      productName: product.name,
      fullName: form.fullName.trim(),
      phone: normalizedPhone,
      governorate: form.governorate,
      areaCity: form.areaCity.trim(),
      detailedAddress: form.detailedAddress.trim(),
      landmark: form.landmark.trim(),
      quantity,
      unitPrice: product.finalUnitPrice,
      subtotal,
      originalUnitPrice: product.originalUnitPrice,
      discount: product.discountLabel,
      paymentMethod: product.paymentMethod,
      deliveryNote: product.deliveryFeeMessage,
      offer: product.offerMessage,
      submissionTimestamp,
      name: form.fullName.trim(),
      address: combinedAddress,
      pieces: String(quantity),
      originalPrice: formatPrice(product.originalUnitPrice),
      finalPrice: formatPrice(product.finalUnitPrice),
      submittedAt: submissionTimestamp,
    };

    try {
      await fetch(GOOGLE_SHEETS_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(payload),
      });
      setForm(initialForm);
      setErrors({});
      setStatus({
        message:
          'Your order request has been sent. We will call you to confirm the delivery details and final delivery fee.',
        type: 'success',
      });
    } catch {
      setStatus({
        message: 'We could not send your order. Please check your connection and try again.',
        type: 'error',
      });
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  function fieldProps(name) {
    return {
      id: name,
      name,
      value: form[name],
      onChange: updateField,
      onBlur: validateField,
      'aria-invalid': Boolean(errors[name]),
      'aria-describedby': errors[name] ? `${name}-error` : undefined,
    };
  }

  return (
    <section className="checkout-section" id="checkout">
      <div className="checkout-copy reveal">
        <p className="eyebrow dark">Cash on Delivery</p>
        <h2>Complete your order.</h2>
        <p className="checkout-reassurance">Delivery {product.deliveryTime}</p>
        <div className="checkout-price-panel" aria-label="Price offer">
          <div className="price-main">
            <span>Special price</span>
            <strong>{formatPrice(product.finalUnitPrice)}</strong>
          </div>
          <div className="price-details">
            <span className="old-price">{formatPrice(product.originalUnitPrice)}</span>
            <span className="discount-badge">{product.discountLabel}</span>
          </div>
          <p>{product.offerMessage}</p>
        </div>
        <p>Enter your details and we will call you to confirm delivery and the final delivery fee.</p>
      </div>

      <form className="checkout-form reveal delay" id="checkoutForm" onSubmit={handleSubmit} noValidate>
        <div className="checkout-fields">
          <FormField id="fullName" label="Full name" error={errors.fullName}>
            <input {...fieldProps('fullName')} type="text" autoComplete="name" required />
          </FormField>

          <FormField id="phone" label="Mobile number" error={errors.phone}>
            <input
              {...fieldProps('phone')}
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="010 1234 5678"
              required
            />
          </FormField>

          <FormField id="governorate" label="Governorate" error={errors.governorate}>
            <select {...fieldProps('governorate')} autoComplete="address-level1" required>
              <option value="" disabled>
                Select governorate
              </option>
              {governorates.map((governorate) => (
                <option value={governorate} key={governorate}>
                  {governorate}
                </option>
              ))}
            </select>
          </FormField>

          <FormField id="areaCity" label="Area / city" error={errors.areaCity}>
            <input {...fieldProps('areaCity')} type="text" autoComplete="address-level2" required />
          </FormField>

          <FormField id="detailedAddress" label="Detailed delivery address" error={errors.detailedAddress} className="full-width">
            <textarea {...fieldProps('detailedAddress')} rows="3" autoComplete="street-address" required />
          </FormField>

          <FormField id="landmark" label="Landmark (optional)" error={errors.landmark} className="full-width">
            <input {...fieldProps('landmark')} type="text" autoComplete="address-line2" />
          </FormField>

          <FormField id="quantity" label="Number of pieces" error={errors.quantity}>
            <input {...fieldProps('quantity')} type="number" min="1" step="1" inputMode="numeric" required />
          </FormField>
        </div>

        <button className="btn primary checkout-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending order...' : 'Confirm Cash on Delivery Order'}
        </button>
        <p className={`form-note ${status.type}`.trim()} aria-live="polite" role="status">
          {status.message}
        </p>
      </form>
    </section>
  );
}

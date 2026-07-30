import { useEffect } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import VideoSection from './components/VideoSection.jsx';
import GiftSection from './components/GiftSection.jsx';
import MaterialSection from './components/MaterialSection.jsx';
import ProductShowcase from './components/ProductShowcase.jsx';
import Gallery from './components/Gallery.jsx';
import FaqSection from './components/FaqSection.jsx';
import CheckoutSection from './components/CheckoutSection.jsx';
import Footer from './components/Footer.jsx';
import Modal from './components/Modal.jsx';
import { useSiteEffects } from './hooks/useSiteEffects.js';
import { useLanguage } from './i18n/LanguageContext.jsx';
import { product } from './config/product.js';
import {
  trackInitialMetaPageView,
  trackInitialMetaViewContent,
  trackMetaEvent,
} from './utils/metaPixel.js';

export default function App() {
  const { language, t } = useLanguage();
  useSiteEffects(language, t.images.preview);

  useEffect(() => {
    trackInitialMetaPageView();
    trackInitialMetaViewContent({
      content_ids: ['juzur-sofa-tray'],
      content_name: product.name,
      content_type: 'product',
      currency: 'EGP',
      value: product.finalUnitPrice,
    });

    const trackCheckoutStart = (event) => {
      if (!event.target.closest('a[href="#checkout"]')) return;
      trackMetaEvent('InitiateCheckout', {
        content_ids: ['juzur-sofa-tray'],
        content_name: product.name,
        content_type: 'product',
        currency: 'EGP',
        num_items: 1,
        value: product.finalUnitPrice,
      });
    };

    document.addEventListener('click', trackCheckoutStart);
    return () => document.removeEventListener('click', trackCheckoutStart);
  }, []);

  return (
    <>
      <div className="cursor-glow" />
      <Header />
      <main id="top">
        <Hero />
        <VideoSection />
        <GiftSection />
        <MaterialSection />
        <ProductShowcase />
        <Gallery />
        <FaqSection />
        <CheckoutSection />
      </main>
      <Footer />
      <a className="mobile-sticky-cta" href="#checkout">
        {t.nav.order}
      </a>
      <Modal />
    </>
  );
}

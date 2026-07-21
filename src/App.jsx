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

export default function App() {
  const { language, t } = useLanguage();
  useSiteEffects(language, t.images.preview);

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

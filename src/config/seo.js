import { locales } from '../i18n/locales.js';
import { calculateOrderTotals, product } from './product.js';
import { contact } from './contact.js';

export const siteOrigin = 'https://www.techwood-art.com';
export const languageUrls = { ar: `${siteOrigin}/`, en: `${siteOrigin}/en` };

export function structuredData(language = 'ar') {
  const t = locales[language];
  const url = languageUrls[language];
  const shipping = (regions, governorate) => ({
    '@type': 'OfferShippingDetails',
    shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'EG', addressRegion: regions },
    shippingRate: { '@type': 'MonetaryAmount', currency: 'EGP', value: calculateOrderTotals({ quantity: 1, governorate }).shippingFee },
  });
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization', '@id': `${siteOrigin}/#organization`,
        name: 'Juzur', alternateName: ['چذور', 'جذور', 'Juzur by Techwood Art'],
        url: `${siteOrigin}/`,
        logo: { '@type': 'ImageObject', url: `${siteOrigin}/assets/juzur-logo-header.webp`, width: 427, height: 200 },
        email: contact.email, telephone: '+201042511891',
        sameAs: ['https://www.instagram.com/juzur.by.techwoodart/'],
      },
      {
        '@type': 'WebSite', '@id': `${siteOrigin}/#website`,
        url: `${siteOrigin}/`, name: 'Juzur | چذور', alternateName: 'Juzur by Techwood Art',
        inLanguage: ['ar-EG', 'en-EG'], publisher: { '@id': `${siteOrigin}/#organization` },
      },
      {
        '@type': 'WebPage', '@id': `${url}#webpage`, url,
        name: t.meta.title, description: t.meta.description, inLanguage: `${language}-EG`,
        isPartOf: { '@id': `${siteOrigin}/#website` },
        mainEntity: { '@id': `${siteOrigin}/#sofa-tray` },
      },
      {
        '@type': 'Product', '@id': `${siteOrigin}/#sofa-tray`,
        name: language === 'ar' ? 'ترابيزة ذراع الكنبة من چذور — خشب زان طبيعي' : 'Juzur Natural Beech Wood Sofa Arm Tray',
        alternateName: language === 'ar' ? 'ترابيزة جذور للكنبة' : 'Juzur Sofa Tray',
        url,
        image: [
          `${siteOrigin}/assets/new-photos/juzur-photo-08.webp`,
          `${siteOrigin}/assets/uploads/juzur-lifestyle-day.webp`,
          `${siteOrigin}/assets/new-photos/juzur-extra-3688.webp`,
        ],
        description: t.hero.text,
        brand: { '@type': 'Brand', name: product.brand },
        manufacturer: { '@id': `${siteOrigin}/#organization` },
        material: language === 'ar' ? 'خشب زان طبيعي' : 'Natural beech wood',
        width: { '@type': 'QuantitativeValue', value: 24, unitCode: 'CMT' },
        depth: { '@type': 'QuantitativeValue', value: 35, unitCode: 'CMT' },
        height: { '@type': 'QuantitativeValue', value: 4.5, unitCode: 'CMT' },
        offers: {
          '@type': 'Offer', url: `${url}#checkout`, priceCurrency: 'EGP',
          price: String(product.finalUnitPrice),
          availability: 'https://schema.org/InStock', itemCondition: 'https://schema.org/NewCondition',
          seller: { '@id': `${siteOrigin}/#organization` },
          shippingDetails: [
            shipping(['Cairo', 'Giza'], 'Cairo'),
            shipping(locales.en.governorates.filter((name) => name !== 'Cairo' && name !== 'Giza'), 'Alexandria'),
          ],
        },
      },
    ],
  };
}

const escapeAttribute = (value) => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export function seoHead(language = 'ar') {
  const { title, description } = locales[language].meta;
  const tag = (name, content, property = false) => `    <meta ${property ? 'property' : 'name'}="${name}" content="${escapeAttribute(content)}" />`;
  return [
    '    <!-- SEO:START -->',
    `    <title>${escapeAttribute(title)}</title>`,
    tag('description', description),
    tag('robots', 'index, follow, max-image-preview:large'),
    `    <link rel="canonical" href="${languageUrls[language]}" />`,
    ...Object.entries(languageUrls).map(([lang, href]) => `    <link rel="alternate" hreflang="${lang}-EG" href="${href}" />`),
    `    <link rel="alternate" hreflang="x-default" href="${languageUrls.ar}" />`,
    tag('og:type', 'website', true), tag('og:site_name', 'Juzur | چذور', true),
    tag('og:url', languageUrls[language], true), tag('og:locale', `${language}_EG`, true),
    tag('og:locale:alternate', language === 'ar' ? 'en_EG' : 'ar_EG', true),
    tag('og:title', title, true), tag('og:description', description, true),
    tag('og:image', `${siteOrigin}/assets/juzur-link-preview.png`, true),
    tag('og:image:secure_url', `${siteOrigin}/assets/juzur-link-preview.png`, true),
    tag('og:image:width', '1200', true), tag('og:image:height', '630', true),
    tag('og:image:alt', language === 'ar' ? 'ترابيزة ذراع الكنبة من چذور، خشب زان طبيعي' : 'Juzur natural beech wood sofa arm tray', true),
    tag('twitter:card', 'summary_large_image'), tag('twitter:title', title),
    tag('twitter:description', description), tag('twitter:image', `${siteOrigin}/assets/juzur-link-preview.png`),
    `    <script type="application/ld+json">\n${JSON.stringify(structuredData(language), null, 2).replaceAll('<', '\\u003c')}\n    </script>`,
    '    <!-- SEO:END -->',
  ].join('\n');
}

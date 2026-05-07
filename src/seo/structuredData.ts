
import { APP_DOMAIN, SITE_NAME } from './seoConfig';

export const getSoftwareAppSchema = (description: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": SITE_NAME,
    "url": APP_DOMAIN,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "description": description,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    }
  };
};

export const getWebApplicationSchema = (name: string, description: string, url: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": `${name} | ${SITE_NAME}`,
    "url": url,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "description": description,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    }
  };
};

export const getBreadcrumbSchema = (items: { name: string; item: string }[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item
    }))
  };
};

export const getFAQSchema = (faqs: { q: string; a: string }[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };
};

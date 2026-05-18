
import { APP_DOMAIN, SITE_NAME, GLOBAL_OG_IMAGE } from './seoConfig';

export const getSoftwareAppSchema = (description: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": SITE_NAME,
    "url": APP_DOMAIN,
    "image": GLOBAL_OG_IMAGE,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "description": description,
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": `${APP_DOMAIN}/logo.png`
      }
    },
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
    "image": GLOBAL_OG_IMAGE,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "description": description,
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME
    },
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

export const getWebSiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_NAME,
    "url": APP_DOMAIN,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${APP_DOMAIN}/?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
};

export const getHowToSchema = (name: string, description: string, steps: { name: string; text: string }[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text
    }))
  };
};

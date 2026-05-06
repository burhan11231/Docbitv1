import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string;
}

export const SEO: React.FC<SEOProps> = ({ title, description, canonical, keywords }) => {
  const siteName = 'DocBit';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://res.cloudinary.com/dlesei0kn/image/upload/v1778091011/og_docbit_cebbib.jpg" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content="https://res.cloudinary.com/dlesei0kn/image/upload/v1778091011/og_docbit_cebbib.jpg" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={canonical} />}
    </Helmet>
  );
};

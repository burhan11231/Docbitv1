
export const APP_DOMAIN = 'https://docbit.in';
export const SITE_NAME = 'DocBit';
export const GLOBAL_OG_IMAGE = 'https://res.cloudinary.com/dlesei0kn/image/upload/v1778091011/og_docbit_cebbib.jpg';
export const THEME_COLOR = '#0B0F19';

export interface PageSEO {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogImage: string;
}

export const SEO_CONFIG: Record<string, PageSEO> = {
  home: {
    title: 'Free PDF Tools Online – Merge, Split & Convert PDFs',
    description: 'Use DocBit to merge PDF files, split documents, convert images into PDFs, and turn PDF pages into images. Fast online tools built for mobile and desktop users with no server uploads.',
    keywords: 'free pdf tools, merge pdf online, split pdf online, image to pdf converter, pdf to image converter, online pdf utility, free document tools india',
    canonical: APP_DOMAIN,
    ogImage: GLOBAL_OG_IMAGE,
  },
  about: {
    title: 'About DocBit – Fast, Privacy-Focused PDF Tools',
    description: 'Learn about DocBit, a platform built on the belief that document processing should be fast, private, and local. We use modern web technologies to process your PDFs entirely in your browser.',
    keywords: 'about docbit, browser-based pdf tools, private pdf processing, local pdf utility, wasm pdf editor',
    canonical: `${APP_DOMAIN}/about`,
    ogImage: GLOBAL_OG_IMAGE,
  },
  privacy: {
    title: 'Privacy Policy – Your Data Stays Yours',
    description: 'Read the DocBit Privacy Policy. We are committed to absolute privacy. Since we process files locally on your device, we never see or store your sensitive documents.',
    keywords: 'privacy policy, docbit privacy, data protection, local processing privacy',
    canonical: `${APP_DOMAIN}/privacy`,
    ogImage: GLOBAL_OG_IMAGE,
  },
  terms: {
    title: 'Terms of Service – Simple & Transparent',
    description: 'Review the Terms of Service for DocBit. We provide free, browser-based PDF tools with a focus on ease of use and user empowerment.',
    keywords: 'terms of service, docbit terms, usage policy',
    canonical: `${APP_DOMAIN}/terms`,
    ogImage: GLOBAL_OG_IMAGE,
  },
  imgToPdf: {
    title: 'Image to PDF Converter Online Free',
    description: 'Convert up to 50 images into a single PDF file online using DocBit. Designed for fast document creation on mobile and desktop with no server uploads or account required.',
    keywords: 'image to pdf, image to pdf online, convert image to pdf, photo to pdf converter, jpg to pdf online, image document converter, png to pdf',
    canonical: `${APP_DOMAIN}/tools/image-to-pdf`,
    ogImage: 'https://res.cloudinary.com/dlesei0kn/image/upload/v1778171813/image-to-pdf_wxix5w.jpg',
  },
  pdfToImg: {
    title: 'PDF to Image Converter Online Free',
    description: 'Extract PDF pages as high-quality images online with DocBit. Convert documents into image files quickly using a clean and mobile-friendly PDF to image tool.',
    keywords: 'pdf to image, convert pdf to image, pdf pages to images, extract images from pdf, online pdf image converter, pdf to jpg, pdf to png',
    canonical: `${APP_DOMAIN}/tools/pdf-to-images`,
    ogImage: 'https://res.cloudinary.com/dlesei0kn/image/upload/v1778171813/pdf-to-images_kjjor5.jpg',
  },
  merge: {
    title: 'Merge PDF Files Online Free',
    description: 'Combine multiple PDF files into one organized document using DocBit. Fast online PDF merging tool optimized for mobile and desktop users.',
    keywords: 'merge pdf, combine pdf files, online pdf merger, join pdf documents, merge documents online',
    canonical: `${APP_DOMAIN}/tools/merge-pdf`,
    ogImage: 'https://res.cloudinary.com/dlesei0kn/image/upload/v1778171812/merge-pdf_o8l7wm.jpg',
  },
  split: {
    title: 'Split PDF Online Free',
    description: 'Separate PDF pages instantly with DocBit’s fast PDF splitter. Extract pages or divide large documents online without server uploads.',
    keywords: 'split pdf, pdf splitter online, extract pdf pages, separate pdf files, divide pdf document',
    canonical: `${APP_DOMAIN}/tools/split-pdf`,
    ogImage: 'https://res.cloudinary.com/dlesei0kn/image/upload/v1778171812/split-pdf_nmlgsz.jpg',
  },
  grayscalePdf: {
    title: 'Grayscale PDF Online Free (Black & White)',
    description: 'Convert color PDFs to grayscale or pure black and white online with DocBit. Fast, private, and secure browser-based document optimization.',
    keywords: 'grayscale pdf, b&w pdf converter, black and white pdf, convert color pdf to gray, optimize pdf for printing',
    canonical: `${APP_DOMAIN}/tools/grayscale-pdf`,
    ogImage: 'https://res.cloudinary.com/dlesei0kn/image/upload/v1778697040/Grayscale_pdf_uwrthg.jpg',
  },
  contact: {
    title: 'Contact Us – Get in Touch with DocBit',
    description: 'Have questions, feedback, or need support? Contact the DocBit team directly. We are always here to help you with your document conversion needs.',
    keywords: 'contact docbit, pdf tools support, feedback, customer service',
    canonical: `${APP_DOMAIN}/contact`,
    ogImage: GLOBAL_OG_IMAGE,
  },
};

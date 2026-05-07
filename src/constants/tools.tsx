import { 
  Combine, 
  Scissors, 
  FileImage, 
  Images
} from 'lucide-react';
import React from 'react';

export type ToolCategory = 'edit' | 'convert' | 'optimize';

export interface PDFTool {
  id: string;
  name: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
  icon: React.ReactNode;
  category: ToolCategory;
  href: string;
  faqs?: { q: string; a: string }[];
}

export const TOOLS: PDFTool[] = [
  {
    id: 'img-to-pdf',
    name: 'Image to PDF',
    description: 'Convert images into a single, high-quality PDF in seconds.',
    seoTitle: 'Image to PDF Converter Online Free (JPG, PNG) | DocBit',
    seoDescription:
      'Free image to PDF converter online. Convert JPG to PDF, PNG to PDF instantly with no upload. Fast, secure, and processed locally on your device.',
    keywords: [
      'image to pdf',
      'jpg to pdf',
      'png to pdf',
      'convert images to pdf free',
      'image to pdf online'
    ],
    faqs: [
      { q: 'Is DocBit Image to PDF converter free?', a: 'Yes, DocBit is 100% free with no hidden charges or premium subscriptions.' },
      { q: 'Are my images uploaded to any server?', a: 'No. DocBit uses advanced on-device processing. Your images are converted to PDF directly in your browser and never touch our servers.' },
      { q: 'Can I use this tool on my mobile phone?', a: 'Absolutely! DocBit is fully optimized for mobile browsers, making it easy to create PDFs from your phone gallery.' }
    ],
    icon: <FileImage className="w-6 h-6" />,
    category: 'convert',
    href: '/tools/image-to-pdf',
  },

  {
    id: 'pdf-to-img',
    name: 'PDF to Image',
    description: 'Convert PDF pages into high-quality images for easy sharing.',
    seoTitle: 'Convert PDF to JPG or PNG Online Free | DocBit',
    seoDescription:
      'Free PDF to image converter online. Convert PDF to JPG or PNG instantly. Extract PDF pages as high-quality images with fast, private processing on your device.',
    keywords: [
      'pdf to jpg',
      'pdf to png',
      'pdf to image',
      'convert pdf to image free',
      'pdf to jpg online'
    ],
    faqs: [
      { q: 'Can I convert multiple PDF pages to images at once?', a: 'Yes, DocBit extracts every page from your PDF and allows you to download them all as high-quality images.' },
      { q: 'Is there a limit on file size?', a: 'Since processing is local, the only limit is your device\'s memory and processing power. We recommend files under 50MB for the best experience.' },
      { q: 'Do I need to sign up to use DocBit?', a: 'No signup or account is required. You can start converting PDFs to images immediately.' }
    ],
    icon: <Images className="w-6 h-6" />,
    category: 'convert',
    href: '/tools/pdf-to-images',
  },

  {
    id: 'merge',
    name: 'Merge PDF',
    description: 'Combine multiple PDF files into a single, organized document.',
    seoTitle: 'Merge PDF Files Online Free (Fast & Private) | DocBit',
    seoDescription:
      'Merge PDF files online free. Combine multiple PDFs into one document instantly with no upload. Fast, secure, and processed locally on your device.',
    keywords: [
      'merge pdf',
      'combine pdf',
      'merge pdf online',
      'combine pdf files free',
      'pdf merger'
    ],
    faqs: [
      { q: 'How many PDF files can I merge at once?', a: 'You can merge as many PDF files as you need. DocBit handles multiple files efficiently right in your browser.' },
      { q: 'Is merging PDFs on DocBit secure?', a: 'Extremely secure. Since your files are never uploaded to a server, your sensitive data stays on your machine throughout the merging process.' },
      { q: 'Can I reorder files before merging?', a: 'Yes, you can easily drag and drop files to change their sequence before clicking merge.' }
    ],
    icon: <Combine className="w-6 h-6" />,
    category: 'edit',
    href: '/tools/merge-pdf',
  },

  {
    id: 'split',
    name: 'Split PDF',
    description: 'Split a PDF into individual pages or extract only what you need.',
    seoTitle: 'Split PDF Online Free (Extract Pages Instantly) | DocBit',
    seoDescription:
      'Split PDF online free. Extract pages or separate PDF files instantly with no upload. Fast, secure, and processed entirely on your device.',
    keywords: [
      'split pdf',
      'extract pdf pages',
      'pdf splitter',
      'split pdf online free',
      'separate pdf pages'
    ],
    faqs: [
      { q: 'How do I extract a specific page range from a PDF?', a: 'Select the "Range" mode, enter the page numbers you want, and DocBit will generate a new PDF with just those pages.' },
      { q: 'Does splitting a PDF reduce its quality?', a: 'No, DocBit preserves the original quality of your pages during the splitting process.' },
      { q: 'Is it safe to split sensitive documents here?', a: 'Yes. Because all splitting happens locally in your browser, your document contents are never transmitted over the internet.' }
    ],
    icon: <Scissors className="w-6 h-6" />,
    category: 'edit',
    href: '/tools/split-pdf',
  },
];

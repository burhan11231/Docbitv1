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
}

export const TOOLS: PDFTool[] = [
  {
    id: 'img-to-pdf',
    name: 'Image to PDF',
    description: 'Convert images into a single, high-quality PDF in seconds.',
    seoTitle: 'Convert Images to PDF Online Free (JPG, PNG) | DocBit',
    seoDescription:
      'Free image to PDF converter online. Convert JPG to PDF, PNG to PDF instantly with no upload. Fast, secure, and processed locally on your device.',
    keywords: [
      'image to pdf',
      'jpg to pdf',
      'png to pdf',
      'convert images to pdf free',
      'image to pdf online'
    ],
    icon: <FileImage className="w-6 h-6" />,
    category: 'convert',
    href: '/tool/img-to-pdf',
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
    icon: <Images className="w-6 h-6" />,
    category: 'convert',
    href: '/tool/pdf-to-img',
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
    icon: <Combine className="w-6 h-6" />,
    category: 'edit',
    href: '/tool/merge',
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
    icon: <Scissors className="w-6 h-6" />,
    category: 'edit',
    href: '/tool/split',
  },
];
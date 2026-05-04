import { 
  Files,
  Combine, 
  Scissors, 
  Image as ImageIcon, 
  FileImage, 
  RotateCw
} from 'lucide-react';
import React from 'react';

export type ToolCategory = 'edit' | 'convert' | 'optimize';

export interface PDFTool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: ToolCategory;
  href: string;
}

export const TOOLS: PDFTool[] = [
  {
    id: 'img-to-pdf',
    name: 'Image to PDF',
    description: 'Convert images (JPG, PNG) into a polished PDF document.',
    icon: <FileImage className="w-6 h-6" />,
    category: 'convert',
    href: '/tool/img-to-pdf',
  },
  {
    id: 'pdf-to-img',
    name: 'PDF to Image',
    description: 'Convert PDF pages into high-quality JPG or PNG images.',
    icon: <Files className="w-6 h-6" />,
    category: 'convert',
    href: '/tool/pdf-to-img',
  },
  {
    id: 'merge',
    name: 'Merge PDF',
    description: 'Combine multiple PDF files into one single document.',
    icon: <Combine className="w-6 h-6" />,
    category: 'edit',
    href: '/tool/merge',
  },
  {
    id: 'split',
    name: 'Split PDF',
    description: 'Separate one page or a whole set for easy extraction.',
    icon: <Scissors className="w-6 h-6" />,
    category: 'edit',
    href: '/tool/split',
  },
];

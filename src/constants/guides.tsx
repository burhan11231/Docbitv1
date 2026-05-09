
import React from 'react';
import { FileText, Smartphone, HardDrive, ShieldCheck, Zap } from 'lucide-react';

export interface Guide {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: 'mobile' | 'privacy' | 'tips';
  content: string;
  icon: React.ReactNode;
  faqs?: { q: string; a: string }[];
  steps?: { name: string; text: string }[];
}

export const GUIDES: Guide[] = [
  {
    id: 'combine-pdf-mobile',
    slug: '/guides/how-to-combine-pdfs-on-mobile',
    title: 'How to Combine PDFs on Mobile via Local Browser Processing',
    description: 'Merge multiple PDF documents into one directly from your smartphone browser. No app install or server uploads required.',
    category: 'mobile',
    icon: <Smartphone className="w-6 h-6" />,
    content: `
      <h2>Secure Mobile PDF Management</h2>
      <p>Combining PDF files on a mobile device shouldn't require downloading invasive apps. In 2026, the safest way to handle your documents is right in your browser using secure, local-first processing.</p>
      
      <h2>Why Local Mobile Processing Matters?</h2>
      <ul>
        <li><strong>Privacy First:</strong> Your documents never leave your phone. All processing happens in your mobile browser memory.</li>
        <li><strong>No Cloud footprint:</strong> Since we don't upload your files, there is zero risk of data exposure.</li>
        <li><strong>Save Device Space:</strong> No need to install heavy PDF apps from the App Store or Play Store.</li>
      </ul>

      <h2>Step-by-Step Mobile Workflow</h2>
      <p>Whether you are using Safari on iPhone or Chrome on Android, the process is fast and private.</p>
    `,
    steps: [
      { name: 'Open DocBit', text: 'Visit DocBit.in/tools/merge-pdf on your mobile browser.' },
      { name: 'Select Local Files', text: 'Tap to select PDFs from your phone\'s local storage or downloads folder.' },
      { name: 'Arrange & Process', text: 'Reorder pages easily and tap "Merge". Processing happens instantly on your device CPU.' },
      { name: 'Immediate Download', text: 'Save the resulting PDF directly to your device.' }
    ],
    faqs: [
      { q: 'Is it really private on mobile?', a: 'Yes. Our engine uses standard WebAssembly to process files inside your browser tab without any server interaction.' },
      { q: 'Does it work on Android and iOS?', a: 'Yes, it supports all modern mobile browsers including Safari, Chrome, and Firefox.' }
    ]
  },
  {
    id: 'convert-photos-locally',
    slug: '/guides/how-to-convert-photos-to-pdf-locally',
    title: 'How to Convert Photos to PDF Locally (Privacy-First Guide)',
    description: 'Transform your photos into professional PDF documents without cloud uploads using secure browser-based processing.',
    category: 'tips',
    icon: <HardDrive className="w-6 h-6" />,
    content: `
      <h2>Zero-Upload PDF Conversion</h2>
      <p>Most online tools compromise your privacy by requiring photo uploads to remote servers. DocBit changes the game with client-side execution, allowing you to perform heavy-duty conversions directly on your hardware.</p>
      
      <h2>The Benefits of Local-Only Processing</h2>
      <p>By converting images locally, you eliminate wait times for uploads and downloads. More importantly, you maintain 100% sovereignty over your data. Your sensitive photos never touch a cloud server, ensuring absolute confidentiality.</p>
    `,
    steps: [
      { name: 'Choose Local Mode', text: 'Access the Image to PDF tool. Notice the "Local Processing" indicator.' },
      { name: 'Select Images', text: 'Pick photos from your gallery. They stay resident in your browser memory.' },
      { name: 'Local Engine Launch', text: 'Our browser-based engine converts your photos instantly.' },
      { name: 'Secure Download', text: 'The final PDF is generated on-the-fly and ready for your device.' }
    ],
    faqs: [
      { q: 'Is this safer than other converters?', a: 'Significantly. Traditional converters upload your files. DocBit processes them locally, so No Server Uploads ever occur.' },
      { q: 'Are all image types supported?', a: 'Yes, we support JPG, PNG, and WebP using local browser libraries.' }
    ]
  },
  {
    id: 'best-free-pdf-tools-2026',
    slug: '/guides/best-free-pdf-tools-2026',
    title: 'Best Free PDF Tools 2026: The Rise of Browser-Based Processing',
    description: 'Discover why local-first tools like DocBit are replacing cloud-based converters in the 2026 privacy revolution.',
    category: 'tips',
    icon: <ShieldCheck className="w-6 h-6" />,
    content: `
      <h2>The Post-Cloud Document Era</h2>
      <p>In 2026, user trust is won through transparency and local processing. Browser-based PDF tools have evolved to handle complex tasks like OCR and merging without needing server-side clusters.</p>
      
      <h2>Why DocBit is a Top Choice in 2026</h2>
      <p>Unlike legacy tools that retain files for processing, DocBit empowers you to remain the sole owner of your data. We offer browser-based PDF management that is cloud-free, fast, and entirely private.</p>
    `,
    faqs: [
      { q: 'What makes a tool "Privacy-First"?', a: 'A tool is privacy-first if it processes data locally on your device rather than uploading it to a centralized server.' },
      { q: 'Is local processing slower?', a: 'Actually, it is often faster because it eliminates the time spent uploading and downloading large files.' }
    ]
  }
];

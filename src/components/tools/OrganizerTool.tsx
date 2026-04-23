import React, { useState, useEffect, useRef } from 'react';
import { Dropzone } from '../Dropzone';
import { PDFDocument, degrees } from 'pdf-lib';
import * as pdfjs from 'pdfjs-dist';
import { 
  RotateCw, 
  Trash2, 
  Copy, 
  ArrowUp,
  ArrowDown,
  Download, 
  X,
  Loader2,
  CheckCircle2,
  MoreVertical
} from 'lucide-react';
import { motion } from 'motion/react';
import { readFileAsArrayBuffer, cn } from '../../lib/utils';

import { DownloadResult } from '../DownloadResult';

// Configure pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PageData {
  id: string;
  index: number;
  rotation: number;
  thumbnail: string;
  originalFileId: string;
}

export default function OrganizerTool() {
  const [pages, setPages] = useState<PageData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; url: string; size: number } | null>(null);

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setOriginalFile(files[0]);
    setIsProcessing(true);
    setProgress(0);

    try {
      const arrayBuffer = await readFileAsArrayBuffer(files[0]);
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      const newPages: PageData[] = [];
      const totalPages = pdf.numPages;

      for (let i = 1; i <= totalPages; i++) {
        try {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 0.4 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          if (context) {
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: context, canvas, viewport }).promise;
            
            const pageInfo: PageData = {
              id: `p-${i}-${Math.random().toString(36).substr(2, 9)}`,
              index: i - 1,
              rotation: 0,
              thumbnail: canvas.toDataURL('image/jpeg', 0.7),
              originalFileId: 'main'
            };
            
            newPages.push(pageInfo);
            // Incremental updates for feedback and reliability
            if (i % 2 === 0 || i === totalPages) {
              setPages([...newPages]);
            }
          }
        } catch (err) {
          console.warn(`Error on page ${i}:`, err);
        }
        setProgress(Math.round((i / totalPages) * 100));
      }

      setPages(newPages);
    } catch (error) {
      console.error('Error parsing PDF:', error);
      alert('Failed to parse PDF. It might be encrypted or corrupted.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMove = (id: string, direction: 'up' | 'down') => {
    const index = pages.findIndex(p => p.id === id);
    if (index === -1) return;
    
    const newPages = [...pages];
    if (direction === 'up' && index > 0) {
      [newPages[index], newPages[index - 1]] = [newPages[index - 1], newPages[index]];
    } else if (direction === 'down' && index < pages.length - 1) {
      [newPages[index], newPages[index + 1]] = [newPages[index + 1], newPages[index]];
    }
    setPages(newPages);
  };
  const handleRotate = (id: string) => {
    setPages(prev => prev.map(p => 
      p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p
    ));
  };

  const handleDelete = (id: string) => {
    setPages(prev => prev.filter(p => p.id !== id));
  };

  const handleDuplicate = (id: string) => {
    const pageIndex = pages.findIndex(p => p.id === id);
    if (pageIndex === -1) return;
    
    const pageToDuplicate = pages[pageIndex];
    const newPage = {
      ...pageToDuplicate,
      id: `p-dup-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    const newPages = [...pages];
    newPages.splice(pageIndex + 1, 0, newPage);
    setPages(newPages);
  };

  const exportPDF = async () => {
    if (!originalFile || pages.length === 0) return;
    setIsExporting(true);

    try {
      const originalBuffer = await readFileAsArrayBuffer(originalFile);
      const originalPdfDoc = await PDFDocument.load(originalBuffer);
      const newPdfDoc = await PDFDocument.create();

      for (const pageData of pages) {
        // Copy the specific page from the original document
        const [copiedPage] = await newPdfDoc.copyPages(originalPdfDoc, [pageData.index]);
        
        // Apply rotation
        const currentRotation = copiedPage.getRotation().angle;
        copiedPage.setRotation(degrees((currentRotation + pageData.rotation) % 360));
        
        newPdfDoc.addPage(copiedPage);
      }

      const pdfBytes = await newPdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      setResult({ blob, url, size: blob.size });

      setSuccessMessage('PDF processed successfully!');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = () => {
    if (!result || !originalFile) return;
    const link = document.createElement('a');
    link.href = result.url;
    link.download = `organized_${originalFile.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setPages([]);
    setResult(null);
    setOriginalFile(null);
  };

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <div className="w-32 h-32 border-8 border-neutral-100 dark:border-neutral-800 rounded-full" />
          <svg className="absolute top-0 left-0 w-32 h-32 -rotate-90">
             <circle
               cx="64"
               cy="64"
               r="56"
               stroke="currentColor"
               strokeWidth="8"
               fill="transparent"
               strokeDasharray={351.8}
               strokeDashoffset={351.8 - (351.8 * progress) / 100}
               className="text-blue-600 transition-all duration-300"
             />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-bold text-xl">
            {progress}%
          </div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Scanning Document</h2>
          <p className="text-neutral-500 dark:text-neutral-400">Extracting pages for your workspace...</p>
        </div>
      </div>
    );
  }

  if (successMessage && result) {
    return (
      <DownloadResult 
        filename={`organized_${originalFile?.name || 'document.pdf'}`} 
        size={result.size} 
        onDownload={handleDownload} 
        onReset={handleReset} 
      />
    );
  }

  if (pages.length === 0) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Dropzone onFilesSelected={handleFiles} label="Upload PDF to Organize" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-40">
      {/* Success Message */}
      {successMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 right-8 z-50 flex items-center gap-3 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-green-500/20"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-bold">{successMessage}</span>
          <button onClick={() => setSuccessMessage(null)} className="ml-4 hover:bg-white/20 p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between bg-white dark:bg-neutral-900 p-4 rounded-[24px] border border-neutral-200 dark:border-neutral-800 sticky top-4 z-20 shadow-lg shadow-black/5">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setPages([])}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors text-neutral-500"
            title="Start Over"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="h-6 w-[1px] bg-neutral-200 dark:bg-neutral-800" />
          <div className="flex flex-col">
            <span className="text-sm font-bold">{pages.length} Pages</span>
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Workspace</span>
          </div>
        </div>

        <button 
          onClick={exportPDF}
          disabled={isExporting}
          className={cn(
            "px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
            isExporting && "animate-pulse"
          )}
        >
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {isExporting ? 'Applying...' : 'Export PDF'}
        </button>
      </div>

      {/* Workspace List View */}
      <div className="flex-1 min-h-[500px]">
        <div className="flex flex-col gap-3">
          {pages.map((page, idx) => (
            <PageItem 
              key={page.id} 
              page={page} 
              isFirst={idx === 0}
              isLast={idx === pages.length - 1}
              handleRotate={handleRotate} 
              handleDuplicate={handleDuplicate} 
              handleDelete={handleDelete} 
              handleMove={handleMove}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PageItem({ page, isFirst, isLast, handleRotate, handleDuplicate, handleDelete, handleMove }: { 
  page: PageData; 
  isFirst: boolean;
  isLast: boolean;
  handleRotate: (id: string) => void; 
  handleDuplicate: (id: string) => void; 
  handleDelete: (id: string) => void; 
  handleMove: (id: string, direction: 'up' | 'down') => void;
  key?: React.Key;
}) {
  return (
    <div 
      className="relative group bg-white dark:bg-neutral-900 rounded-2xl p-3 border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all flex items-center gap-4"
    >
      {/* Thumbnail */}
      <div className="relative w-20 aspect-[1/1.414] bg-neutral-50 dark:bg-neutral-800 rounded-lg overflow-hidden border border-neutral-100 dark:border-neutral-800 flex-shrink-0">
        <motion.img 
          src={page.thumbnail} 
          alt={`Page ${page.index + 1}`}
          animate={{ rotate: page.rotation }}
          className="w-full h-full object-contain pointer-events-none"
        />
        {page.rotation !== 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-blue-500/10 pointer-events-none">
             <span className="text-[10px] font-black text-blue-600 bg-white/90 dark:bg-neutral-900/90 px-1 rounded shadow-sm">{page.rotation}°</span>
          </div>
        )}
      </div>

      {/* Info & Reorder */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-black tracking-tight text-neutral-900 dark:text-white uppercase">
            Page {page.index + 1}
          </span>
          <span className="text-[10px] font-bold text-neutral-400">ID: {page.id.split('-')[2]}</span>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-lg p-0.5">
             {!isFirst && (
               <button 
                 onClick={(e) => { e.stopPropagation(); handleMove(page.id, 'up'); }}
                 className="p-1 hover:text-blue-600 text-neutral-400 transition-colors"
                 title="Move Up"
               >
                 <ArrowUp className="w-4 h-4" />
               </button>
             )}
             {!isLast && (
               <button 
                 onClick={(e) => { e.stopPropagation(); handleMove(page.id, 'down'); }}
                 className="p-1 hover:text-blue-600 text-neutral-400 transition-colors"
                 title="Move Down"
               >
                 <ArrowDown className="w-4 h-4" />
               </button>
             )}
           </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
         <button 
           onClick={(e) => { e.stopPropagation(); handleRotate(page.id); }}
           className="w-10 h-10 flex items-center justify-center bg-neutral-50 dark:bg-neutral-800 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
           title="Rotate"
         >
            <RotateCw className="w-4 h-4" />
         </button>
         <button 
           onClick={(e) => { e.stopPropagation(); handleDuplicate(page.id); }}
           className="w-10 h-10 flex items-center justify-center bg-neutral-50 dark:bg-neutral-800 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
           title="Duplicate"
         >
            <Copy className="w-4 h-4" />
         </button>
         <button 
           onClick={(e) => { e.stopPropagation(); handleDelete(page.id); }}
           className="w-10 h-10 flex items-center justify-center bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-all rounded-xl"
           title="Delete"
         >
            <Trash2 className="w-4 h-4" />
         </button>
      </div>
    </div>
  );
}

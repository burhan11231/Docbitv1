import React, { useState } from 'react';
import { Dropzone } from '../Dropzone';
import { PDFDocument, PageSizes } from 'pdf-lib';
import { 
  FileImage, 
  Download, 
  ArrowUp,
  ArrowDown,
  X,
  Loader2,
  CheckCircle2,
  Trash2,
  Maximize2,
  Minimize2,
  StretchHorizontal
} from 'lucide-react';
import { motion } from 'motion/react';
import { readFileAsArrayBuffer, cn, formatBytes } from '../../lib/utils';
import { DownloadResult } from '../DownloadResult';

type FitMode = 'fit' | 'fill' | 'stretch';

interface ImgData {
  id: string;
  file: File;
  preview: string;
}

export default function ImgToPdfTool() {
  const [images, setImages] = useState<ImgData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fitMode, setFitMode] = useState<FitMode>('fit');
  const [pageSize, setPageSize] = useState<'A4' | 'auto'>('A4');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; size: number } | null>(null);

  const handleFiles = (files: File[]) => {
    const newImages = files.map(f => ({
      id: Math.random().toString(36).substr(2, 9),
      file: f,
      preview: URL.createObjectURL(f)
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const convertToPdf = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const imgData of images) {
        // Use a canvas to handle EXIF orientation automatically by the browser
        const img = new Image();
        img.src = imgData.preview;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas context failed');
        ctx.drawImage(img, 0, 0);

        const imgBytes = await new Promise<ArrayBuffer>((resolve) => {
          canvas.toBlob((blob) => {
            if (blob) {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as ArrayBuffer);
              reader.readAsArrayBuffer(blob);
            }
          }, 'image/jpeg', 0.95);
        });

        const embeddedImg = await pdfDoc.embedJpg(imgBytes);

        const dims = embeddedImg.scale(1);
        const page = pdfDoc.addPage(pageSize === 'A4' ? PageSizes.A4 : [dims.width, dims.height]);
        const { width: pWidth, height: pHeight } = page.getSize();

        let drawWidth = dims.width;
        let drawHeight = dims.height;
        let x = 0;
        let y = 0;

        if (pageSize === 'A4') {
          const ratio = dims.width / dims.height;
          const pRatio = pWidth / pHeight;

          if (fitMode === 'fit') {
            if (ratio > pRatio) {
              drawWidth = pWidth;
              drawHeight = pWidth / ratio;
            } else {
              drawHeight = pHeight;
              drawWidth = pHeight * ratio;
            }
          } else if (fitMode === 'fill') {
             if (ratio > pRatio) {
              drawHeight = pHeight;
              drawWidth = pHeight * ratio;
            } else {
              drawWidth = pWidth;
              drawHeight = pWidth / ratio;
            }
          } else if (fitMode === 'stretch') {
            drawWidth = pWidth;
            drawHeight = pHeight;
          }
          
          x = (pWidth - drawWidth) / 2;
          y = (pHeight - drawHeight) / 2;
        }

        page.drawImage(embeddedImg, {
          x,
          y,
          width: drawWidth,
          height: drawHeight,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResult({ url, size: blob.size });

      setSuccessMessage('Images converted to PDF successfully!');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (e) {
      console.error(e);
      alert('Error during conversion. Ensure files are valid images.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result.url;
    link.download = `images_to_pdf_${new Date().getTime()}.pdf`;
    link.click();
  };

  const handleReset = () => {
    setImages([]);
    setResult(null);
  };

  const removeImg = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleMove = (id: string, direction: 'up' | 'down') => {
    const index = images.findIndex(img => img.id === id);
    if (index === -1) return;
    
    const newImages = [...images];
    if (direction === 'up' && index > 0) {
      [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
    } else if (direction === 'down' && index < images.length - 1) {
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    }
    setImages(newImages);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-40">
       {result ? (
        <DownloadResult 
          filename={`images_to_pdf_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`} 
          size={result.size} 
          onDownload={handleDownload} 
          onReset={handleReset} 
        />
       ) : images.length === 0 ? (
        <Dropzone 
          onFilesSelected={handleFiles} 
          maxFiles={50} 
          accept={{ 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'] }}
          label="Convert Images to PDF" 
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">Image Sequence</h2>
                <div className="flex items-center gap-4">
                  <label className="text-blue-600 hover:text-blue-700 font-bold cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl transition-all">
                    <FileImage className="w-4 h-4" />
                    <span>Append More</span>
                    <input type="file" multiple className="hidden" accept="image/*" onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))} />
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                {images.map((img, idx) => (
                  <ImgItem 
                    key={img.id} 
                    img={img} 
                    isFirst={idx === 0}
                    isLast={idx === images.length - 1}
                    removeImg={removeImg} 
                    handleMove={handleMove}
                  />
                ))}
              </div>
           </div>

           <div className="lg:col-span-4 space-y-6">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[32px] p-8 shadow-xl shadow-black/5 space-y-8 sticky top-8">
                 <h3 className="text-lg font-black tracking-tight uppercase text-neutral-400 tracking-widest">Global Settings</h3>
                 
                 <div className="space-y-4">
                   <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Page Size</p>
                   <div className="flex gap-2">
                     {['A4', 'auto'].map(s => (
                       <button
                         key={s}
                         onClick={() => setPageSize(s as any)}
                         className={cn(
                           "flex-1 py-3 rounded-xl border-2 font-bold text-sm transition-all",
                           pageSize === s ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "border-neutral-100 dark:border-neutral-800 text-neutral-400"
                         )}
                       >{s === 'A4' ? 'Standard A4' : 'Image Native'}</button>
                     ))}
                   </div>
                 </div>

                 {pageSize === 'A4' && (
                   <div className="space-y-4">
                     <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Image Fit Mode</p>
                     <div className="grid grid-cols-1 gap-2">
                       {[
                         { id: 'fit', label: 'Contain (Best Fit)', icon: <Minimize2 className="w-4 h-4" /> },
                         { id: 'fill', label: 'Cover (Fill Page)', icon: <Maximize2 className="w-4 h-4" /> },
                         { id: 'stretch', label: 'Stretch to Edge', icon: <StretchHorizontal className="w-4 h-4" /> }
                       ].map(mode => (
                         <button
                           key={mode.id}
                           onClick={() => setFitMode(mode.id as FitMode)}
                           className={cn(
                             "flex items-center gap-3 px-4 py-3 rounded-xl border-2 font-bold text-left text-sm transition-all",
                             fitMode === mode.id ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "border-neutral-100 dark:border-neutral-800 text-neutral-400"
                           )}
                         >
                           {mode.icon}
                           {mode.label}
                         </button>
                       ))}
                     </div>
                   </div>
                 )}

                 <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800">
                    <button 
                      onClick={convertToPdf}
                      disabled={isProcessing}
                      className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                      {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6" />}
                      Generate PDF Document
                    </button>
                    <p className="mt-4 text-[10px] text-center text-neutral-400 font-bold uppercase tracking-widest leading-relaxed">
                      Instant Local Processing
                    </p>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

function ImgItem({ img, isFirst, isLast, removeImg, handleMove }: { 
  img: ImgData; 
  isFirst: boolean;
  isLast: boolean;
  removeImg: (id: string) => void;
  handleMove: (id: string, direction: 'up' | 'down') => void;
  key?: React.Key;
}) {
  return (
    <div 
      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-4 flex items-center gap-6 group hover:border-blue-500 dark:hover:border-blue-500 transition-all shadow-sm"
    >
      <div className="flex flex-col gap-1">
        {!isFirst && (
          <button 
            onClick={() => handleMove(img.id, 'up')}
            className="p-1 hover:text-blue-500 text-neutral-300 transition-colors"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
        {!isLast && (
          <button 
            onClick={() => handleMove(img.id, 'down')}
            className="p-1 hover:text-blue-500 text-neutral-300 transition-colors"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-inner border border-neutral-100 dark:border-neutral-800 flex-shrink-0">
        <img src={img.preview} alt="Preview" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold truncate text-lg">{img.file.name}</p>
        <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">{formatBytes(img.file.size)}</p>
      </div>
      <button 
        onClick={() => removeImg(img.id)}
        className="p-3 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all md:opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="w-6 h-6" />
      </button>
    </div>
  );
}

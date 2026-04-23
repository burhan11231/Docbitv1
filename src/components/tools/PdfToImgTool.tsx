import React, { useState } from 'react';
import { Dropzone } from '../Dropzone';
import { PDFDocument } from 'pdf-lib';
import * as pdfjs from 'pdfjs-dist';
import { 
  Image as ImageIcon, 
  Download, 
  X,
  Loader2,
  CheckCircle2,
  Settings,
  LayoutGrid,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import { readFileAsArrayBuffer, cn } from '../../lib/utils';
import JSZip from 'jszip';
import { DownloadResult } from '../DownloadResult';

// Configure pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PreviewImg {
  id: string;
  dataUrl: string;
  index: number;
}

export default function PdfToImgTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previews, setPreviews] = useState<PreviewImg[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [quality, setQuality] = useState(0.8);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; size: number } | null>(null);

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setFile(files[0]);
    setIsProcessing(true);
    setProgress(0);
    setPreviews([]);

    try {
      const buffer = await readFileAsArrayBuffer(files[0]);
      const loadingTask = pdfjs.getDocument({ data: buffer });
      const pdf = await loadingTask.promise;
      const totalPages = pdf.numPages;
      
      const newPreviews: PreviewImg[] = [];
      for (let i = 1; i <= totalPages; i++) {
        try {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 0.3 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (context) {
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: context, canvas, viewport }).promise;
            newPreviews.push({ id: `prev-${i}`, dataUrl: canvas.toDataURL('image/jpeg', 0.6), index: i });
            
            if (i % 5 === 0 || i === totalPages) {
              setPreviews([...newPreviews]);
            }
          }
        } catch (err) {
          console.warn(`Preview error on page ${i}:`, err);
        }
        setProgress(Math.round((i / totalPages) * 100));
      }
      setPreviews(newPreviews);
    } catch (e) {
      console.error(e);
      alert('Failed to process PDF previews.');
    } finally {
      setIsProcessing(false);
    }
  };

  const convertAndDownload = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(0);

    try {
      const buffer = await readFileAsArrayBuffer(file);
      const loadingTask = pdfjs.getDocument({ data: buffer });
      const pdf = await loadingTask.promise;
      const zip = new JSZip();
      const total = pdf.numPages;

      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // High res for export
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          await page.render({ canvasContext: context, canvas, viewport }).promise;
          
          const dataUrl = canvas.toDataURL(`image/${format}`, quality);
          const base64Data = dataUrl.split(',')[1];
          zip.file(`page_${i}.${format}`, base64Data, { base64: true });
        }
        setProgress(Math.round((i / total) * 100));
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      setResult({ url, size: content.size });
      
      setSuccessMessage('Images exported successfully!');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (e) {
      console.error(e);
      alert('Conversion failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const link = document.createElement('a');
    link.href = result.url;
    link.download = `exported_images_${file.name.replace('.pdf', '')}.zip`;
    link.click();
  };

  const handleReset = () => {
    setFile(null);
    setPreviews([]);
    setResult(null);
  };

  const renderContent = () => {
    if (result) {
      return (
        <DownloadResult 
          filename={`exported_images_${file?.name.replace('.pdf', '')}.zip`} 
          size={result.size} 
          onDownload={handleDownload} 
          onReset={handleReset} 
        />
      );
    }

    if (isProcessing && !file) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="font-bold text-neutral-500">Preparing engine... {progress}%</p>
        </div>
      );
    }

    if (!file) {
      return <Dropzone onFilesSelected={handleFiles} label="PDF to Image Converter" />;
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-40">
        {/* Controls - Left */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[32px] p-6 shadow-xl shadow-black/5 space-y-8">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold truncate">{file.name}</h3>
                  <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Convert to Visuals</p>
                </div>
             </div>

             <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Export Format</p>
                  <div className="flex gap-2 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
                     <button 
                       onClick={() => setFormat('png')}
                       className={cn(
                         "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
                         format === 'png' ? "bg-white dark:bg-neutral-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-neutral-500"
                       )}
                     >PNG</button>
                     <button 
                       onClick={() => setFormat('jpeg')}
                       className={cn(
                         "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
                         format === 'jpeg' ? "bg-white dark:bg-neutral-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-neutral-500"
                       )}
                     >JPG</button>
                  </div>
                </div>

                {format === 'jpeg' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Quality</p>
                       <span className="text-xs font-bold text-blue-600">{Math.round(quality * 100)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.1" 
                      max="1.0" 
                      step="0.1" 
                      value={quality}
                      onChange={(e) => setQuality(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                )}

                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-4">
                   <button 
                    onClick={convertAndDownload}
                    disabled={isProcessing}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                   >
                     {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                     {isProcessing ? `Processing (${progress}%)` : 'Generate Images'}
                   </button>
                   <button 
                    onClick={() => { setFile(null); setPreviews([]); }}
                    className="w-full text-center text-sm font-bold text-neutral-400 hover:text-neutral-600"
                   >Cancel</button>
                </div>
             </div>
          </div>

          <div className="bg-neutral-900 text-white rounded-[32px] p-6 space-y-4">
             <h4 className="text-xs font-black uppercase tracking-widest text-neutral-500">Note</h4>
             <p className="text-sm leading-relaxed opacity-80 font-medium">
               DocBit converts each page into a separate high-resolution image and bundles them into a ZIP archive for your convenience.
             </p>
          </div>
        </div>

        {/* Preview Grid - Right */}
        <div className="lg:col-span-8 flex flex-col gap-6">
           <div className="flex items-center justify-between">
              <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-blue-600" />
                Visual Preview 
                <span className="text-sm font-medium text-neutral-400">(First few pages)</span>
              </h3>
           </div>
           
           <div className="flex flex-col gap-3">
             {previews.map((p) => (
               <motion.div 
                 key={p.id}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-3 shadow-sm flex items-center gap-4"
               >
                  <div className="w-16 aspect-[1/1.41] bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden flex-shrink-0">
                     <img src={p.dataUrl} className="w-full h-full object-cover" alt={`Page ${p.index}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                     <span className="text-sm font-black uppercase text-neutral-900 dark:text-white tracking-widest leading-none">Page {p.index}</span>
                  </div>
               </motion.div>
             ))}
             {!isProcessing && previews.length === 0 && (
               <div className="col-span-full py-20 text-center text-neutral-400 text-sm font-medium">
                  Previews will appear here as we process.
               </div>
             )}
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {renderContent()}
    </div>
  );
}

import React, { useState } from 'react';
import { Dropzone } from '../Dropzone';
import { PDFDocument, PageSizes } from 'pdf-lib';
import { 
  Fullscreen, 
  Download, 
  X,
  Loader2,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { motion } from 'motion/react';
import { readFileAsArrayBuffer, cn } from '../../lib/utils';
import { DownloadResult } from '../DownloadResult';

type Presets = 'A4' | 'A5' | 'Letter' | 'Custom';

export default function ResizeTool() {
  const [file, setFile] = useState<File | null>(null);
  const [preset, setPreset] = useState<Presets>('A4');
  const [isProcessing, setIsProcessing] = useState(false);
  const [customWidth, setCustomWidth] = useState(595); // A4 Width in points
  const [customHeight, setCustomHeight] = useState(842); // A4 Height in points
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; size: number } | null>(null);

  const handleFiles = (files: File[]) => {
    if (files.length > 0) setFile(files[0]);
  };

  const processResize = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const bytes = await readFileAsArrayBuffer(file);
      const pdfDoc = await PDFDocument.load(bytes);
      const newPdfDoc = await PDFDocument.create();

      let targetSize: [number, number];
      switch (preset) {
        case 'A4': targetSize = PageSizes.A4; break;
        case 'A5': targetSize = PageSizes.A5; break;
        case 'Letter': targetSize = PageSizes.Letter; break;
        case 'Custom': targetSize = [customWidth, customHeight]; break;
      }

      const pages = pdfDoc.getPages();
      
      for (let i = 0; i < pages.length; i++) {
        const originalPage = pages[i];
        const { width, height } = originalPage.getSize();
        
        // Create new page
        const newPage = newPdfDoc.addPage([targetSize[0], targetSize[1]]);
        
        // Embed the original page
        const [embeddedPage] = await newPdfDoc.embedPdf(pdfDoc, [i]);
        
        // Calculate scale and position
        const scale = Math.min(targetSize[0] / width, targetSize[1] / height);
        const scaledWidth = width * scale;
        const scaledHeight = height * scale;
        const x = (targetSize[0] - scaledWidth) / 2;
        const y = (targetSize[1] - scaledHeight) / 2;
        
        // Draw the embedded page
        newPage.drawPage(embeddedPage, {
          x,
          y,
          width: scaledWidth,
          height: scaledHeight,
        });
      }

      const pdfBytes = await newPdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResult({ url, size: blob.size });

      setSuccessMessage('PDF resized successfully!');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (e) {
      console.error(e);
      alert('Error resizing PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const link = document.createElement('a');
    link.href = result.url;
    link.download = `resized_${file.name}`;
    link.click();
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-40">
       {result ? (
        <DownloadResult 
          filename={`resized_${file?.name}`} 
          size={result.size} 
          onDownload={handleDownload} 
          onReset={handleReset} 
        />
       ) : !file ? (
        <Dropzone onFilesSelected={handleFiles} label="PDF Page Resizer" />
      ) : (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[32px] overflow-hidden shadow-xl shadow-black/5">
           <div className="p-8 flex flex-col md:flex-row gap-12">
              <div className="flex-1 space-y-8">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center">
                      <Fullscreen className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{file.name}</h3>
                      <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Adjust Geometry</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Select Target Size</p>
                    <div className="flex flex-col gap-2">
                       {['A4', 'A5', 'Letter', 'Custom'].map((p) => (
                         <button
                           key={p}
                           onClick={() => setPreset(p as any)}
                           className={cn(
                             "py-4 px-6 rounded-2xl border-2 font-bold transition-all flex items-center justify-start gap-4",
                             preset === p ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "border-neutral-100 dark:border-neutral-800 text-neutral-400"
                           )}
                         >
                           <FileText className="w-5 h-5" />
                           {p}
                         </button>
                       ))}
                    </div>
                 </div>

                 {preset === 'Custom' && (
                   <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-neutral-400">Width (pt)</label>
                        <input 
                          type="number" 
                          value={customWidth} 
                          onChange={(e) => setCustomWidth(Number(e.target.value))} 
                          className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border-none rounded-xl font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-neutral-400">Height (pt)</label>
                        <input 
                          type="number" 
                          value={customHeight} 
                          onChange={(e) => setCustomHeight(Number(e.target.value))} 
                          className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border-none rounded-xl font-bold"
                        />
                      </div>
                   </div>
                 )}
              </div>

              <div className="md:w-64 flex flex-col justify-end gap-3">
                 <button 
                  onClick={processResize}
                  disabled={isProcessing}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                 >
                   {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                   {isProcessing ? 'Processing...' : 'Apply & Download'}
                 </button>
                 <button 
                  onClick={() => setFile(null)}
                  className="text-sm font-bold text-neutral-400 hover:text-neutral-600 dark:hover:text-white py-2"
                 >Back</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

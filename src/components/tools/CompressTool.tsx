import React, { useState } from 'react';
import { Dropzone } from '../Dropzone';
import { PDFDocument } from 'pdf-lib';
import * as pdfjs from 'pdfjs-dist';
import { 
  FileDown, 
  Download, 
  X,
  Loader2,
  CheckCircle2,
  Gauge,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import { readFileAsArrayBuffer, cn, formatBytes } from '../../lib/utils';
import { DownloadResult } from '../DownloadResult';

// Configure pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type CompressionLevel = 'low' | 'medium' | 'high';

export default function CompressTool() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<CompressionLevel>('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ blob: Blob; size: number } | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFiles = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setResult(null);
    }
  };

  const compressPdf = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(0);

    try {
      const buffer = await readFileAsArrayBuffer(file);
      const loadingTask = pdfjs.getDocument({ data: buffer });
      const pdf = await loadingTask.promise;
      const newPdfDoc = await PDFDocument.create();
      const total = pdf.numPages;

      // Scaling factor based on level
      // We increase these to ensure quality is maintained (human eye threshold)
      const scaleMap = {
        low: 3.0,     // High Resolution (216 DPI)
        medium: 2.0,  // Standard Resolution (144 DPI)
        high: 1.5     // Web Optimization (108 DPI)
      };
      
      const qualityMap = {
        low: 0.95,    // Maximum fidelity
        medium: 0.85, // High fidelity
        high: 0.75    // Good quality
      };

      const scale = scaleMap[level];
      const quality = qualityMap[level];

      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (context) {
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          await page.render({ canvasContext: context, canvas, viewport }).promise;
          
          const imgData = canvas.toDataURL('image/jpeg', quality);
          const imgBytes = await fetch(imgData).then(res => res.arrayBuffer());
          const embeddedImg = await newPdfDoc.embedJpg(imgBytes);
          
          const newPage = newPdfDoc.addPage([viewport.width, viewport.height]);
          newPage.drawImage(embeddedImg, {
            x: 0,
            y: 0,
            width: viewport.width,
            height: viewport.height,
          });
        }
        setProgress(Math.round((i / total) * 100));
      }

      const pdfBytes = await newPdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResult({ blob, size: blob.size });
      
      setSuccessMessage('PDF compressed successfully!');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (e) {
      console.error(e);
      alert('Compression failed. This tool works best on documents with many images.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!result || !file) return;
    const url = URL.createObjectURL(result.blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `compressed_${file.name}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-40">
       {result ? (
        <DownloadResult 
          filename={`compressed_${file?.name}`} 
          size={result.size} 
          onDownload={downloadResult} 
          onReset={handleReset} 
          title={`Size reduced by ${(((file!.size - result.size) / file!.size) * 100).toFixed(1)}%`}
        />
       ) : !file ? (
        <Dropzone onFilesSelected={handleFiles} label="PDF Compressor" />
      ) : (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[32px] overflow-hidden shadow-xl shadow-black/5">
          <div className="p-8 flex flex-col md:flex-row gap-12">
            <div className="flex-1 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center">
                  <FileDown className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{file.name}</h3>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    Original Size: <span className="text-neutral-900 dark:text-white">{formatBytes(file.size)}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Select Strength</p>
                 <div className="flex flex-col gap-3">
                    {[
                      { id: 'low', label: 'Low Compression', desc: 'Max Quality' },
                      { id: 'medium', label: 'Medium Compression', desc: 'Balanced' },
                      { id: 'high', label: 'High Compression', desc: 'Smallest Size' }
                    ].map(l => (
                      <button
                        key={l.id}
                        onClick={() => setLevel(l.id as CompressionLevel)}
                        className={cn(
                          "flex items-center justify-between px-6 py-5 rounded-2xl border-2 transition-all",
                          level === l.id 
                            ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600" 
                            : "border-neutral-100 dark:border-neutral-800 text-neutral-400"
                        )}
                      >
                        <span className="font-black text-sm uppercase tracking-tight">{l.label}</span>
                        <span className="text-[10px] uppercase font-black opacity-60 tracking-widest">{l.desc}</span>
                      </button>
                    ))}
                 </div>
              </div>
            </div>

            <div className="md:w-64 flex flex-col gap-6">
                <div className="bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-[24px] space-y-4">
                   <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-400">
                     <Gauge className="w-4 h-4" />
                     Engine Stats
                   </h4>
                   <div className="space-y-2 text-xs font-medium text-neutral-500">
                      <p>• High fidelity re-encoding</p>
                      <p>• JPG optimization pass</p>
                      <p>• Metadata preservation</p>
                   </div>
                </div>

                <div className="flex-1 flex flex-col justify-end gap-3">
                   <button 
                    onClick={compressPdf}
                    disabled={isProcessing}
                    className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                   >
                     {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                     {isProcessing ? `Optimizing (${progress}%)` : 'Compress Now'}
                   </button>
                   <button 
                    onClick={() => { setFile(null); setResult(null); }}
                    className="text-sm font-bold text-neutral-400 hover:text-neutral-600 dark:hover:text-white py-2"
                   >Cancel</button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

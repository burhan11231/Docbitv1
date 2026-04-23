import React, { useState } from 'react';
import { Dropzone } from '../Dropzone';
import { PDFDocument } from 'pdf-lib';
import { 
  Scissors, 
  Download, 
  X,
  Loader2,
  CheckCircle2,
  Settings,
  Split,
  FileBox
} from 'lucide-react';
import { readFileAsArrayBuffer, cn } from '../../lib/utils';
import JSZip from 'jszip';
import { DownloadResult } from '../DownloadResult';
import { motion } from 'motion/react';

type SplitMode = 'range' | 'every-page' | 'every-x-pages';

export default function SplitTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isSplitting, setIsSplitting] = useState(false);
  const [splitMode, setSplitMode] = useState<SplitMode>('range');
  const [rangeStr, setRangeStr] = useState('');
  const [everyX, setEveryX] = useState(1);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; size: number; isZip: boolean } | null>(null);

  const handleFiles = (files: File[]) => {
    if (files.length > 0) setFile(files[0]);
  };

  const processSplit = async () => {
    if (!file) return;
    setIsSplitting(true);

    try {
      const bytes = await readFileAsArrayBuffer(file);
      const pdfDoc = await PDFDocument.load(bytes);
      const totalPages = pdfDoc.getPageCount();
      const zip = new JSZip();

      if (splitMode === 'every-page') {
        for (let i = 0; i < totalPages; i++) {
          const newDoc = await PDFDocument.create();
          const [page] = await newDoc.copyPages(pdfDoc, [i]);
          newDoc.addPage(page);
          const pdfBytes = await newDoc.save();
          zip.file(`page_${i + 1}.pdf`, pdfBytes);
        }
      } else if (splitMode === 'range') {
        const ranges = rangeStr.split(',').map(r => r.trim());
        const newDoc = await PDFDocument.create();
        
        for (const range of ranges) {
          if (range.includes('-')) {
            const [start, end] = range.split('-').map(Number);
            const indices = Array.from({ length: end - start + 1 }, (_, i) => start + i - 1);
            const copied = await newDoc.copyPages(pdfDoc, indices.filter(idx => idx >= 0 && idx < totalPages));
            copied.forEach(p => newDoc.addPage(p));
          } else {
            const idx = Number(range) - 1;
            if (idx >= 0 && idx < totalPages) {
              const [page] = await newDoc.copyPages(pdfDoc, [idx]);
              newDoc.addPage(page);
            }
          }
        }
        
        const pdfBytes = await newDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setResult({ url, size: blob.size, isZip: false });
      } else if (splitMode === 'every-x-pages') {
        for (let i = 0; i < totalPages; i += everyX) {
          const newDoc = await PDFDocument.create();
          const indices = Array.from({ length: Math.min(everyX, totalPages - i) }, (_, k) => i + k);
          const copied = await newDoc.copyPages(pdfDoc, indices);
          copied.forEach(p => newDoc.addPage(p));
          const pdfBytes = await newDoc.save();
          zip.file(`part_${Math.floor(i / everyX) + 1}.pdf`, pdfBytes);
        }
      }

      if (splitMode !== 'range') {
        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        setResult({ url, size: content.size, isZip: true });
      }

      setSuccessMessage('PDF split successfully!');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error('Split error:', error);
      alert('Error splitting PDF. Check your range format.');
    } finally {
      setIsSplitting(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const link = document.createElement('a');
    link.href = result.url;
    link.download = result.isZip 
      ? `split_${file.name.replace('.pdf', '')}.zip` 
      : `extracted_${file.name}`;
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
          filename={result.isZip ? `split_${file?.name.replace('.pdf', '')}.zip` : `extracted_${file?.name}`}
          size={result.size}
          onDownload={handleDownload}
          onReset={handleReset}
        />
       ) : !file ? (
        <Dropzone onFilesSelected={handleFiles} label="Select PDF to Split" />
      ) : (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[32px] overflow-hidden shadow-xl shadow-black/5">
          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center">
                  <Scissors className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{file.name}</h3>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Ready to split</p>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <p className="text-sm font-black uppercase tracking-widest text-neutral-400">Select Mode</p>
                <div className="flex flex-col gap-3">
                  {[
                    { id: 'range', label: 'Extract Range', icon: <Settings className="w-4 h-4" /> },
                    { id: 'every-page', label: 'Extract All', icon: <Split className="w-4 h-4" /> },
                    { id: 'every-x-pages', label: 'Split Every X', icon: <FileBox className="w-4 h-4" /> }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSplitMode(m.id as SplitMode)}
                      className={cn(
                        "flex items-center justify-start gap-4 px-6 py-4 rounded-xl border font-bold text-sm transition-all text-left",
                        splitMode === m.id 
                          ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20" 
                          : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700"
                      )}
                    >
                      {m.icon}
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-[24px]">
                {splitMode === 'range' && (
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Page Ranges (e.g. 1, 3-5, 10)</label>
                    <input 
                      type="text" 
                      placeholder="Enter pages..."
                      value={rangeStr}
                      onChange={(e) => setRangeStr(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                    />
                  </div>
                )}
                {splitMode === 'every-x-pages' && (
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Pages per file</label>
                    <input 
                      type="number" 
                      min="1"
                      value={everyX}
                      onChange={(e) => setEveryX(parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                    />
                  </div>
                )}
                {splitMode === 'every-page' && (
                  <p className="text-sm font-medium text-neutral-500 italic">This will generate a separate PDF for every single page and pack them into a ZIP file.</p>
                )}
              </div>
            </div>

            <div className="md:w-72 flex flex-col justify-between">
               <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-[24px] border border-blue-100 dark:border-blue-900/10 space-y-4">
                  <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Tool Info</h4>
                  <p className="text-xs leading-relaxed text-blue-800/70 dark:text-blue-300 opacity-80">
                    Your PDF stays on your device. Splitting is done instantly using local computation.
                  </p>
               </div>
               
               <div className="pt-6 space-y-3">
                 <button 
                  onClick={processSplit}
                  disabled={isSplitting}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                 >
                   {isSplitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                   {isSplitting ? 'Splitting...' : 'Apply & Export'}
                 </button>
                 <button 
                  onClick={() => setFile(null)}
                  className="w-full py-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-white font-bold transition-all"
                 >
                  Back to Upload
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

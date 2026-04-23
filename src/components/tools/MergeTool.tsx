import React, { useState } from 'react';
import { Dropzone } from '../Dropzone';
import { PDFDocument } from 'pdf-lib';
import { 
  Trash2, 
  ArrowUp,
  ArrowDown,
  Download, 
  X,
  Loader2,
  CheckCircle2,
  FileText,
  Plus
} from 'lucide-react';
import { motion } from 'motion/react';
import { readFileAsArrayBuffer, cn, formatBytes } from '../../lib/utils';
import { DownloadResult } from '../DownloadResult';

interface FileData {
  id: string;
  file: File;
  size: number;
}

export default function MergeTool() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; url: string; size: number } | null>(null);

  const handleFiles = (newFiles: File[]) => {
    const formatted: FileData[] = newFiles.map(f => ({
      id: `f-${Math.random().toString(36).substr(2, 9)}`,
      file: f,
      size: f.size
    }));
    setFiles(prev => [...prev, ...formatted]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleMove = (id: string, direction: 'up' | 'down') => {
    const index = files.findIndex(f => f.id === id);
    if (index === -1) return;
    
    const newFiles = [...files];
    if (direction === 'up' && index > 0) {
      [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
    } else if (direction === 'down' && index < files.length - 1) {
      [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
    }
    setFiles(newFiles);
  };

  const mergePDFs = async () => {
    if (files.length < 2) return;
    setIsMerging(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const fileData of files) {
        const bytes = await readFileAsArrayBuffer(fileData.file);
        const pdf = await PDFDocument.load(bytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      setResult({ blob, url, size: blob.size });

      setSuccessMessage('PDFs merged successfully!');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error('Merge error:', error);
      alert('Failed to merge PDFs. One of the files might be encrypted.');
    } finally {
      setIsMerging(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result.url;
    link.download = `merged_${new Date().getTime()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setFiles([]);
    setResult(null);
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 max-w-4xl mx-auto pb-40">
      {/* Success Message */}
      {successMessage && result && (
        <DownloadResult 
          filename={`merged_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`} 
          size={result.size} 
          onDownload={handleDownload} 
          onReset={handleReset} 
        />
      )}

      {files.length === 0 && !result ? (
        <Dropzone 
          onFilesSelected={handleFiles} 
          maxFiles={10} 
          label="Select PDFs to Merge" 
          className="animate-in slide-in-from-bottom-10"
        />
      ) : (
        <>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-black tracking-tight">Merge Workspace</h2>
               <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{files.length} Files selected</span>
               </div>
            </div>

            <div className="space-y-3">
              {files.map((fileData, idx) => (
                <FileItem 
                  key={fileData.id} 
                  fileData={fileData} 
                  isFirst={idx === 0}
                  isLast={idx === files.length - 1}
                  removeFile={removeFile} 
                  handleMove={handleMove}
                />
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
               <label className="flex-1 w-full">
                 <div className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-2xl cursor-pointer transition-colors font-bold text-sm">
                   <Plus className="w-5 h-5" />
                   Add More PDFs
                 </div>
                 <input 
                   type="file" 
                   className="hidden" 
                   accept="application/pdf" 
                   multiple 
                   onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))} 
                 />
               </label>
               
               <button 
                onClick={mergePDFs}
                disabled={isMerging || files.length < 2}
                className="w-full sm:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 disabled:text-neutral-400 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-3"
               >
                 {isMerging ? (
                   <>
                     <Loader2 className="w-5 h-5 animate-spin" />
                     Merging...
                   </>
                 ) : (
                   <>
                     <Download className="w-5 h-5" />
                     Merge & Export PDF
                   </>
                 )}
               </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function FileItem({ fileData, isFirst, isLast, removeFile, handleMove }: { 
  fileData: FileData; 
  isFirst: boolean;
  isLast: boolean;
  removeFile: (id: string) => void;
  handleMove: (id: string, direction: 'up' | 'down') => void;
  key?: React.Key;
}) {
  return (
    <div 
      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 flex items-center gap-4 group hover:border-blue-500 dark:hover:border-blue-500 transition-all shadow-sm"
    >
      <div className="flex flex-col gap-1">
        {!isFirst && (
          <button 
            onClick={() => handleMove(fileData.id, 'up')}
            className="p-1 hover:text-blue-500 text-neutral-300 transition-colors"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}
        {!isLast && (
          <button 
            onClick={() => handleMove(fileData.id, 'down')}
            className="p-1 hover:text-blue-500 text-neutral-300 transition-colors"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
        <FileText className="w-6 h-6" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-bold truncate">{fileData.file.name}</p>
        <p className="text-xs text-neutral-400 font-medium">{formatBytes(fileData.size)}</p>
      </div>

      <button 
        onClick={() => removeFile(fileData.id)}
        className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all md:opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}

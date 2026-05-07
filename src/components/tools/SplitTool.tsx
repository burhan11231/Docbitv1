import React, { useState } from 'react';
import { Dropzone } from '../Dropzone';
import { PDFDocument } from 'pdf-lib';
import * as pdfjs from 'pdfjs-dist';
import { 
  Scissors, 
  Download, 
  Loader2,
  Settings2,
  Layers,
  FileText,
  X,
  Shield,
  FileBox,
  LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { readFileAsArrayBuffer, cn, formatBytes } from '../../lib/utils';
import JSZip from 'jszip';
import { DownloadResult } from '../DownloadResult';
import { ImageViewer } from '../ImageViewer';
import { SEO } from '../SEO';
import { ToolInfo } from '../ToolInfo';
import { ShieldCheck, Zap, Globe } from 'lucide-react';
import { TOOLS } from '../../constants/tools';
import { SEO_CONFIG, APP_DOMAIN } from '../../seo/seoConfig';
import { 
  getWebApplicationSchema, 
  getBreadcrumbSchema, 
  getFAQSchema 
} from '../../seo/structuredData';

// Configure pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type SplitMode = 'all' | 'range';

export default function SplitTool() {
  const tool = TOOLS.find(t => t.id === 'split')!;
  const [file, setFile] = useState<File | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pdfProxy, setPdfProxy] = useState<pdfjs.PDFDocumentProxy | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [previews, setPreviews] = useState<string[]>([]);
  
  const [isSplitting, setIsSplitting] = useState(false);
  const [splitMode, setSplitMode] = useState<SplitMode>('all');
  const [rangeStr, setRangeStr] = useState('');
  
  const [result, setResult] = useState<{ url: string; size: number; isZip: boolean } | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [highResPreview, setHighResPreview] = useState<string | null>(null);
  const [isRenderingPreview, setIsRenderingPreview] = useState(false);

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;
    const f = files[0];
    setIsLoadingFile(true);
    setFile(f);
    setResult(null);
    setPreviews([]);
    setPdfProxy(null);

    try {
      const buffer = await readFileAsArrayBuffer(f);
      const doc = await PDFDocument.load(buffer);
      setPdfDoc(doc);
      setTotalPages(doc.getPageCount());

      const loadingTask = pdfjs.getDocument({ data: buffer.slice(0) });
      const pdf = await loadingTask.promise;
      setPdfProxy(pdf);
      const prevs: string[] = [];
      const numToPreview = Math.min(12, doc.getPageCount());
      
      for (let i = 1; i <= numToPreview; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.3 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          await page.render({ canvasContext: context, canvas, viewport }).promise;
          prevs.push(canvas.toDataURL('image/jpeg', 0.8));
          setPreviews([...prevs]);
        }
      }
    } catch (e) {
      console.error(e);
      setFile(null);
    } finally {
      setIsLoadingFile(false);
    }
  };

  const handlePreview = async (index: number) => {
    if (!pdfProxy) return;
    setPreviewImage(previews[index] || '');
    setHighResPreview(null);
    setIsRenderingPreview(true);

    try {
      const page = await pdfProxy.getPage(index + 1);
      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (context) {
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, canvas, viewport }).promise;
        setHighResPreview(canvas.toDataURL('image/jpeg', 0.9));
      }
    } catch (e) {
      console.error('Split preview failed:', e);
    } finally {
      setIsRenderingPreview(false);
    }
  };

  const processSplit = async () => {
    if (!file || !pdfDoc) return;
    setIsSplitting(true);

    try {
      const zip = new JSZip();

      const saveBlob = async (doc: PDFDocument, name: string) => {
        const bytes = await doc.save();
        zip.file(name, bytes);
      };

      if (splitMode === 'all') {
        for (let i = 0; i < totalPages; i++) {
          const newDoc = await PDFDocument.create();
          const [page] = await newDoc.copyPages(pdfDoc, [i]);
          newDoc.addPage(page);
          await saveBlob(newDoc, `${file.name.replace('.pdf', '')}_p${i + 1}.pdf`);
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
        await saveBlob(newDoc, `extracted_${file.name}`);
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      setResult({ url, size: content.size, isZip: true });
    } catch (error) {
      console.error('Split error:', error);
    } finally {
      setIsSplitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-40 px-4">
      <SEO 
        {...SEO_CONFIG.split}
        schema={[
          getWebApplicationSchema(
            SEO_CONFIG.split.title,
            SEO_CONFIG.split.description,
            SEO_CONFIG.split.canonical
          ),
          getBreadcrumbSchema([
            { name: 'Home', item: APP_DOMAIN },
            { name: 'Split PDF', item: SEO_CONFIG.split.canonical }
          ]),
          getFAQSchema(tool.faqs || [])
        ]}
      />

       {result ? (
        <DownloadResult 
          filename={result.isZip ? `split_${file?.name.replace('.pdf', '')}.zip` : `extracted_${file?.name}`}
          size={result.size}
          onDownload={() => { const link = document.createElement('a'); link.href = result.url; link.download = result.isZip ? 'split.zip' : 'split.pdf'; link.click(); }}
          onReset={() => { setFile(null); setPdfDoc(null); setResult(null); setPreviews([]); }}
        />
       ) : !file ? (
        <>
          <Dropzone onFilesSelected={handleFiles} isProcessing={isLoadingFile} label="Split PDF Document" />
          
          <ToolInfo 
            title="PDF Splitter"
            steps={[
              { title: "Upload PDF", desc: "Select the PDF file you want to split or extract pages from." },
              { title: "Select Mode", desc: "Choose to extract all pages into separate files or define a custom range." },
              { title: "Split & Zip", desc: "Download your split pages instantly. We'll pack them in a ZIP." }
            ]}
            benefits={[
              { title: "In-Browser Split", desc: "No uploads. Your document is split locally, ensuring total privacy.", icon: <ShieldCheck className="w-8 h-8" /> },
              { title: "Range Support", desc: "Extract specific pages like '1, 3, 5-10' with our intelligent parser.", icon: <Zap className="w-8 h-8" /> },
              { title: "No Subscription", desc: "Get full access to all splitting features without any account or fees.", icon: <Globe className="w-8 h-8" /> }
            ]}
            faqs={tool.faqs || []}
            relatedTools={TOOLS.filter(t => t.id !== 'split')}
            seoContent={{
              title: 'Split PDF pages into separate files instantly',
              content: 'Need to extract a single page or divide a large PDF? DocBit offers the fastest way to split PDF online while keeping your data 100% private. Our tool runs entirely in your browser, meaning your sensitive documents never leave your computer. Perfect for separating chapters, extracting receipts, or breaking down large reports into manageable sections.'
            }}
          />
        </>
       ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
           <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between px-2">
                 <div className="space-y-1">
                    <h1 className="text-2xl font-black flex items-center gap-3">
                      Split PDF Pages
                    </h1>
                    <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Divide a PDF into separate files or extract specific pages easily.</p>
                 </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 rounded-[40px] border border-neutral-200 dark:border-neutral-800 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <LayoutGrid className="w-5 h-5 text-blue-600" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400">Page Structure</h3>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {previews.map((p, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePreview(i)} 
                      className="group relative aspect-[3/4] bg-neutral-50 dark:bg-neutral-800 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700 cursor-zoom-in shadow-sm hover:shadow-md transition-all"
                    >
                      <img src={p} className="w-full h-full object-cover" alt={`Page ${i+1}`} />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-white/90 dark:bg-black/90 backdrop-blur shadow-sm rounded-lg text-[10px] font-black text-neutral-600 dark:text-neutral-400">
                        P{i+1}
                      </div>
                    </motion.div>
                  ))}
                  {totalPages > 12 && (
                    <div className="aspect-[3/4] flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-700 p-4 text-center">
                      <FileBox className="w-6 h-6 text-neutral-300 mb-2" />
                      <p className="text-[10px] font-black uppercase text-neutral-400 leading-tight">
                        +{totalPages - 12} More Pages
                      </p>
                    </div>
                  )}
                </div>
              </div>
           </div>

           <ImageViewer src={highResPreview || previewImage || ''} isOpen={!!previewImage} onClose={() => { setPreviewImage(null); setHighResPreview(null); }} />

           <div className="lg:col-span-4 space-y-6">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[32px] p-8 shadow-xl shadow-black/5 space-y-8 sticky top-8">
                 <div className="space-y-6">
                    <div className="flex items-center gap-2 text-blue-600">
                      <Settings2 className="w-4 h-4" />
                      <h3 className="text-[10px] font-black tracking-widest uppercase">Split Strategy</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                       {[
                         { id: 'all', label: 'Extract All', icon: <Layers className="w-4 h-4" /> },
                         { id: 'range', label: 'Custom Range', icon: <Scissors className="w-4 h-4" /> }
                       ].map((mode) => (
                         <button
                           key={mode.id}
                           onClick={() => setSplitMode(mode.id as SplitMode)}
                           className={cn(
                             "flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left",
                             splitMode === mode.id 
                               ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20" 
                               : "bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700"
                           )}
                         >
                           <div className="w-8 h-8 rounded-lg bg-current/10 flex items-center justify-center">
                             {React.cloneElement(mode.icon as React.ReactElement, { className: "w-4 h-4" })}
                           </div>
                           <span className="text-xs font-black uppercase tracking-tight">{mode.label}</span>
                         </button>
                       ))}
                    </div>

                    <AnimatePresence mode="wait">
                      {splitMode === 'range' && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-2"
                        >
                          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Page Range</label>
                          <input 
                            type="text" 
                            placeholder="e.g. 1-5, 8, 12-15"
                            value={rangeStr} 
                            onChange={(e) => setRangeStr(e.target.value)} 
                            className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border-none font-black text-lg focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
                          />
                          <p className="text-[10px] font-bold text-neutral-500 uppercase">Separate ranges with commas</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-black uppercase text-neutral-400">Active File</p>
                        <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                          {totalPages} Pages
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-blue-600">
                            <FileText className="w-5 h-5" />
                         </div>
                         <div className="flex-1 min-w-0">
                           <p className="text-[10px] font-black text-neutral-900 dark:text-white truncate">{file.name}</p>
                           <p className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">{formatBytes(file.size)}</p>
                         </div>
                      </div>
                    </div>
                 </div>

                 <div className="pt-6">
                    <button 
                      onClick={processSplit}
                      disabled={isSplitting}
                      className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isSplitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Scissors className="w-5 h-5" />}
                      {isSplitting ? 'PROCESSING...' : 'SPLIT PDF'}
                    </button>
                    <div className="mt-4 flex items-center justify-center gap-2 text-[8px] font-black uppercase text-neutral-400 tracking-[0.2em]">
                       <Shield className="w-3 h-3" />
                       Private Local Logic
                    </div>
                 </div>
              </div>
           </div>
        </div>
       )}
    </div>
  );
}

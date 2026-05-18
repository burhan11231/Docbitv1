import React, { useState } from 'react';
import { Dropzone } from '../Dropzone';
import { PDFDocument, PageSizes, rgb, StandardFonts } from 'pdf-lib';
import { useFileExitConfirm } from '../../hooks/useFileExitConfirm';
import { NavigationConfirmModal } from '../NavigationConfirmModal';
import { 
  FileImage, 
  Download, 
  ArrowUp,
  ArrowDown,
  Trash2,
  Maximize2,
  Minimize2,
  StretchHorizontal,
  RotateCw,
  Plus,
  Loader2,
  Wand2,
  Settings2,
  Layout,
  Palette,
  Shield,
  ShieldCheck,
  Zap,
  Globe,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { readFileAsArrayBuffer, cn, formatBytes } from '../../lib/utils';
import { DownloadResult } from '../DownloadResult';
import { ImageViewer } from '../ImageViewer';
import { ColorPickerModal } from '../ColorPickerModal';
import { FileGrid, GridItem } from '../FileGrid';
import { SEO } from '../SEO';
import { ToolInfo } from '../ToolInfo';
import { ToolContent } from '../ToolContent';
import { TOOLS } from '../../constants/tools';
import { SEO_CONFIG, APP_DOMAIN } from '../../seo/seoConfig';
import { 
  getWebApplicationSchema, 
  getBreadcrumbSchema,
  getHowToSchema
} from '../../seo/structuredData';
import { getFAQSchema } from '../../utils/schema/faqSchema';
import { TOOL_SEO_CONTENT } from '../../constants/toolSeoContent';

type FitMode = 'fit' | 'fill' | 'stretch';
type PageSize = 'A4' | 'A3' | 'Letter' | 'Custom';
type Orientation = 'portrait' | 'landscape';

export default function ImgToPdfTool() {
  const MAX_FILES = 300;
  const tool = TOOLS.find(t => t.id === 'img-to-pdf')!;
  const [images, setImages] = useState<GridItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddingFiles, setIsAddingFiles] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState('');
  
  // Layout Settings
  const [fitMode, setFitMode] = useState<FitMode>('fit');
  const [pageSize, setPageSize] = useState<PageSize>('A4');
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [customWidth, setCustomWidth] = useState(595);
  const [customHeight, setCustomHeight] = useState(842);
  const [margin, setMargin] = useState({ top: 0, bottom: 0, left: 0, right: 0 });
  const [bgColor, setBgColor] = useState('#ffffff');
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  
  // Advanced Options
  const [quality, setQuality] = useState<'high' | 'medium' | 'small'>('medium');

  const [result, setResult] = useState<{ url: string; size: number } | null>(null);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [viewerItem, setViewerItem] = useState<GridItem | null>(null);

  const blocker = useFileExitConfirm({ isDirty: images.length > 0 && !result });

  const handleFiles = async (files: File[]) => {
    if (images.length >= MAX_FILES) {
      alert(`Maximum of ${MAX_FILES} images allowed.`);
      return;
    }

    const remainingSlots = MAX_FILES - images.length;
    const filesToProcess = files.slice(0, remainingSlots);

    setIsAddingFiles(true);
    
    const newItems: GridItem[] = [];
    
    // Create pending items for immediate visual feedback
    for (const f of filesToProcess) {
       const item: GridItem = {
          id: Math.random().toString(36).substr(2, 9),
          file: f,
          size: f.size,
          rotation: 0,
          status: 'processing'
       };
       newItems.push(item);
    }

    setImages(prev => [...prev, ...newItems]);
    setResult(null);
    setIsDownloaded(false);

    // Generate thumbnails in background
    for (const item of newItems) {
        try {
            const url = URL.createObjectURL(item.file);
            setImages(prev => prev.map(img => 
                img.id === item.id ? { ...img, thumbnail: url, status: 'ready' } : img
            ));
            await new Promise(r => setTimeout(r, 20)); // Keep UI thread smooth
        } catch (e) {
            console.error('Thumbnail error:', e);
        }
    }

    setIsAddingFiles(false);
  };

  const handleRotate = (id: string, newRotation?: number) => {
    setImages(prev => prev.map(img => 
      img.id === id 
        ? { ...img, rotation: newRotation !== undefined ? newRotation : ((img.rotation || 0) + 90) % 360 } 
        : img
    ));
    
    if (viewerItem?.id === id) {
        setViewerItem(prev => prev ? { ...prev, rotation: newRotation !== undefined ? newRotation : ((prev.rotation || 0) + 90) % 360 } : null);
    }
  };

  const removeImg = (id: string) => {
    setImages(prev => {
        const item = prev.find(i => i.id === id);
        if (item?.thumbnail) URL.revokeObjectURL(item.thumbnail);
        return prev.filter(img => img.id !== id);
    });
  };

  const handleMove = (id: string, direction: 'left' | 'right') => {
    const index = images.findIndex(img => img.id === id);
    if (index === -1) return;
    
    const newImages = [...images];
    if (direction === 'left' && index > 0) {
      [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
    } else if (direction === 'right' && index < images.length - 1) {
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    }
    setImages(newImages);
  };

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return rgb(r, g, b);
  };

  const convertToPdf = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    setProgress(0);
    setProcessingStage('Initializing engine...');

    try {
      const pdfDoc = await PDFDocument.create();
      const qualityValue = quality === 'high' ? 0.92 : quality === 'medium' ? 0.75 : 0.5;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) throw new Error('Canvas context failed');

      for (let i = 0; i < images.length; i++) {
        const imgData = images[i];
        setProcessingStage(`Rendering Part ${i + 1} of ${images.length}...`);
        setProgress(Math.round((i / images.length) * 100));

        const img = new Image();
        img.src = URL.createObjectURL(imgData.file);
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        const rotation = imgData.rotation || 0;
        const isSwapped = rotation === 90 || rotation === 270;
        
        canvas.width = isSwapped ? img.naturalHeight : img.naturalWidth;
        canvas.height = isSwapped ? img.naturalWidth : img.naturalHeight;
        
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
        ctx.restore();

        URL.revokeObjectURL(img.src);

        const imgBytes = await new Promise<ArrayBuffer>((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (blob) {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as ArrayBuffer);
              reader.readAsArrayBuffer(blob);
            } else {
              reject(new Error('Encoding failed'));
            }
          }, 'image/jpeg', qualityValue);
        });

        const embeddedImg = await pdfDoc.embedJpg(imgBytes);
        const imgDims = embeddedImg.scale(1);

        let pWidth, pHeight;
        if (pageSize === 'Custom') {
          pWidth = customWidth; pHeight = customHeight;
        } else {
          const standard = PageSizes[pageSize];
          pWidth = orientation === 'portrait' ? standard[0] : standard[1];
          pHeight = orientation === 'portrait' ? standard[1] : standard[0];
        }

        const page = pdfDoc.addPage([pWidth, pHeight]);
        page.drawRectangle({ x: 0, y: 0, width: pWidth, height: pHeight, color: hexToRgb(bgColor) });

        const safeWidth = pWidth - margin.left - margin.right;
        const safeHeight = pHeight - margin.top - margin.bottom;
        let drawWidth = imgDims.width, drawHeight = imgDims.height;
        const ratio = imgDims.width / imgDims.height, safeRatio = safeWidth / safeHeight;

        if (fitMode === 'fit') {
          if (ratio > safeRatio) { drawWidth = safeWidth; drawHeight = safeWidth / ratio; }
          else { drawHeight = safeHeight; drawWidth = safeHeight * ratio; }
        } else if (fitMode === 'fill') {
          if (ratio > safeRatio) { drawHeight = safeHeight; drawWidth = safeHeight * ratio; }
          else { drawWidth = safeWidth; drawHeight = safeWidth / ratio; }
        } else if (fitMode === 'stretch') {
          drawWidth = safeWidth; drawHeight = safeHeight;
        }

        page.drawImage(embeddedImg, {
          x: margin.left + (safeWidth - drawWidth) / 2,
          y: margin.bottom + (safeHeight - drawHeight) / 2,
          width: drawWidth, height: drawHeight,
        });

        if (i % 5 === 0) await new Promise(r => setTimeout(r, 0));
      }

      setProcessingStage('Finalizing Document...');
      setProgress(100);

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResult({ url: URL.createObjectURL(blob), size: blob.size });
      setIsDownloaded(false);
    } catch (e) {
      console.error(e);
      alert('Error during conversion. Large files can be memory intensive.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setProcessingStage('');
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result.url;
    link.download = `docbit_images_${new Date().getTime()}.pdf`;
    link.click();
    setIsDownloaded(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-40">
      <SEO 
        {...SEO_CONFIG.imgToPdf}
        schema={[
          getWebApplicationSchema(SEO_CONFIG.imgToPdf.title, SEO_CONFIG.imgToPdf.description, SEO_CONFIG.imgToPdf.canonical),
          getBreadcrumbSchema([
            { name: 'Home', item: APP_DOMAIN },
            { name: 'Image to PDF', item: SEO_CONFIG.imgToPdf.canonical }
          ]),
          getFAQSchema(tool.faqs || []),
          tool.steps && getHowToSchema(tool.name, tool.description, tool.steps)
        ].filter(Boolean)}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-neutral-900 dark:text-white uppercase italic">
            Convert <span className="text-blue-600">Images</span> to PDF
          </h1>
          <p className="text-sm font-bold uppercase tracking-widest text-neutral-400">High-performance image synthesis on your device.</p>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <DownloadResult 
            filename="images_to_pdf.pdf" 
            size={result.size} 
            onDownload={handleDownload} 
            isDownloaded={isDownloaded}
            onBack={() => setResult(null)}
            onReset={() => { setImages([]); setResult(null); setIsDownloaded(false); }} 
          />
        )}
      </AnimatePresence>

       {images.length === 0 ? (
        <Dropzone 
          onFilesSelected={handleFiles} 
          maxFiles={MAX_FILES} 
          isProcessing={isAddingFiles}
          accept={{ 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'], 'image/webp': ['.webp'] }}
          label="Select Images (JPG, PNG, WebP)" 
        />
      ) : (
        <div className="space-y-8 italic">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[40px] p-8 shadow-xl shadow-black/5 space-y-10 not-italic">
            {/* Options grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              <div className="xl:col-span-8 flex flex-col h-full space-y-8">
                <div className="flex items-center gap-2 text-blue-600">
                  <Layout className="w-5 h-5" />
                  <h3 className="text-xs font-black tracking-widest uppercase">Layout Configuration</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-3">
                       <p className="text-[10px] font-black uppercase text-neutral-400 tracking-wider italic">Page Format</p>
                       <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                         {['A4', 'A3', 'Letter', 'Custom'].map(s => (
                           <button
                             key={s}
                             onClick={() => setPageSize(s as any)}
                             className={cn(
                               "py-2.5 rounded-xl border-2 font-black text-[10px] uppercase transition-all shadow-sm",
                               pageSize === s ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "border-neutral-100 dark:border-neutral-800 text-neutral-400 hover:border-neutral-200"
                             )}
                           >{s}</button>
                         ))}
                       </div>
                    </div>

                    {pageSize === 'Custom' ? (
                      <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-1 duration-300">
                         <div className="space-y-1.5">
                            <p className="text-[8px] font-black text-neutral-400 uppercase tracking-widest">Width (pt)</p>
                            <input type="number" value={customWidth} onChange={(e) => setCustomWidth(Number(e.target.value))} className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl text-sm font-black border-2 border-transparent focus:border-blue-500 transition-all outline-none" />
                         </div>
                         <div className="space-y-1.5">
                            <p className="text-[8px] font-black text-neutral-400 uppercase tracking-widest">Height (pt)</p>
                            <input type="number" value={customHeight} onChange={(e) => setCustomHeight(Number(e.target.value))} className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl text-sm font-black border-2 border-transparent focus:border-blue-500 transition-all outline-none" />
                         </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                         <p className="text-[10px] font-black uppercase text-neutral-400 tracking-wider italic">Orientation</p>
                         <div className="grid grid-cols-2 gap-2">
                           {['portrait', 'landscape'].map(o => (
                             <button
                               key={o}
                               onClick={() => setOrientation(o as Orientation)}
                               className={cn(
                                 "py-2.5 rounded-xl border-2 font-black text-[10px] uppercase transition-all shadow-sm",
                                 orientation === o ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "border-neutral-100 dark:border-neutral-800 text-neutral-400 hover:border-neutral-200"
                               )}
                             >{o}</button>
                           ))}
                         </div>
                      </div>
                    )}
                    
                    <div className="space-y-3">
                       <p className="text-[10px] font-black uppercase text-neutral-400 tracking-wider italic">Background</p>
                       <button 
                         onClick={() => setIsColorPickerOpen(true)}
                         className="w-full flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border-2 border-transparent hover:border-blue-500 transition-all group"
                       >
                         <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl shadow-lg border border-white/20" style={{ backgroundColor: bgColor }} />
                           <span className="text-xs font-black uppercase text-neutral-900 dark:text-white">{bgColor}</span>
                         </div>
                         <Palette className="w-4 h-4 text-neutral-400 group-hover:text-blue-600 transition-colors" />
                       </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase text-neutral-400 tracking-wider italic">Fit Algorithm</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'fit', label: 'Contain', icon: <Minimize2 className="w-4 h-4 text-blue-500" /> },
                          { id: 'fill', label: 'Cover', icon: <Maximize2 className="w-4 h-4 text-purple-500" /> },
                          { id: 'stretch', label: 'Warp', icon: <StretchHorizontal className="w-4 h-4 text-orange-500" /> }
                        ].map(m => (
                          <button
                            key={m.id}
                            onClick={() => setFitMode(m.id as FitMode)}
                            className={cn(
                              "flex flex-col items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all shadow-sm",
                              fitMode === m.id ? "border-current bg-current/5" : "border-neutral-100 dark:border-neutral-800 text-neutral-400 hover:border-neutral-200"
                            )}
                            style={{ color: fitMode === m.id ? (m.id === 'fit' ? '#2563eb' : m.id === 'fill' ? '#9333ea' : '#ea580c') : undefined }}
                          >
                            {m.icon}
                            <span className="text-[8px] font-black uppercase tracking-widest">{m.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                       <p className="text-[10px] font-black uppercase text-neutral-400 tracking-wider italic">Margins (px)</p>
                       <div className="grid grid-cols-2 gap-3">
                          <div className="relative">
                             <input type="number" value={margin.top} onChange={(e) => setMargin(m => ({ ...m, top: Number(e.target.value), bottom: Number(e.target.value) }))} className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl text-sm font-black border-2 border-transparent focus:border-blue-500" />
                             <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-black text-neutral-300 uppercase">Y-Axis</span>
                          </div>
                          <div className="relative">
                             <input type="number" value={margin.left} onChange={(e) => setMargin(m => ({ ...m, left: Number(e.target.value), right: Number(e.target.value) }))} className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl text-sm font-black border-2 border-transparent focus:border-blue-500" />
                             <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-black text-neutral-300 uppercase">X-Axis</span>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <p className="text-[10px] font-black uppercase text-neutral-400 tracking-wider italic">Quality Profile</p>
                       <div className="flex gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                          {['small', 'medium', 'high'].map(q => (
                            <button
                              key={q}
                              onClick={() => setQuality(q as any)}
                              className={cn(
                                "flex-1 py-2 rounded-lg font-black text-[9px] uppercase transition-all",
                                quality === q ? "bg-white dark:bg-neutral-700 text-blue-600 shadow-sm" : "text-neutral-400 hover:text-neutral-600"
                              )}
                            >{q}</button>
                          ))}
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="xl:col-span-4 h-full border-t xl:border-t-0 xl:border-l border-neutral-100 dark:border-neutral-800 pt-8 xl:pt-0 xl:pl-8 flex flex-col justify-center">
                <div className="space-y-6">
                  {isProcessing && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">{processingStage}</span>
                        <span className="text-[10px] font-black text-blue-600">{progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-blue-600" />
                      </div>
                    </div>
                  )}
                  <button 
                    onClick={convertToPdf}
                    disabled={isProcessing}
                    className="group w-full py-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black rounded-[24px] shadow-2xl shadow-blue-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                  >
                    {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Wand2 className="w-6 h-6 transition-transform group-hover:scale-110" />}
                    <span className="text-xl tracking-tight uppercase italic">{isProcessing ? 'COMPILING...' : 'EXPORT TO PDF'}</span>
                  </button>
                  <div className="flex flex-col items-center gap-3">
                     <div className="flex items-center justify-center gap-2 text-[8px] font-black uppercase text-neutral-400 tracking-[0.2em]">
                       <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                       Safe Local Conversion
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ColorPickerModal 
            isOpen={isColorPickerOpen}
            onClose={() => setIsColorPickerOpen(false)}
            color={bgColor}
            onChange={setBgColor}
            title="Canvas Background"
          />

          <ImageViewer 
            src={viewerItem?.thumbnail || ''} 
            rotation={viewerItem?.rotation || 0}
            isOpen={!!viewerItem} 
            onClose={() => setViewerItem(null)} 
            onRotate={(rot) => viewerItem && handleRotate(viewerItem.id, rot)}
          />

          <FileGrid 
            items={images}
            onRemove={removeImg}
            onMove={handleMove}
            onRotate={handleRotate}
            onPreview={setViewerItem}
            onAddMore={handleFiles}
            accept="image/*"
            maxFiles={MAX_FILES}
          />
        </div>
      )}

      <ToolContent 
        toolId={tool.id}
        toolName="Image to PDF"
        toolType="Convert"
        description="Transform your photos, scans, and images into professionally formatted PDF documents. Fast, secure, and entirely on your device."
        longContent={TOOL_SEO_CONTENT.imgToPdf}
      />

      <NavigationConfirmModal 
        isOpen={blocker.state === 'blocked'}
        onConfirm={() => blocker.proceed?.()}
        onCancel={() => blocker.reset?.()}
      />
    </div>
  );
}
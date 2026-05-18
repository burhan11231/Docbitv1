import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ZoomIn, ZoomOut, Loader2, RotateCw } from 'lucide-react';
import { cn } from '../lib/utils';

interface ImageViewerProps {
  src: string;
  isOpen: boolean;
  onClose: () => void;
  alt?: string;
  rotation?: number;
  loading?: boolean;
  onRotate?: (newRotation: number) => void;
}

export function ImageViewer({ 
  src, 
  isOpen, 
  onClose, 
  alt, 
  rotation = 0, 
  loading = false,
  onRotate
}: ImageViewerProps) {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setZoom(1); // Reset zoom when opening
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));

  const rotate = () => {
    if (onRotate) {
      onRotate((rotation + 90) % 360);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-8 lg:p-12 bg-black/95 backdrop-blur-xl"
          onClick={onClose}
        >
          {/* Background overlay to fix "small visible part" issue - ensures no gaps */}
          <div className="absolute inset-x-0 -inset-y-10 bg-black pointer-events-none" />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-12 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Controls */}
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 bg-black/40 backdrop-blur-3xl p-2 rounded-[24px] border border-white/10 ring-1 ring-black/40 overflow-hidden px-4 md:px-6 mb-6">
               <div className="flex items-center gap-1">
                 <button 
                   onClick={handleZoomOut}
                   className="p-2.5 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                   title="Zoom Out"
                 >
                   <ZoomOut className="w-5 h-5" />
                 </button>
                 <span className="px-3 text-[10px] font-black text-white uppercase tracking-widest min-w-[65px] text-center opacity-70">
                   {Math.round(zoom * 100)}%
                 </span>
                 <button 
                   onClick={handleZoomIn}
                   className="p-2.5 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                   title="Zoom In"
                 >
                   <ZoomIn className="w-5 h-5" />
                 </button>
               </div>
               
               <div className="hidden md:block w-px h-6 bg-white/10" />

               <div className="flex items-center gap-1">
                 {onRotate && (
                    <button 
                      onClick={rotate}
                      className="p-2.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-xl transition-all flex items-center gap-2"
                      title="Rotate 90°"
                    >
                      <RotateCw className="w-5 h-5" />
                      <span className="hidden sm:block text-[9px] font-black uppercase tracking-widest italic">Rotate</span>
                    </button>
                 )}
               </div>
            </div>

            {/* Image Container - Fixed Aspect Ratio Frame */}
            <div className="relative group w-full max-w-5xl aspect-square bg-neutral-950/50 rounded-[32px] md:rounded-[40px] shadow-[0_0_150px_rgba(0,0,0,0.8)] border border-white/5 flex items-center justify-center overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,transparent_70%)]" />
               
               {loading ? (
                <div className="flex flex-col items-center gap-6 relative z-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/30 blur-3xl rounded-full scale-150 animate-pulse" />
                    <Loader2 className="w-16 h-16 text-blue-500 animate-spin relative z-10" />
                  </div>
                  <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] opacity-40 italic">Synthesizing Pixels...</p>
                </div>
              ) : (
                <div className="relative transition-all duration-700 ease-out flex items-center justify-center w-full h-full z-10">
                  <motion.div
                    animate={{ rotate: rotation }}
                    transition={{ type: 'spring', damping: 30, stiffness: 150 }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <motion.img
                      src={src}
                      alt={alt || "Image preview"}
                      animate={{ 
                        scale: zoom
                      }}
                      transition={{ type: 'spring', damping: 30, stiffness: 150 }}
                      className="max-w-full max-h-full object-contain select-none shadow-2xl rounded-sm"
                    />
                  </motion.div>
                </div>
              )}
              
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center bg-black/60 backdrop-blur-2xl px-6 py-3 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-2xl">
                <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] pointer-events-none italic">Encrypted Secure Preview</span>
              </div>
            </div>

            {/* Close Button / Bottom Bar */}
            <div className="mt-8 flex items-center gap-6">
                <button
                   onClick={onClose}
                   className="px-10 py-4 bg-white/5 hover:bg-neutral-100 hover:text-black text-white font-black rounded-2xl border border-white/10 transition-all active:scale-95 text-xs uppercase tracking-[0.2em] italic shadow-xl"
                >
                    Dismiss Viewer
                </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


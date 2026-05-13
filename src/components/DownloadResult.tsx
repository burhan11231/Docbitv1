import React, { useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { Download, RotateCcw, CheckCircle2, FileText, Zap, ArrowLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatBytes } from '../lib/utils';

interface DownloadResultProps {
  filename: string;
  size: number;
  onDownload: () => void;
  onReset: () => void;
  onBack: () => void;
  isDownloaded: boolean;
  title?: string;
}

export function DownloadResult({ filename, size, onDownload, onReset, onBack, isDownloaded, title = "Process Complete" }: DownloadResultProps) {
  const [showExitWarning, setShowExitWarning] = React.useState(false);
  const [exitAction, setExitAction] = React.useState<'back' | 'reset' | null>(null);

  // Prevent body scroll when modal is open
  useLayoutEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handleBack = () => {
    if (!isDownloaded) {
      setExitAction('back');
      setShowExitWarning(true);
    } else {
      onBack();
    }
  };

  const handleReset = () => {
    if (!isDownloaded) {
      setExitAction('reset');
      setShowExitWarning(true);
    } else {
      onReset();
    }
  };

  const confirmExit = () => {
    if (exitAction === 'back') onBack();
    if (exitAction === 'reset') onReset();
    setShowExitWarning(false);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 h-[100dvh]">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBack}
        className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm h-[100dvh] w-full"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-sm bg-white dark:bg-neutral-900 rounded-[32px] overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 z-10"
      >
        <AnimatePresence mode="wait">
          {showExitWarning ? (
            <motion.div 
              key="warning"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8 text-center space-y-6"
            >
              <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto">
                <RotateCcw className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black uppercase italic tracking-tight">Unsaved Changes</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-bold uppercase leading-relaxed">
                  You haven't downloaded your file yet. <br/> Are you sure you want to leave?
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button 
                  onClick={() => setShowExitWarning(false)}
                  className="py-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-black rounded-xl text-[10px] uppercase tracking-widest"
                >
                  Stay
                </button>
                <button 
                  onClick={confirmExit}
                  className="py-3 bg-red-600 text-white font-black rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-red-500/20"
                >
                  Leave
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="relative"
            >
              <div className="p-6 space-y-6">
                {/* Close Button */}
                <button 
                  onClick={handleBack}
                  className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center space-y-3 pt-2">
                   <div className={cn(
                     "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors",
                     isDownloaded ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400" : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                   )}>
                     <CheckCircle2 className="w-8 h-8" />
                   </div>
                   <div>
                     <h2 className="text-xl font-black tracking-tight uppercase italic">
                       {isDownloaded ? "Downloaded Success" : title}
                     </h2>
                     <p className="text-xs text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-tighter">
                       {isDownloaded ? "Saved to device" : "Your file is ready"}
                     </p>
                   </div>
                </div>

                <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-2xl space-y-3 border border-neutral-100 dark:border-neutral-800">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-black truncate text-sm uppercase italic">{filename}</p>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest leading-none">
                          {formatBytes(size)}
                        </p>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                   <button 
                     onClick={onDownload}
                     className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                   >
                     <Download className="w-4 h-4" />
                     {isDownloaded ? "Download Again" : "Download File"}
                   </button>
                   
                   <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={handleBack}
                        className="py-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 font-black rounded-xl transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back
                      </button>
                      <button 
                        onClick={handleReset}
                        className="py-3 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 font-black rounded-xl transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset
                      </button>
                   </div>
                </div>
              </div>

              <div className="bg-neutral-950 p-3 flex items-center justify-center gap-2 text-white/40 text-[9px] font-black uppercase tracking-[0.2em] italic">
                 <Zap className="w-3 h-3 text-blue-500" />
                 Instant Local Export
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>,
    document.body
  );
}


import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

interface ColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  color: string;
  onChange: (color: string) => void;
  title?: string;
  presets?: string[];
}

const DEFAULT_PRESETS = [
  '#ffffff', '#000000', '#f8fafc', '#f1f5f9', 
  '#3b82f6', '#2563eb', '#10b981', '#059669', 
  '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'
];

export function ColorPickerModal({ 
  isOpen, 
  onClose, 
  color, 
  onChange, 
  title = "Pick a Color",
  presets = DEFAULT_PRESETS 
}: ColorPickerModalProps) {
  const [tempColor, setTempColor] = useState(color);

  useEffect(() => {
    if (isOpen) setTempColor(color);
  }, [isOpen, color]);

  const handleApply = () => {
    onChange(tempColor);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-[40px] shadow-2xl overflow-hidden border border-neutral-100 dark:border-neutral-800"
          >
            <div className="p-6 md:p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black tracking-tight text-neutral-900 dark:text-white">{title}</h3>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Select or define color</p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>

              {/* Main Preview Area */}
              <div className="space-y-6">
                <div 
                  className="w-full h-32 rounded-2xl shadow-inner border border-neutral-100 dark:border-neutral-800 flex items-end p-4 transition-all duration-500 overflow-hidden relative"
                  style={{ backgroundColor: tempColor }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="relative z-10 w-full flex items-center justify-between">
                    <span className={cn(
                      "font-mono font-black text-sm uppercase tracking-widest px-2 py-1 rounded bg-black/20 backdrop-blur-md",
                      parseInt(tempColor.replace('#', ''), 16) > 0xffffff / 2 ? "text-black" : "text-white"
                    )}>
                      {tempColor}
                    </span>
                  </div>
                </div>

                {/* Horizontal Presets */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Global Palette</span>
                    <button 
                      onClick={() => setTempColor('#ffffff')}
                      className="text-[10px] font-black uppercase text-blue-600 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {presets.map((p) => (
                      <motion.button
                        key={p}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setTempColor(p)}
                        className={cn(
                          "w-10 h-10 rounded-full border-2 transition-all p-0.5",
                          tempColor === p ? "border-blue-600 scale-110 shadow-lg shadow-blue-600/20" : "border-neutral-100 dark:border-neutral-800"
                        )}
                        style={{ backgroundColor: p }}
                      >
                        {tempColor === p && (
                          <div className={cn(
                            "w-full h-full rounded-full flex items-center justify-center",
                            parseInt(p.replace('#', ''), 16) > 0xffffff / 2 ? "text-black" : "text-white"
                          )}>
                            <Check className="w-5 h-5" />
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Custom HEX Input */}
                <div className="space-y-3">
                   <span className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Custom Engine</span>
                   <div className="relative">
                     <input 
                       type="text"
                       value={tempColor}
                       onChange={(e) => {
                         const val = e.target.value;
                         if (val.startsWith('#') && val.length <= 7) {
                           setTempColor(val);
                         }
                       }}
                       className="w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl font-mono text-sm uppercase tracking-widest focus:ring-2 focus:ring-blue-600 transition-all font-black"
                     />
                     <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-black">#</div>
                   </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4">
                <button 
                  onClick={onClose}
                  className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleApply}
                  className="flex-1 py-4 text-xs font-black uppercase tracking-widest bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 rounded-2xl shadow-xl shadow-black/10 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Apply Color
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

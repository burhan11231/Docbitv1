import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, X } from 'lucide-react';

interface NavigationConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const NavigationConfirmModal: React.FC<NavigationConfirmModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-[2px] z-[9999]"
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 pointer-events-none z-[10000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="pointer-events-auto w-full max-w-sm bg-white dark:bg-neutral-900 rounded-[32px] shadow-2xl overflow-hidden border border-neutral-100 dark:border-neutral-800"
            >
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-neutral-900 dark:text-white leading-tight">
                    Unsaved Changes
                  </h3>
                </div>
                
                <p className="text-neutral-500 dark:text-neutral-400 mb-8 leading-relaxed">
                  You have active files in the tool. If you leave now, your progress will be lost.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={onCancel}
                    className="px-6 py-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-bold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    Stay
                  </button>
                  <button
                    onClick={onConfirm}
                    className="px-6 py-4 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors"
                  >
                    Leave
                  </button>
                </div>
              </div>

              <button 
                onClick={onCancel}
                className="absolute top-6 right-6 p-2 rounded-full text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

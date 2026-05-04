import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';

export default function Offline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm"
      >
        <div className="bg-neutral-900 dark:bg-neutral-800 text-white p-5 rounded-[24px] shadow-2xl flex items-center gap-4 border border-white/10">
          <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center text-red-500">
            <WifiOff className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-black uppercase tracking-wider">OFFLINE MODE</p>
            <p className="text-[10px] font-bold text-neutral-400">Stable features are available locally.</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

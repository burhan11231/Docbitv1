import React from 'react';
import { motion } from 'motion/react';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from './SEO';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <SEO 
        title="404 - Page Not Found"
        description="The page you are looking for does not exist on DocBit."
        noindex={true}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[48px] p-12 max-w-lg w-full text-center shadow-2xl shadow-black/5 space-y-8"
      >
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 blur-3xl rounded-full" />
          <div className="relative w-32 h-32 bg-blue-50 dark:bg-blue-900/10 rounded-full flex items-center justify-center border-4 border-white dark:border-neutral-900 shadow-xl">
            <FileQuestion className="w-16 h-16 text-blue-600" />
          </div>
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
            404
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-black tracking-tight text-neutral-900 dark:text-white">Page Not Found</h1>
          <p className="text-neutral-500 font-medium">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link 
            to="/" 
            className="flex items-center justify-center gap-2 py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-500/20"
          >
            <Home className="w-4 h-4" />
            GO HOME
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 py-4 px-6 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 font-black rounded-2xl transition-all active:scale-95 border border-neutral-200 dark:border-neutral-700"
          >
            <ArrowLeft className="w-4 h-4" />
            GO BACK
          </button>
        </div>

        <div className="pt-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase text-neutral-400 tracking-[0.2em]">
          <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
          System Active
        </div>
      </motion.div>
    </div>
  );
}

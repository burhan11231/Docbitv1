import React, { useCallback, useState } from 'react';
import { Upload, File, FileText, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  label?: string;
  className?: string;
}

export function Dropzone({ 
  onFilesSelected, 
  accept = { 'application/pdf': ['.pdf'] }, 
  maxFiles = 1,
  label = "Click to upload or drag and drop",
  className
}: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    
    const files = Array.from(e.dataTransfer.files) as File[];
    validateAndProcess(files);
  };

  const onHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      validateAndProcess(files);
    }
  };

  const validateAndProcess = (files: File[]) => {
    // Basic validation
    const allowedTypes = Object.keys(accept);
    const validFiles = files.filter(file => {
      if (allowedTypes.length > 0 && !allowedTypes.includes(file.type) && !file.name.endsWith('.pdf')) {
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      setError("Please upload valid PDF files.");
      return;
    }

    if (maxFiles === 1 && validFiles.length > 1) {
      onFilesSelected([validFiles[0]]);
    } else {
      onFilesSelected(validFiles.slice(0, maxFiles));
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <label 
        className={cn(
          "relative flex flex-col items-center justify-center w-full h-[400px] border-2 border-dashed rounded-[32px] cursor-pointer transition-all duration-300",
          isDragging 
            ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 scale-[0.99] shadow-inner" 
            : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:border-neutral-300 dark:hover:border-neutral-700 Shadow-sm"
        )}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-10 text-center">
          <div className="w-20 h-20 mb-6 bg-neutral-100 dark:bg-neutral-800 rounded-3xl flex items-center justify-center text-neutral-400 group-hover:scale-110 transition-transform">
            {maxFiles > 1 ? <FileText className="w-10 h-10" /> : <File className="w-10 h-10" />}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="mb-2 text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            {label}
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8 max-w-sm">
            {maxFiles === 1 ? 'Your file will be processed locally.' : `Upload up to ${maxFiles} files for processing.`}
            <br />
            100% secure. No server uploads.
          </p>
          
          <div className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Select Files
          </div>
        </div>
        
        {error && (
          <div className="absolute bottom-10 flex items-center gap-2 text-red-500 text-sm font-medium bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-full border border-red-100 dark:border-red-900/30 animate-shake">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <input 
          type="file" 
          className="hidden" 
          accept={Object.values(accept).flat().join(',')} 
          multiple={maxFiles > 1}
          onChange={onHandleChange}
        />
      </label>
    </div>
  );
}

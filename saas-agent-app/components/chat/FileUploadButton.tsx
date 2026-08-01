'use client';

import { useRef, useState } from 'react';
import { Plus, X, File, Image, FileText, Paperclip } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface FileUploadButtonProps {
  onFileSelect: (files: File[]) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in bytes
  multiple?: boolean;
}

export function FileUploadButton({ 
  onFileSelect, 
  acceptedTypes = ['image/*', '.pdf', '.doc', '.docx', '.txt'],
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = true 
}: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => {
      const validFiles = files.filter(file => {
        const isValidType = acceptedTypes.some(type => {
          if (type.endsWith('/*')) {
            const mimeType = type.replace('/*', '');
            return file.type.startsWith(mimeType);
          }
          return file.type === type || file.name.endsWith(type.replace('*', ''));
        });
        return isValidType && file.size <= maxSize;
      });
      
      if (validFiles.length > 0) {
        onFileSelect(validFiles);
        setIsOpen(false);
      }
    },
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize,
    multiple,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const validFiles = fileArray.filter(file => {
        const isValidType = acceptedTypes.some(type => {
          if (type.endsWith('/*')) {
            const mimeType = type.replace('/*', '');
            return file.type.startsWith(mimeType);
          }
          return file.type === type || file.name.endsWith(type.replace('*', ''));
        });
        return isValidType && file.size <= maxSize;
      });
      
      if (validFiles.length > 0) {
        onFileSelect(validFiles);
      }
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
        aria-label="Attach file"
      >
        <Plus className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Popup Menu */}
          <div className="absolute bottom-full mb-2 left-0 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50 min-w-[280px] max-w-[320px]">
            <div
              {...getRootProps()}
              className={`p-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
              }`}
            >
              <input {...getInputProps()} />
              <div className="text-center">
                <Paperclip className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 font-medium">
                  {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                </p>
                <p className="text-xs text-gray-400 mt-1">or click to browse</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                >
                  Browse Files
                </button>
                <p className="text-xs text-gray-400 mt-3">
                  Supports: {acceptedTypes.join(', ')}
                </p>
                <p className="text-xs text-gray-400">
                  Max size: {Math.round(maxSize / 1024 / 1024)}MB
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple={multiple}
              accept={acceptedTypes.join(',')}
              onChange={handleFileChange}
              className="hidden"
            />
            
            <button
              onClick={() => setIsOpen(false)}
              className="mt-2 w-full px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </>
      )}
    </div>
  );
}
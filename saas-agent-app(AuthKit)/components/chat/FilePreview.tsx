'use client';

import { File, X, Image, FileText, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
  uploading?: boolean;
}

export function FilePreview({ file, onRemove, uploading = false }: FilePreviewProps) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  const getFileIcon = () => {
    if (file.type.startsWith('image/')) {
      return null; // Show preview instead
    }
    if (file.type === 'application/pdf') {
      return <FileText className="w-8 h-8 text-red-500" />;
    }
    if (file.type.startsWith('text/')) {
      return <FileText className="w-8 h-8 text-blue-500" />;
    }
    return <File className="w-8 h-8 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="relative group">
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 min-w-[150px] max-w-[250px]">
        {preview ? (
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
            <img src={preview} alt={file.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
            {getFileIcon()}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
          {uploading && (
            <div className="flex items-center gap-1 mt-1">
              <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
              <span className="text-xs text-blue-600">Uploading...</span>
            </div>
          )}
        </div>

        <button
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded-full"
          aria-label="Remove file"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
}
'use client';

import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface FileUploadProgressProps {
  progress: number;
  fileName: string;
  status: 'uploading' | 'complete' | 'error';
  onCancel?: () => void;
}

export function FileUploadProgress({ progress, fileName, status, onCancel }: FileUploadProgressProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'uploading': return 'text-blue-600';
      case 'complete': return 'text-green-600';
      case 'error': return 'text-red-600';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading': return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'complete': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'uploading': return 'Uploading...';
      case 'complete': return 'Complete';
      case 'error': return 'Upload Failed';
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 min-w-[200px]">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]">
            {fileName}
          </span>
          <div className={`flex items-center gap-1.5 text-xs ${getStatusColor()}`}>
            {getStatusIcon()}
            <span>{getStatusText()}</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              status === 'error' ? 'bg-red-500' : 'bg-blue-600'
            } ${status === 'uploading' ? 'progress-pulse' : ''}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-400">
            {Math.min(progress, 100)}%
          </span>
          {status === 'uploading' && onCancel && (
            <button
              onClick={onCancel}
              className="text-xs text-red-500 hover:text-red-600 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
  url?: string;
}

interface FileUploadContextType {
  uploadingFiles: UploadingFile[];
  addFile: (file: File) => void;
  removeFile: (id: string) => void;
  updateProgress: (id: string, progress: number) => void;
  updateStatus: (id: string, status: 'uploading' | 'complete' | 'error') => void;
}

const FileUploadContext = createContext<FileUploadContextType | undefined>(undefined);

export function FileUploadProvider({ children }: { children: ReactNode }) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  const addFile = (file: File) => {
    const id = Date.now().toString();
    setUploadingFiles(prev => [...prev, {
      id,
      file,
      progress: 0,
      status: 'uploading'
    }]);
  };

  const removeFile = (id: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== id));
  };

  const updateProgress = (id: string, progress: number) => {
    setUploadingFiles(prev => prev.map(f => 
      f.id === id ? { ...f, progress } : f
    ));
  };

  const updateStatus = (id: string, status: 'uploading' | 'complete' | 'error') => {
    setUploadingFiles(prev => prev.map(f => 
      f.id === id ? { ...f, status } : f
    ));
  };

  return (
    <FileUploadContext.Provider value={{
      uploadingFiles,
      addFile,
      removeFile,
      updateProgress,
      updateStatus
    }}>
      {children}
    </FileUploadContext.Provider>
  );
}

export function useFileUpload() {
  const context = useContext(FileUploadContext);
  if (context === undefined) {
    throw new Error('useFileUpload must be used within a FileUploadProvider');
  }
  return context;
}
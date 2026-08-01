'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2, Paperclip, Image, File, X, Plus, Upload } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  files?: File[];
  timestamp: Date;
}

export default function AgentPage() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Hello! How can I help you today? You can upload files by clicking the + button.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = (files: File[]) => {
    const validFiles = files.filter(file => {
      const validTypes = ['image/*', '.pdf', '.doc', '.docx', '.txt', '.csv', '.json'];
      const isValidType = validTypes.some(type => {
        if (type.endsWith('/*')) {
          const mimeType = type.replace('/*', '');
          return file.type.startsWith(mimeType);
        }
        return file.type === type || file.name.endsWith(type.replace('*', ''));
      });
      return isValidType && file.size <= 10 * 1024 * 1024;
    });
    
    if (validFiles.length > 0) {
      setAttachedFiles(prev => [...prev, ...validFiles]);
      
      validFiles.forEach(file => {
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            const current = prev[file.name] || 0;
            const next = current + Math.random() * 15;
            if (next >= 100) {
              clearInterval(interval);
              return { ...prev, [file.name]: 100 };
            }
            return { ...prev, [file.name]: Math.min(next, 95) };
          });
        }, 200);
      });
    }
    
    setIsFileMenuOpen(false);
    setIsDragging(false);
  };

  const handleRemoveFile = (index: number) => {
    const file = attachedFiles[index];
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
    setUploadProgress(prev => {
      const newState = { ...prev };
      delete newState[file.name];
      return newState;
    });
  };

  const handleSend = async () => {
    if (!input.trim() && attachedFiles.length === 0) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim() || 'Check out my files',
      files: attachedFiles.length > 0 ? attachedFiles : undefined,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    const sentFiles = [...attachedFiles];
    setAttachedFiles([]);
    setUploadProgress({});
    setIsLoading(true);

    if (sentFiles.length > 0) {
      const fileNames = sentFiles.map(f => f.name).join(', ');
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `I've received your files: ${fileNames}. I'm processing them and will analyze the content.`,
          timestamp: new Date()
        }]);
        setIsLoading(false);
      }, 2000);
    } else {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "I'm processing your request. This is a demo response from your AI agent.",
          timestamp: new Date()
        }]);
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessageTime = (date: Date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return '';
    }
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFileSelect(Array.from(files));
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files);
    }
    setIsFileMenuOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Bot className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-sm">AI Agent</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-gray-500">Online</span>
            </div>
          </div>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          v2.0
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 ${
              message.role === 'assistant' ? 'justify-start' : 'justify-end'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bot className="w-3.5 h-3.5 text-blue-600" />
              </div>
            )}
            <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : ''}`}>
              <div
                className={`p-3 rounded-lg ${
                  message.role === 'assistant'
                    ? 'bg-white border border-gray-200 shadow-sm'
                    : 'bg-blue-600 text-white'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                
                {message.files && message.files.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {message.files.map((file, fileIndex) => (
                      <div
                        key={fileIndex}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs ${
                          message.role === 'assistant'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-blue-500/20 text-white'
                        }`}
                      >
                        {file.type.startsWith('image/') ? (
                          <Image className="w-3 h-3" />
                        ) : (
                          <File className="w-3 h-3" />
                        )}
                        <span className="truncate max-w-[80px]">{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className={`text-xs mt-1 ${
                message.role === 'assistant' ? 'text-gray-400' : 'text-gray-400 text-right'
              }`}>
                {formatMessageTime(message.timestamp)}
              </p>
            </div>
            {message.role === 'user' && (
              <div className="w-7 h-7 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-gray-600">You</span>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="bg-white border border-gray-200 shadow-sm p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                <span className="text-xs text-gray-500">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* File Attachments Preview */}
      {attachedFiles.length > 0 && (
        <div className="px-3 py-2 bg-white border-t border-gray-200 flex flex-wrap gap-1.5 flex-shrink-0">
          {attachedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg border border-gray-200 group hover:border-gray-300 transition-colors text-xs"
            >
              {file.type.startsWith('image/') ? (
                <Image className="w-3.5 h-3.5 text-blue-500" />
              ) : (
                <File className="w-3.5 h-3.5 text-gray-500" />
              )}
              <span className="text-gray-700 max-w-[80px] truncate">{file.name}</span>
              <span className="text-gray-400 text-[10px]">
                {(file.size / 1024).toFixed(0)} KB
              </span>
              {uploadProgress[file.name] < 100 ? (
                <div className="w-10 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress[file.name] || 0}%` }}
                  />
                </div>
              ) : (
                <span className="text-green-600 text-[10px]">✓</span>
              )}
              <button
                onClick={() => handleRemoveFile(index)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-gray-200 rounded"
              >
                <X className="w-3 h-3 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-200 flex-shrink-0">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none min-h-[38px] max-h-[120px] text-sm bg-white"
              rows={1}
              disabled={isLoading}
            />
          </div>
          
          {/* File Upload Button */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setIsFileMenuOpen(!isFileMenuOpen)}
              className={`p-2 rounded-lg transition-colors border ${
                isFileMenuOpen 
                  ? 'bg-blue-50 border-blue-300 text-blue-600' 
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-400'
              }`}
              aria-label="Attach file"
            >
              <Plus className="w-4 h-4" />
            </button>

            {isFileMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setIsFileMenuOpen(false)}
                />
                <div className="absolute bottom-full mb-2 right-0 bg-white rounded-xl shadow-lg border border-gray-200 p-3 z-50 w-64">
                  <div
                    className={`p-4 border-2 border-dashed rounded-lg transition-colors cursor-pointer text-center ${
                      isDragging 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center gap-1">
                      {isDragging ? (
                        <>
                          <Upload className="w-7 h-7 text-blue-500 animate-bounce" />
                          <p className="text-sm font-medium text-blue-600">Drop files here</p>
                        </>
                      ) : (
                        <>
                          <Paperclip className="w-7 h-7 text-gray-400" />
                          <p className="text-sm text-gray-600 font-medium">Drop or click to browse</p>
                          <p className="text-xs text-gray-400">Max 10MB</p>
                          <div className="flex flex-wrap gap-1 justify-center mt-1">
                            <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Images</span>
                            <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">PDF</span>
                            <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">DOC</span>
                            <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">TXT</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.txt,.csv,.json"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => setIsFileMenuOpen(false)}
                      className="flex-1 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Browse
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <button
            onClick={handleSend}
            disabled={(!input.trim() && attachedFiles.length === 0) || isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Send</span>
          </button>
        </div>
        
        <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-400">
          <Paperclip className="w-3 h-3" />
          <span>Images, PDF, DOC, TXT</span>
          <span>•</span>
          <span>10MB max</span>
          <span>•</span>
          <span className="text-gray-300">Enter to send</span>
        </div>
      </div>
    </div>
  );
}
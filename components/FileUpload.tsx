import React, { useCallback, useState, useRef } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  file: File | null;
}

const CloudArrowUpIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75m-7.5-3v4.5m12-4.5v4.5m-6-13.5C6.879 2.25 2.25 6.879 2.25 12c0 5.121 4.629 9.75 9.75 9.75s9.75-4.629 9.75-9.75c0-5.121-4.629-9.75-9.75-9.75z" />
    </svg>
);

const DocumentIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);


export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, file }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((selectedFile: File) => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  }, [onFileSelect]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`relative w-full p-6 text-center border-2 border-dashed rounded-xl transition-all duration-300 ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-slate-50'}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        aria-label="File uploader"
      />
      
      {!file ? (
        <div className="space-y-3">
            <CloudArrowUpIcon className="w-12 h-12 mx-auto text-gray-400" />
            <p className="font-semibold text-gray-700">Drag & drop your file here</p>
            <p className="text-sm text-gray-500">or</p>
            <button
              type="button"
              onClick={openFileDialog}
              className="px-4 py-2 font-semibold text-indigo-600 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition-colors"
            >
              Select a file
            </button>
            <p className="text-xs text-gray-400 mt-2">Any document format accepted</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4">
            <DocumentIcon className="w-12 h-12 text-green-500" />
            <p className="font-semibold text-gray-800 break-all">{file.name}</p>
            <button
                type="button"
                onClick={openFileDialog}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
                Change file
            </button>
        </div>
      )}
    </div>
  );
};
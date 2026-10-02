
import React, { useCallback, useState } from 'react';
import { UploadCloudIcon } from './icons/Icons';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      if (files[0].type === 'text/csv' || files[0].name.endsWith('.csv')) {
        onFileChange(files[0]);
      } else {
        alert("Please upload a valid CSV file.");
      }
    }
  }, [onFileChange]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (files[0].type === 'text/csv' || files[0].name.endsWith('.csv')) {
        onFileChange(files[0]);
      } else {
        alert("Please upload a valid CSV file.");
        e.target.value = ''; // Reset file input
      }
    }
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`border-2 border-dashed ${isDragging ? 'border-teal-400 bg-gray-700/50' : 'border-gray-600'} rounded-lg p-10 text-center cursor-pointer transition-all duration-300`}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept=".csv"
        onChange={handleFileSelect}
      />
      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
        <UploadCloudIcon className="w-16 h-16 text-gray-500 mb-4" />
        <h2 className="text-xl font-semibold text-white">Drag and drop your dataset here</h2>
        <p className="text-gray-400">or</p>
        <p className="mt-2 bg-gray-700 hover:bg-gray-600 text-teal-400 font-bold py-2 px-4 rounded-md">
          Click to browse files
        </p>
        <p className="mt-4 text-sm text-gray-500">Only .csv files are supported</p>
      </label>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { FileInfo } from '../types';

interface FilePreviewProps {
  file: FileInfo;
  onClose: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onClose }) => {
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/file-preview`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filePath: file.path }),
        });
        const data = await response.json();
        setContent(data.content);
      } catch (error) {
        console.error('Error fetching file content:', error);
        setContent('Error loading file content');
      }
    };

    fetchContent();
  }, [file]);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-xl w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">File Preview: {file.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg max-h-96 overflow-auto">
          <pre className="whitespace-pre-wrap">{content}</pre>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
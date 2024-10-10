import React, { useState } from 'react';
import { FileInfo } from '../types';
import { FileText, ArrowRight, Copy, Eye } from 'lucide-react';
import FilePreview from './FilePreview';

interface FileListProps {
  files: FileInfo[];
  onFileAction: (file: FileInfo, action: 'move' | 'copy') => void;
}

const FileList: React.FC<FileListProps> = ({ files, onFileAction }) => {
  const [previewFile, setPreviewFile] = useState<FileInfo | null>(null);

  return (
    <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full leading-normal">
        <thead>
          <tr>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:bg-gray-600 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
              File Name
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:bg-gray-600 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
              Path
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:bg-gray-600 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
              Keywords
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:bg-gray-600 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={index}>
              <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
                <div className="flex items-center">
                  <FileText className="flex-shrink-0 w-5 h-5 text-gray-400 mr-2" />
                  <p className="text-gray-900 dark:text-gray-200 whitespace-no-wrap">{file.name}</p>
                </div>
              </td>
              <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
                <p className="text-gray-900 dark:text-gray-200 whitespace-no-wrap">{file.path}</p>
              </td>
              <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
                <p className="text-gray-900 dark:text-gray-200 whitespace-no-wrap">
                  {file.keywords.join(', ')}
                </p>
              </td>
              <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
                <button
                  onClick={() => setPreviewFile(file)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-200 mr-3"
                  title="Preview"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onFileAction(file, 'move')}
                  className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-200 mr-3"
                  title="Move"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onFileAction(file, 'copy')}
                  className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-200"
                  title="Copy"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {previewFile && (
        <FilePreview file={previewFile} onClose={() => setPreviewFile(null)} />
      )}
    </div>
  );
};

export default FileList;
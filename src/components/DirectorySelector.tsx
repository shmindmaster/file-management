import React, { useState } from 'react';
import { Folder, X } from 'lucide-react';
import { Directory } from '../types';

interface DirectorySelectorProps {
  label: string;
  directories: Directory[];
  setDirectories: React.Dispatch<React.SetStateAction<Directory[]>>;
}

const DirectorySelector: React.FC<DirectorySelectorProps> = ({ label, directories, setDirectories }) => {
  const [newDirectory, setNewDirectory] = useState('');

  const handleAddDirectory = () => {
    if (newDirectory) {
      setDirectories([...directories, { path: newDirectory }]);
      setNewDirectory('');
    }
  };

  const handleRemoveDirectory = (index: number) => {
    setDirectories(directories.filter((_, i) => i !== index));
  };

  const handleBrowse = () => {
    // In a real browser environment, we would use the File System Access API
    // For this example, we'll simulate browsing by adding a placeholder path
    setNewDirectory('/path/to/selected/directory');
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
      <div className="flex mb-2">
        <input
          className="shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder={`Enter ${label.toLowerCase()} path`}
          value={newDirectory}
          onChange={(e) => setNewDirectory(e.target.value)}
        />
        <button
          onClick={handleBrowse}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
        >
          <Folder className="w-5 h-5" />
        </button>
      </div>
      <button
        onClick={handleAddDirectory}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Add Directory
      </button>
      <ul className="mt-2">
        {directories.map((dir, index) => (
          <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded mb-1">
            <span>{dir.path}</span>
            <button
              onClick={() => handleRemoveDirectory(index)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DirectorySelector;
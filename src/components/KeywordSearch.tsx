import React from 'react';
import { Search, Loader } from 'lucide-react';

interface KeywordSearchProps {
  onSearch: () => void;
  isScanning: boolean;
}

const KeywordSearch: React.FC<KeywordSearchProps> = ({ onSearch, isScanning }) => {
  return (
    <div className="mb-6">
      <button
        onClick={onSearch}
        disabled={isScanning}
        className={`flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-2 px-4 rounded flex items-center ${
          isScanning ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isScanning ? (
          <Loader className="w-5 h-5 mr-2 animate-spin" />
        ) : (
          <Search className="w-5 h-5 mr-2" />
        )}
        {isScanning ? 'Scanning...' : 'Start Search'}
      </button>
    </div>
  );
};

export default KeywordSearch;
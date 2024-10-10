import React, { useState } from 'react';
import { X, Plus, Trash } from 'lucide-react';
import { KeywordConfig, Directory } from '../types';

interface ConfigurationPanelProps {
  onClose: () => void;
  keywordConfigs: KeywordConfig[];
  setKeywordConfigs: React.Dispatch<React.SetStateAction<KeywordConfig[]>>;
  targetDirectories: Directory[];
}

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  onClose,
  keywordConfigs,
  setKeywordConfigs,
  targetDirectories,
}) => {
  const [newKeywords, setNewKeywords] = useState('');
  const [newDestination, setNewDestination] = useState('');

  const handleAddKeywordConfig = () => {
    if (newKeywords && newDestination) {
      const keywords = newKeywords.split(',').map(k => k.trim()).filter(k => k !== '');
      setKeywordConfigs([...keywordConfigs, { keywords, destinationFolder: newDestination }]);
      setNewKeywords('');
      setNewDestination('');
    }
  };

  const handleRemoveKeywordConfig = (index: number) => {
    setKeywordConfigs(keywordConfigs.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-5 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Configuration</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newKeywords">
            New Keywords (comma-separated)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="newKeywords"
            type="text"
            placeholder="Enter keywords, e.g., important, urgent"
            value={newKeywords}
            onChange={(e) => setNewKeywords(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newDestination">
            Destination Folder
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="newDestination"
            value={newDestination}
            onChange={(e) => setNewDestination(e.target.value)}
          >
            <option value="">Select a destination folder</option>
            {targetDirectories.map((dir, index) => (
              <option key={index} value={dir.path}>
                {dir.path}
              </option>
            ))}
          </select>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
          onClick={handleAddKeywordConfig}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Keyword Configuration
        </button>
        <div className="mt-4">
          <h3 className="font-bold mb-2">Current Keyword Configurations:</h3>
          <ul>
            {keywordConfigs.map((config, index) => (
              <li key={index} className="flex justify-between items-center mb-2">
                <span>{config.keywords.join(' + ')} → {config.destinationFolder}</span>
                <button
                  onClick={() => handleRemoveKeywordConfig(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationPanel;
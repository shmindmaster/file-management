import React, { useState } from 'react';
import { Directory, KeywordConfig } from '../types';
import DirectorySelector from './DirectorySelector';

interface WelcomeWizardProps {
  onComplete: () => void;
  setBaseDirectories: React.Dispatch<React.SetStateAction<Directory[]>>;
  setTargetDirectories: React.Dispatch<React.SetStateAction<Directory[]>>;
  setKeywordConfigs: React.Dispatch<React.SetStateAction<KeywordConfig[]>>;
}

const WelcomeWizard: React.FC<WelcomeWizardProps> = ({
  onComplete,
  setBaseDirectories,
  setTargetDirectories,
  setKeywordConfigs,
}) => {
  const [step, setStep] = useState(0);
  const [baseDir, setBaseDir] = useState<Directory[]>([]);
  const [targetDir, setTargetDir] = useState<Directory[]>([]);
  const [keyword, setKeyword] = useState('');
  const [destination, setDestination] = useState('');

  const handleNext = () => {
    if (step === 0 && baseDir.length === 0) {
      alert('Please select at least one base directory.');
      return;
    }
    if (step === 1 && targetDir.length === 0) {
      alert('Please select at least one target directory.');
      return;
    }
    if (step === 2 && (!keyword || !destination)) {
      alert('Please enter a keyword and select a destination folder.');
      return;
    }
    if (step < 2) {
      setStep(step + 1);
    } else {
      setBaseDirectories(baseDir);
      setTargetDirectories(targetDir);
      setKeywordConfigs([{ keywords: [keyword], destinationFolder: destination }]);
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Welcome to Advanced Keyword File Manager</h2>
        {step === 0 && (
          <div>
            <p className="mb-4">Let's start by selecting the base directory to scan:</p>
            <DirectorySelector
              label="Base Directory"
              directories={baseDir}
              setDirectories={setBaseDir}
            />
          </div>
        )}
        {step === 1 && (
          <div>
            <p className="mb-4">Now, select the target directories for moving files:</p>
            <DirectorySelector
              label="Target Directories"
              directories={targetDir}
              setDirectories={setTargetDir}
            />
          </div>
        )}
        {step === 2 && (
          <div>
            <p className="mb-4">Finally, let's set up your first keyword and destination:</p>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
              type="text"
              placeholder="Enter keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              <option value="">Select destination folder</option>
              {targetDir.map((dir, index) => (
                <option key={index} value={dir.path}>
                  {dir.path}
                </option>
              ))}
            </select>
          </div>
        )}
        <button
          onClick={handleNext}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {step < 2 ? 'Next' : 'Finish'}
        </button>
      </div>
    </div>
  );
};

export default WelcomeWizard;
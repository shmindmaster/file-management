import React, { useState, useEffect } from 'react';
import { Search, FolderPlus, FileText, Settings, Moon, Sun } from 'lucide-react';
import KeywordSearch from './components/KeywordSearch';
import FileList from './components/FileList';
import ConfigurationPanel from './components/ConfigurationPanel';
import ProgressBar from './components/ProgressBar';
import DirectorySelector from './components/DirectorySelector';
import WelcomeWizard from './components/WelcomeWizard';
import ErrorLog from './components/ErrorLog';
import { FileInfo, KeywordConfig, Directory, AppError } from './types';

function App() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [showConfig, setShowConfig] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [keywordConfigs, setKeywordConfigs] = useState<KeywordConfig[]>([]);
  const [baseDirectories, setBaseDirectories] = useState<Directory[]>([]);
  const [targetDirectories, setTargetDirectories] = useState<Directory[]>([]);
  const [showWelcomeWizard, setShowWelcomeWizard] = useState(true);
  const [errors, setErrors] = useState<AppError[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const savedConfig = localStorage.getItem('appConfig');
    if (savedConfig) {
      const { keywordConfigs, baseDirectories, targetDirectories } = JSON.parse(savedConfig);
      setKeywordConfigs(keywordConfigs);
      setBaseDirectories(baseDirectories);
      setTargetDirectories(targetDirectories);
      setShowWelcomeWizard(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('appConfig', JSON.stringify({ keywordConfigs, baseDirectories, targetDirectories }));
  }, [keywordConfigs, baseDirectories, targetDirectories]);

  const handleSearch = async () => {
    if (baseDirectories.length === 0) {
      addError('Please select at least one base directory first.');
      return;
    }

    setProgress({ current: 0, total: 1 });
    setIsScanning(true);

    try {
      const response = await fetch('http://localhost:3001/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseDirectories, keywordConfigs }),
      });

      const reader = response.body?.getReader();
      let partialData = '';

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        partialData += new TextDecoder().decode(value);
        const lines = partialData.split('\n');
        
        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i];
          try {
            const data = JSON.parse(line);
            if (data.results) {
              setFiles(data.results);
            }
            if (data.filesProcessed && data.totalFiles) {
              setProgress({ current: data.filesProcessed, total: data.totalFiles });
            }
          } catch (e) {
            console.error('Error parsing JSON:', e);
          }
        }
        
        partialData = lines[lines.length - 1];
      }
    } catch (error) {
      addError('Error searching files: ' + (error as Error).message);
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileAction = async (file: FileInfo, action: 'move' | 'copy') => {
    const matchingConfig = keywordConfigs.find(config => 
      config.keywords.every(keyword => file.keywords.includes(keyword))
    );

    if (!matchingConfig) {
      addError('No matching keyword configuration found for this file.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/file-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file, action, destination: matchingConfig.destinationFolder }),
      });
      const result = await response.json();
      if (result.success) {
        addError(result.message, 'success');
        handleSearch(); // Refresh the file list
      } else {
        addError(`Error: ${result.message}`);
      }
    } catch (error) {
      addError(`Error ${action}ing file: ` + (error as Error).message);
    }
  };

  const addError = (message: string, type: 'error' | 'success' = 'error') => {
    setErrors(prev => [...prev, { message, type, timestamp: new Date() }]);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-screen flex flex-col">
        <header className="bg-blue-600 dark:bg-blue-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold flex items-center">
              <FolderPlus className="mr-2" />
              Advanced Keyword File Manager
            </h1>
            <div className="flex items-center">
              <button
                onClick={toggleDarkMode}
                className="mr-4 p-2 rounded-full hover:bg-blue-700 dark:hover:bg-blue-900"
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setShowConfig(!showConfig)}
                className="bg-blue-500 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-900 text-white font-bold py-2 px-4 rounded flex items-center"
              >
                <Settings className="mr-2" />
                Configure
              </button>
            </div>
          </div>
        </header>

        <main className="container mx-auto p-4 flex-grow">
          <DirectorySelector
            label="Base Directories"
            directories={baseDirectories}
            setDirectories={setBaseDirectories}
          />
          <DirectorySelector
            label="Target Directories"
            directories={targetDirectories}
            setDirectories={setTargetDirectories}
          />
          <KeywordSearch onSearch={handleSearch} isScanning={isScanning} />
          <ProgressBar current={progress.current} total={progress.total} />
          <FileList files={files} onFileAction={handleFileAction} />
        </main>

        {showConfig && (
          <ConfigurationPanel
            onClose={() => setShowConfig(false)}
            keywordConfigs={keywordConfigs}
            setKeywordConfigs={setKeywordConfigs}
            targetDirectories={targetDirectories}
          />
        )}

        {showWelcomeWizard && (
          <WelcomeWizard
            onComplete={() => setShowWelcomeWizard(false)}
            setBaseDirectories={setBaseDirectories}
            setTargetDirectories={setTargetDirectories}
            setKeywordConfigs={setKeywordConfigs}
          />
        )}

        <ErrorLog errors={errors} setErrors={setErrors} />

        <footer className="bg-gray-200 dark:bg-gray-700 text-center p-4">
          <p>&copy; 2024 Advanced Keyword File Manager. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
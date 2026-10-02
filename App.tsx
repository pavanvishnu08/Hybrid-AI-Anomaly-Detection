import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { AnalysisStepper } from './components/AnalysisStepper';
import { ResultsDashboard } from './components/ResultsDashboard';
import { RealtimeDashboard } from './components/RealtimeDashboard';
import { runModelAnalysis } from './services/geminiService';
import { saveAnalysisResult, getAnalysisResult, clearAnalysisResult } from './services/localStorageService';
import type { AnalysisResult } from './types';
import { ShieldCheckIcon, AlertTriangleIcon, HistoryIcon } from './components/icons/Icons';

type AnalysisStatus = 'idle' | 'preprocessing' | 'supervised' | 'unsupervised' | 'fusion' | 'explainability' | 'complete' | 'error';
type AnalysisMode = 'idle' | 'static' | 'real-time';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('idle');
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('idle');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [savedAnalysisExists, setSavedAnalysisExists] = useState<boolean>(false);

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      setFile(selectedFile);
      resetState(false); // Soft reset, keep file
      const savedResult = getAnalysisResult(selectedFile);
      setSavedAnalysisExists(!!savedResult);
    }
  };
  
  const resetState = (fullReset = true) => {
    if (fullReset) {
      setFile(null);
      setSavedAnalysisExists(false);
    }
    setAnalysisStatus('idle');
    setAnalysisMode('idle');
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
  }

  const performAnalysis = useCallback(async (mode: AnalysisMode) => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setAnalysisMode(mode);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) {
          throw new Error("File is empty or could not be read.");
        }
        
        const lines = text.trim().split('\n');
        const headers = lines[0].split(',');
        const dataSample = lines.slice(1, 11).join('\n');

        const steps: AnalysisStatus[] = ['preprocessing', 'supervised', 'unsupervised', 'fusion', 'explainability'];
        for (const step of steps) {
          setAnalysisStatus(step);
          await new Promise(resolve => setTimeout(resolve, 700)); 
        }

        const result = await runModelAnalysis(headers, dataSample);
        saveAnalysisResult(file, result);
        setSavedAnalysisExists(true);
        
        setAnalysisResult(result);
        setAnalysisStatus('complete');
      } catch (err) {
        console.error("Analysis Error:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred during analysis.");
        setAnalysisStatus('error');
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setError("Failed to read the file.");
      setAnalysisStatus('error');
      setIsLoading(false);
    };
    reader.readAsText(file);
  }, [file]);

  const handleLoadSaved = () => {
    if (!file) return;
    const savedResult = getAnalysisResult(file);
    if (savedResult) {
      setAnalysisResult(savedResult);
      setAnalysisStatus('complete');
      setAnalysisMode('static');
      setError(null);
      setIsLoading(false);
    }
  };

  const handleClearSaved = () => {
    if (!file) return;
    clearAnalysisResult(file);
    setSavedAnalysisExists(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-4">
            <ShieldCheckIcon className="w-12 h-12 text-teal-400" />
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Hybrid AI Anomaly Detection
            </h1>
          </div>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Simulating a Random Forest & Autoencoder hybrid model to analyze network traffic and identify threats with SHAP-based explanations.
          </p>
        </header>

        <main className="max-w-7xl mx-auto">
          <div className="bg-gray-800 rounded-lg shadow-2xl p-6 border border-gray-700">
            {!file ? (
              <FileUpload onFileChange={handleFileChange} />
            ) : (
              <div className="text-center">
                 <div className="bg-gray-700 p-4 rounded-md mb-6 flex items-center justify-between">
                    <p className="font-mono text-teal-400">
                        <span className="font-bold text-gray-300">Dataset Loaded:</span> {file.name}
                    </p>
                    <button
                        onClick={() => resetState(true)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                    >
                        Load New Dataset
                    </button>
                </div>

                {analysisMode === 'idle' && !isLoading && (
                  <div className="space-y-4">
                    {savedAnalysisExists && (
                      <div className="bg-gray-700/50 border border-teal-800 p-4 rounded-lg text-center">
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <HistoryIcon className="w-6 h-6 text-teal-400" />
                          <p className="font-semibold text-gray-200">Saved analysis found for this file.</p>
                        </div>
                        <div className="flex justify-center items-center gap-4">
                          <button
                            onClick={handleLoadSaved}
                            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 text-lg rounded-lg transition-transform duration-300 transform hover:scale-105"
                          >
                            Load Saved Results
                          </button>
                          <button onClick={handleClearSaved} className="text-gray-400 hover:text-red-400 text-sm underline">
                            Clear
                          </button>
                        </div>
                        <p className="text-gray-500 text-sm mt-4">Or, you can run a new analysis below.</p>
                      </div>
                    )}
                    <div className={`flex justify-center items-center gap-4 ${savedAnalysisExists ? 'pt-4 border-t border-gray-700' : ''}`}>
                      <button
                        onClick={() => performAnalysis('static')}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 text-lg rounded-lg transition-transform duration-300 transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed"
                      >
                        Run New Analysis
                      </button>
                       <button
                        onClick={() => performAnalysis('real-time')}
                        disabled={isLoading}
                        className="bg-transparent border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white font-bold py-3 px-8 text-lg rounded-lg transition-all duration-300 transform hover:scale-105 disabled:border-gray-600 disabled:text-gray-500 disabled:cursor-not-allowed"
                      >
                        Start Real-time Simulation
                      </button>
                    </div>
                  </div>
                )}

                {isLoading && (
                  <div className="mt-6">
                    <AnalysisStepper currentStatus={analysisStatus} />
                  </div>
                )}

                {error && (
                  <div className="mt-6 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex items-center gap-3 justify-center">
                    <AlertTriangleIcon className="w-6 h-6" />
                    <div>
                      <h3 className="font-bold">Analysis Failed</h3>
                      <p>{error}</p>
                    </div>
                  </div>
                )}
                
                {analysisStatus === 'complete' && analysisResult && (
                  <>
                    {analysisMode === 'static' && <ResultsDashboard result={analysisResult} />}
                    {analysisMode === 'real-time' && (
                      <RealtimeDashboard 
                        initialResult={analysisResult} 
                        onStop={() => resetState(true)} 
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </main>

        <footer className="text-center mt-12 text-gray-500">
          <p>Powered by a simulated Hybrid AI model (Random Forest + Autoencoder). A conceptual demonstration.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
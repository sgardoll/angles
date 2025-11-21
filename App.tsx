import React, { useState } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { ResultsGrid } from './components/ResultsGrid';
import { generateAngles } from './services/geminiService';
import { RedditPost, AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (transcript: string, file: File | null) => {
    setAppState(AppState.ANALYZING);
    setError(null);
    try {
      const results = await generateAngles(transcript, file);
      setPosts(results);
      setAppState(AppState.RESULTS);
    } catch (err) {
      console.error(err);
      setError("Failed to generate angles. Please try again or check your API key.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setPosts([]);
    setAppState(AppState.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-slate-200 selection:bg-indigo-500/30">
      <Header />
      
      <main className="p-6 md:p-12">
        {appState === AppState.IDLE || appState === AppState.ANALYZING ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <div className="text-center mb-10 max-w-2xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                Turn one video into <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                  infinite conversations.
                </span>
              </h1>
              <p className="text-lg text-slate-400">
                Angles analyzes your content to find the perfect hooks for different Reddit communities, ensuring value-first engagement without the spam.
              </p>
            </div>
            
            <InputSection onAnalyze={handleAnalyze} appState={appState} />
            
            {appState === AppState.ERROR && (
              <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 flex items-center gap-2 animate-pulse">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{error}</span>
              </div>
            )}
          </div>
        ) : (
          <ResultsGrid posts={posts} onReset={handleReset} />
        )}
      </main>
    </div>
  );
};

export default App;

import React, { useState, ChangeEvent } from 'react';
import { AppState } from '../types';

interface InputSectionProps {
  onAnalyze: (transcript: string, file: File | null) => void;
  appState: AppState;
}

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, appState }) => {
  const [transcript, setTranscript] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!transcript.trim()) return;
    onAnalyze(transcript, file);
  };

  const isLoading = appState === AppState.ANALYZING;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="bg-indigo-500 rounded-lg p-2">📺</span>
          <span>Source Material</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Video Source */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-400">YouTube URL (Reference)</label>
            <input 
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Visual Context Upload */}
          <div className="space-y-3">
             <label className="block text-sm font-medium text-slate-400">Visual Reference (Optional)</label>
             <div className="relative">
                <input 
                  type="file" 
                  accept="image/*,video/mp4,video/webm"
                  onChange={handleFileChange}
                  className="hidden" 
                  id="file-upload"
                />
                <label 
                  htmlFor="file-upload"
                  className="w-full bg-slate-900 border border-slate-700 border-dashed rounded-lg px-4 py-3 text-slate-400 flex items-center justify-center cursor-pointer hover:bg-slate-800 transition-colors"
                >
                  {file ? (
                    <span className="text-indigo-400 truncate">{file.name}</span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                      Upload Thumbnail/Clip
                    </span>
                  )}
                </label>
             </div>
          </div>
        </div>

        {/* Transcript Area */}
        <div className="space-y-3 mb-8">
          <label className="block text-sm font-medium text-slate-400">Transcript / Content Text</label>
          <textarea 
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste your video transcript here..."
            className="w-full h-64 bg-slate-900 border border-slate-700 rounded-lg px-4 py-4 text-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none resize-none leading-relaxed font-mono text-sm"
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button 
            onClick={handleSubmit}
            disabled={isLoading || !transcript.trim()}
            className={`
              flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all transform
              ${isLoading || !transcript.trim() 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-[1.02] hover:shadow-lg shadow-indigo-500/25'
              }
            `}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Extracting Angles...
              </>
            ) : (
              <>
                <span>Find Angles</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

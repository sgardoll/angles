import React from 'react';
import { RedditPost, AngleDirection } from '../types';
import { PostPreview } from './PostPreview';

interface ResultsGridProps {
  posts: RedditPost[];
  onReset: () => void;
  onRefine: (direction: AngleDirection) => void;
  isRefining: boolean;
}

export const ResultsGrid: React.FC<ResultsGridProps> = ({ posts, onReset, onRefine, isRefining }) => {
  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Generated Angles</h2>
          <p className="text-slate-400 mt-1">Found {posts.length} unique perspectives for your content.</p>
        </div>
        <button 
          onClick={onReset}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors border border-slate-700"
        >
          Analyze New Content
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
        {posts.map((post, index) => (
          <div key={index} className="flex flex-col gap-4 animate-fade-in">
            {/* Strategy Card */}
            <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-700/50 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider">Angle #{index + 1}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded ${
                  post.selfPromotionRisk === 'Low' ? 'bg-green-500/20 text-green-400' :
                  post.selfPromotionRisk === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  Risk: {post.selfPromotionRisk}
                </span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed italic">
                "{post.angleExplanation}"
              </p>
            </div>

            {/* The Post Preview */}
            <PostPreview post={post} />
            
            {/* Action Buttons */}
            <div className="flex gap-2">
               <button 
                 onClick={() => navigator.clipboard.writeText(`${post.title}\n\n${post.body}`)}
                 className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                 Copy
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* Refinement Actions */}
      <div className="bg-[#1e293b]/50 border border-slate-800 rounded-2xl p-8 mb-12">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
              <span>Refine Strategy</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button 
                  onClick={() => onRefine('niche')}
                  disabled={isRefining}
                  className="relative overflow-hidden bg-[#1e293b] hover:bg-slate-800 border border-indigo-500/30 hover:border-indigo-500/60 p-6 rounded-xl text-left transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                       <svg className="w-24 h-24 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z"/></svg>
                  </div>
                  <div className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-bold text-indigo-400">Contract Scope (Specific)</span>
                          {isRefining ? (
                             <span className="animate-spin h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full"></span>
                          ) : (
                             <svg className="w-6 h-6 text-slate-500 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                          )}
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed">
                          "Find me more obvious, exact-match communities."<br/>
                          <span className="text-slate-500 mt-1 block text-xs">e.g. Target r/FlutterDev instead of r/programming</span>
                      </p>
                  </div>
              </button>
              
              <button 
                  onClick={() => onRefine('broad')}
                  disabled={isRefining}
                  className="relative overflow-hidden bg-[#1e293b] hover:bg-slate-800 border border-purple-500/30 hover:border-purple-500/60 p-6 rounded-xl text-left transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <svg className="w-24 h-24 text-purple-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                  </div>
                   <div className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-bold text-purple-400">Expand Scope (Broad)</span>
                           {isRefining ? (
                             <span className="animate-spin h-5 w-5 border-2 border-purple-500 border-t-transparent rounded-full"></span>
                          ) : (
                             <svg className="w-6 h-6 text-slate-500 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                          )}
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed">
                          "Find me less obvious, 'vibe-based' communities."<br/>
                          <span className="text-slate-500 mt-1 block text-xs">e.g. Target r/vibecoding instead of r/webdev</span>
                      </p>
                  </div>
              </button>
          </div>
      </div>
    </div>
  );
};
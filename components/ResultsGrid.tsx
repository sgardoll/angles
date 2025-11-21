import React from 'react';
import { RedditPost } from '../types';
import { PostPreview } from './PostPreview';

interface ResultsGridProps {
  posts: RedditPost[];
  onReset: () => void;
}

export const ResultsGrid: React.FC<ResultsGridProps> = ({ posts, onReset }) => {
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

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {posts.map((post, index) => (
          <div key={index} className="flex flex-col gap-4">
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
    </div>
  );
};

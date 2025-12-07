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
  
  const handleCopyMarkdown = (post: RedditPost) => {
    const text = `${post.title}\n\n${post.body}`;
    navigator.clipboard.writeText(text);
  };

  const handleCopyRichText = async (post: RedditPost, elementId: string) => {
    try {
        const bodyElement = document.getElementById(elementId);
        if (!bodyElement) return;

        // Construct simple HTML for the clipboard
        const titleHtml = `<h1 style="font-size: 1.2em; font-weight: bold; margin-bottom: 1em;">${post.title}</h1>`;
        const bodyHtml = bodyElement.innerHTML;
        const fullHtml = titleHtml + bodyHtml;

        const blobHtml = new Blob([fullHtml], { type: 'text/html' });
        const blobText = new Blob([`${post.title}\n\n${post.body}`], { type: 'text/plain' });

        // @ts-ignore - ClipboardItem is standard but might be missing in older types
        const data = [new ClipboardItem({
            ['text/html']: blobHtml,
            ['text/plain']: blobText,
        })];

        await navigator.clipboard.write(data);
    } catch (err) {
        console.error("Rich text copy failed, falling back to markdown", err);
        handleCopyMarkdown(post);
    }
  };

  const handlePostToReddit = (post: RedditPost) => {
    // Reddit submit URL format
    // Clean the subreddit name to ensure we don't duplicate the "r/" prefix
    // The model typically returns "r/subreddit", but the URL structure is /r/[name]
    const cleanSubreddit = post.subreddit.replace(/^r\//i, '').replace(/^\//, '');
    const baseUrl = `https://www.reddit.com/r/${cleanSubreddit}/submit`;
    const params = new URLSearchParams({
      title: post.title,
      text: post.body,
      selftext: 'true' // Forces a text post
    });
    window.open(`${baseUrl}?${params.toString()}`, '_blank');
  };

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
        {posts.map((post, index) => {
          const contentId = `post-content-${index}`;
          return (
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
              <PostPreview post={post} contentId={contentId} />
              
              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                 <button 
                   onClick={() => handlePostToReddit(post)}
                   className="w-full bg-[#FF4500] hover:bg-[#ff5722] text-white py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-900/20 group transform hover:-translate-y-0.5"
                   title="Open draft in Reddit"
                 >
                   <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 1.249 0 .688-.561 1.249-1.249 1.249 0-.687-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>
                   Draft on Reddit
                 </button>

                 <div className="flex gap-2">
                    <button 
                      onClick={() => handleCopyMarkdown(post)}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 border border-slate-700"
                      title="Copy as Markdown (Best for Reddit Markdown Mode)"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      Copy MD
                    </button>
                    <button 
                      onClick={() => handleCopyRichText(post, contentId)}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
                      title="Copy formatted text (Best for Fancy Pants Editor)"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                      Copy Rich
                    </button>
                 </div>
              </div>
            </div>
          );
        })}
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
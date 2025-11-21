import React from 'react';
import ReactMarkdown from 'react-markdown';
import { RedditPost } from '../types';

interface PostPreviewProps {
  post: RedditPost;
}

export const PostPreview: React.FC<PostPreviewProps> = ({ post }) => {
  return (
    <div className="bg-white text-slate-900 rounded-lg overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      
      {/* Reddit Header */}
      <div className="flex items-center gap-2 p-3 border-b border-slate-100 bg-slate-50">
        <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs">
          r/
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-800">{post.subreddit}</span>
          <span className="text-[10px] text-slate-500">Posted by u/AnglesApp • now</span>
        </div>
        {post.flair && (
          <span className="ml-auto px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full text-[10px] font-medium">
            {post.flair}
          </span>
        )}
      </div>

      {/* Post Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold leading-snug mb-3 text-slate-900">
          {post.title}
        </h3>
        <div className="prose prose-sm prose-slate max-w-none text-slate-700">
          <div className="line-clamp-[12] whitespace-pre-wrap font-sans">
             {post.body}
          </div>
        </div>
      </div>

      {/* Reddit Footer Actions */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-4 text-slate-500 text-xs font-bold">
        <div className="flex items-center gap-1 bg-slate-200/50 px-2 py-1 rounded hover:bg-slate-200 cursor-pointer">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3l8 9h-5v9h-6v-9H4l8-9z"/></svg>
          <span>Vote</span>
          <svg className="w-4 h-4 rotate-180" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3l8 9h-5v9h-6v-9H4l8-9z"/></svg>
        </div>
        <div className="flex items-center gap-1 hover:bg-slate-200 px-2 py-1 rounded cursor-pointer">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
          <span>Comments</span>
        </div>
        <div className="flex items-center gap-1 hover:bg-slate-200 px-2 py-1 rounded cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
          <span>Share</span>
        </div>
      </div>
    </div>
  );
};

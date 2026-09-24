import React, { useEffect, useState } from 'react';
import { 
  Clock, 
  User, 
  ArrowLeft, 
  Share2, 
  Zap, 
  ArrowRight, 
  Tag, 
  Sparkles 
} from 'lucide-react';
import { BLOG_POSTS, GAMES } from '../data/mockData';
import { useRouter, Link } from '../context/RouterContext';
import { apiRequest } from '../context/AuthContext';
import { BlogPost } from '../types';

export const BlogPostPage: React.FC = () => {
  const { params, navigate } = useRouter();
  const slug = params.blogId || 'omega-vs-aurora-how-to-watch-sept-18';
  const [publishedPost, setPublishedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    apiRequest(`/api/news/${slug}`)
      .then(data => setPublishedPost(data.post))
      .catch(() => setPublishedPost(null));
  }, [slug]);

  const post = BLOG_POSTS.find(p => p.slug === slug) || publishedPost || BLOG_POSTS[0];
  const relatedPosts = BLOG_POSTS.filter(p => p.id !== post.id).slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back Button */}
      <button
        onClick={() => navigate('/blog')}
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-brand-gold uppercase tracking-wider transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to News & Guides
      </button>

      {/* Article Header */}
      <div className="space-y-4">
        <span className="inline-block text-xs font-extrabold text-brand-gold bg-brand-gold/15 px-3 py-1 rounded-full border border-brand-gold/30 uppercase">
          {post.category}
        </span>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 pt-2 border-b border-brand-cardBorder pb-4">
          <div className="flex items-center gap-1.5 text-white font-medium">
            <User className="w-4 h-4 text-brand-gold" /> {post.author}
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-brand-cyan" /> {post.date} ({post.readTime})
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="rounded-3xl overflow-hidden aspect-video border border-brand-cardBorder shadow-2xl">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Content */}
      <div className="space-y-6 text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
        {post.content.map((paragraph, idx) => (
          <p key={idx} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-brand-cardBorder">
        <span className="text-xs font-bold text-gray-400 uppercase mr-2 flex items-center gap-1">
          <Tag className="w-3.5 h-3.5" /> Tags:
        </span>
        {post.tags.map(t => (
          <span key={t} className="text-xs bg-brand-card border border-brand-cardBorder px-3 py-1 rounded-lg text-gray-300">
            #{t}
          </span>
        ))}
      </div>

      {/* Interactive Top-Up CTA Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#201538] via-[#141026] to-[#201538] border border-brand-gold/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-extrabold text-brand-gold uppercase tracking-wider">Instant Game Top-Up</span>
          <h3 className="text-xl sm:text-2xl font-display font-black text-white">
            Ready to stock up on Diamonds?
          </h3>
          <p className="text-xs text-gray-400">
            Get instant MLBB & HoK currency credited in 1 to 5 minutes via GCash & Maya.
          </p>
        </div>

        <button
          onClick={() => navigate('/games/mobile-legends')}
          className="px-6 py-3.5 bg-gradient-to-r from-brand-gold to-brand-goldLight text-brand-dark font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-gold-glow hover:opacity-95 transition-all shrink-0 flex items-center gap-2"
        >
          <Zap className="w-4 h-4 fill-current" /> Top-Up Now (Save 25%)
        </button>
      </div>

      {/* Related Posts */}
      <div className="space-y-4 pt-6 border-t border-brand-cardBorder">
        <h3 className="font-display font-bold text-lg text-white">Related News & Articles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {relatedPosts.map(r => (
            <div
              key={r.id}
              onClick={() => navigate(`/blog/${r.slug}`)}
              className="p-4 rounded-2xl bg-brand-card border border-brand-cardBorder hover:border-brand-gold/50 cursor-pointer transition-all group flex items-center gap-4"
            >
              <img src={r.image} alt={r.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-white group-hover:text-brand-gold transition-colors line-clamp-2">
                  {r.title}
                </h4>
                <span className="text-[11px] text-gray-500 mt-1 block">{r.readTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

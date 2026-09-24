import React, { useEffect, useState } from 'react';
import { 
  Flame, 
  Clock, 
  User, 
  ArrowRight, 
  Search, 
  Sparkles,
  Tag
} from 'lucide-react';
import { BLOG_POSTS } from '../data/mockData';
import { useRouter } from '../context/RouterContext';
import { apiRequest } from '../context/AuthContext';
import { BlogPost } from '../types';

export const BlogPage: React.FC = () => {
  const { navigate } = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [publishedPosts, setPublishedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    apiRequest('/api/news')
      .then(data => setPublishedPosts(data.news || []))
      .catch(() => setPublishedPosts([]));
  }, []);

  const categories = ['All', 'Esports', 'Patch Notes', 'Guides', 'News'];

  const allPosts = [...publishedPosts, ...BLOG_POSTS.filter(post => !publishedPosts.some(published => published.slug === post.slug))];
  const filteredPosts = allPosts.filter(post => {
    const matchesCat = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-[#1E1335] via-[#141026] to-[#1E1335] border border-brand-gold/40 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold text-xs font-bold uppercase tracking-wider border border-brand-gold/30">
            <Flame className="w-3.5 h-3.5" /> Esports & Patch Notes Hub
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-white">
            GPDS Gaming News & Guides
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed">
            Stay ahead of the meta with official balance updates, tournament recaps, redeem code guides, and top-up tips.
          </p>
        </div>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-brand-gold text-brand-dark shadow-gold-glow'
                  : 'bg-brand-card hover:bg-brand-cardLight text-gray-400 hover:text-white border border-brand-cardBorder'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-brand-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search guides & news..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-brand-card border border-brand-cardBorder focus:border-brand-gold rounded-xl pl-10 pr-3 py-2 text-xs text-white outline-none"
          />
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map(post => (
          <div
            key={post.id}
            onClick={() => navigate(`/blog/${post.slug}`)}
            className="rounded-3xl bg-brand-card border border-brand-cardBorder hover:border-brand-gold/60 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-brand-gold/10 flex flex-col justify-between group"
          >
            <div>
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-brand-gold text-brand-dark font-display font-black text-[10px] px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  {post.category}
                </div>
              </div>

              <div className="p-5 space-y-2.5">
                <div className="flex items-center gap-3 text-[11px] text-gray-400">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="font-display font-bold text-base text-white group-hover:text-brand-gold transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                  {post.summary}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 flex items-center justify-between border-t border-brand-cardBorder/50 mt-4 pt-4 text-xs font-bold text-brand-gold">
              <span>Read Full Article</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

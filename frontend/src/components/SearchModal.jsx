import React, { useState, useEffect, useRef } from 'react';
import { fetchApi, formatImageUrl } from '../services/api';

export default function SearchModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      setSearchTerm('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!searchTerm.trim() || searchTerm.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const data = await fetchApi(`/news?search=${encodeURIComponent(searchTerm.trim())}&limit=6`);
      if (data && data.news) {
        setResults(data.news);
      } else {
        setResults([]);
      }
      setLoading(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative border-b border-gray-100 p-4 flex items-center gap-3">
          <i className="bi bi-search text-gray-400 text-lg"></i>
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search news, topics, keywords..."
            className="w-full bg-transparent text-gray-800 placeholder-gray-400 font-medium text-base focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <i className="bi bi-x-circle-fill"></i>
            </button>
          )}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-[#c91f26] p-1 text-sm font-semibold ml-2"
          >
            ESC
          </button>
        </div>

        {/* Content Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {loading && (
            <div className="text-center py-8 text-gray-400 text-sm flex items-center justify-center gap-2">
              <i className="bi bi-arrow-repeat animate-spin text-[#c91f26]"></i> Searching news stories...
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Matching Articles ({results.length})
              </div>
              {results.map((item) => (
                <a
                  key={item._id || item.slug}
                  href={`/post-detail.html?slug=${item.slug}`}
                  className="flex items-center gap-4 p-2.5 rounded-lg hover:bg-gray-50 transition border border-transparent hover:border-gray-200 group"
                >
                  <img
                    src={formatImageUrl(item.image)}
                    alt={item.title}
                    className="w-16 h-14 rounded object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-[#c91f26] uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-semibold text-gray-800 group-hover:text-[#c91f26] truncate transition">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                      <span><i className="bi bi-clock"></i> {item.readTime || '3 min'}</span>
                      <span>•</span>
                      <span><i className="bi bi-eye"></i> {item.views || 0} views</span>
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}

          {!loading && searchTerm.length >= 2 && results.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">
              No news articles found matching "<span className="font-semibold text-gray-700">{searchTerm}</span>"
            </div>
          )}

          {searchTerm.length < 2 && (
            <div className="py-2">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Suggested Topics
              </div>
              <div className="flex flex-wrap gap-2">
                {['Kerala', 'India', 'World', 'Sports', 'Technology', 'Business', 'Weather'].map(
                  (topic, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSearchTerm(topic)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-[#c91f26] hover:text-white transition"
                    >
                      {topic}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

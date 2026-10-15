import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchApi, formatImageUrl, handleImageError } from '../../services/api';

const TRENDING_ITEMS = [
  { text: 'AI Revolution 2026', count: '25.3K' },
  { text: 'Space Exploration News', count: '18.7K' },
  { text: 'Digital Marketing Tips', count: '12.1K' },
  { text: 'Health and Wellness', count: '9.8K' },
  { text: 'Travel Destinations', count: '8.5K' },
];

const POPULAR_TOPICS = [
  'Technology',
  'Business',
  'Lifestyle',
  'Travel',
  'Health',
  'Fashion',
  'Sports',
  'Education',
];

export default function SearchModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSearchTerm('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Live search query
  useEffect(() => {
    const query = searchTerm.trim();
    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await fetchApi(`/news?search=${encodeURIComponent(query)}&limit=8`);
        if (data && data.news && Array.isArray(data.news)) {
          setResults(data.news);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelectTopic = (topic) => {
    setSearchTerm(topic);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Right Slide-over Sidebar Drawer */}
      <div
        className={`fixed top-0 right-0 w-[400px] max-w-full h-screen bg-white z-[9999] shadow-[-5px_0_30px_rgba(0,0,0,0.15)] overflow-y-auto transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="flex items-center px-6 py-5 border-b border-[#eeeeee] gap-3">
          <div className="flex-1 flex items-center bg-[#f5f5f5] rounded-lg px-3.5 py-2.5 gap-2.5">
            <i className="bi bi-search text-[#777777] text-base"></i>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search articles..."
              autoComplete="off"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-0 outline-none text-[15px] text-[#222222] placeholder:text-[#999999]"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 transition-colors p-0.5 ml-1"
                title="Clear"
              >
                <i className="bi bi-x-circle-fill text-sm"></i>
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#222222] hover:bg-[#f0f0f0] hover:text-[#ff4c60] text-lg transition-colors cursor-pointer flex-shrink-0"
            title="Close Search"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {searchTerm.trim().length === 0 ? (
            /* Suggestions View */
            <div>
              <div className="text-xs font-semibold uppercase tracking-[1px] text-[#777777] mb-3.5">
                Trending Now
              </div>
              <ul className="mb-6 divide-y divide-[#f0f0f0] p-0 list-none">
                {TRENDING_ITEMS.map((item, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleSelectTopic(item.text)}
                    className="flex items-center gap-3 py-2.5 cursor-pointer hover:pl-1.5 transition-all group"
                  >
                    <i className="bi bi-fire text-[#ff4c60] text-base w-5 text-center"></i>
                    <span className="text-sm font-medium text-[#222222] group-hover:text-[#ff4c60] transition-colors">
                      {item.text}
                    </span>
                    <span className="ml-auto text-xs text-[#777777] bg-[#f5f5f5] px-2 py-0.5 rounded font-normal">
                      {item.count}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="text-xs font-semibold uppercase tracking-[1px] text-[#777777] mb-3 mt-6">
                Popular Topics
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TOPICS.map((topic, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectTopic(topic)}
                    className="inline-block px-3.5 py-1.5 border border-[#e0e0e0] rounded-full text-[#666666] text-xs bg-transparent hover:border-[#ff4c60] hover:text-[#ff4c60] hover:bg-[#ff4c60]/5 transition-colors cursor-pointer"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Search Results View */
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-semibold uppercase tracking-[1px] text-[#777777]">
                  Search Results
                </div>
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-[#ff4c60] hover:underline font-medium"
                >
                  Clear & View Trending
                </button>
              </div>

              {loading && (
                <div className="py-8 text-center text-gray-500 text-sm flex items-center justify-center gap-2">
                  <i className="bi bi-arrow-repeat animate-spin text-[#ff4c60] text-lg"></i>
                  <span>Searching articles...</span>
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="divide-y divide-[#f0f0f0]">
                  {results.map((item) => (
                    <Link
                      key={item._id || item.slug}
                      to={`/post-detail?slug=${item.slug}`}
                      onClick={onClose}
                      className="flex gap-3.5 py-3.5 hover:pl-1.5 transition-all text-decoration-none group"
                    >
                      <img
                        src={formatImageUrl(item.image)}
                        alt={item.title}
                        className="w-[70px] h-[60px] object-cover rounded-md flex-shrink-0"
                        onError={(e) => handleImageError(e)}
                      />
                      <div className="flex-1 min-w-0">
                        <h6 className="text-sm font-semibold text-[#222222] group-hover:text-[#ff4c60] line-clamp-2 leading-snug mb-1 transition-colors">
                          {item.title}
                        </h6>
                        <span className="text-xs text-[#777777]">
                          {item.category || 'News'} - {item.readTime || '5 min read'}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {!loading && results.length === 0 && (
                <div className="py-10 text-center">
                  <i className="bi bi-search text-3xl text-gray-300 block mb-2"></i>
                  <p className="text-sm text-gray-600 font-medium">
                    No articles found matching &quot;{searchTerm}&quot;
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Try searching for another topic or keyword.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

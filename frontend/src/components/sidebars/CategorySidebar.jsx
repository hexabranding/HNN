import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchApi } from '../../services/api';

export default function CategorySidebar({ activeCategory = '' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriesList, setCategoriesList] = useState([]);
  const navigate = useNavigate();

  const fallbackCategories = [
    { name: 'Sports', path: '/sports', count: 45, isSub: false },
    { name: 'Health', path: '/health', count: 38, isSub: false },
    { name: 'Technology', path: '/technology', count: 52, isSub: false },
    { name: 'Business', path: '/business', count: 41, isSub: false },
    { name: 'Entertainment', path: '/category/entertainment', count: 29, isSub: false },
    { name: 'Lifestyle', path: '/category/lifestyle', count: 35, isSub: false },
  ];

  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      try {
        const data = await fetchApi('/categories');
        if (isMounted && Array.isArray(data) && data.length > 0) {
          const list = [];
          for (const item of data) {
            list.push({
              name: item.label,
              path: `/${item.slug}`,
              count: item.count || 0,
              isSub: false,
            });
            if (item.children && Array.isArray(item.children)) {
              for (const ch of item.children) {
                list.push({
                  name: ch.label,
                  path: `/${item.slug}/${ch.slug}`,
                  count: ch.count || 0,
                  isSub: true,
                });
              }
            }
          }
          setCategoriesList(list);
        }
      } catch (_err) {
        // Fallback to static defaults
      }
    }
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const categoriesToDisplay = categoriesList.length > 0 ? categoriesList : fallbackCategories;

  const popularPosts = [
    {
      title: 'Champions Defining a New Era',
      date: 'July 22, 2026',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=100&q=80',
      slug: 'the-champions-defining-a-new-era-of-sport',
    },
    {
      title: 'Tactics Changing the Modern Game',
      date: 'July 21, 2026',
      image: 'https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=100&q=80',
      slug: 'inside-the-tactics-changing-the-modern-game',
    },
    {
      title: 'Underdog Teams Shock Fans',
      date: 'July 19, 2026',
      image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=100&q=80',
      slug: 'underdog-teams-shock-fans-in-world-cup-qualifiers',
    },
  ];

  const popularTags = [
    'Football',
    'Basketball',
    'Tennis',
    'Swimming',
    'Athletics',
    'Fitness',
    'World Cup',
    'Olympics',
    'Cricket',
    'Rugby',
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/blog-standard?q=${encodeURIComponent(searchTerm.trim())}`);
  };

  return (
    <aside className="sidebar space-y-6">
      {/* 1. Search Widget */}
      <div className="bg-[#fff9f5] border border-gray-100 rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleSearch} className="flex border border-gray-200 rounded-full overflow-hidden bg-white focus-within:border-[#ff4c60] focus-within:ring-2 focus-within:ring-[#ff4c60]/10 transition-all">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search articles..."
            className="flex-1 bg-transparent px-5 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
          />
          <button
            type="submit"
            className="w-10 h-10 rounded-full bg-[#ff4c60] text-white flex items-center justify-center m-1 hover:bg-[#e03b4e] transition-colors cursor-pointer flex-shrink-0"
            aria-label="Search"
          >
            <i className="bi bi-search text-xs"></i>
          </button>
        </form>
      </div>

      {/* 2. Categories Widget */}
      <div className="bg-[#fff9f5] border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h4 className="font-['Prompt',sans-serif] text-[18px] font-bold text-gray-900 mb-5 pb-3 border-b-2 border-gray-200 relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-10 after:h-[2px] after:bg-[#ff4c60]">
          Categories
        </h4>
        <ul className="divide-y divide-gray-100 list-none p-0 m-0">
          {categoriesToDisplay.map((cat, idx) => {
            const cleanSlug = cat.path.replace(/^\//, '').toLowerCase();
            const cleanActive = activeCategory.toLowerCase().trim();
            const isActive =
              cleanActive === cat.name.toLowerCase() ||
              cleanActive === cleanSlug ||
              cleanSlug.endsWith(`/${cleanActive}`);

            return (
              <li key={idx} className="group">
                <Link
                  to={cat.path}
                  className={`flex items-center justify-between py-3 text-sm font-medium transition-all ${
                    cat.isSub ? 'pl-3.5 text-gray-600' : 'text-gray-800'
                  } ${
                    isActive
                      ? 'text-[#ff4c60] font-bold pl-1.5'
                      : 'hover:text-[#ff4c60] hover:pl-1.5'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {cat.isSub && <span className="text-gray-300 text-xs">↳</span>}
                    <span>{cat.name}</span>
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full transition-colors ${
                      isActive
                        ? 'bg-[#ff4c60] text-white'
                        : 'bg-[#f0f0f0] text-gray-500 group-hover:bg-[#ff4c60] group-hover:text-white'
                    }`}
                  >
                    {cat.count}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 3. Popular Posts Widget */}
      <div className="bg-[#fff9f5] border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h4 className="font-['Prompt',sans-serif] text-[18px] font-bold text-gray-900 mb-5 pb-3 border-b-2 border-gray-200 relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-10 after:h-[2px] after:bg-[#ff4c60]">
          Popular Posts
        </h4>
        <div className="space-y-4">
          {popularPosts.map((post, idx) => (
            <div key={idx} className="flex items-center gap-3.5 group">
              <Link
                to={`/post-detail?slug=${post.slug}`}
                className="w-[75px] h-[65px] rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 block"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <h5 className="font-['Prompt',sans-serif] text-sm font-semibold text-gray-900 leading-snug group-hover:text-[#ff4c60] transition-colors line-clamp-2">
                  <Link to={`/post-detail?slug=${post.slug}`}>
                    {post.title}
                  </Link>
                </h5>
                <span className="text-xs text-gray-400 flex items-center gap-1.5 mt-1.5">
                  <i className="bi bi-calendar3 text-[11px]"></i>
                  {post.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Popular Tags Widget */}
      <div className="bg-[#fff9f5] border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h4 className="font-['Prompt',sans-serif] text-[18px] font-bold text-gray-900 mb-5 pb-3 border-b-2 border-gray-200 relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-10 after:h-[2px] after:bg-[#ff4c60]">
          Popular Tags
        </h4>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag, idx) => (
            <Link
              key={idx}
              to={`/blog-standard?tag=${encodeURIComponent(tag)}`}
              className="px-3.5 py-1.5 bg-[#f0f4ec] border border-[#e2e8de] rounded-full text-xs font-medium text-gray-700 hover:bg-[#ff4c60] hover:text-white hover:border-[#ff4c60] transition-all"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* 5. Follow Us Widget */}
      <div className="bg-[#fff9f5] border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h4 className="font-['Prompt',sans-serif] text-[18px] font-bold text-gray-900 mb-5 pb-3 border-b-2 border-gray-200 relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-10 after:h-[2px] after:bg-[#ff4c60]">
          Follow Us
        </h4>
        <div className="flex flex-col gap-2.5">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#3b5998] hover:opacity-95 text-white font-medium text-sm transition-all hover:translate-x-1"
          >
            <i className="bi bi-facebook text-base w-5 text-center"></i>
            <span>Facebook</span>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#1da1f2] hover:opacity-95 text-white font-medium text-sm transition-all hover:translate-x-1"
          >
            <i className="bi bi-twitter-x text-base w-5 text-center"></i>
            <span>Twitter</span>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white font-medium text-sm transition-all hover:translate-x-1"
          >
            <i className="bi bi-instagram text-base w-5 text-center"></i>
            <span>Instagram</span>
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#ff0000] hover:opacity-95 text-white font-medium text-sm transition-all hover:translate-x-1"
          >
            <i className="bi bi-youtube text-base w-5 text-center"></i>
            <span>YouTube</span>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-[#0077b5] font-medium text-sm transition-all hover:translate-x-1"
          >
            <i className="bi bi-linkedin text-base w-5 text-center"></i>
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </aside>
  );
}

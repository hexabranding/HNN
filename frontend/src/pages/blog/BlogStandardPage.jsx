import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import CategorySidebar from '../../components/sidebars/CategorySidebar';
import Pagination from '../../components/common/Pagination';
import { fetchApi, formatImageUrl } from '../../services/api';

const FALLBACK_POSTS = [
  {
    badge: 'Technology',
    title: "The Rise of Generative AI: How It's Transforming Creative Industries",
    author: 'David Miller',
    authorImg: 'https://i.pravatar.cc/30?img=5',
    date: 'July 20, 2026',
    readTime: '8 min read',
    views: '2.4K views',
    excerpt:
      'From art to music, generative AI is revolutionizing the creative process. Discover how artists and content creators are leveraging this technology to push boundaries and create unprecedented works.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    slug: 'the-rise-of-generative-ai-how-its-transforming-creative-industries',
  },
  {
    badge: 'Business',
    title: 'Remote Work Revolution: How Companies Are Embracing a Flexible Future',
    author: 'Emma Roberts',
    authorImg: 'https://i.pravatar.cc/30?img=8',
    date: 'July 19, 2026',
    readTime: '6 min read',
    views: '1.8K views',
    excerpt:
      'The modern workplace has changed fundamentally. Explore the strategies forward-thinking companies are using to maintain productivity, culture, and employee well-being in distributed teams.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    slug: 'remote-work-revolution-how-companies-are-embracing-a-flexible-future',
  },
  {
    badge: 'Lifestyle',
    title: 'Mindful Living in a Fast-Paced World: Simple Habits for Daily Balance',
    author: 'Sarah Connor',
    authorImg: 'https://i.pravatar.cc/30?img=9',
    date: 'July 18, 2026',
    readTime: '5 min read',
    views: '3.1K views',
    excerpt:
      'In an age of constant connectivity, finding inner peace requires intentional practice. Learn practical mindfulness habits that easily fit into busy schedules without overwhelming routines.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    slug: 'mindful-living-in-a-fast-paced-world-simple-habits-for-daily-balance',
  },
  {
    badge: 'Travel',
    title: 'Hidden Paradises: 10 Underrated Travel Destinations for 2026',
    author: 'Michael Chang',
    authorImg: 'https://i.pravatar.cc/30?img=12',
    date: 'July 17, 2026',
    readTime: '7 min read',
    views: '4.5K views',
    excerpt:
      'Escape the crowds and discover extraordinary places that offer authentic cultural experiences, stunning landscapes, and rich historical heritage without tourist overload.',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
    slug: 'hidden-paradises-10-underrated-travel-destinations-for-2026',
  },
];

export default function BlogStandardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterTag = searchParams.get('tag') || '';
  const searchQuery = searchParams.get('q') || '';
  const pageFromUrl = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const sortFromUrl = searchParams.get('sort') || 'newest';

  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [sortBy, setSortBy] = useState(sortFromUrl);
  const [apiPosts, setApiPosts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const CARDS_PER_PAGE = 6;

  // Sync state if browser back/forward buttons clicked
  useEffect(() => {
    const p = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const s = searchParams.get('sort') || 'newest';
    if (p !== currentPage) setCurrentPage(p);
    if (s !== sortBy) setSortBy(s);
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;
    async function loadPosts() {
      setLoading(true);
      try {
        const qp = new URLSearchParams();
        if (searchQuery) qp.set('search', searchQuery);
        if (filterTag) qp.set('tag', filterTag);
        qp.set('page', currentPage.toString());
        qp.set('limit', CARDS_PER_PAGE.toString());
        if (sortBy) qp.set('sort', sortBy);

        const res = await fetchApi(`/news?${qp.toString()}`, { skipCache: true });
        if (isMounted) {
          if (res && res.news && Array.isArray(res.news) && res.news.length > 0) {
            setApiPosts(res.news);
            setTotalCount(res.total || res.news.length);
            setTotalPages(res.totalPages || Math.max(1, Math.ceil((res.total || res.news.length) / CARDS_PER_PAGE)));
          } else {
            setApiPosts([]);
            setTotalCount(0);
            setTotalPages(1);
          }
        }
      } catch (err) {
        console.warn('API error in BlogStandardPage:', err);
        if (isMounted) {
          setApiPosts([]);
          setTotalCount(0);
          setTotalPages(1);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadPosts();
    return () => { isMounted = false; };
  }, [searchQuery, filterTag, currentPage, sortBy]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', newPage.toString());
    if (sortBy && sortBy !== 'newest') nextParams.set('sort', sortBy);
    setSearchParams(nextParams);
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSortBy(newSort);
    setCurrentPage(1);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', '1');
    if (newSort === 'newest') {
      nextParams.delete('sort');
    } else {
      nextParams.set('sort', newSort);
    }
    setSearchParams(nextParams);
  };

  const isUsingFallback = apiPosts.length === 0 && !searchQuery && !filterTag;
  const displayedPosts = apiPosts.length > 0
    ? apiPosts.map((item, idx) => ({
        badge: item.category || 'News',
        title: item.title,
        author: item.author || 'Staff Reporter',
        authorImg: `https://i.pravatar.cc/30?img=${(idx % 12) + 1}`,
        date: item.date
          ? new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
          : item.createdAt
          ? new Date(item.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
          : 'Recent',
        readTime: item.readTime || '5 min read',
        views: `${item.views || 0} views`,
        excerpt: item.description || item.excerpt || (item.content ? item.content.replace(/<[^>]+>/g, '').slice(0, 160) + '...' : ''),
        image: formatImageUrl(item.image) || FALLBACK_POSTS[idx % FALLBACK_POSTS.length].image,
        slug: item.slug || `post-${idx + 1}`,
      }))
    : isUsingFallback
    ? FALLBACK_POSTS
    : [];

  const effectiveTotalCount = isUsingFallback ? FALLBACK_POSTS.length : totalCount;
  const effectiveTotalPages = isUsingFallback ? Math.max(1, Math.ceil(effectiveTotalCount / CARDS_PER_PAGE)) : totalPages;

  return (
    <div className="w-full">
      {/* Breadcrumb Section matching blog-standard.html */}
      <section className="bg-[#f2f2de] py-7 border-b border-[#e8e5dc]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2 font-medium flex-wrap">
            <Link to="/" className="text-[#ff4c60] hover:underline font-semibold">Home</Link>
            <span>/</span>
            <span className="text-gray-800 font-semibold">Blog Standard</span>
            {filterTag && (
              <>
                <span>/</span>
                <span className="text-[#ff4c60] font-semibold">Tag: #{filterTag}</span>
              </>
            )}
            {searchQuery && (
              <>
                <span>/</span>
                <span className="text-[#ff4c60] font-semibold">Search: "{searchQuery}"</span>
              </>
            )}
          </nav>
          <h1 className="font-['Prompt',sans-serif] text-3xl sm:text-4xl font-bold text-[#101820]">
            {searchQuery ? `Search Results: "${searchQuery}"` : filterTag ? `Articles tagged: #${filterTag}` : 'Blog Standard'}
          </h1>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-14 sm:py-16 bg-white">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Blog Standard Cards Column (8 cols) */}
            <div className="lg:col-span-8">
              {/* Professional Filter & Sort Toolbar */}
              <div className="mb-8 pb-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-500 font-medium">
                  Showing <span className="text-gray-900 font-semibold">{effectiveTotalCount > 0 ? (currentPage - 1) * CARDS_PER_PAGE + 1 : 0}</span>–
                  <span className="text-gray-900 font-semibold">{Math.min(currentPage * CARDS_PER_PAGE, effectiveTotalCount)}</span> of{' '}
                  <span className="text-gray-900 font-bold">{effectiveTotalCount}</span> stories
                </div>

                <div className="flex items-center gap-2.5 self-start sm:self-auto">
                  <label htmlFor="sortSelectBlog" className="text-xs uppercase tracking-wider text-gray-500 font-semibold flex items-center gap-1.5">
                    <i className="bi bi-sort-down text-sm text-[#ff4c60]"></i>
                    Sort by:
                  </label>
                  <select
                    id="sortSelectBlog"
                    value={sortBy}
                    onChange={handleSortChange}
                    className="text-xs sm:text-sm font-semibold text-gray-800 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#ff4c60] focus:ring-2 focus:ring-[#ff4c60]/10 transition cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="popular">Most Popular / Viewed</option>
                    <option value="likes">Most Liked</option>
                    <option value="comments">Most Commented</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="py-20 text-center">
                  <div className="inline-block w-8 h-8 border-3 border-[#ff4c60] border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-sm text-gray-500 font-medium">Loading stories...</p>
                </div>
              ) : displayedPosts.length === 0 ? (
                <div className="py-16 px-6 text-center bg-[#fafafa] rounded-2xl border border-dashed border-[#e2e8f0]">
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-50 text-[#c91f26] rounded-full flex items-center justify-center text-2xl">
                    <i className="bi bi-search"></i>
                  </div>
                  <h3 className="font-['Prompt',sans-serif] text-xl font-bold text-[#111111] mb-2">
                    No Articles Found
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto text-sm mb-6 leading-relaxed">
                    {searchQuery ? `We couldn't find any articles matching "${searchQuery}".` : filterTag ? `No articles currently tagged with #${filterTag}.` : 'No stories found in this section.'}
                  </p>
                  <Link
                    to="/blog-standard"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c91f26] hover:bg-[#a8191f] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition"
                  >
                    <i className="bi bi-arrow-left"></i>
                    <span>View All Articles</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-10">
                  {displayedPosts.map((post, idx) => (
                    <article
                      key={post.slug || idx}
                      className="rounded-2xl overflow-hidden border border-[#e8e5dc] bg-white group hover:shadow-lg transition-all duration-300"
                    >
                      {/* Wide Image with Badge */}
                      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                        <Link to={`/post-detail?slug=${post.slug}`}>
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        </Link>
                        <span className="absolute top-4 left-4 px-3.5 py-1 bg-[#ff4c60] text-white text-xs font-bold uppercase rounded-[4px] tracking-wider shadow-sm">
                          {post.badge}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-7 sm:p-8">
                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-4 text-[13.5px] text-[#777777] mb-3">
                          <span className="flex items-center gap-2 font-medium text-gray-800">
                            <img
                              src={post.authorImg}
                              alt={post.author}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <i className="bi bi-calendar3 text-[12px]"></i>
                            {post.date}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <i className="bi bi-clock text-[13px]"></i>
                            {post.readTime}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <i className="bi bi-eye text-[14px]"></i>
                            {post.views}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="font-['Prompt',sans-serif] text-[26px] sm:text-[28px] font-bold text-[#111111] leading-[1.25] tracking-tight mb-3.5 group-hover:text-[#ff4c60] transition-colors">
                          <Link to={`/post-detail?slug=${post.slug}`}>
                            {post.title}
                          </Link>
                        </h2>

                        {/* Excerpt */}
                        <p className="text-[15px] sm:text-[16px] text-[#777777] leading-[1.6] mb-4 font-normal">
                          {post.excerpt}
                        </p>

                        {/* Footer */}
                        <div>
                          <Link
                            to={`/post-detail?slug=${post.slug}`}
                            className="inline-flex items-center gap-2 font-['Prompt',sans-serif] text-[15px] font-semibold text-[#ff4c60] hover:text-[#e03b4e] transition-colors group/btn"
                          >
                            <span>Read More</span>
                            <i className="bi bi-arrow-right text-[14px] transition-transform duration-300 group-hover/btn:translate-x-1"></i>
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* Server-Side Pagination */}
              {displayedPosts.length > 0 && effectiveTotalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={effectiveTotalPages}
                  onPageChange={handlePageChange}
                  className="mt-12 !justify-start"
                />
              )}
            </div>

            {/* Sidebar Column (4 cols) */}
            <div className="lg:col-span-4">
              <CategorySidebar activeCategory="Lifestyle" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

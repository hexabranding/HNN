import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchApi } from '../../services/api';
import Pagination from '../../components/common/Pagination';

const DEFAULT_BUSINESS_ARTICLES = [
  {
    title: 'Global Markets Rally as Trade Agreements Strengthen Investor Confidence',
    date: 'July 22, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=85',
    excerpt: 'Stock markets around the world surged to new highs as major economies finalized trade deals that are expected to boost cross-border commerce and economic growth throughout the second half of 2026.',
    slug: 'global-markets-rally-trade-agreements',
    badge: 'Markets',
  },
  {
    title: 'Record Venture Capital Flows Into Climate Tech Startups',
    date: 'July 21, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&q=85',
    excerpt: 'Investors are pouring unprecedented amounts into climate technology companies, signaling a major shift in venture capital priorities toward sustainable innovation and clean energy solutions.',
    slug: 'record-venture-capital-climate-tech',
    badge: 'Startups',
  },
  {
    title: 'Remote Work Economy Reaches $2 Trillion as Hybrid Models Become Standard',
    date: 'July 20, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&q=85',
    excerpt: 'The global remote work economy has crossed the $2 trillion mark, driven by companies adopting permanent hybrid work policies and investing heavily in digital collaboration infrastructure.',
    slug: 'remote-work-economy-reaches-2-trillion',
    badge: 'Economy',
  },
  {
    title: 'Central Banks Signal Rate Stability as Inflation Eases Globally',
    date: 'July 19, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=85',
    excerpt: 'Major central banks indicated they are likely to hold interest rates steady as inflation continues to cool, providing relief to businesses and consumers seeking borrowing cost predictability.',
    slug: 'central-banks-rate-stability',
    badge: 'Finance',
  },
  {
    title: 'How AI Is Reshaping Corporate Decision-Making Across Industries',
    date: 'July 18, 2026',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=85',
    excerpt: 'From supply chain optimization to customer analytics, artificial intelligence tools are becoming essential for businesses looking to gain a competitive edge in an increasingly data-driven marketplace.',
    slug: 'how-ai-reshaping-corporate-decision-making',
    badge: 'AI & Business',
  },
];

const BUSINESS_TOPICS = [
  {
    title: 'Stock Market Hits Record High',
    date: 'Jul 22, 2026',
    comments: '342',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=120&q=80',
    slug: 'stock-market-hits-record-high',
  },
  {
    title: 'Climate Tech Fundraising Boom',
    date: 'Jul 21, 2026',
    comments: '189',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=120&q=80',
    slug: 'climate-tech-fundraising-boom',
  },
  {
    title: 'Hybrid Work Now Standard',
    date: 'Jul 20, 2026',
    comments: '267',
    image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=120&q=80',
    slug: 'hybrid-work-now-standard',
  },
];

const POPULAR_TAGS = [
  'Markets',
  'Startups',
  'Finance',
  'Economy',
  'AI',
  'Investment',
  'Trade',
  'Crypto',
];

export default function BusinessPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterTag = searchParams.get('tag') || '';
  const pageFromUrl = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const sortFromUrl = searchParams.get('sort') || 'newest';

  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [sortBy, setSortBy] = useState(sortFromUrl);
  const [articles, setArticles] = useState([]);
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
    async function loadData() {
      setLoading(true);
      try {
        const qp = new URLSearchParams();
        qp.set('category', 'business');
        if (filterTag) qp.set('tag', filterTag);
        qp.set('page', currentPage.toString());
        qp.set('limit', CARDS_PER_PAGE.toString());
        if (sortBy) qp.set('sort', sortBy);

        const data = await fetchApi(`/news?${qp.toString()}`, { skipCache: true });
        if (isMounted) {
          const list = (data && data.news && Array.isArray(data.news))
            ? data.news
            : (Array.isArray(data) ? data : []);

          if (list.length > 0) {
            const formatted = list.map((item, idx) => ({
              title: item.title,
              date: item.createdAt
                ? new Date(item.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : item.date || DEFAULT_BUSINESS_ARTICLES[idx % DEFAULT_BUSINESS_ARTICLES.length]?.date,
              readTime: item.readTime || `${Math.ceil((item.content?.length || 500) / 300)} min read`,
              image: item.image || DEFAULT_BUSINESS_ARTICLES[idx % DEFAULT_BUSINESS_ARTICLES.length]?.image,
              excerpt: item.description || item.excerpt || (item.content ? item.content.substring(0, 160) + '...' : ''),
              slug: item.slug || `business-${idx + 1}`,
              badge: item.category || 'Business',
            }));
            setArticles(formatted);
            setTotalCount(data.total || list.length);
            setTotalPages(data.totalPages || Math.max(1, Math.ceil((data.total || list.length) / CARDS_PER_PAGE)));
          } else {
            setArticles([]);
            setTotalCount(0);
            setTotalPages(1);
          }
        }
      } catch (err) {
        console.warn('API error in BusinessPage:', err);
        if (isMounted) {
          setArticles([]);
          setTotalCount(0);
          setTotalPages(1);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [filterTag, currentPage, sortBy]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', newPage.toString());
    if (sortBy && sortBy !== 'newest') nextParams.set('sort', sortBy);
    setSearchParams(nextParams);
    window.scrollTo({ top: 350, behavior: 'smooth' });
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

  const isUsingFallback = articles.length === 0 && !filterTag;
  const displayedArticles = articles.length > 0
    ? articles
    : isUsingFallback
    ? DEFAULT_BUSINESS_ARTICLES
    : [];

  const effectiveTotalCount = isUsingFallback ? DEFAULT_BUSINESS_ARTICLES.length : totalCount;
  const effectiveTotalPages = isUsingFallback ? Math.max(1, Math.ceil(effectiveTotalCount / CARDS_PER_PAGE)) : totalPages;

  return (
    <div className="w-full">
        {/* Breadcrumb matching business.html */}
        <section className="bg-[#f5f5ea] py-9 border-b border-[#e8e5dc]">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2 font-medium">
              <Link to="/" className="text-[#ff4c60] hover:underline font-semibold">
                Home
              </Link>
              <span>/</span>
              <span className="text-gray-800 font-semibold">Business</span>
            </nav>
            <h1 className="font-['Prompt',sans-serif] text-3xl sm:text-4xl font-bold text-[#111111] tracking-tight">
              Business News
            </h1>
          </div>
        </section>

        {/* 2-Column Main Section: 8 cols single-column cards, 4 cols widgets */}
        <section className="py-14 sm:py-16 bg-white">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Left Column: 8 cols (Single-column stream of blog-standard-card) */}
              <div className="lg:col-span-8">
                {/* Professional Filter & Sort Toolbar */}
                <div className="mb-8 pb-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-sm text-gray-500 font-medium">
                    Showing <span className="text-gray-900 font-semibold">{effectiveTotalCount > 0 ? (currentPage - 1) * CARDS_PER_PAGE + 1 : 0}</span>–
                    <span className="text-gray-900 font-semibold">{Math.min(currentPage * CARDS_PER_PAGE, effectiveTotalCount)}</span> of{' '}
                    <span className="text-gray-900 font-bold">{effectiveTotalCount}</span> stories
                  </div>

                  <div className="flex items-center gap-2.5 self-start sm:self-auto">
                    <label htmlFor="sortSelectBus" className="text-xs uppercase tracking-wider text-gray-500 font-semibold flex items-center gap-1.5">
                      <i className="bi bi-sort-down text-sm text-[#ff4c60]"></i>
                      Sort by:
                    </label>
                    <select
                      id="sortSelectBus"
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
                ) : displayedArticles.length === 0 ? (
                  <div className="py-16 px-6 text-center bg-[#fafafa] rounded-2xl border border-dashed border-[#e2e8f0]">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-50 text-[#c91f26] rounded-full flex items-center justify-center text-2xl">
                      <i className="bi bi-briefcase"></i>
                    </div>
                    <h3 className="font-['Prompt',sans-serif] text-xl font-bold text-[#111111] mb-2">
                      No Business Articles Found
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto text-sm mb-6 leading-relaxed">
                      {filterTag ? `No business articles currently tagged with #${filterTag}.` : 'No business stories found in this section.'}
                    </p>
                    <Link
                      to="/business"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c91f26] hover:bg-[#a8191f] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition"
                    >
                      <i className="bi bi-arrow-left"></i>
                      <span>View All Business News</span>
                    </Link>
                  </div>
                ) : (
                  <div>
                    {displayedArticles.map((article, idx) => (
                      <article key={idx} className="mb-12 sm:mb-14 group">
                        {/* Full-width Image with hover effect matching business.html */}
                        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[8px] sm:rounded-[10px] bg-gray-100 block mb-6">
                          <Link to={`/post-detail?slug=${article.slug}`} className="block w-full h-full">
                            <img
                              src={article.image}
                              alt={article.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                          </Link>
                          <div className="absolute inset-2 border border-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[6px]"></div>
                        </div>

                        {/* Content */}
                        <div>
                          {/* Meta: Date and Read Time (no author, no views) */}
                          <div className="flex items-center gap-4 text-[13.5px] text-[#777777] font-normal mb-3">
                            <span className="flex items-center gap-1.5">
                              <i className="bi bi-calendar3 text-[12px]"></i>
                              {article.date}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <i className="bi bi-clock text-[13px] text-[#d99374]"></i>
                              {article.readTime}
                            </span>
                          </div>

                          {/* Title */}
                          <h2 className="font-['Prompt',sans-serif] text-[26px] sm:text-[30px] font-bold text-[#111111] leading-[1.3] tracking-tight mb-3.5 group-hover:text-[#ff4c60] transition-colors">
                            <Link to={`/post-detail?slug=${article.slug}`}>
                              {article.title}
                            </Link>
                          </h2>

                          {/* Excerpt */}
                          <p className="text-[15px] sm:text-[16px] text-[#777777] leading-[1.6] mb-3 font-normal">
                            {article.excerpt}
                          </p>

                          {/* Read More Link */}
                          <div>
                            <Link
                              to={`/post-detail?slug=${article.slug}`}
                              className="inline-flex items-center gap-2 font-['Prompt',sans-serif] text-[15px] font-semibold text-[#ff4c60] hover:text-[#e03b4e] transition-colors group/btn"
                            >
                              <span>Read More</span>
                              <i className="bi bi-arrow-right text-[14px] transition-transform duration-300 group-hover/btn:translate-x-1"></i>
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}

                    {/* Server-Side Pagination */}
                    {displayedArticles.length > 0 && effectiveTotalPages > 1 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={effectiveTotalPages}
                        onPageChange={handlePageChange}
                        className="mt-12 !justify-start"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: 4 cols (Business Topics, Popular Tags, Stay Connected) */}
              <div className="lg:col-span-4">
                {/* Widget 1: Business Topics */}
                <div className="border border-[#eeeeee] rounded-[8px] p-6 mb-8 bg-white">
                  <h3 className="font-['Prompt',sans-serif] text-[18px] font-semibold text-[#111111] mb-5 pb-3 border-b-2 border-gray-100 relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-10 after:h-[2px] after:bg-[#ff4c60]">
                    Business Topics
                  </h3>
                  <div>
                    {BUSINESS_TOPICS.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex gap-3 pb-4 mb-4 border-b border-[#eeeeee] last:border-b-0 last:pb-0 last:mb-0 group"
                      >
                        <Link
                          to={`/post-detail?slug=${item.slug}`}
                          className="w-20 h-[70px] rounded-[6px] overflow-hidden flex-shrink-0 bg-gray-100 block"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-['Prompt',sans-serif] text-[14.5px] font-semibold text-[#111111] leading-[1.35] mb-1.5 group-hover:text-[#ff4c60] transition-colors line-clamp-2">
                            <Link to={`/post-detail?slug=${item.slug}`}>{item.title}</Link>
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-[#777777]">
                            <span className="flex items-center gap-1">
                              <i className="bi bi-calendar3 text-[11px]"></i> {item.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <i className="bi bi-chat text-[11px]"></i> {item.comments}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Widget 2: Popular Tags */}
                <div className="border border-[#eeeeee] rounded-[8px] p-6 mb-8 bg-white">
                  <h3 className="font-['Prompt',sans-serif] text-[18px] font-semibold text-[#111111] mb-5 pb-3 border-b-2 border-gray-100 relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-10 after:h-[2px] after:bg-[#ff4c60]">
                    Popular Tags
                  </h3>
                  <div className="flex flex-wrap gap-x-3.5 gap-y-2 text-[14px] text-[#555555]">
                    {POPULAR_TAGS.map((tag, idx) => (
                      <Link
                        key={idx}
                        to={`/business?tag=${tag.toLowerCase()}`}
                        className="hover:text-[#ff4c60] transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Widget 3: Stay Connected */}
                <div className="border border-[#eeeeee] rounded-[8px] p-6 mb-8 bg-white">
                  <h3 className="font-['Prompt',sans-serif] text-[18px] font-semibold text-[#111111] mb-5 pb-3 border-b-2 border-gray-100 relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-10 after:h-[2px] after:bg-[#ff4c60]">
                    Stay Connected
                  </h3>
                  <ul className="space-y-2.5">
                    <li>
                      <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2.5 px-4 py-3 border border-[#eeeeee] rounded-[6px] text-[14px] font-medium text-[#444444] hover:bg-[#ff4c60] hover:text-white hover:border-[#ff4c60] transition-all duration-300"
                      >
                        <i className="bi bi-facebook text-[16px]"></i>
                        <span>3.5K Like</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://x.com"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2.5 px-4 py-3 border border-[#eeeeee] rounded-[6px] text-[14px] font-medium text-[#444444] hover:bg-[#ff4c60] hover:text-white hover:border-[#ff4c60] transition-all duration-300"
                      >
                        <i className="bi bi-twitter-x text-[16px]"></i>
                        <span>60K Follower</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2.5 px-4 py-3 border border-[#eeeeee] rounded-[6px] text-[14px] font-medium text-[#444444] hover:bg-[#ff4c60] hover:text-white hover:border-[#ff4c60] transition-all duration-300"
                      >
                        <i className="bi bi-instagram text-[16px]"></i>
                        <span>75K Follower</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section matching business.html Screenshot 5 */}
        <section className="pb-20 sm:pb-24 bg-white">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#f5f5ea] rounded-[14px] p-8 sm:p-12 lg:p-14">
              <h2 className="font-['Prompt',sans-serif] text-3xl sm:text-[38px] font-bold text-[#111111] mb-3">
                Stay Ahead in Business.
              </h2>
              <p className="flex items-center gap-2 text-[15px] sm:text-[16px] text-[#555555] mb-6">
                <i className="bi bi-envelope-fill text-[#ff4c60]"></i> Get weekly business insights
              </p>
              <Link
                to="/contact"
                className="inline-block bg-[#ff4c60] hover:bg-[#e03b4e] text-white px-8 py-3.5 rounded-[6px] font-['Prompt',sans-serif] font-medium text-[15px] sm:text-base transition-colors shadow-sm"
              >
                Subscribe Now
              </Link>
            </div>
          </div>
        </section>
    </div>
  );
}

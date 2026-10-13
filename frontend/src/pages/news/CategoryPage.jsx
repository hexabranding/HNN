import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import CategorySidebar from '../../components/sidebars/CategorySidebar';
import BusinessPage from './BusinessPage';
import { CATEGORY_PAGES_DATA } from '../../data/categoryData';
import { fetchApi } from '../../services/api';
import Pagination from '../../components/common/Pagination';

const ENTIRE_TOPIC_CATEGORIES = [
  {
    name: 'Africa',
    articles: '75 Article',
    views: '2.8k View',
    image: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=600&q=80',
    path: '/africa',
  },
  {
    name: 'Sports',
    articles: '120 Article',
    views: '4.2k View',
    image: 'https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=600&q=80',
    path: '/sports',
  },
  {
    name: 'Health',
    articles: '95 Article',
    views: '3.8k View',
    image: 'https://images.unsplash.com/photo-1505576399279-0d754c0ce1c8?w=600&q=80',
    path: '/health',
  },
  {
    name: 'Technology',
    articles: '150 Article',
    views: '5.6k View',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
    path: '/technology',
  },
  {
    name: 'Business',
    articles: '88 Article',
    views: '3.1k View',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
    path: '/business',
  },
  {
    name: 'Asia',
    articles: '130 Article',
    views: '4.5k View',
    image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=600&q=80',
    path: '/asia',
  },
  {
    name: 'Europe',
    articles: '110 Article',
    views: '3.9k View',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80',
    path: '/europe',
  },
];

export default function CategoryPage({ category: propCategory, isRegional: propIsRegional }) {
  const params = useParams();
  const categoryKey = (propCategory || params.category || 'sports').toLowerCase();

  if (categoryKey === 'business') {
    return <BusinessPage />;
  }

  const [currentPage, setCurrentPage] = useState(1);
  const [apiArticles, setApiArticles] = useState([]);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const fallbackData = CATEGORY_PAGES_DATA[categoryKey] || CATEGORY_PAGES_DATA['sports'];
  const isRegional = propIsRegional || fallbackData.isRegional;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    async function loadData() {
      try {
        const res = await fetchApi(`/news?category=${encodeURIComponent(categoryKey)}&limit=12`);
        if (res && res.news && res.news.length > 0) {
          setApiArticles(res.news);
        }
      } catch (err) {
        console.warn('API error, using fallback category data:', err);
      }
    }

    loadData();
  }, [categoryKey]);

  // Combine dynamic articles and fallback data
  const displayedArticles =
    apiArticles.length > 0
      ? apiArticles.map((a, i) => ({
          badge: a.category || fallbackData.articles[i % fallbackData.articles.length]?.badge || 'Sports',
          author: a.author || fallbackData.articles[i % fallbackData.articles.length]?.author || 'Staff Writer',
          date: a.date
            ? new Date(a.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })
            : fallbackData.articles[i % fallbackData.articles.length]?.date,
          views: `${a.views || '3.5k'}`,
          readTime: a.readTime || '5 min read',
          title: a.title,
          excerpt: a.description || a.excerpt || fallbackData.articles[i % fallbackData.articles.length]?.excerpt,
          image: a.image || fallbackData.articles[i % fallbackData.articles.length]?.image,
          slug: a.slug || `post-${i + 1}`,
        }))
      : fallbackData.articles;

  const CARDS_PER_PAGE = 10;
  const totalPages = Math.max(1, Math.ceil(displayedArticles.length / CARDS_PER_PAGE));
  const paginatedArticles = displayedArticles.slice(
    (currentPage - 1) * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE
  );

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSuccess(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSuccess(false), 4000);
    }
  };

  return (
    <div className="w-full">
        {/* Breadcrumb Header matching sports.html */}
        <section className="bg-[#f5f5ea] py-9 border-b border-[#e8e5dc]">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2 font-medium">
              <Link to="/" className="text-[#ff4c60] hover:underline font-semibold">
                Home
              </Link>
              <span>/</span>
              {isRegional && (
                <>
                  <span className="text-gray-600">International News</span>
                  <span>/</span>
                </>
              )}
              <span className="text-gray-800 font-semibold">{fallbackData.breadcrumb}</span>
            </nav>
            <h1 className="font-['Prompt',sans-serif] text-3xl sm:text-4xl font-bold text-[#111111] tracking-tight">
              {fallbackData.title}
            </h1>
          </div>
        </section>

        {/* Main 2-Column Content: Left 8 cols, Right 4 cols */}
        <section className="py-14 sm:py-16 bg-white">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Left Column: 8 cols (Blog Grid) */}
              <div className="lg:col-span-8">
                {/* 2-Column News Cards Grid - Auto resized to content length */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {paginatedArticles.map((article, idx) => (
                    <article
                      key={idx}
                      className="border border-[#eeeeee] rounded-[10px] overflow-hidden bg-white hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-300 group h-fit self-start"
                    >
                      {/* Image (height: 250px matching style.css .blog-grid-1 .image) */}
                      <div className="relative h-[250px] w-full overflow-hidden bg-gray-100 block">
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

                      {/* Content Area - Automatically sizes based on content length */}
                      <div className="p-[22px] sm:p-6">
                        {/* Meta Row: Person, Date, Views */}
                        <div className="flex items-center gap-3.5 sm:gap-4 text-[13.5px] text-[#777777] font-normal mb-3">
                          <span className="flex items-center gap-1.5">
                            <i className="bi bi-person text-[15px]"></i>
                            {article.author}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <i className="bi bi-calendar3 text-[12px]"></i>
                            {article.date}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <i className="bi bi-eye text-[14px]"></i>
                            {article.views}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-['Prompt',sans-serif] text-[26px] sm:text-[28px] font-bold text-[#111111] leading-[1.25] tracking-tight mb-3.5 group-hover:text-[#ff4c60] transition-colors">
                          <Link to={`/post-detail?slug=${article.slug}`}>
                            {article.title}
                          </Link>
                        </h3>

                        {/* Excerpt with exact 1.6 line height and reduced space to View Details */}
                        <p className="text-[15px] sm:text-[16px] text-[#777777] leading-[1.6] mb-2.5 font-normal">
                          {article.excerpt}
                        </p>

                        {/* Bottom Row: View Details and Read Time stacked exactly as in Image 1 */}
                        <div>
                          <Link
                            to={`/post-detail?slug=${article.slug}`}
                            className="inline-flex items-center gap-2 font-['Prompt',sans-serif] text-[15px] font-semibold text-[#ff4c60] hover:text-[#e03b4e] transition-colors group/btn"
                          >
                            <span>View Details</span>
                            <i className="bi bi-arrow-right text-[14px] transition-transform duration-300 group-hover/btn:translate-x-1"></i>
                          </Link>
                          <div className="text-[13px] text-[#777777] flex items-center gap-1.5 mt-1.5 font-normal">
                            <i className="bi bi-clock text-xs text-[#d99374]"></i>
                            <span>{article.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Interactive Pagination matching HEXA NEWS standard (10 cards per page) */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(p) => {
                    setCurrentPage(p);
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                  className="mt-12 !justify-start"
                />
              </div>

              {/* Right Column: 4 cols (Sidebar) */}
              <div className="lg:col-span-4">
                <CategorySidebar activeCategory={categoryKey} />
              </div>
            </div>
          </div>
        </section>

        {/* Entire Topic Category Section matching sports.html */}
        <section className="py-20 bg-white border-t border-gray-100">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-['Prompt',sans-serif] text-3xl sm:text-[40px] font-bold text-gray-900 leading-tight">
                Entire Topic{' '}
                <span className="[-webkit-text-stroke:2px_#ff4c60] text-transparent ml-2 inline-block">
                  Category
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ENTIRE_TOPIC_CATEGORIES.slice(0, 4).map((cat, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-all duration-300 group flex flex-col"
                >
                  <Link to={cat.path} className="h-48 overflow-hidden block bg-gray-100">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </Link>
                  <div className="p-5 text-center flex-1 flex flex-col justify-center">
                    <h4 className="font-['Prompt',sans-serif] text-xl font-bold text-gray-900 group-hover:text-[#ff4c60] transition-colors mb-2">
                      <Link to={cat.path}>{cat.name}</Link>
                    </h4>
                    <div className="flex justify-center gap-4 text-xs text-gray-500 font-medium">
                      <span>{cat.articles}</span>
                      <span>{cat.views}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Subscribe to Our Newsletter Section matching sports.html */}
        <section className="bg-[#f5f5ea] py-12 border-y border-[#e8e5dc]">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Left Info */}
              <div className="flex items-center gap-4 text-left">
                <i className="bi bi-envelope-paper text-[#ff4c60] text-4xl flex-shrink-0"></i>
                <div>
                  <h3 className="font-['Prompt',sans-serif] text-xl sm:text-2xl font-bold text-gray-900">
                    Subscribe to Our Newsletter
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Get the latest articles and news delivered straight to your inbox.
                  </p>
                </div>
              </div>

              {/* Right Form */}
              <form onSubmit={handleNewsletterSubmit} className="flex w-full md:w-auto max-w-md">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 bg-white border border-gray-300 rounded-l-md px-5 py-3.5 text-sm text-gray-800 outline-none w-full sm:w-72 focus:border-[#ff4c60]"
                />
                <button
                  type="submit"
                  className="bg-[#ff4c60] hover:bg-[#e03b4e] text-white px-6 py-3.5 rounded-r-md font-semibold text-sm transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer flex-shrink-0"
                >
                  <span>Subscribe</span>
                  <i className="bi bi-send text-xs"></i>
                </button>
              </form>
            </div>
            {newsletterSuccess && (
              <p className="text-xs text-green-700 font-semibold mt-3 text-center md:text-right">
                Thank you for subscribing to HEXA NEWS!
              </p>
            )}
          </div>
        </section>
    </div>
  );
}

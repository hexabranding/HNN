import React, { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import Topbar from '../components/Topbar';
import Header from '../components/Header';
import SearchModal from '../components/SearchModal';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import CategorySidebar from '../components/CategorySidebar';
import { fetchApi } from '../services/api';

export default function PostDetailPage() {
  const { slug: routeSlug } = useParams();
  const [searchParams] = useSearchParams();
  const querySlug = searchParams.get('slug');
  const activeSlug = routeSlug || querySlug || 'the-champions-defining-a-new-era-of-sport';

  const [searchOpen, setSearchOpen] = useState(false);
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback article data matching HTML specifications
  const defaultArticle = {
    title: 'The Champions Defining a New Era of Sport and Athleticism',
    category: 'Sports',
    badge: 'Athletics',
    author: 'Daniel Reed',
    authorImg: 'https://i.pravatar.cc/100?img=12',
    date: 'July 22, 2026',
    views: '5.2k views',
    readTime: '6 min read',
    commentsCount: 2,
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1400&q=80',
    lead: 'From record-breaking performances to the next generation of rising stars, unprecedented tactics and preparation are defining the competitive landscape around the world.',
    paragraphs: [
      'Athletic performance is entering an era defined by scientific data, specialized biomechanics, and relentless psychological preparation. Across global competitions, traditional barriers that stood for decades are being dismantled with striking consistency.',
      'Coaching staffs now rely on high-frequency wearable telemetry and predictive machine learning models to track muscle fatigue in real time, preventing catastrophic injuries before they can manifest.',
      'Yet beyond the algorithms, the human narrative remains the beating heart of athletic achievement. Young competitors are demonstrating fearlessness and mental composure on the grandest stages, unburdened by past expectations.',
    ],
    quote: 'True excellence in sports is no longer about isolated physical prowess—it is an ecosystem of scientific preparation, emotional grit, and fearless imagination.',
    quoteAuthor: 'Coach Marcus Vance, High Performance Director',
    tags: ['Athletics', 'Champions', 'Fitness', 'Sports Science', 'World Records'],
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);

    async function loadArticle() {
      try {
        const data = await fetchApi(`/news/${activeSlug}`);
        if (data && data.title) {
          setArticle(data);
          // Increment view count in backend
          fetchApi(`/news/${activeSlug}/view`, { method: 'PATCH' }).catch(() => {});
          // Load related
          if (data.category) {
            const relRes = await fetchApi(`/news?category=${encodeURIComponent(data.category)}&limit=4`);
            if (relRes && relRes.news) {
              setRelated(relRes.news.filter((a) => a.slug !== activeSlug).slice(0, 2));
            }
          }
        } else {
          setArticle(defaultArticle);
        }
      } catch (e) {
        setArticle(defaultArticle);
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [activeSlug]);

  const current = article || defaultArticle;

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 font-inter antialiased">
      <Topbar />
      <Header onOpenSearch={() => setSearchOpen(true)} />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <main className="flex-1 w-full">
        {/* 1. Post Hero Banner matching post-detail.html */}
        <section
          className="relative min-h-[480px] sm:min-h-[540px] flex items-end bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${current.image})` }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 w-full">
            <span className="inline-block px-4 py-1.5 bg-[#ff4c60] text-white text-xs font-bold uppercase rounded-[3px] tracking-wider mb-4 shadow-sm">
              {current.category || current.badge || 'News'}
            </span>

            <h1 className="font-['Prompt',sans-serif] text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl mb-6 drop-shadow-md">
              {current.title}
            </h1>

            {/* Post Hero Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-white/85">
              <span className="flex items-center gap-2">
                <img
                  src={current.authorImg || 'https://i.pravatar.cc/60?img=12'}
                  alt={current.author || 'Author'}
                  className="w-8 h-8 rounded-full object-cover border-2 border-white/40"
                />
                <span className="font-semibold text-white">{current.author || 'Staff Writer'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <i className="bi bi-calendar3 text-[#ff4c60]"></i>
                {current.date ? new Date(current.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : defaultArticle.date}
              </span>
              <span className="flex items-center gap-1.5">
                <i className="bi bi-eye text-[#ff4c60]"></i>
                {current.views || '4.5k views'}
              </span>
              <span className="flex items-center gap-1.5">
                <i className="bi bi-clock text-[#ff4c60]"></i>
                {current.readTime || '6 min read'}
              </span>
            </div>
          </div>
        </section>

        {/* 2. Main Article Content Area */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Article Column (8 cols) */}
              <div className="lg:col-span-8">
                <article className="max-w-[820px] text-gray-700 leading-relaxed text-base sm:text-lg">
                  {/* Lead paragraph */}
                  <p className="text-xl sm:text-2xl font-normal text-gray-900 leading-relaxed mb-6 font-serif">
                    {current.lead || (current.paragraphs && current.paragraphs[0])}
                  </p>

                  {/* Body paragraphs */}
                  {(current.paragraphs || defaultArticle.paragraphs).map((p, idx) => (
                    <p key={idx} className="text-gray-700 text-base sm:text-[17px] leading-[1.8] mb-6">
                      {p}
                    </p>
                  ))}

                  {/* Blockquote matching post-blockquote in style.css */}
                  <blockquote className="bg-[#f2f2de] border-l-4 border-[#ff4c60] p-7 sm:p-9 rounded-r-lg my-8 relative">
                    <i className="bi bi-quote text-4xl text-[#ff4c60]/40 leading-none block mb-2"></i>
                    <p className="font-['Prompt',sans-serif] text-lg sm:text-xl italic text-gray-900 leading-relaxed mb-3">
                      "{current.quote || defaultArticle.quote}"
                    </p>
                    <cite className="not-italic text-sm font-semibold text-[#ff4c60] block">
                      — {current.quoteAuthor || defaultArticle.quoteAuthor}
                    </cite>
                  </blockquote>

                  <p className="text-gray-700 text-base sm:text-[17px] leading-[1.8] mb-8">
                    As we look ahead to future seasons, the combination of advanced technology and human persistence will continue to rewrite the boundaries of what is possible.
                  </p>

                  {/* Post Tags & Share row matching style.css lines 2106-2150 */}
                  <div className="py-6 border-y border-gray-200 flex flex-wrap items-center justify-between gap-4 my-10">
                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1">
                        Tags:
                      </span>
                      {(current.tags || defaultArticle.tags).map((tag, idx) => (
                        <Link
                          key={idx}
                          to={`/blog-standard?tag=${encodeURIComponent(tag)}`}
                          className="px-3.5 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:bg-[#ff4c60] hover:text-white hover:border-[#ff4c60] transition-colors"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>

                    {/* Share */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-700 mr-2">Share Story:</span>
                      {[
                        { icon: 'bi-facebook', url: '#' },
                        { icon: 'bi-twitter-x', url: '#' },
                        { icon: 'bi-linkedin', url: '#' },
                        { icon: 'bi-whatsapp', url: '#' },
                      ].map((s, idx) => (
                        <a
                          key={idx}
                          href={s.url}
                          className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-[#ff4c60] hover:text-white flex items-center justify-center text-xs transition-colors"
                        >
                          <i className={`bi ${s.icon}`}></i>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Author Bio Box */}
                  <div className="bg-[#fff6ef] border border-[#e8e5dc] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 my-10 shadow-sm">
                    <img
                      src={current.authorImg || 'https://i.pravatar.cc/100?img=12'}
                      alt={current.author || 'Author'}
                      className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md flex-shrink-0"
                    />
                    <div className="text-center sm:text-left">
                      <span className="text-xs font-bold text-[#ff4c60] uppercase tracking-wider block mb-1">
                        Written by
                      </span>
                      <h4 className="font-['Prompt',sans-serif] text-xl font-bold text-gray-900 mb-2">
                        {current.author || 'Daniel Reed'}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">
                        Senior sports journalist and investigative features writer with over a decade of reporting across major international championships.
                      </p>
                      <div className="flex items-center justify-center sm:justify-start gap-3 text-sm text-gray-500">
                        <a href="#" className="hover:text-[#ff4c60]"><i className="bi bi-twitter-x"></i></a>
                        <a href="#" className="hover:text-[#ff4c60]"><i className="bi bi-linkedin"></i></a>
                        <a href="#" className="hover:text-[#ff4c60]"><i className="bi bi-envelope"></i></a>
                      </div>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="font-['Prompt',sans-serif] text-2xl font-bold text-[#101820] mb-8">
                      Comments (2)
                    </h3>

                    {/* Comments list */}
                    <div className="space-y-6 mb-12">
                      {[
                        {
                          name: 'Lisa Wang',
                          img: 'https://i.pravatar.cc/60?img=12',
                          date: 'July 22, 2026',
                          text: 'This is a fantastic article! Really well-written and informative. Thanks for sharing these insights.',
                        },
                        {
                          name: 'Mark Johnson',
                          img: 'https://i.pravatar.cc/60?img=18',
                          date: 'July 21, 2026',
                          text: 'Great read! I appreciate the depth of research and the practical perspectives included. Looking forward to more content like this.',
                        },
                      ].map((c, idx) => (
                        <div key={idx} className="flex gap-4 p-5 rounded-xl bg-gray-50 border border-gray-100">
                          <img
                            src={c.img}
                            alt={c.name}
                            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-['Prompt',sans-serif] font-bold text-gray-900 text-sm">
                                {c.name}
                              </h5>
                              <span className="text-xs text-gray-400">{c.date}</span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed mb-2">
                              {c.text}
                            </p>
                            <button className="text-xs font-semibold text-[#ff4c60] hover:underline flex items-center gap-1 cursor-pointer">
                              <i className="bi bi-reply"></i> Reply
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Leave a reply form */}
                    <div className="bg-[#fff6ef] border border-[#e8e5dc] rounded-2xl p-6 sm:p-8">
                      <h4 className="font-['Prompt',sans-serif] text-xl font-bold text-[#101820] mb-2">
                        Leave a Reply
                      </h4>
                      <p className="text-xs text-gray-500 mb-6">
                        Your email address will not be published. Required fields are marked *
                      </p>
                      <form onSubmit={(e) => { e.preventDefault(); alert('Comment submitted for review!'); }} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <input
                            type="text"
                            required
                            placeholder="Your Name *"
                            className="w-full px-4 py-2.5 bg-white border border-[#e8e5dc] rounded-lg text-sm text-gray-800 outline-none focus:border-[#ff4c60]"
                          />
                          <input
                            type="email"
                            required
                            placeholder="Your Email *"
                            className="w-full px-4 py-2.5 bg-white border border-[#e8e5dc] rounded-lg text-sm text-gray-800 outline-none focus:border-[#ff4c60]"
                          />
                        </div>
                        <textarea
                          required
                          rows={4}
                          placeholder="Write your comment here... *"
                          className="w-full px-4 py-2.5 bg-white border border-[#e8e5dc] rounded-lg text-sm text-gray-800 outline-none focus:border-[#ff4c60] resize-y"
                        ></textarea>
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-[#ff4c60] hover:bg-[#548f6f] text-white font-['Prompt',sans-serif] font-semibold text-sm rounded-full transition-colors cursor-pointer shadow-md"
                        >
                          Post Comment
                        </button>
                      </form>
                    </div>
                  </div>
                </article>
              </div>

              {/* Sidebar Column (4 cols) */}
              <div className="lg:col-span-4">
                <CategorySidebar activeCategory={current.category || 'Sports'} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import CategorySidebar from '../../components/sidebars/CategorySidebar';
import { fetchApi, formatImageUrl } from '../../services/api';

export default function PostDetailPage() {
  const { slug: routeSlug } = useParams();
  const [searchParams] = useSearchParams();
  const querySlug = searchParams.get('slug');
  const activeSlug = routeSlug || querySlug || 'the-champions-defining-a-new-era-of-sport';

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
  const themeColor = current.backgroundColor || '#c91f26';
  const featuredImg = formatImageUrl(current.image || defaultArticle.image);

  return (
    <div className="w-full bg-[#fdfbf7]/30 min-h-screen py-6 sm:py-8">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Main Headline Title Banner on Top */}
        <div
          style={{ backgroundColor: themeColor }}
          className="p-6 sm:p-8 lg:p-10 rounded-2xl text-white shadow-md mb-8 relative overflow-hidden transition-colors"
        >
          <div className="flex items-center gap-2 mb-3.5">
            <span className="inline-block px-3.5 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold uppercase rounded-md tracking-wider border border-white/25 font-['Prompt',sans-serif]">
              {current.category || current.badge || 'News'}
            </span>
          </div>

          <h1 className="font-['Prompt',sans-serif] text-2xl sm:text-3xl lg:text-[38px] xl:text-[42px] font-bold text-white leading-[1.3] drop-shadow-sm">
            {current.title}
          </h1>
        </div>

        {/* 2. Main Article Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Article Column (8 cols) */}
          <div className="lg:col-span-8">
            <article className="max-w-[820px] text-gray-700 leading-relaxed text-base sm:text-lg">
              {/* Post Meta Info (Author, Date, Views, Read Time) */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-600 pb-5 mb-8 border-b border-gray-200">
                <span className="flex items-center gap-2">
                  <img
                    src={current.authorImg || 'https://i.pravatar.cc/60?img=12'}
                    alt={current.author || 'Author'}
                    className="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-sm"
                  />
                  <span className="font-semibold text-gray-900">{current.author || 'Staff Writer'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="bi bi-calendar3" style={{ color: themeColor }}></i>
                  <span>
                    {current.date
                      ? new Date(current.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                      : defaultArticle.date}
                  </span>
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="bi bi-eye" style={{ color: themeColor }}></i>
                  <span>{current.views !== undefined ? `${current.views} views` : '4.5k views'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="bi bi-clock" style={{ color: themeColor }}></i>
                  <span>{current.readTime || '3 min read'}</span>
                </span>
              </div>

              {/* Featured Image - placed in the down section below Heading and Meta */}
              {featuredImg && (
                <div className="w-full max-h-[500px] sm:max-h-[560px] rounded-2xl overflow-hidden shadow-sm bg-gray-100 border border-gray-200/80 mb-8">
                  <img
                    src={featuredImg}
                    alt={current.title}
                    className="w-full h-full max-h-[500px] sm:max-h-[560px] object-cover block"
                  />
                </div>
              )}

                {/* Video Player (if videoUrl is present) */}
                {current.videoUrl && (
                  <div className="mb-8 rounded-2xl overflow-hidden shadow-md aspect-video bg-black">
                    {current.videoUrl.includes('youtube.com') || current.videoUrl.includes('youtu.be') ? (
                      <iframe
                        src={
                          current.videoUrl.includes('watch?v=')
                            ? current.videoUrl.replace('watch?v=', 'embed/').split('&')[0]
                            : current.videoUrl.replace('youtu.be/', 'www.youtube.com/embed/')
                        }
                        title={current.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video src={current.videoUrl} controls className="w-full h-full object-contain" />
                    )}
                  </div>
                )}

                {/* Photo Gallery (if gallery images present) */}
                {current.gallery && current.gallery.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Photo Gallery</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {current.gallery.map((gImg, gIdx) => (
                        <div key={gIdx} className="rounded-xl overflow-hidden aspect-[4/3] bg-gray-100 shadow-sm border border-gray-200">
                          <img
                            src={formatImageUrl(gImg)}
                            alt={`Gallery ${gIdx + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                  {current.content ? (
                    <div
                      className="text-gray-800 text-base sm:text-[17px] leading-[1.8] mb-8 space-y-4 article-html-content [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mt-5 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_blockquote]:border-l-4 [&_blockquote]:border-[#ff4c60] [&_blockquote]:bg-[#f2f2de] [&_blockquote]:p-5 [&_blockquote]:my-6 [&_blockquote]:rounded-r-lg [&_blockquote]:italic [&_a]:text-[#c91f26] [&_a]:underline [&_img]:rounded-lg [&_img]:my-4 [&_img]:max-w-full"
                      dangerouslySetInnerHTML={{ __html: current.content }}
                    />
                  ) : (
                    <>
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
                      <blockquote
                        style={{ borderLeftColor: themeColor }}
                        className="bg-[#f2f2de] border-l-4 p-7 sm:p-9 rounded-r-lg my-8 relative"
                      >
                        <i
                          className="bi bi-quote text-4xl leading-none block mb-2 opacity-40"
                          style={{ color: themeColor }}
                        ></i>
                        <p className="font-['Prompt',sans-serif] text-lg sm:text-xl italic text-gray-900 leading-relaxed mb-3">
                          "{current.quote || defaultArticle.quote}"
                        </p>
                        <cite
                          style={{ color: themeColor }}
                          className="not-italic text-sm font-semibold block"
                        >
                          — {current.quoteAuthor || defaultArticle.quoteAuthor}
                        </cite>
                      </blockquote>
                    </>
                  )}

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
                          className="px-3.5 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors"
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
                          className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-900 hover:text-white flex items-center justify-center text-xs transition-colors"
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
                      <span
                        style={{ color: themeColor }}
                        className="text-xs font-bold uppercase tracking-wider block mb-1"
                      >
                        Written by
                      </span>
                      <h4 className="font-['Prompt',sans-serif] text-xl font-bold text-gray-900 mb-2">
                        {current.author || 'Daniel Reed'}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">
                        Senior journalist and investigative features writer with over a decade of reporting across major international championships and news.
                      </p>
                      <div className="flex items-center justify-center sm:justify-start gap-3 text-sm text-gray-500">
                        <a href="#" className="hover:text-gray-900"><i className="bi bi-twitter-x"></i></a>
                        <a href="#" className="hover:text-gray-900"><i className="bi bi-linkedin"></i></a>
                        <a href="#" className="hover:text-gray-900"><i className="bi bi-envelope"></i></a>
                      </div>
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
    </div>
  );
}

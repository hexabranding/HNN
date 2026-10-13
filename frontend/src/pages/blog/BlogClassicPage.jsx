import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CategorySidebar from '../../components/sidebars/CategorySidebar';

export default function BlogClassicPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const posts = [
    {
      badge: 'Technology',
      title: 'The Rise of Generative AI in Creative Industries',
      author: 'David Miller',
      date: 'July 20, 2026',
      views: '1.2k',
      readTime: '5 min read',
      excerpt: 'From art to music, generative AI is revolutionizing the creative process and pushing boundaries.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80',
      slug: 'the-rise-of-generative-ai-in-creative-industries',
    },
    {
      badge: 'Business',
      title: 'Remote Work Revolution: Companies Embrace Flexible Future',
      author: 'Emma Roberts',
      date: 'July 19, 2026',
      views: '980',
      readTime: '4 min read',
      excerpt: 'The workplace is evolving with major corporations adopting permanent remote work policies.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
      slug: 'remote-work-revolution-companies-embrace-flexible-future',
    },
    {
      badge: 'Lifestyle',
      title: 'Mindful Living: Habits for Daily Balance in Chaos',
      author: 'Sarah Connor',
      date: 'July 18, 2026',
      views: '2.1k',
      readTime: '6 min read',
      excerpt: 'Practical mindfulness habits that fit easily into busy schedules without overwhelming routines.',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80',
      slug: 'mindful-living-habits-for-daily-balance-in-chaos',
    },
    {
      badge: 'Travel',
      title: 'Hidden Paradises: 10 Underrated Travel Destinations',
      author: 'Michael Chang',
      date: 'July 17, 2026',
      views: '3.4k',
      readTime: '5 min read',
      excerpt: 'Escape crowds and discover extraordinary places offering authentic cultural experiences.',
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80',
      slug: 'hidden-paradises-10-underrated-travel-destinations',
    },
    {
      badge: 'Health',
      title: 'The Science of High Quality Sleep and Recovery',
      author: 'Dr. Rachel Green',
      date: 'July 16, 2026',
      views: '1.9k',
      readTime: '5 min read',
      excerpt: 'New research examines sleep stages and actionable habits for long-term health benefits.',
      image: 'https://images.unsplash.com/photo-1511295742362-92c96b1cf484?w=600&q=80',
      slug: 'the-science-of-high-quality-sleep-and-recovery',
    },
    {
      badge: 'Sports',
      title: 'How Young Competitors Are Reshaping Pro Tournaments',
      author: 'Daniel Reed',
      date: 'July 15, 2026',
      views: '2.8k',
      readTime: '4 min read',
      excerpt: 'A new generation brings fearless tactics and fresh rivalries to center stage.',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80',
      slug: 'how-young-competitors-are-reshaping-pro-tournaments',
    },
  ];

  return (
    <div className="w-full">
        {/* Breadcrumb Section matching blog-classic.html */}
        <section className="bg-[#f2f2de] py-7 border-b border-[#e8e5dc]">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2 font-medium">
              <Link to="/" className="text-[#ff4c60] hover:underline font-semibold">Home</Link>
              <span>/</span>
              <span className="text-gray-800 font-semibold">Blog Classic</span>
            </nav>
            <h1 className="font-['Prompt',sans-serif] text-3xl sm:text-4xl font-bold text-[#101820]">
              Blog Classic
            </h1>
          </div>
        </section>

        {/* 2-Column Layout */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Main Content (8 cols) */}
              <div className="lg:col-span-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.map((post, idx) => (
                    <article
                      key={idx}
                      className="rounded-[10px] overflow-hidden border border-[#e8e5dc] bg-white group hover:shadow-md hover:border-[#ff4c60]/40 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                        <Link to={`/post-detail?slug=${post.slug}`}>
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        </Link>
                        <span className="absolute top-3 left-3 px-3 py-1 bg-[#ff4c60] text-white text-[11px] font-bold uppercase rounded-[4px]">
                          {post.badge}
                        </span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                            <span><i className="bi bi-person text-[#ff4c60]"></i> {post.author}</span>
                            <span>•</span>
                            <span><i className="bi bi-calendar3 text-[#ff4c60]"></i> {post.date}</span>
                          </div>
                          <h3 className="font-['Prompt',sans-serif] text-[18px] font-bold text-[#101820] leading-[1.35] mb-2 group-hover:text-[#ff4c60] transition-colors">
                            <Link to={`/post-detail?slug=${post.slug}`}>
                              {post.title}
                            </Link>
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-4">
                            {post.excerpt}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                          <Link
                            to={`/post-detail?slug=${post.slug}`}
                            className="font-semibold text-[#ff4c60] hover:text-[#548f6f] inline-flex items-center gap-1"
                          >
                            <span>View Details</span>
                            <i className="bi bi-arrow-right"></i>
                          </Link>
                          <span className="text-gray-400 font-medium">
                            {post.readTime}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-12 flex justify-center">
                  <nav className="inline-flex items-center gap-1.5 p-1 bg-[#f2f2de] border border-[#e8e5dc] rounded-full">
                    {[1, 2, 3].map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition cursor-pointer ${
                          currentPage === page
                            ? 'bg-[#ff4c60] text-white shadow-sm'
                            : 'text-gray-700 hover:bg-white'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Sidebar (4 cols) */}
              <div className="lg:col-span-4">
                <CategorySidebar activeCategory="Technology" />
              </div>
            </div>
          </div>
        </section>
    </div>
  );
}

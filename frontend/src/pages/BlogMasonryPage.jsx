import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Topbar from '../components/Topbar';
import Header from '../components/Header';
import SearchModal from '../components/SearchModal';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';

export default function BlogMasonryPage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const posts = [
    {
      badge: 'Technology',
      title: 'The Rise of Generative AI: Transforming Creative Industries Forever',
      author: 'David Miller',
      authorImg: 'https://i.pravatar.cc/30?img=5',
      readTime: '8 min read',
      excerpt:
        'From art to music and beyond, generative artificial intelligence is fundamentally reshaping the creative landscape in ways we never imagined possible.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80',
      slug: 'the-rise-of-generative-ai-transforming-creative-industries-forever',
    },
    {
      badge: 'Business',
      title: 'Remote Work Revolution: Companies Embrace Flexible Future',
      author: 'Emma Roberts',
      authorImg: 'https://i.pravatar.cc/30?img=8',
      readTime: '5 min read',
      excerpt:
        'The workplace has evolved permanently with hybrid corporate policies.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
      slug: 'remote-work-revolution-companies-embrace-flexible-future-masonry',
    },
    {
      badge: 'Lifestyle',
      title: 'Mindful Living in a High-Speed Era: Creating Calm from Within',
      author: 'Sarah Connor',
      authorImg: 'https://i.pravatar.cc/30?img=9',
      readTime: '6 min read',
      excerpt:
        'Daily micro-rituals can dramatically improve focus, reduce stress, and restore physical equilibrium without complex lifestyle overhauls.',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80',
      slug: 'mindful-living-in-a-high-speed-era-creating-calm-from-within',
    },
    {
      badge: 'Travel',
      title: 'Hidden Paradises: 10 Underrated Travel Destinations for the Adventurous Soul',
      author: 'Michael Chang',
      authorImg: 'https://i.pravatar.cc/30?img=12',
      readTime: '7 min read',
      excerpt:
        'Leave crowded tourist hotspots behind and discover breathtaking untouched landscapes, authentic local cuisines, and timeless cultural heritage.',
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80',
      slug: 'hidden-paradises-10-underrated-travel-destinations-for-the-adventurous-soul',
    },
    {
      badge: 'Health',
      title: 'The Neuroscience of Quality Sleep and Peak Performance',
      author: 'Dr. Rachel Green',
      authorImg: 'https://i.pravatar.cc/30?img=16',
      readTime: '6 min read',
      excerpt:
        'Understand how circadian rhythms and restorative REM cycles elevate focus, immune defense, and daily endurance.',
      image: 'https://images.unsplash.com/photo-1511295742362-92c96b1cf484?w=600&q=80',
      slug: 'the-neuroscience-of-quality-sleep-and-peak-performance',
    },
    {
      badge: 'Sports',
      title: 'Next-Generation Champions Dismantle Historical World Records',
      author: 'Daniel Reed',
      authorImg: 'https://i.pravatar.cc/30?img=18',
      readTime: '5 min read',
      excerpt:
        'Modern telemetry, nutritional science, and mental resilience converge to push human physical limits further than ever.',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80',
      slug: 'next-generation-champions-dismantle-historical-world-records',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 font-inter antialiased">
      <Topbar />
      <Header onOpenSearch={() => setSearchOpen(true)} />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <main className="flex-1 w-full">
        {/* Breadcrumb Section matching blog-masonry.html */}
        <section className="bg-[#f2f2de] py-7 border-b border-[#e8e5dc]">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2 font-medium">
              <Link to="/" className="text-[#ff4c60] hover:underline font-semibold">
                <i className="bi bi-house mr-1"></i> Home
              </Link>
              <span>/</span>
              <span className="text-gray-800 font-semibold">Masonry Blog</span>
            </nav>
            <h1 className="font-['Prompt',sans-serif] text-3xl sm:text-4xl font-bold text-[#101820]">
              Masonry Layout
            </h1>
          </div>
        </section>

        {/* Masonry Grid Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-14">
              <span className="text-xs font-bold text-[#ff4c60] uppercase tracking-widest mb-1 block">
                Our Blog
              </span>
              <h2 className="font-['Prompt',sans-serif] text-3xl sm:text-4xl font-bold text-[#101820]">
                Curated Stories & Perspectives
              </h2>
            </div>

            {/* Pure CSS Masonry columns */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {posts.map((post, idx) => (
                <article
                  key={idx}
                  className="break-inside-avoid rounded-2xl overflow-hidden border border-[#e8e5dc] bg-white group hover:shadow-lg hover:border-[#ff4c60]/40 transition-all duration-300"
                >
                  <div className="relative overflow-hidden bg-gray-100">
                    <Link to={`/post-detail?slug=${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </Link>
                    <span className="absolute top-3 left-3 px-3 py-1 bg-[#ff4c60] text-white text-[11px] font-bold uppercase rounded-[4px] shadow-sm">
                      {post.badge}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="font-['Prompt',sans-serif] text-xl font-bold text-[#101820] leading-snug mb-3 group-hover:text-[#ff4c60] transition-colors">
                      <Link to={`/post-detail?slug=${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {post.excerpt}
                    </p>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-2 font-medium text-gray-800">
                        <img
                          src={post.authorImg}
                          alt={post.author}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1 font-medium text-gray-400">
                        <i className="bi bi-clock"></i>
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-16 flex justify-center">
              <nav className="inline-flex items-center gap-2 p-1.5 bg-[#f2f2de] border border-[#e8e5dc] rounded-full">
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
        </section>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}

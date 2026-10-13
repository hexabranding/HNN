import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import CategorySidebar from '../../components/sidebars/CategorySidebar';

export default function BlogStandardPage() {
  const [searchParams] = useSearchParams();
  const filterTag = searchParams.get('tag');
  const searchQuery = searchParams.get('q');
  const [currentPage, setCurrentPage] = useState(1);

  const posts = [
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

  return (
    <div className="w-full">
        {/* Breadcrumb Section matching blog-standard.html */}
        <section className="bg-[#f2f2de] py-7 border-b border-[#e8e5dc]">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2 font-medium">
              <Link to="/" className="text-[#ff4c60] hover:underline font-semibold">Home</Link>
              <span>/</span>
              <span className="text-gray-800 font-semibold">Blog Standard</span>
              {filterTag && (
                <>
                  <span>/</span>
                  <span className="text-[#ff4c60]">Tag: #{filterTag}</span>
                </>
              )}
              {searchQuery && (
                <>
                  <span>/</span>
                  <span className="text-[#ff4c60]">Search: "{searchQuery}"</span>
                </>
              )}
            </nav>
            <h1 className="font-['Prompt',sans-serif] text-3xl sm:text-4xl font-bold text-[#101820]">
              Blog Standard
            </h1>
          </div>
        </section>

        {/* Main Content Area */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Blog Standard Cards Column (8 cols) */}
              <div className="lg:col-span-8 space-y-10">
                {posts.map((post, idx) => (
                  <article
                    key={idx}
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
                      <p className="text-[15px] sm:text-[16px] text-[#777777] leading-[1.6] mb-2.5 font-normal">
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

                {/* Pagination */}
                <div className="pt-6 flex justify-center">
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

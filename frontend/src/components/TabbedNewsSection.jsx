import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { STATIC_TABS_DATA } from '../data/staticHomeData';
import { formatImageUrl } from '../services/api';

export default function TabbedNewsSection({ allArticles = [] }) {
  const [activeTab, setActiveTab] = useState('newest');

  const tabs = [
    { id: 'newest', label: 'Newest' },
    { id: 'trending', label: 'Trending' },
    { id: 'topView', label: 'Top View' },
    { id: 'topLike', label: 'Top Like' },
    { id: 'recent', label: 'Recent' },
  ];

  const getFilteredArticles = () => {
    if (allArticles && allArticles.length >= 6) {
      const copy = [...allArticles];
      switch (activeTab) {
        case 'newest':
          return copy.slice(0, 6);
        case 'trending':
          return copy.sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 6);
        case 'topView':
          return copy.sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 6);
        case 'topLike':
          return copy.sort((a, b) => (b.comments || 0) - (a.comments || 0)).slice(0, 6);
        case 'recent':
          return copy.slice(0, 6);
        default:
          return copy.slice(0, 6);
      }
    }
    // Static fallback matching index.html
    return STATIC_TABS_DATA[activeTab] || STATIC_TABS_DATA.newest;
  };

  const displayedArticles = getFilteredArticles();

  return (
    <section className="w-full pt-[50px] px-[5%] pb-0 bg-white">
      <div className="w-full max-w-[1440px] mx-auto">
        {/* Tab Nav matching .nav-tabs.nav-style-1 */}
        <ul className="flex flex-wrap justify-center items-center border-b-2 border-[#eee] mb-[40px] list-none p-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <li key={tab.id} className="relative">
                <button
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`font-['Prompt',sans-serif] text-[18px] font-semibold text-black px-[25px] py-[12px] bg-transparent border-b-[3px] -mb-[2px] transition-all duration-300 cursor-pointer block hover:border-b-[#ff4c60] ${
                    isActive ? 'border-b-[#ff4c60]' : 'border-b-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Tab Content Slider matching .banner-1-slider */}
        <div className="relative">
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              992: { slidesPerView: 3 },
            }}
            className="pb-4"
          >
            {displayedArticles.map((article, idx) => (
              <SwiperSlide key={article._id || article.slug || idx} className="h-auto">
                {/* .blog-grid-3 card */}
                <div className="relative bg-white border border-[#eee] rounded-[12px] overflow-hidden transition-all duration-400 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] group flex flex-col h-full text-left">
                  {/* Category Badge matching .eg-badge.badge--red */}
                  <span className="absolute top-[15px] left-[15px] z-10 bg-[#ff4c60] text-white text-[12px] font-semibold px-[14px] py-[5px] rounded-[3px] font-['Inter',sans-serif] pointer-events-none">
                    {article.category || 'News'}
                  </span>

                  {/* Image matching .blog-grid-3 .image */}
                  <a
                    href={`/post-detail?slug=${article.slug || ''}`}
                    className="block w-full h-[280px] overflow-hidden bg-gray-100"
                  >
                    <img
                      src={formatImageUrl(article.image)}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
                      loading="lazy"
                    />
                  </a>

                  {/* Content matching .blog-grid-3 .content */}
                  <div className="p-[20px] flex-1 flex flex-col justify-between">
                    <div>
                      {/* Author & Views */}
                      <ul className="flex items-center gap-[15px] text-[13px] text-[#101010]/50 mb-[12px] p-0 list-none">
                        <li>
                          <a
                            href="/author"
                            className="flex items-center gap-[6px] text-inherit hover:text-[#ff4c60] transition-colors"
                          >
                            <img
                              src={
                                article.authorImg ||
                                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&q=80'
                              }
                              alt={article.author || 'Author'}
                              className="w-[28px] h-[28px] rounded-full object-cover"
                            />
                            <span className="text-[#101010]/70 font-normal">
                              {article.author || 'Rison donec'}
                            </span>
                          </a>
                        </li>
                        <li className="text-[#101010]/50">{article.views || '1.5k View'}</li>
                      </ul>

                      {/* Heading Title matching h4 */}
                      <h4 className="font-['Prompt',sans-serif] text-[24px] font-semibold text-[#101010] leading-[1.4] mb-[15px] line-clamp-2">
                        <a
                          href={`/post-detail?slug=${article.slug || ''}`}
                          className="hover:text-[#ff4c60] transition-colors"
                        >
                          {article.title}
                        </a>
                      </h4>
                    </div>

                    {/* Bottom Area matching .bottom-area & .arrow-btn */}
                    <div className="flex items-center justify-between">
                      <a
                        href={`/post-detail?slug=${article.slug || ''}`}
                        className="text-[#ff4c60] text-[14px] font-semibold inline-flex items-center gap-[6px] hover:tracking-[0.5px] transition-all"
                      >
                        <span>View Details</span>
                        <i className="bi bi-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

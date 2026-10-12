import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
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
    if (allArticles && allArticles.length >= 3) {
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
    <section className="py-12 bg-white">
      {/* Section Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 pb-4 mb-8 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#c91f26]">
            Curated Feed
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-prompt">
            Featured Headlines
          </h2>
        </div>

        {/* Tab switcher buttons */}
        <div className="flex flex-wrap gap-1 sm:gap-2 bg-gray-100 p-1.5 rounded-xl self-start md:self-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${
                activeTab === tab.id
                  ? 'bg-[#c91f26] text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Carousel */}
      <div className="relative group">
        <Swiper
          modules={[Navigation]}
          spaceBetween={24}
          slidesPerView={1}
          navigation={{
            nextEl: `.tab-next-${activeTab}`,
            prevEl: `.tab-prev-${activeTab}`,
          }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-4"
        >
          {displayedArticles.map((article, idx) => (
            <SwiperSlide key={article._id || article.slug || idx}>
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group/card transform hover:-translate-y-1">
                {/* Thumbnail */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <span className="absolute top-3 left-3 z-10 px-3 py-1 bg-[#c91f26] text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm">
                    {article.category || 'News'}
                  </span>
                  <a href={`/post-detail.html?slug=${article.slug}`} className="block w-full h-full">
                    <img
                      src={formatImageUrl(article.image)}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                      loading="lazy"
                    />
                  </a>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Author & Views */}
                    <div className="flex items-center gap-2.5 text-xs text-gray-500 mb-3">
                      {article.authorImg && (
                        <img
                          src={article.authorImg}
                          alt={article.author || 'Author'}
                          className="w-6 h-6 rounded-full object-cover ring-2 ring-gray-100"
                        />
                      )}
                      <span className="font-semibold text-gray-700">
                        {article.author || 'Rison donec'}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span>{article.views || '1.5k View'}</span>
                    </div>

                    {/* Headline Title */}
                    <h3 className="text-base font-bold font-prompt text-gray-900 group-hover/card:text-[#c91f26] transition-colors line-clamp-2 leading-snug">
                      <a href={`/post-detail.html?slug=${article.slug}`}>{article.title}</a>
                    </h3>
                  </div>

                  {/* Read More Link */}
                  <div className="pt-4 mt-4 border-t border-gray-50 flex items-center justify-between">
                    <a
                      href={`/post-detail.html?slug=${article.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#c91f26] hover:text-[#a8191f] transition"
                    >
                      <span>Read Story</span>
                      <i className="bi bi-arrow-right text-[10px]"></i>
                    </a>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Carousel Arrow Controls */}
        <button
          className={`tab-prev-${activeTab} absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 text-gray-700 hover:bg-[#c91f26] hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100`}
          aria-label="Previous articles"
        >
          <i className="bi bi-chevron-left text-sm"></i>
        </button>
        <button
          className={`tab-next-${activeTab} absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 text-gray-700 hover:bg-[#c91f26] hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100`}
          aria-label="Next articles"
        >
          <i className="bi bi-chevron-right text-sm"></i>
        </button>
      </div>
    </section>
  );
}

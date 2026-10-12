import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { STATIC_RECENT_POSTS } from '../data/staticHomeData';
import { formatImageUrl } from '../services/api';

export default function RecentPostSlider({ articles = [] }) {
  const displayArticles = (articles && articles.length >= 4)
    ? articles
    : STATIC_RECENT_POSTS;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 mb-10 border-b border-gray-100">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 font-prompt">
              Featured <span className="text-[#c91f26]">Post</span>
            </h2>
            <div className="w-12 h-1 bg-[#c91f26] mt-2 rounded-full"></div>
          </div>

          <div className="flex gap-2">
            <button
              className="recent-prev w-10 h-10 rounded-full bg-white border border-gray-200 hover:border-[#c91f26] hover:bg-[#c91f26] hover:text-white flex items-center justify-center text-gray-700 transition shadow-sm"
              aria-label="Previous featured post"
            >
              <i className="bi bi-chevron-left text-sm"></i>
            </button>
            <button
              className="recent-next w-10 h-10 rounded-full bg-white border border-gray-200 hover:border-[#c91f26] hover:bg-[#c91f26] hover:text-white flex items-center justify-center text-gray-700 transition shadow-sm"
              aria-label="Next featured post"
            >
              <i className="bi bi-chevron-right text-sm"></i>
            </button>
          </div>
        </div>

        {/* 4-Item Carousel */}
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={24}
          slidesPerView={1}
          loop={displayArticles.length > 3}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
          navigation={{
            nextEl: '.recent-next',
            prevEl: '.recent-prev',
          }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {displayArticles.map((item, idx) => (
            <SwiperSlide key={item._id || item.slug || idx}>
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4] group bg-gray-950 shadow-md">
                <img
                  src={formatImageUrl(item.image)}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1.5">
                    {item.category}
                  </span>
                  <h4 className="text-sm sm:text-base font-bold font-prompt leading-snug group-hover:text-red-300 transition-colors line-clamp-3 mb-3">
                    <a href={`/post-detail.html?slug=${item.slug}`}>{item.title}</a>
                  </h4>
                  <div className="flex items-center text-xs text-gray-300 gap-3 pt-2 border-t border-white/20 font-medium">
                    <span className="flex items-center gap-1">
                      <i className="bi bi-calendar3 text-[10px] text-red-400"></i>
                      {item.date || '12 Dec, 2026'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <i className="bi bi-chat text-[10px]"></i>
                      {item.comments || '13 Comment'}
                    </span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

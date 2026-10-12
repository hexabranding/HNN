import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { STATIC_HERO_SLIDES } from '../data/staticHomeData';
import { formatImageUrl } from '../services/api';

export default function HeroSlider({ articles = [] }) {
  const displayArticles = (articles && articles.length > 0)
    ? articles
    : STATIC_HERO_SLIDES;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-gray-950 group">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        speed={1000}
        loop={displayArticles.length > 1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: '.hero-next-btn',
          prevEl: '.hero-prev-btn',
        }}
        pagination={{
          el: '.hero-pagination-dots',
          clickable: true,
        }}
        className="w-full h-[500px] sm:h-[560px] lg:h-[620px]"
      >
        {displayArticles.map((item, idx) => {
          const bgImage = formatImageUrl(item.image);
          return (
            <SwiperSlide key={item._id || item.slug || idx} className="relative w-full h-full">
              {/* Background image container */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-100 group-hover:scale-105"
                style={{ backgroundImage: `url('${bgImage}')` }}
              />

              {/* Exact hero overlay matching original design (gradient from left to right) */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/25 pointer-events-none" />

              {/* Centered Vertically Slide Content matching style.css */}
              <div className="relative z-10 h-full max-w-4xl px-8 sm:px-14 lg:px-20 flex flex-col justify-center">
                <span className="inline-block self-start px-3.5 py-1 bg-[#c91f26] text-white text-[11px] font-bold uppercase tracking-wider rounded mb-4 shadow-sm">
                  {item.badge || (item.featured ? 'Featured' : item.category || 'Breaking News')}
                </span>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white font-prompt leading-[1.15] mb-4 drop-shadow-md">
                  <a
                    href={`/post-detail.html?slug=${item.slug}`}
                    className="hover:text-red-400 transition-colors"
                  >
                    {item.title}
                  </a>
                </h1>

                {item.excerpt && (
                  <p className="text-gray-200 text-sm sm:text-base font-normal max-w-2xl line-clamp-2 mb-6 leading-relaxed">
                    {item.excerpt}
                  </p>
                )}

                {/* Metadata & Read Article Button */}
                <div className="flex flex-wrap items-center gap-6 text-xs text-gray-300 font-medium">
                  <span className="flex items-center gap-1.5">
                    <i className="bi bi-person text-[#c91f26] text-sm"></i>
                    {item.author || 'Staff Reporter'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <i className="bi bi-clock text-[#c91f26] text-sm"></i>
                    {item.readTime || '5 min read'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <i className="bi bi-eye text-[#c91f26] text-sm"></i>
                    {item.views || '12.5K Views'}
                  </span>

                  <a
                    href={`/post-detail.html?slug=${item.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#c91f26] hover:bg-[#a8191f] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition shadow-lg shadow-red-900/30 transform hover:-translate-y-0.5"
                  >
                    <span>Read Article</span>
                    <i className="bi bi-arrow-right"></i>
                  </a>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Navigation Arrows */}
      <button
        className="hero-prev-btn absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/15 hover:bg-[#c91f26] text-white border border-white/20 flex items-center justify-center transition backdrop-blur-md"
        aria-label="Previous slide"
      >
        <i className="bi bi-chevron-left text-base"></i>
      </button>

      <button
        className="hero-next-btn absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/15 hover:bg-[#c91f26] text-white border border-white/20 flex items-center justify-center transition backdrop-blur-md"
        aria-label="Next slide"
      >
        <i className="bi bi-chevron-right text-base"></i>
      </button>

      {/* Pagination Dots */}
      <div className="hero-pagination-dots absolute bottom-6 right-8 z-20 flex gap-2 justify-end" />
    </div>
  );
}

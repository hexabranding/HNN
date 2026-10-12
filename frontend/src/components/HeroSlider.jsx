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
    <section className="w-full relative overflow-hidden bg-black group">
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
        className="w-full h-[70vh] min-h-[500px] max-h-[700px]"
      >
        {displayArticles.map((item, idx) => {
          const bgImage = formatImageUrl(item.image);
          return (
            <SwiperSlide key={item._id || item.slug || idx} className="relative w-full h-full">
              {/* Full cover background image */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('${bgImage}')` }}
              />

              {/* Exact horizontal gradient overlay from style.css */}
              <div
                className="absolute inset-0 z-[1] pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 100%)',
                }}
              />

              {/* Slide Content: exactly like original HTML (only the title is visible) */}
              <div className="relative z-[2] h-full flex items-center px-[8%] max-w-[750px]">
                <h1 className="text-3xl sm:text-5xl lg:text-[48px] font-bold text-white font-prompt leading-[1.2] drop-shadow-sm">
                  <a
                    href={`/post-detail?slug=${item.slug}`}
                    className="hover:text-red-400 transition-colors"
                  >
                    {item.title}
                  </a>
                </h1>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Navigation Arrows: 50px circles with 20px offset */}
      <button
        className="hero-prev-btn absolute left-5 top-1/2 -translate-y-1/2 z-10 w-[50px] h-[50px] rounded-full bg-white/15 hover:bg-[#c91f26] hover:border-[#c91f26] border border-white/20 text-white flex items-center justify-center transition-all duration-300 backdrop-blur-[4px] cursor-pointer"
        aria-label="Previous slide"
      >
        <i className="bi bi-arrow-left text-lg"></i>
      </button>

      <button
        className="hero-next-btn absolute right-5 top-1/2 -translate-y-1/2 z-10 w-[50px] h-[50px] rounded-full bg-white/15 hover:bg-[#c91f26] hover:border-[#c91f26] border border-white/20 text-white flex items-center justify-center transition-all duration-300 backdrop-blur-[4px] cursor-pointer"
        aria-label="Next slide"
      >
        <i className="bi bi-arrow-right text-lg"></i>
      </button>

      {/* Pagination Dots */}
      <div className="hero-pagination-dots absolute bottom-[30px] left-0 right-0 z-10 flex gap-2 justify-center" />
    </section>
  );
}

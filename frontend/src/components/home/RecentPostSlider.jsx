import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { STATIC_RECENT_POSTS } from '../../data/staticHomeData';
import { formatImageUrl } from '../../services/api';

export default function RecentPostSlider({ articles = [] }) {
  const displayArticles =
    articles && articles.length >= 4 ? articles : STATIC_RECENT_POSTS;

  return (
    <section className="recent-post-section pt-[120px] pb-0 bg-white w-full">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title matching .section-title-1.mb-50.text-center */}
        <div className="mb-[50px] text-center">
          <h2 className="font-['Prompt',sans-serif] text-[32px] sm:text-[40px] font-bold text-[#101010] leading-[1.2] inline-flex items-baseline flex-wrap justify-center">
            <span>Featured</span>
            <span
              className="ml-[8px] font-['Prompt',sans-serif] text-[32px] sm:text-[40px] font-bold"
              style={{
                WebkitTextStroke: '2px #ff4c60',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Post
            </span>
          </h2>
        </div>

        {/* Swiper Slider matching .recent-1-slider & .blog-image-1 */}
        <div className="relative">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={25}
            slidesPerView={1}
            loop={true}
            speed={800}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              0: { slidesPerView: 1 },
              576: { slidesPerView: 2 },
              992: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
            className="w-full pb-2"
          >
            {displayArticles.map((item, idx) => (
              <SwiperSlide key={item._id || item.slug || idx} className="h-auto">
                <div className="blog-image-1 w-full">
                  <div className="relative rounded-[10px] overflow-hidden h-[350px] group bg-black">
                    {/* Background Image */}
                    <img
                      src={formatImageUrl(item.image)}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-550 group-hover:scale-[1.08]"
                      loading="lazy"
                    />

                    {/* Gradient Overlay & Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-[25px] bg-gradient-to-t from-black/85 via-black/50 to-transparent">
                      {/* Subtitle / Category Badge */}
                      <span className="inline-block px-[12px] py-[4px] bg-[#ff4c60] text-white text-[12px] font-semibold rounded-[3px] font-['Inter',sans-serif] mb-[10px]">
                        {item.category || 'News'}
                      </span>

                      {/* Title */}
                      <h4 className="font-['Prompt',sans-serif] text-[24px] font-semibold text-white leading-[1.4] mb-[10px] group-hover:text-[#ff4c60] transition-colors line-clamp-2">
                        <a href={`/post-detail?slug=${item.slug}`}>{item.title}</a>
                      </h4>

                      {/* Metadata */}
                      <ul className="flex items-center gap-[25px] text-[13px] text-white/70 list-none p-0 m-0">
                        <li className="ml-auto flex items-center gap-[8px]">
                          <i className="bi bi-calendar3 text-[12px]"></i>
                          <span>{item.date || '12 December, 2026'}</span>
                        </li>
                        <li className="flex items-center gap-[8px]">
                          <i className="bi bi-chat text-[12px]"></i>
                          <span>{item.comments || '13 Comment'}</span>
                        </li>
                      </ul>
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

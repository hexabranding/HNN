import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { STATIC_MULTI_LIST } from '../data/staticHomeData';
import { formatImageUrl } from '../services/api';

export default function MultiListSection({ articles = [] }) {
  // If API has enough articles (at least 15), hydrate into the 3 groups; otherwise use exact static data
  const groups =
    articles && articles.length >= 15
      ? STATIC_MULTI_LIST.map((staticGroup, gIdx) => {
          const startIdx = gIdx * 5;
          const endIdx = startIdx + 5;
          const apiSlice = articles.slice(startIdx, endIdx);
          return {
            groupTitle: staticGroup.groupTitle,
            groupSubtitle: staticGroup.groupSubtitle,
            items: apiSlice.map((item) => {
              const d = item.date ? new Date(item.date) : new Date();
              const day = isNaN(d.getTime()) ? '12' : d.getDate().toString().padStart(2, '0');
              const mon = isNaN(d.getTime()) ? 'Jul' : d.toLocaleString('en', { month: 'short' });
              return {
                day,
                mon,
                author: item.author || 'Staff Reporter',
                category: item.category || 'News',
                title: item.title,
                readTime: item.readTime || '5 Min Read',
                image: formatImageUrl(item.image),
                slug: item.slug,
              };
            }),
          };
        })
      : STATIC_MULTI_LIST;

  return (
    <div className="relative w-full">
      {/* Swiper Arrow Controls (top-right corner) */}
      <div className="absolute top-0 right-0 z-20 flex items-center gap-2.5">
        <button
          type="button"
          className="blog-multi-prev w-[40px] h-[40px] rounded-full border border-[#eee] bg-white flex items-center justify-center text-[#101010]/50 hover:bg-[#ff4c60] hover:border-[#ff4c60] hover:text-white transition-all cursor-pointer shadow-sm"
          aria-label="Previous slide"
        >
          <i className="bi bi-arrow-left text-base leading-none"></i>
        </button>
        <button
          type="button"
          className="blog-multi-next w-[40px] h-[40px] rounded-full border border-[#eee] bg-white flex items-center justify-center text-[#101010]/50 hover:bg-[#ff4c60] hover:border-[#ff4c60] hover:text-white transition-all cursor-pointer shadow-sm"
          aria-label="Next slide"
        >
          <i className="bi bi-arrow-right text-base leading-none"></i>
        </button>
      </div>

      {/* Swiper Slider sliding horizontally left/right */}
      <Swiper
        modules={[Navigation, Autoplay]}
        slidesPerView={1}
        loop={true}
        speed={800}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: '.blog-multi-next',
          prevEl: '.blog-multi-prev',
        }}
        className="w-full"
      >
        {groups.map((group, gIdx) => (
          <SwiperSlide key={gIdx} className="w-full">
            {/* Section Title matching .section-title-1 */}
            <div className="mb-[40px] pr-[100px]">
              <h2 className="font-['Prompt',sans-serif] text-[32px] sm:text-[40px] font-bold text-[#101010] leading-[1.2] flex items-baseline flex-wrap">
                <span>{group.groupTitle}</span>
                <span
                  className="ml-[8px] font-['Prompt',sans-serif] text-[32px] sm:text-[40px] font-bold"
                  style={{
                    WebkitTextStroke: '2px #ff4c60',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {group.groupSubtitle}
                </span>
              </h2>
            </div>

            {/* 5 Blog Items matching .blog-list-2 */}
            <div className="w-full">
              {group.items.map((item, idx) => (
                <div
                  key={item.slug || idx}
                  className="flex gap-[20px] items-start pb-[25px] mb-[25px] border-b border-[#eee] last:border-b-0 last:mb-0 last:pb-0 group"
                >
                  {/* Date Column */}
                  <div className="text-center min-w-[70px] flex-shrink-0 pt-0.5">
                    <h3 className="font-['Prompt',sans-serif] text-[32px] font-bold text-[#ff4c60] leading-none">
                      {item.day}
                    </h3>
                    <p className="text-[14px] text-[#101010]/50 mt-[4px] leading-tight">
                      {item.mon}
                    </p>
                  </div>

                  {/* Content Column */}
                  <div className="flex-1 min-w-0">
                    <ul className="flex items-center gap-[15px] text-[13px] text-[#101010]/50 mb-[8px] list-none p-0">
                      <li className="flex items-center gap-[5px]">
                        <i className="bi bi-person text-sm"></i>
                        <span>{item.author}</span>
                      </li>
                      <li>
                        <span className="text-[#548f6f] font-medium">{item.category}</span>
                      </li>
                    </ul>

                    <h4 className="font-['Prompt',sans-serif] text-[20px] sm:text-[22px] font-semibold text-[#101010] leading-[1.4] mb-[10px] group-hover:text-[#ff4c60] transition-colors">
                      <a href={`/post-detail.html?slug=${item.slug}`}>{item.title}</a>
                    </h4>

                    <div className="flex items-center gap-[20px]">
                      <a
                        href={`/post-detail.html?slug=${item.slug}`}
                        className="text-[#ff4c60] text-[14px] font-semibold inline-flex items-center gap-[6px] hover:tracking-[0.5px] transition-all"
                      >
                        <span>View Details</span>
                        <i className="bi bi-arrow-right"></i>
                      </a>
                      <span className="text-[13px] text-[#101010]/50 flex items-center gap-[5px]">
                        <i className="bi bi-clock text-[#d99374]"></i>
                        <span>{item.readTime}</span>
                      </span>
                    </div>
                  </div>

                  {/* Image Thumbnail Column */}
                  <a
                    href={`/post-detail.html?slug=${item.slug}`}
                    className="flex-shrink-0 w-[110px] h-[90px] rounded-[8px] overflow-hidden block bg-gray-100"
                  >
                    <img
                      src={formatImageUrl(item.image)}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </a>
                </div>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

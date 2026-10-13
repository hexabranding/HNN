import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { STATIC_CATEGORIES } from '../../data/staticHomeData';

export default function CategorySlider({ categories = [] }) {
  // Use static categories or hydrated data
  const displayCategories =
    categories && categories.length >= 4
      ? categories.map((cat, idx) => ({
          name: cat.label || cat.name || cat.slug,
          count: cat.count ? `${cat.count} Articles` : '0 Articles',
          views: cat.views ? `${cat.views} View` : '0 View',
          image: cat.image || STATIC_CATEGORIES[idx % STATIC_CATEGORIES.length].image,
          slug: cat.slug || cat.label?.toLowerCase() || 'news',
        }))
      : STATIC_CATEGORIES;

  return (
    <section className="category-section pt-[100px] bg-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title matching .section-title-1.mb-50.text-center */}
        <div className="mb-[50px] text-center">
          <h2 className="font-['Prompt',sans-serif] text-[32px] sm:text-[40px] font-bold text-[#101010] leading-[1.2] inline-flex items-baseline flex-wrap justify-center">
            <span>Entire Topic</span>
            <span
              className="ml-[8px] font-['Prompt',sans-serif] text-[32px] sm:text-[40px] font-bold"
              style={{
                WebkitTextStroke: '2px #ff4c60',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Category
            </span>
          </h2>
        </div>

        {/* Swiper Slider matching .category-1-slider */}
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
            {displayCategories.map((cat, idx) => (
              <SwiperSlide key={idx} className="h-auto">
                <div className="category-1 border border-[#eee] rounded-[10px] overflow-hidden bg-white transition-all duration-400 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] group flex flex-col h-full text-center">
                  {/* Category Image */}
                  <Link
                    to={`/${cat.slug}`}
                    className="block w-full h-[200px] overflow-hidden bg-gray-100"
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-550 group-hover:scale-[1.08]"
                      loading="lazy"
                    />
                  </Link>

                  {/* Category Content */}
                  <div className="p-[18px] text-center flex-1 flex flex-col justify-between">
                    <h4 className="font-['Prompt',sans-serif] text-[22px] font-semibold text-[#101010] mb-[8px] group-hover:text-[#ff4c60] transition-colors leading-[1.4]">
                      <Link to={`/${cat.slug}`}>{cat.name}</Link>
                    </h4>

                    <ul className="flex items-center justify-center gap-[20px] text-[13px] text-[#101010]/50 list-none p-0 m-0">
                      <li>{cat.count}</li>
                      <li>{cat.views}</li>
                    </ul>
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

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { STATIC_CATEGORIES } from '../data/staticHomeData';

export default function CategorySlider({ categories = [] }) {
  const displayCategories = (categories && categories.length > 0)
    ? categories.map((cat, idx) => ({
        name: cat.label || cat.name || cat.slug,
        count: `${cat.count || 24} Article`,
        views: `${cat.views || '3.5k'} View`,
        image: cat.image || STATIC_CATEGORIES[idx % STATIC_CATEGORIES.length].image,
        slug: cat.slug || cat.label?.toLowerCase() || 'news',
      }))
    : STATIC_CATEGORIES;

  return (
    <section className="py-16 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 font-prompt">
            Entire Topic <span className="text-[#c91f26]">Category</span>
          </h2>
          <div className="w-16 h-1 bg-[#c91f26] mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Carousel Slider */}
        <div className="relative group">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1.2}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            navigation={{
              nextEl: '.category-next-btn',
              prevEl: '.category-prev-btn',
            }}
            breakpoints={{
              480: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
            }}
            className="pb-4"
          >
            {displayCategories.map((cat, idx) => (
              <SwiperSlide key={idx}>
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group/card flex flex-col h-full">
                  {/* Category Image */}
                  <a
                    href={`/${cat.slug}.html`}
                    className="block relative aspect-[4/3] overflow-hidden bg-gray-100"
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                  </a>

                  {/* Content */}
                  <div className="p-4 text-center flex-1 flex flex-col justify-between">
                    <h4 className="text-base font-bold font-prompt text-gray-900 group-hover/card:text-[#c91f26] transition-colors mb-2">
                      <a href={`/${cat.slug}.html`}>{cat.name}</a>
                    </h4>

                    <div className="flex items-center justify-center gap-3 text-xs text-gray-500 font-medium pt-2 border-t border-gray-50">
                      <span>{cat.count}</span>
                      <span className="text-gray-300">•</span>
                      <span>{cat.views}</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Arrows */}
          <button
            className="category-prev-btn absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 text-gray-700 hover:bg-[#c91f26] hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Previous categories"
          >
            <i className="bi bi-chevron-left text-sm"></i>
          </button>
          <button
            className="category-next-btn absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 text-gray-700 hover:bg-[#c91f26] hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Next categories"
          >
            <i className="bi bi-chevron-right text-sm"></i>
          </button>
        </div>
      </div>
    </section>
  );
}

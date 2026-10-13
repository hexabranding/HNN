import React from 'react';
import { STATIC_LATEST_ARTICLES } from '../../data/staticHomeData';
import { formatImageUrl } from '../../services/api';

export default function LatestArticlesGrid({ articles = [] }) {
  const displayArticles =
    articles && articles.length >= 3 ? articles.slice(0, 3) : STATIC_LATEST_ARTICLES;

  return (
    <section className="latest-blog-section pt-[100px] pb-[100px] bg-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title matching .section-title-1.mb-50.text-center */}
        <div className="mb-[50px] text-center">
          <h2 className="font-['Prompt',sans-serif] text-[32px] sm:text-[40px] font-bold text-[#101010] leading-[1.2] inline-flex items-baseline flex-wrap justify-center">
            <span>Latest</span>
            <span
              className="ml-[8px] font-['Prompt',sans-serif] text-[32px] sm:text-[40px] font-bold"
              style={{
                WebkitTextStroke: '2px #ff4c60',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Article
            </span>
          </h2>
          <div className="mt-3">
            <a
              href="/blog-classic"
              className="font-['Prompt',sans-serif] text-[18px] font-medium text-[#ff4c60] inline-flex items-center hover:tracking-[0.5px] transition-all group"
            >
              <span>View Article</span>
              <i className="bi bi-arrow-right w-[28px] h-[28px] leading-[26px] rounded-full border border-[#ff4c60]/30 inline-flex items-center justify-center ml-[10px] text-[16px] -rotate-45 transition-transform group-hover:scale-110"></i>
            </a>
          </div>
        </div>

        {/* 3-Column Grid matching .row & .blog-grid-1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
          {displayArticles.map((item, idx) => {
            const isRedBadge = idx === 1;
            const badgeClasses = isRedBadge
              ? 'bg-[#ff4c60] text-white'
              : 'bg-white text-[#101010] shadow-[0_2px_10px_rgba(0,0,0,0.1)]';
            const imgUrl = formatImageUrl(item.image);

            return (
              <div
                key={item._id || item.slug || idx}
                className="blog-grid-1 border border-[#eee] rounded-[10px] overflow-hidden bg-white mb-[30px] transition-all duration-400 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] relative group flex flex-col h-full"
              >
                {/* Badge matching .eg-badge */}
                <span
                  className={`absolute top-[15px] left-[15px] z-10 px-[14px] py-[5px] text-[12px] font-semibold rounded-[3px] font-['Inter',sans-serif] pointer-events-none ${badgeClasses}`}
                >
                  {item.category || 'News'}
                </span>

                {/* Image matching .blog-grid-1 .image */}
                <a
                  href={`/post-detail?slug=${item.slug}`}
                  className="block w-full h-[250px] overflow-hidden bg-gray-100"
                >
                  <img
                    src={imgUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-550 group-hover:scale-[1.08]"
                    loading="lazy"
                  />
                </a>

                {/* Content matching .blog-grid-1 .content */}
                <div className="p-[22px] flex-1 flex flex-col justify-between">
                  <h4 className="font-['Prompt',sans-serif] text-[24px] font-semibold text-[#101010] leading-[1.4] mb-[15px] group-hover:text-[#ff4c60] transition-colors line-clamp-2">
                    <a href={`/post-detail?slug=${item.slug}`}>{item.title}</a>
                  </h4>

                  <div className="flex items-center">
                    <a
                      href={`/post-detail?slug=${item.slug}`}
                      className="text-[#ff4c60] text-[14px] font-semibold inline-flex items-center gap-[6px] hover:tracking-[0.5px] transition-all"
                    >
                      <span>View Details</span>
                      <i className="bi bi-arrow-right"></i>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

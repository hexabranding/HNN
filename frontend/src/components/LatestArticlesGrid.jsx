import React from 'react';
import { STATIC_LATEST_ARTICLES } from '../data/staticHomeData';
import { formatImageUrl } from '../services/api';

export default function LatestArticlesGrid({ articles = [] }) {
  const displayArticles = (articles && articles.length >= 3)
    ? articles.slice(0, 3)
    : STATIC_LATEST_ARTICLES;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between pb-6 mb-10 border-b border-gray-100 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 font-prompt">
              Latest <span className="text-[#c91f26]">Article</span>
            </h2>
            <div className="w-12 h-1 bg-[#c91f26] mt-2 rounded-full"></div>
          </div>

          <a
            href="/blog-classic.html"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 text-xs font-bold text-gray-700 hover:text-white hover:bg-[#c91f26] hover:border-[#c91f26] transition-all shadow-sm"
          >
            <span>View All Articles</span>
            <i className="bi bi-arrow-right"></i>
          </a>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayArticles.map((item, idx) => {
            const badgeBg = idx === 1 ? 'bg-[#c91f26] text-white' : 'bg-white text-gray-900 shadow-md';
            const imgUrl = formatImageUrl(item.image);

            return (
              <div
                key={item._id || item.slug || idx}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col group"
              >
                {/* Image & Badge Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <span
                    className={`absolute top-4 left-4 z-10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md ${badgeBg}`}
                  >
                    {item.category || 'News'}
                  </span>
                  <a href={`/post-detail.html?slug=${item.slug}`} className="block w-full h-full">
                    <img
                      src={imgUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </a>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <h4 className="text-lg font-bold font-prompt text-gray-900 group-hover:text-[#c91f26] transition-colors line-clamp-2 leading-snug mb-6">
                    <a href={`/post-detail.html?slug=${item.slug}`}>{item.title}</a>
                  </h4>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <a
                      href={`/post-detail.html?slug=${item.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c91f26] group-hover:translate-x-1 transition-transform"
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

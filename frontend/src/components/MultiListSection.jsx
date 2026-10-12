import React from 'react';
import { STATIC_MULTI_LIST } from '../data/staticHomeData';
import { formatImageUrl } from '../services/api';

export default function MultiListSection({ articles = [] }) {
  // If API has enough articles, hydrate into the 3 groups; otherwise use exact static data
  const groups = STATIC_MULTI_LIST.map((staticGroup, gIdx) => {
    const startIdx = gIdx * 5;
    const endIdx = startIdx + 5;
    const apiSlice = articles && articles.length >= endIdx ? articles.slice(startIdx, endIdx) : [];

    if (apiSlice.length > 0) {
      return {
        groupTitle: staticGroup.groupTitle,
        groupSubtitle: staticGroup.groupSubtitle,
        items: apiSlice.map((item) => {
          const d = item.date ? new Date(item.date) : new Date();
          const day = isNaN(d.getTime()) ? '12' : d.getDate().toString().padStart(2, '0');
          const mon = isNaN(d.getTime()) ? 'JUL' : d.toLocaleString('en', { month: 'short' });
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
    }
    return staticGroup;
  });

  return (
    <div className="space-y-12">
      {groups.map((group, gIdx) => (
        <div key={gIdx} className="bg-white">
          {/* Group Header */}
          <div className="flex items-center justify-between border-b-2 border-gray-100 pb-3 mb-6">
            <h3 className="text-xl sm:text-2xl font-bold font-prompt text-gray-900 flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[#c91f26]"></span>
              {group.groupTitle}
              <span className="text-xs font-semibold text-gray-400 font-sans uppercase tracking-wider ml-1">
                / {group.groupSubtitle}
              </span>
            </h3>
          </div>

          {/* Items List */}
          <div className="space-y-4">
            {group.items.map((item, idx) => (
              <div
                key={item.slug || idx}
                className="flex items-start gap-4 p-4 rounded-2xl border border-gray-100 hover:border-red-100 hover:shadow-md transition-all duration-200 group bg-white"
              >
                {/* Date badge */}
                <div className="flex flex-col items-center justify-center w-12 sm:w-14 h-14 sm:h-16 bg-red-50 text-[#c91f26] rounded-xl font-bold flex-shrink-0 border border-red-100">
                  <span className="text-base sm:text-lg leading-none font-extrabold">{item.day}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider mt-0.5">{item.mon}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-1.5">
                    <span className="font-semibold text-gray-700">
                      {item.author}
                    </span>
                    <span>•</span>
                    <span className="text-[#c91f26] font-bold uppercase text-[10px] tracking-wider">
                      {item.category}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold font-prompt text-gray-900 group-hover:text-[#c91f26] transition-colors line-clamp-2 leading-snug">
                    <a href={`/post-detail.html?slug=${item.slug}`}>{item.title}</a>
                  </h4>

                  <div className="flex items-center justify-between mt-3 text-xs">
                    <a
                      href={`/post-detail.html?slug=${item.slug}`}
                      className="text-[#c91f26] font-bold inline-flex items-center gap-1.5 hover:underline text-xs tracking-wide"
                    >
                      <span>Read More</span>
                      <i className="bi bi-arrow-right text-[10px]"></i>
                    </a>
                    <span className="text-gray-400 text-[11px] font-medium">
                      <i className="bi bi-clock mr-1"></i> {item.readTime}
                    </span>
                  </div>
                </div>

                {/* Thumbnail */}
                <a
                  href={`/post-detail.html?slug=${item.slug}`}
                  className="w-20 h-20 sm:w-28 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100"
                >
                  <img
                    src={formatImageUrl(item.image)}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                    loading="lazy"
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

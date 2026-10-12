import React, { useState } from 'react';
import { STATIC_VIDEO_DATA } from '../data/staticHomeData';

export default function VideoPostSection() {
  const [activeVideoId, setActiveVideoId] = useState(null);
  const data = STATIC_VIDEO_DATA;

  return (
    <section className="py-16 bg-gray-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between pb-6 mb-10 border-b border-gray-200/80 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 font-prompt">
              Featured <span className="text-[#c91f26]">Video Post</span>
            </h2>
            <div className="w-12 h-1 bg-[#c91f26] mt-2 rounded-full"></div>
          </div>

          <a
            href="/blog-standard.html"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 text-xs font-bold text-gray-700 hover:text-white hover:bg-[#c91f26] hover:border-[#c91f26] transition-all shadow-sm"
          >
            <span>Explore All Videos</span>
            <i className="bi bi-arrow-right"></i>
          </a>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Main Featured Video (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              {/* Video Thumbnail with Play Button */}
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-black group shadow-md">
                <img
                  src={data.featured.image}
                  alt={data.featured.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
                  loading="lazy"
                />

                {/* Pulse Ring Play Button */}
                <button
                  type="button"
                  onClick={() => setActiveVideoId(data.featured.videoId)}
                  className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#c91f26] hover:bg-[#a8191f] text-white flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 shadow-2xl focus:outline-none ring-8 ring-white/30"
                  aria-label="Play video"
                >
                  <i className="bi bi-play-fill text-3xl sm:text-4xl ml-1"></i>
                </button>
              </div>

              {/* Video Info */}
              <div className="mt-6">
                <h3 className="text-xl sm:text-2xl font-bold font-prompt text-gray-900 hover:text-[#c91f26] transition-colors leading-snug">
                  <a href={`/post-detail.html?slug=${data.featured.slug}`}>
                    {data.featured.title}
                  </a>
                </h3>

                <p className="text-sm text-gray-600 mt-3 line-clamp-2 leading-relaxed">
                  {data.featured.excerpt}
                </p>
              </div>
            </div>

            {/* Author Meta */}
            <div className="flex items-center gap-6 text-xs text-gray-400 font-medium mt-6 pt-4 border-t border-gray-100">
              <span className="flex items-center gap-1.5 text-gray-700 font-semibold">
                <i className="bi bi-person text-[#c91f26]"></i>
                {data.featured.author}
              </span>
              <span className="flex items-center gap-1.5">
                <i className="bi bi-calendar3 text-[#c91f26]"></i>
                {data.featured.date}
              </span>
            </div>
          </div>

          {/* Sidebar Videos (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {data.sidebar.map((v, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-5 items-center group flex-1"
              >
                {/* Thumbnail with Small Play Button */}
                <div className="relative w-full sm:w-44 aspect-[16/10] sm:aspect-square rounded-xl overflow-hidden bg-black flex-shrink-0">
                  <img
                    src={v.image}
                    alt={v.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
                    loading="lazy"
                  />
                  <button
                    type="button"
                    onClick={() => setActiveVideoId(v.videoId)}
                    className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-[#c91f26] hover:bg-[#a8191f] text-white flex items-center justify-center transition transform group-hover:scale-110 shadow-lg ring-4 ring-white/30"
                    aria-label="Play video"
                  >
                    <i className="bi bi-play-fill text-lg ml-0.5"></i>
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-bold font-prompt text-gray-900 group-hover:text-[#c91f26] transition-colors line-clamp-2 leading-snug">
                    <a href={`/post-detail.html?slug=${v.slug}`}>{v.title}</a>
                  </h4>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-3 pt-3 border-t border-gray-50">
                    <span className="flex items-center gap-1 text-gray-700 font-medium">
                      <i className="bi bi-person text-[#c91f26]"></i>
                      {v.author}
                    </span>
                    <span className="text-[#c91f26] font-semibold text-[11px] uppercase">
                      <i className="bi bi-tag mr-0.5"></i>
                      {v.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal Popup */}
      {activeVideoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <button
              onClick={() => setActiveVideoId(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-[#c91f26] text-white flex items-center justify-center transition"
              aria-label="Close video"
            >
              <i className="bi bi-x-lg text-lg"></i>
            </button>

            <div className="aspect-[16/9] w-full">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`}
                title="YouTube video player"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

import React, { useState } from 'react';
import { STATIC_VIDEO_DATA } from '../../data/staticHomeData';

export default function VideoPostSection() {
  const [activeVideoId, setActiveVideoId] = useState(null);
  const data = STATIC_VIDEO_DATA;

  return (
    <section className="video-blog pt-8 pb-4 bg-white">
      <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Exact match to HTML and user screenshot */}
        <div className="section-title-1 mb-[36px] text-center">
          <h2 className="font-['Prompt',sans-serif] text-[34px] sm:text-[40px] font-bold text-[#101820] leading-[1.2]">
            Featured{' '}
            <span
              className="subtitle inline font-bold text-transparent font-['Prompt',sans-serif] ml-2"
              style={{
                WebkitTextStroke: '2px #ff4c60',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Video Post
            </span>
          </h2>
          <div className="mt-4">
            <a
              href="/blog-standard"
              className="arrow-btn-2 inline-flex items-center gap-[8px] text-[15px] font-medium font-['Prompt',sans-serif] text-[#ff4c60] hover:text-[#548f6f] transition-colors group cursor-pointer"
            >
              <span>Explore All</span>
              <span className="w-[28px] h-[28px] rounded-full border border-[#ff4c60]/40 inline-flex items-center justify-center text-[14px] -rotate-45 group-hover:rotate-0 transition-transform duration-300">
                <i className="bi bi-arrow-right text-[13px]"></i>
              </span>
            </a>
          </div>
        </div>

        {/* 2-Column Row matching index.html */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Main Featured Video (lg:col-span-7) */}
          <div className="lg:col-span-7">
            {/* Video Play Thumbnail */}
            <div
              className="video-play relative rounded-[10px] overflow-hidden cursor-pointer group shadow-sm bg-black"
              onClick={() => setActiveVideoId(data.featured.videoId)}
            >
              <img
                src={data.featured.image}
                alt={data.featured.title}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveVideoId(data.featured.videoId);
                }}
                className="video-btn absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px] rounded-full bg-[#ff4c60] text-white flex items-center justify-center text-[24px] z-10 transition-transform duration-350 hover:scale-110 shadow-lg cursor-pointer"
                aria-label="Play video"
              >
                <i className="bi bi-play-fill ml-0.5"></i>
              </button>
            </div>

            {/* Video Content */}
            <div className="content mt-[20px] pt-[5px]">
              <h4 className="font-['Prompt',sans-serif] text-[22px] sm:text-[26px] font-semibold text-[#101820] leading-[1.4] mb-[10px] hover:text-[#ff4c60] transition-colors">
                <a href={`/post-detail?slug=${data.featured.slug}`}>
                  {data.featured.title}
                </a>
              </h4>
              <p className="text-[15px] text-[#555] leading-[1.7] mb-[15px]">
                {data.featured.excerpt}
              </p>
              <div className="video-author flex items-center gap-[20px] text-[14px] text-[#777]">
                <span className="flex items-center gap-[6px]">
                  <i className="bi bi-person text-[#ff4c60]"></i>
                  {data.featured.author}
                </span>
                <span className="flex items-center gap-[6px]">
                  <i className="bi bi-calendar3 text-[#ff4c60]"></i>
                  {data.featured.date}
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar Videos (lg:col-span-5) */}
          <div className="lg:col-span-5">
            <div className="video-sidebar space-y-[20px]">
              {data.sidebar.map((v, idx) => (
                <div
                  key={idx}
                  className="video-item flex gap-[15px] items-start pb-5 last:pb-0 border-b border-gray-100 last:border-b-0"
                >
                  {/* Thumbnail Sibling-2 */}
                  <div
                    className="video-play sibling-2 relative w-[130px] sm:w-[140px] h-[110px] sm:h-[120px] rounded-[10px] overflow-hidden flex-shrink-0 cursor-pointer group bg-black shadow-sm"
                    onClick={() => setActiveVideoId(v.videoId)}
                  >
                    <img
                      src={v.image}
                      alt={v.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveVideoId(v.videoId);
                      }}
                      className="video-btn absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40px] h-[40px] rounded-full bg-[#ff4c60] text-white flex items-center justify-center text-[16px] z-10 transition-transform duration-350 hover:scale-110 shadow-md cursor-pointer"
                      aria-label="Play video"
                    >
                      <i className="bi bi-play-fill ml-0.5"></i>
                    </button>
                  </div>

                  {/* Content */}
                  <div className="content flex-1 min-w-0">
                    <h6 className="font-['Prompt',sans-serif] text-[15px] font-semibold text-[#101820] leading-[1.4] mb-[6px] hover:text-[#ff4c60] transition-colors line-clamp-2">
                      <a href={`/post-detail?slug=${v.slug}`}>{v.title}</a>
                    </h6>
                    <div className="flex flex-wrap items-center gap-[8px] text-[13px] text-[#777] mt-2">
                      <span className="flex items-center gap-[4px]">
                        <i className="bi bi-person text-[#ff4c60]"></i>
                        {v.author}
                      </span>
                      <span>&nbsp;</span>
                      <span className="flex items-center gap-[4px]">
                        <i className="bi bi-tag text-[#ff4c60]"></i>
                        {v.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal Popup */}
      {activeVideoId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          onClick={() => setActiveVideoId(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveVideoId(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-[#ff4c60] text-white flex items-center justify-center transition cursor-pointer"
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

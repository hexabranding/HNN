import React from 'react';
import { STATIC_EDITOR_CHOICE } from '../data/staticHomeData';
import { formatImageUrl } from '../services/api';

export default function SidebarEditorChoice({ articles = [] }) {
  const displayItems = (articles && articles.length >= 5)
    ? articles.slice(0, 5)
    : STATIC_EDITOR_CHOICE;

  return (
    <aside className="space-y-8">
      {/* Editor's Choice Widget */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="border-b-2 border-gray-100 pb-3 mb-5 flex items-center justify-between">
          <h4 className="text-lg font-bold font-prompt text-gray-900 tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c91f26]"></span>
            Editor's Choice
          </h4>
          <span className="text-[11px] font-bold text-[#c91f26] bg-red-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Top 5
          </span>
        </div>

        <div className="space-y-4">
          {displayItems.map((item, idx) => (
            <div
              key={item._id || item.slug || idx}
              className="flex gap-3.5 items-center group pb-3.5 border-b border-gray-50 last:border-0 last:pb-0"
            >
              <a
                href={`/post-detail.html?slug=${item.slug}`}
                className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100"
              >
                <img
                  src={formatImageUrl(item.image)}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
              </a>

              <div className="flex-1 min-w-0">
                <h5 className="text-xs sm:text-sm font-semibold font-prompt text-gray-800 group-hover:text-[#c91f26] transition-colors line-clamp-2 leading-snug">
                  <a href={`/post-detail.html?slug=${item.slug}`}>{item.title}</a>
                </h5>
                <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-1.5 font-medium">
                  <span className="flex items-center gap-1">
                    <i className="bi bi-calendar3 text-[10px] text-[#c91f26]"></i>
                    {item.date || 'Jul 20, 2026'}
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="bi bi-chat text-[10px] text-gray-400"></i>
                    {item.comments || 87}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stay Connected Widget */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="border-b-2 border-gray-100 pb-3 mb-5">
          <h4 className="text-lg font-bold font-prompt text-gray-900 tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c91f26]"></span>
            Stay Connected
          </h4>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <a
            href="#"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-50/70 text-blue-700 hover:bg-blue-600 hover:text-white transition duration-200 text-xs font-bold"
          >
            <i className="bi bi-facebook text-base"></i>
            <div>
              <span className="block leading-none">3.5K</span>
              <span className="text-[10px] opacity-80 font-normal">Like</span>
            </div>
          </a>

          <a
            href="#"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-100 text-gray-900 hover:bg-black hover:text-white transition duration-200 text-xs font-bold"
          >
            <i className="bi bi-twitter-x text-base"></i>
            <div>
              <span className="block leading-none">60K</span>
              <span className="text-[10px] opacity-80 font-normal">Follower</span>
            </div>
          </a>

          <a
            href="#"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-red-50/70 text-red-600 hover:bg-red-600 hover:text-white transition duration-200 text-xs font-bold"
          >
            <i className="bi bi-pinterest text-base"></i>
            <div>
              <span className="block leading-none">25K</span>
              <span className="text-[10px] opacity-80 font-normal">Follower</span>
            </div>
          </a>

          <a
            href="#"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-pink-50/70 text-pink-600 hover:bg-pink-600 hover:text-white transition duration-200 text-xs font-bold"
          >
            <i className="bi bi-instagram text-base"></i>
            <div>
              <span className="block leading-none">75K</span>
              <span className="text-[10px] opacity-80 font-normal">Follower</span>
            </div>
          </a>
        </div>
      </div>

      {/* Ad Banner Widget */}
      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black text-white p-6 text-center shadow-lg relative">
        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block mb-2">
          Advertisement
        </span>
        <h5 className="font-prompt font-extrabold text-xl text-white mb-2">
          HEXA NEWS DIGITAL
        </h5>
        <p className="text-xs text-gray-300 mb-5 leading-relaxed">
          Trusted journalism across Kerala, India, and the Global Diaspora.
        </p>
        <a
          href="/contact.html"
          className="inline-block px-5 py-2.5 bg-[#c91f26] hover:bg-[#a8191f] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition shadow-md"
        >
          Partner With Us
        </a>
      </div>
    </aside>
  );
}

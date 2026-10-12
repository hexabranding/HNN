import React from 'react';
import { STATIC_EDITOR_CHOICE } from '../data/staticHomeData';
import { formatImageUrl } from '../services/api';

export default function SidebarEditorChoice({ articles = [] }) {
  const displayItems =
    articles && articles.length >= 5 ? articles.slice(0, 5) : STATIC_EDITOR_CHOICE;

  return (
    <aside className="post-side-bar-1 space-y-[40px]">
      {/* Editor Choice Widget matching .sidebar-widget-1 */}
      <div className="border border-[#eee] rounded-[8px] p-[25px] bg-white">
        <h6 className="font-['Prompt',sans-serif] text-[18px] font-semibold text-[#101010] mb-[20px] pb-[12px] border-b-2 border-[#eee] relative after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:w-[40px] after:h-[2px] after:bg-[#ff4c60]">
          Editor Choice
        </h6>

        <div className="space-y-0">
          {displayItems.map((item, idx) => (
            <div
              key={item._id || item.slug || idx}
              className="flex gap-[12px] pb-[18px] mb-[18px] border-b border-[#eee] last:border-b-0 last:mb-0 last:pb-0 group"
            >
              <a
                href={`/post-detail.html?slug=${item.slug}`}
                className="w-[80px] h-[70px] rounded-[6px] overflow-hidden flex-shrink-0 bg-gray-100 block"
              >
                <img
                  src={formatImageUrl(item.image)}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-110"
                  loading="lazy"
                />
              </a>

              <div className="flex-1 min-w-0">
                <h6 className="font-['Prompt',sans-serif] text-[15px] font-semibold text-[#101010] leading-[1.4] mb-[6px] group-hover:text-[#ff4c60] transition-colors line-clamp-2">
                  <a href={`/post-detail.html?slug=${item.slug}`}>{item.title}</a>
                </h6>
                <ul className="flex items-center gap-[12px] text-[12px] text-[#101010]/50 list-none p-0">
                  <li className="flex items-center gap-[4px]">
                    <i className="bi bi-calendar3 text-[11px]"></i>
                    <span>{item.date || 'Jul 20, 2026'}</span>
                  </li>
                  <li className="flex items-center gap-[4px]">
                    <i className="bi bi-chat text-[11px]"></i>
                    <span>{item.comments || 520}</span>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stay Connected Widget matching .sidebar-widget-1 & .social-3 */}
      <div className="border border-[#eee] rounded-[8px] p-[25px] bg-white">
        <h6 className="font-['Prompt',sans-serif] text-[18px] font-semibold text-[#101010] mb-[20px] pb-[12px] border-b-2 border-[#eee] relative after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:w-[40px] after:h-[2px] after:bg-[#ff4c60]">
          Stay Connected
        </h6>

        <ul className="space-y-[10px] list-none p-0 m-0">
          <li>
            <a
              href="#"
              className="flex items-center gap-[10px] py-[12px] px-[15px] border border-[#eee] rounded-[6px] text-[14px] font-medium text-[#101010]/70 hover:bg-[#ff4c60] hover:border-[#ff4c60] hover:text-white transition-all group"
            >
              <i className="bi bi-facebook text-[18px]"></i>
              <span>3.5K Like</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center gap-[10px] py-[12px] px-[15px] border border-[#eee] rounded-[6px] text-[14px] font-medium text-[#101010]/70 hover:bg-[#ff4c60] hover:border-[#ff4c60] hover:text-white transition-all group"
            >
              <i className="bi bi-twitter-x text-[18px]"></i>
              <span>60K Follower</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center gap-[10px] py-[12px] px-[15px] border border-[#eee] rounded-[6px] text-[14px] font-medium text-[#101010]/70 hover:bg-[#ff4c60] hover:border-[#ff4c60] hover:text-white transition-all group"
            >
              <i className="bi bi-pinterest text-[18px]"></i>
              <span>25K Follower</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center gap-[10px] py-[12px] px-[15px] border border-[#eee] rounded-[6px] text-[14px] font-medium text-[#101010]/70 hover:bg-[#ff4c60] hover:border-[#ff4c60] hover:text-white transition-all group"
            >
              <i className="bi bi-instagram text-[18px]"></i>
              <span>75K Follower</span>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
}

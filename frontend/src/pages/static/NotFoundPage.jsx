import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="w-full flex items-center justify-center py-24 px-4 text-center">
      <div className="max-w-lg mx-auto">
        <div className="font-['Prompt',sans-serif] text-8xl sm:text-9xl font-extrabold text-[#ff4c60] leading-none mb-4 select-none drop-shadow-sm">
          404
        </div>
        <h2 className="font-['Prompt',sans-serif] text-2xl sm:text-3xl font-bold text-[#101820] mb-3">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-600 text-base mb-8 leading-relaxed">
          The story, article, or page you are looking for may have been relocated, updated, or does not exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#ff4c60] hover:bg-[#548f6f] text-white font-['Prompt',sans-serif] font-bold text-sm uppercase tracking-wider rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <span>Back to Home</span>
          <i className="bi bi-arrow-right"></i>
        </Link>
      </div>
    </div>
  );
}

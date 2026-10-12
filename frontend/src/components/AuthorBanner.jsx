import React from 'react';

export default function AuthorBanner() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-red-50 via-rose-50/50 to-orange-50 border border-red-100/80 p-8 sm:p-12 lg:p-16 overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10 shadow-sm">
          {/* Subtle background decorative circle */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-red-100/50 rounded-full blur-2xl pointer-events-none"></div>

          {/* Author Circle Image (visible on lg screens, exactly like index.html) */}
          <div className="hidden lg:flex items-center justify-center flex-shrink-0 relative z-10">
            <div className="w-64 h-64 xl:w-72 xl:h-72 rounded-full overflow-hidden border-4 border-white shadow-xl ring-8 ring-red-100/60 transition-transform duration-500 hover:scale-105">
              <img
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80"
                alt="Become an Author"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 max-w-2xl text-center lg:text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100/80 text-[#c91f26] text-xs font-bold uppercase tracking-wider mb-4">
              <i className="bi bi-pen-fill"></i> Join Our Writing Community
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 font-prompt leading-tight mb-4">
              Become An Author And Share Your Great Stories.
            </h2>

            <p className="flex items-center justify-center lg:justify-start gap-2 text-sm sm:text-base text-gray-600 mb-8 font-medium">
              <i className="bi bi-envelope-fill text-[#c91f26]"></i>
              <span>Get Every Update and reach millions of readers worldwide</span>
            </p>

            <a
              href="/contact.html"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#c91f26] hover:bg-[#a8191f] text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/25 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Become An Author</span>
              <i className="bi bi-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

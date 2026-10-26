import React from 'react';

/**
 * Modern, professional skeleton card for article grids (Category, Business, Blog)
 */
export function ArticleCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm animate-pulse flex flex-col h-full">
      {/* Featured Image placeholder */}
      <div className="w-full aspect-[16/10] bg-gray-200/80 rounded-xl mb-4"></div>

      {/* Category Badge & Date */}
      <div className="flex items-center justify-between mb-3">
        <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
      </div>

      {/* Headline title lines */}
      <div className="space-y-2 mb-3 flex-1">
        <div className="h-5 bg-gray-200 rounded w-full"></div>
        <div className="h-5 bg-gray-200 rounded w-4/5"></div>
      </div>

      {/* Short excerpt lines */}
      <div className="space-y-1.5 mb-4">
        <div className="h-3.5 bg-gray-100 rounded w-full"></div>
        <div className="h-3.5 bg-gray-100 rounded w-5/6"></div>
      </div>

      {/* Author & Read Time Footer */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gray-200"></div>
          <div className="h-3.5 w-24 bg-gray-200 rounded"></div>
        </div>
        <div className="h-3.5 w-16 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

/**
 * Grid of skeleton cards matching CategoryPage & BusinessPage layout
 */
export function ArticleGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton loader for PostDetailPage (Article Detail View)
 */
export function ArticleDetailSkeleton() {
  return (
    <div className="w-full bg-[#fdfbf7]/30 min-h-screen py-6 sm:py-8 animate-pulse font-['Inter',sans-serif]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Banner Skeleton */}
        <div className="p-8 sm:p-10 rounded-2xl bg-gray-200/90 shadow-md mb-8">
          <div className="h-6 w-24 bg-gray-300/80 rounded-md mb-4"></div>
          <div className="h-9 sm:h-12 bg-gray-300/80 rounded-lg w-4/5 mb-3"></div>
          <div className="h-9 sm:h-12 bg-gray-300/80 rounded-lg w-2/3"></div>
        </div>

        {/* Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Article Body Skeleton */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl p-6 sm:p-10 border border-gray-100 shadow-sm space-y-6">
              {/* Meta info bar */}
              <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gray-200"></div>
                  <div className="space-y-1.5">
                    <div className="h-4 w-28 bg-gray-200 rounded"></div>
                    <div className="h-3 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>

              {/* Featured Image Box */}
              <div className="w-full aspect-video bg-gray-200 rounded-2xl"></div>

              {/* Paragraphs lines */}
              <div className="space-y-3 pt-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-11/12"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              </div>

              {/* Blockquote Placeholder */}
              <div className="p-6 bg-gray-50 border-l-4 border-gray-300 rounded-r-lg space-y-2">
                <div className="h-5 bg-gray-200 rounded w-full"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              </div>

              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
              <div className="h-5 w-32 bg-gray-200 rounded"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex gap-3 items-center">
                    <div className="w-16 h-16 rounded-xl bg-gray-200 flex-shrink-0"></div>
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3.5 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Top slim progress bar for smooth route transitions (YouTube/GitHub style)
 */
export function TopProgressBar() {
  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[999999] overflow-hidden bg-red-100">
      <div className="h-full bg-gradient-to-r from-[#ff4c60] via-[#c91f26] to-[#ff4c60] w-full animate-[progressIndeterminate_1.2s_ease-in-out_infinite] origin-left"></div>
    </div>
  );
}

/**
 * Page skeleton fallback for React Suspense route transitions
 */
export function RoutePageSkeleton() {
  return (
    <div className="w-full min-h-screen bg-[#fdfbf7]/30">
      <TopProgressBar />
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
        {/* Banner placeholder */}
        <div className="h-40 rounded-2xl bg-gray-200/80 mb-8"></div>
        {/* Grid placeholder */}
        <ArticleGridSkeleton count={6} />
      </div>
    </div>
  );
}

/**
 * Section 1: Hero Slider Skeleton (Matches dark 70vh swiper)
 */
export function HeroSliderSkeleton() {
  return (
    <section className="w-full relative overflow-hidden bg-[#111111] animate-pulse">
      <div className="w-full h-[70vh] min-h-[500px] max-h-[700px] relative flex items-center px-[8%]">
        {/* Horizontal subtle gradient */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.3) 100%)',
          }}
        />

        {/* Content Shimmer */}
        <div className="relative z-[2] max-w-[750px] w-full">
          {/* Category Badge shimmer */}
          <div className="h-6 w-24 bg-red-600/50 rounded-[4px] mb-4"></div>

          {/* Heading lines shimmer */}
          <div className="space-y-3 mb-6">
            <div className="h-10 sm:h-12 md:h-14 bg-white/20 rounded-lg w-full max-w-[680px]"></div>
            <div className="h-10 sm:h-12 md:h-14 bg-white/20 rounded-lg w-4/5 max-w-[520px]"></div>
          </div>

          {/* Meta line shimmer */}
          <div className="flex items-center gap-4">
            <div className="h-4 w-32 bg-white/15 rounded"></div>
            <div className="h-4 w-20 bg-white/15 rounded"></div>
          </div>
        </div>

        {/* Left Arrow placeholder */}
        <div className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 bg-white/5 items-center justify-center">
          <div className="w-4 h-4 rounded bg-white/20"></div>
        </div>
        {/* Right Arrow placeholder */}
        <div className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 bg-white/5 items-center justify-center">
          <div className="w-4 h-4 rounded bg-white/20"></div>
        </div>

        {/* Pagination Dots placeholder */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#c91f26]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-white/30"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-white/30"></div>
        </div>
      </div>
    </section>
  );
}

/**
 * Section 2: Tabbed News Section Skeleton (Matches 5-tab carousel)
 */
export function TabbedNewsSkeleton() {
  return (
    <section className="w-full pt-[50px] px-[5%] pb-6 bg-white animate-pulse">
      <div className="w-full max-w-[1440px] mx-auto">
        {/* Tab Navigation Shimmer */}
        <div className="flex flex-wrap justify-center items-center border-b-2 border-[#eee] mb-[40px] gap-8 pb-3">
          {['Newest', 'Trending', 'Top View', 'Top Like', 'Recent'].map((tab, idx) => (
            <div
              key={idx}
              className={`h-5 w-20 rounded ${
                idx === 0
                  ? 'bg-[#ff4c60]/50 relative after:content-[""] after:absolute after:-bottom-3.5 after:left-0 after:right-0 after:h-[3px] after:bg-[#ff4c60]'
                  : 'bg-gray-200'
              }`}
            ></div>
          ))}
        </div>

        {/* 3-Column Card Slider Shimmer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white border border-[#eee] rounded-[12px] overflow-hidden flex flex-col h-full text-left"
            >
              {/* Image box with category badge */}
              <div className="relative w-full h-[280px] bg-gray-200/80">
                <div className="absolute top-[15px] left-[15px] h-5 w-20 bg-red-400/40 rounded-[3px]"></div>
              </div>

              {/* Content box */}
              <div className="p-[20px] flex-1 flex flex-col justify-between space-y-4">
                <div>
                  {/* Author avatar & info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-7 h-7 rounded-full bg-gray-200"></div>
                    <div className="h-3.5 w-24 bg-gray-200 rounded"></div>
                    <div className="h-3 w-16 bg-gray-100 rounded ml-auto"></div>
                  </div>

                  {/* Headline lines */}
                  <div className="space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-full"></div>
                    <div className="h-5 bg-gray-200 rounded w-4/5"></div>
                  </div>
                </div>

                {/* Footer date */}
                <div className="h-3 w-28 bg-gray-100 rounded pt-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Section 3: Multi-List & Sidebar Editor Choice Skeleton
 */
export function MultiListSectionSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: 8 cols */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-6">
            <div className="h-7 w-44 bg-gray-200 rounded"></div>
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200"></div>
              <div className="w-8 h-8 rounded-full bg-gray-200"></div>
            </div>
          </div>

          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="flex flex-col sm:flex-row gap-5 p-4 rounded-2xl border border-gray-100 bg-white"
            >
              <div className="w-full sm:w-[220px] h-[140px] rounded-xl bg-gray-200/80 flex-shrink-0"></div>
              <div className="flex-1 space-y-3 py-1">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-16 bg-red-100 rounded"></div>
                  <div className="h-3 w-20 bg-gray-100 rounded"></div>
                </div>
                <div className="h-5 bg-gray-200 rounded w-full"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3.5 bg-gray-100 rounded w-1/3 pt-2"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: 4 cols (Sidebar Editor Choice) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#fbfbfa] rounded-2xl p-6 border border-gray-100 space-y-4">
            <div className="h-6 w-36 bg-gray-200 rounded pb-2 border-b border-gray-200"></div>
            <div className="space-y-4 pt-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-3 items-center pb-3 border-b border-gray-100 last:border-0">
                  <div className="w-16 h-16 rounded-xl bg-gray-200 flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-2.5 bg-gray-100 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Complete Home Page Skeleton matching the exact layout of HomePage.jsx
 */
export function HomePageSkeleton() {
  return (
    <div className="w-full bg-white">
      <HeroSliderSkeleton />
      <TabbedNewsSkeleton />
      <MultiListSectionSkeleton />
    </div>
  );
}


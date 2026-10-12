import React, { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import Header from '../components/Header';
import SearchModal from '../components/SearchModal';
import HeroSlider from '../components/HeroSlider';
import TabbedNewsSection from '../components/TabbedNewsSection';
import MultiListSection from '../components/MultiListSection';
import SidebarEditorChoice from '../components/SidebarEditorChoice';
import CategorySlider from '../components/CategorySlider';
import AuthorBanner from '../components/AuthorBanner';
import LatestArticlesGrid from '../components/LatestArticlesGrid';
import RecentPostSlider from '../components/RecentPostSlider';
import VideoPostSection from '../components/VideoPostSection';
import NewsletterSection from '../components/NewsletterSection';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import { fetchApi } from '../services/api';

export default function HomePage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [featuredRes, allRes, catRes] = await Promise.all([
          fetchApi('/news?featured=true&limit=6').catch(() => null),
          fetchApi('/news?limit=30').catch(() => null),
          fetchApi('/categories').catch(() => null),
        ]);

        if (featuredRes && featuredRes.news && featuredRes.news.length > 0) {
          setFeaturedArticles(featuredRes.news);
        } else if (allRes && allRes.news && allRes.news.length > 0) {
          setFeaturedArticles(allRes.news.slice(0, 5));
        }

        if (allRes && allRes.news) {
          setAllArticles(allRes.news);
        }

        if (catRes && Array.isArray(catRes)) {
          setCategories(catRes);
        }
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 font-inter antialiased selection:bg-[#c91f26] selection:text-white">
      {/* 1. Topbar with live date, temperature, logo, and social counts */}
      <Topbar />

      {/* 2. Main sticky navigation header with dropdowns */}
      <Header onOpenSearch={() => setSearchOpen(true)} />

      {/* 3. Search overlay drawer modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Main Content Body in exact order of index.html */}
      <main className="flex-1 w-full">
        {/* Section 1: Hero Carousel Slider */}
        <HeroSlider articles={featuredArticles} />

        {/* Section 2: Banner 5-Tab News Carousel (Newest, Trending, Top View, Top Like, Recent) */}
        <TabbedNewsSection allArticles={allArticles} />

        {/* Section 3: Blog List Multi-List & Sidebar Editor Choice / Stay Connected */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-8">
              <MultiListSection articles={allArticles} />
            </div>
            <div className="lg:col-span-4">
              <SidebarEditorChoice articles={allArticles} categories={categories} />
            </div>
          </div>
        </section>

        {/* Section 4: Entire Topic Category Carousel */}
        <CategorySlider categories={categories} />

        {/* Section 5: Author Update Banner ("Become An Author") */}
        <AuthorBanner />

        {/* Section 6: Latest Article 3-Column Grid */}
        <LatestArticlesGrid articles={allArticles} />

        {/* Section 7: Featured Post Carousel (Recent Post Slider) */}
        <RecentPostSlider articles={allArticles} />

        {/* Section 8: Featured Video Post with YouTube Player */}
        <VideoPostSection />

        {/* Section 9: Newsletter Subscription Banner */}
        <NewsletterSection />
      </main>

      {/* Footer (4 Columns + Help Center + Copyright) */}
      <Footer />

      {/* Floating Back to Top Button */}
      <BackToTop />
    </div>
  );
}

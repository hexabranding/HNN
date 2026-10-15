import React, { useState, useEffect } from 'react';
import HeroSlider from '../components/home/HeroSlider';
import CategorySlider from '../components/home/CategorySlider';
import RecentPostSlider from '../components/home/RecentPostSlider';
import LatestArticlesGrid from '../components/home/LatestArticlesGrid';
import TabbedNewsSection from '../components/home/TabbedNewsSection';
import VideoPostSection from '../components/home/VideoPostSection';
import MultiListSection from '../components/home/MultiListSection';
import NewsletterSection from '../components/home/NewsletterSection';
import SidebarEditorChoice from '../components/sidebars/SidebarEditorChoice';
import AuthorBanner from '../components/sidebars/AuthorBanner';
import { fetchApi } from '../services/api';

export default function HomePage() {
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
    <div className="w-full selection:bg-[#c91f26] selection:text-white">
      {/* Section 1: Hero Carousel Slider */}
      <HeroSlider articles={featuredArticles} />

      {/* Section 2: Banner 5-Tab News Carousel (Newest, Trending, Top View, Top Like, Recent) */}
      <TabbedNewsSection allArticles={allArticles} />

      {/* Section 3: Blog List Multi-List & Sidebar Editor Choice / Stay Connected */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4">
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
    </div>
  );
}

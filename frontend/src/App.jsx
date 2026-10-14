import React, { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Preloader from './components/layout/Preloader';
import ErrorBoundary from './components/layout/ErrorBoundary';
import MainLayout from './components/layout/MainLayout';

// Lazy-loaded pages for optimized bundle splitting & faster page load
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/static/AboutPage'));
const ContactPage = lazy(() => import('./pages/static/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/static/NotFoundPage'));
const PostDetailPage = lazy(() => import('./pages/news/PostDetailPage'));
const AuthorPage = lazy(() => import('./pages/news/AuthorPage'));
const CategoryPage = lazy(() => import('./pages/news/CategoryPage'));
const BusinessPage = lazy(() => import('./pages/news/BusinessPage'));
const BlogStandardPage = lazy(() => import('./pages/blog/BlogStandardPage'));
const BlogClassicPage = lazy(() => import('./pages/blog/BlogClassicPage'));
const BlogMasonryPage = lazy(() => import('./pages/blog/BlogMasonryPage'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminNewsPage = lazy(() => import('./pages/admin/AdminNewsPage'));
const AdminCategoriesPage = lazy(() => import('./pages/admin/AdminCategoriesPage'));
const AdminAuthorsPage = lazy(() => import('./pages/admin/AdminAuthorsPage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'));

// Author Portal Pages
const AuthorLayout = lazy(() => import('./pages/author/AuthorLayout'));
const AuthorDashboardPage = lazy(() => import('./pages/author/AuthorDashboardPage'));
const AuthorNewsPage = lazy(() => import('./pages/author/AuthorNewsPage'));
const AuthorSettingsPage = lazy(() => import('./pages/author/AuthorSettingsPage'));

function App() {
  const [initialLoading, setInitialLoading] = useState(true);

  // Initial site mount preloader matching original HTML egns-preloader behavior
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorBoundary>
      {initialLoading && <Preloader fullScreen={true} />}
      <BrowserRouter>
        <Suspense fallback={<Preloader fullScreen={true} />}>
          <Routes>
            {/* 1. Public Layout Routes with Persistent Topbar, Header, Footer & Search Drawer */}
            <Route element={<MainLayout />}>
              {/* Homepage */}
              <Route path="/" element={<HomePage />} />

              {/* Static Information & Contact */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* Article Detail */}
              <Route path="/post-detail" element={<PostDetailPage />} />
              <Route path="/post/:slug" element={<PostDetailPage />} />

              {/* Authors */}
              <Route path="/author" element={<AuthorPage />} />
              <Route path="/author/:id" element={<AuthorPage />} />

              {/* Blog Variations */}
              <Route path="/blog-standard" element={<BlogStandardPage />} />
              <Route path="/blog-classic" element={<BlogClassicPage />} />
              <Route path="/blog-masonry" element={<BlogMasonryPage />} />

              {/* Main Categories */}
              <Route path="/sports" element={<CategoryPage category="sports" />} />
              <Route path="/health" element={<CategoryPage category="health" />} />
              <Route path="/technology" element={<CategoryPage category="technology" />} />
              <Route path="/business" element={<BusinessPage />} />

              {/* Regional International Categories */}
              <Route path="/asia" element={<CategoryPage category="asia" isRegional={true} />} />
              <Route path="/north-america" element={<CategoryPage category="north-america" isRegional={true} />} />
              <Route path="/antarctica" element={<CategoryPage category="antarctica" isRegional={true} />} />
              <Route path="/europe" element={<CategoryPage category="europe" isRegional={true} />} />
              <Route path="/australia" element={<CategoryPage category="australia" isRegional={true} />} />
              <Route path="/south-america" element={<CategoryPage category="south-america" isRegional={true} />} />
              {/* Dynamic Category & Hierarchical Subcategory Pages */}
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/category/:category/:subcategory" element={<CategoryPage />} />
              <Route path="/:category/:subcategory" element={<CategoryPage />} />
              <Route path="/:categorySlug" element={<CategoryPage />} />

              {/* 404 Catch-All within MainLayout */}
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* 2. Isolated Administrative Dashboard (Dedicated Sub-Routes) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="news" element={<AdminNewsPage />} />
              <Route path="news/new" element={<AdminNewsPage defaultEditor={true} />} />
              <Route path="news/edit/:id" element={<AdminNewsPage defaultEditor={true} />} />
              <Route path="articles" element={<AdminNewsPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="category" element={<AdminCategoriesPage />} />
              <Route path="catageory" element={<AdminCategoriesPage />} />
              <Route path="authors" element={<AdminAuthorsPage />} />
              <Route path="author" element={<AdminAuthorsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="*" element={<AdminDashboardPage />} />
            </Route>

            {/* 3. Isolated Journalist / Author Workstation */}
            <Route path="/author-dashboard" element={<AuthorLayout />}>
              <Route index element={<AuthorDashboardPage />} />
              <Route path="news" element={<AuthorNewsPage />} />
              <Route path="news/new" element={<AuthorNewsPage defaultEditor={true} />} />
              <Route path="news/edit/:id" element={<AuthorNewsPage defaultEditor={true} />} />
              <Route path="settings" element={<AuthorSettingsPage />} />
              <Route path="*" element={<AuthorDashboardPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

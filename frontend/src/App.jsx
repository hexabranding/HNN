import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PostDetailPage from './pages/PostDetailPage';
import AuthorPage from './pages/AuthorPage';
import BlogStandardPage from './pages/BlogStandardPage';
import BlogClassicPage from './pages/BlogClassicPage';
import BlogMasonryPage from './pages/BlogMasonryPage';
import CategoryPage from './pages/CategoryPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Homepage */}
        <Route path="/" element={<HomePage />} />

        {/* 2. Static Information & Contact */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* 3. Article Detail */}
        <Route path="/post-detail" element={<PostDetailPage />} />
        <Route path="/post/:slug" element={<PostDetailPage />} />

        {/* 4. Authors */}
        <Route path="/author" element={<AuthorPage />} />
        <Route path="/author/:id" element={<AuthorPage />} />

        {/* 5. Blog Variations */}
        <Route path="/blog-standard" element={<BlogStandardPage />} />
        <Route path="/blog-classic" element={<BlogClassicPage />} />
        <Route path="/blog-masonry" element={<BlogMasonryPage />} />

        {/* 6. Main Categories */}
        <Route path="/sports" element={<CategoryPage category="sports" />} />
        <Route path="/health" element={<CategoryPage category="health" />} />
        <Route path="/technology" element={<CategoryPage category="technology" />} />
        <Route path="/business" element={<CategoryPage category="business" />} />

        {/* 7. Regional International Categories */}
        <Route path="/asia" element={<CategoryPage category="asia" isRegional={true} />} />
        <Route path="/north-america" element={<CategoryPage category="north-america" isRegional={true} />} />
        <Route path="/antarctica" element={<CategoryPage category="antarctica" isRegional={true} />} />
        <Route path="/europe" element={<CategoryPage category="europe" isRegional={true} />} />
        <Route path="/australia" element={<CategoryPage category="australia" isRegional={true} />} />
        <Route path="/south-america" element={<CategoryPage category="south-america" isRegional={true} />} />
        <Route path="/africa" element={<CategoryPage category="africa" isRegional={true} />} />

        {/* 8. Administrative Dashboard */}
        <Route path="/admin" element={<AdminPage />} />

        {/* 9. Legacy .html URL Redirects (Cleans browser URL automatically) */}
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="/about.html" element={<Navigate to="/about" replace />} />
        <Route path="/contact.html" element={<Navigate to="/contact" replace />} />
        <Route path="/post-detail.html" element={<Navigate to="/post-detail" replace />} />
        <Route path="/author.html" element={<Navigate to="/author" replace />} />
        <Route path="/blog-standard.html" element={<Navigate to="/blog-standard" replace />} />
        <Route path="/blog-classic.html" element={<Navigate to="/blog-classic" replace />} />
        <Route path="/blog-masonry.html" element={<Navigate to="/blog-masonry" replace />} />
        <Route path="/sports.html" element={<Navigate to="/sports" replace />} />
        <Route path="/health.html" element={<Navigate to="/health" replace />} />
        <Route path="/technology.html" element={<Navigate to="/technology" replace />} />
        <Route path="/business.html" element={<Navigate to="/business" replace />} />
        <Route path="/asia.html" element={<Navigate to="/asia" replace />} />
        <Route path="/north-america.html" element={<Navigate to="/north-america" replace />} />
        <Route path="/antarctica.html" element={<Navigate to="/antarctica" replace />} />
        <Route path="/europe.html" element={<Navigate to="/europe" replace />} />
        <Route path="/australia.html" element={<Navigate to="/australia" replace />} />
        <Route path="/south-america.html" element={<Navigate to="/south-america" replace />} />
        <Route path="/africa.html" element={<Navigate to="/africa" replace />} />
        <Route path="/admin.html" element={<Navigate to="/admin" replace />} />

        {/* 10. 404 Catch-All */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="/404.html" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

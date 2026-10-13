import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchApi } from '../../services/api';
import HtmlEditor from '../../components/admin/HtmlEditor';
import Pagination from '../../components/common/Pagination';

export default function AdminPage() {
  const [token, setToken] = useState(
    localStorage.getItem('hexa_token') || localStorage.getItem('hexa_admin_token') || ''
  );
  const [user, setUser] = useState(
    (() => {
      try {
        return JSON.parse(localStorage.getItem('hexa_user') || 'null');
      } catch {
        return null;
      }
    })()
  );

  // Active Sidebar Tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Login form state
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Data State
  const [stats, setStats] = useState({
    articles: 0,
    categories: 0,
    authors: 0,
    views: 0,
  });
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const CARDS_PER_PAGE = 10;
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // News View State: 'list' (10-card dashboard) or 'editor' (Add / Edit News view)
  const [newsView, setNewsView] = useState('list');
  const [editingArticleId, setEditingArticleId] = useState(null);
  const [galleryInput, setGalleryInput] = useState('');
  const [artForm, setArtForm] = useState({
    title: '',
    titleEn: '',
    slug: '',
    category: 'Technology',
    categories: [],
    author: 'Staff Reporter',
    excerpt: '',
    content: '',
    image: '',
    gallery: [],
    tags: '',
    media: 'standard',
    videoUrl: '',
    featured: false,
    breaking: false,
    mainNews: false,
    popular: false,
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    readTime: '4 min read',
    backgroundColor: '#c91f26',
    likes: 0,
    views: 0,
    published: true,
  });

  // Category Modal State
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [catForm, setCatForm] = useState({ id: '', label: '', slug: '' });

  // Author Modal State
  const [authorModalOpen, setAuthorModalOpen] = useState(false);
  const [authorForm, setAuthorForm] = useState({ name: '', role: 'Reporter', bio: '' });

  // Settings State
  const [settings, setSettings] = useState({
    siteName: 'HEXA NEWS',
    siteDescription: 'Latest Global & Regional News Portal',
    contactEmail: 'contact@hexanews.in',
  });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

  // Check login on load
  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((data) => {
          if (data && data.user) {
            setUser(data.user);
            localStorage.setItem('hexa_user', JSON.stringify(data.user));
          }
        })
        .catch(() => {
          // Keep existing token
        });

      loadDashboardData();
    }
  }, [token]);

  const loadDashboardData = async () => {
    try {
      const [artRes, catRes, authRes] = await Promise.all([
        fetchApi('/news?limit=1000').catch(() => null),
        fetchApi('/categories').catch(() => null),
        fetchApi('/authors').catch(() => null),
      ]);

      const newsList = artRes?.news || (Array.isArray(artRes) ? artRes : []);
      const catList = Array.isArray(catRes) ? catRes : [];
      const authList = Array.isArray(authRes) ? authRes : [];

      setArticles(newsList);
      setCategories(catList);
      setAuthors(authList);

      const totalViews = newsList.reduce((acc, curr) => acc + (curr.views || 0), 0);
      setStats({
        articles: artRes?.total || newsList.length,
        categories: catList.length,
        authors: authList.length,
        views: totalViews,
      });
    } catch (err) {
      console.warn('Dashboard data load warning:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUser, password: loginPass }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      localStorage.setItem('hexa_token', data.token);
      localStorage.setItem('hexa_admin_token', data.token);
      localStorage.setItem('hexa_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      showToast('Signed in successfully!', 'success');
      loadDashboardData();
    } catch (err) {
      setLoginError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('hexa_token');
    localStorage.removeItem('hexa_admin_token');
    localStorage.removeItem('hexa_user');
    setToken('');
    setUser(null);
  };

  // Article Editor Actions (In-page view, matching screenshot)
  const openNewArticleModal = () => {
    setEditingArticleId(null);
    setGalleryInput('');
    setArtForm({
      title: '',
      titleEn: '',
      slug: '',
      category: categories[0]?.label || 'Technology',
      categories: [],
      author: user?.name || 'HEXA NEWS Admin',
      excerpt: '',
      content: '',
      image: '',
      gallery: [],
      tags: '',
      media: 'standard',
      videoUrl: '',
      featured: false,
      breaking: false,
      mainNews: false,
      popular: false,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: '4 min read',
      backgroundColor: '#c91f26',
      likes: 0,
      views: 0,
      published: true,
    });
    setNewsView('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openEditArticleModal = (art) => {
    setEditingArticleId(art._id || art.slug);
    setGalleryInput('');
    setArtForm({
      title: art.title || '',
      titleEn: art.titleEn || '',
      slug: art.slug || art.engSlug || '',
      category: art.category || 'Technology',
      categories: Array.isArray(art.categories) ? art.categories : [],
      author: art.author || 'Staff Reporter',
      excerpt: art.excerpt || art.description || '',
      content: art.content || art.description || '',
      image: art.image || '',
      gallery: Array.isArray(art.gallery) ? art.gallery : [],
      tags: Array.isArray(art.tags) ? art.tags.join(', ') : art.tags || '',
      media: art.media || (art.videoUrl ? 'video' : 'standard'),
      videoUrl: art.videoUrl || '',
      featured: !!art.featured,
      breaking: !!art.breaking,
      mainNews: !!art.mainNews,
      popular: !!art.popular,
      date: art.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: art.readTime || '4 min read',
      backgroundColor: art.backgroundColor || '#c91f26',
      likes: art.likes || 0,
      views: art.views || 0,
      published: art.published !== false,
    });
    setNewsView('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveArticle = async (e) => {
    e.preventDefault();
    if (!artForm.title || !artForm.category || !artForm.content) {
      showToast('Title, category, and content are required', 'error');
      return;
    }

    const payload = {
      ...artForm,
      featured: !!artForm.featured,
      breaking: !!artForm.breaking,
      mainNews: !!artForm.mainNews,
      popular: !!artForm.popular,
      media: artForm.videoUrl?.trim() ? 'video' : (artForm.media || 'standard'),
      tags: typeof artForm.tags === 'string'
        ? artForm.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : (Array.isArray(artForm.tags) ? artForm.tags : []),
    };

    const endpoint = editingArticleId ? `/news/${editingArticleId}` : '/news';
    const method = editingArticleId ? 'PUT' : 'POST';

    try {
      const res = await fetch(`/api${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
      }

      showToast(editingArticleId ? 'Article updated!' : 'Article published!', 'success');
      setNewsView('list');
      loadDashboardData();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    }
  };

  const handleGalleryFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch('/api/upload/image', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setArtForm((prev) => ({
          ...prev,
          gallery: [...(prev.gallery || []), data.url],
        }));
        showToast('Gallery image added!', 'success');
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteArticle = async (idOrSlug) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      const res = await fetch(`/api/news/${idOrSlug}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showToast('Article deleted', 'success');
        loadDashboardData();
      } else {
        throw new Error('Delete failed');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Image Upload helper
  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload/image', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setArtForm((prev) => ({ ...prev, image: data.url }));
        showToast('Image uploaded successfully!', 'success');
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Category Actions
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!catForm.id || !catForm.label) {
      showToast('ID and Label are required', 'error');
      return;
    }

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: catForm.id,
          label: catForm.label,
          slug: catForm.slug || catForm.id,
        }),
      });

      if (res.ok) {
        showToast('Category created!', 'success');
        setCategoryModalOpen(false);
        loadDashboardData();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Author Actions
  const handleSaveAuthor = async (e) => {
    e.preventDefault();
    if (!authorForm.name) {
      showToast('Author name is required', 'error');
      return;
    }

    try {
      const res = await fetch('/api/authors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(authorForm),
      });

      if (res.ok) {
        showToast('Author created!', 'success');
        setAuthorModalOpen(false);
        loadDashboardData();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const filteredArticles = articles.filter((a) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      a.title?.toLowerCase().includes(q) ||
      a.author?.toLowerCase().includes(q) ||
      a.excerpt?.toLowerCase().includes(q) ||
      a.category?.toLowerCase().includes(q) ||
      a.categoryMl?.toLowerCase().includes(q);

    const matchesCategory =
      selectedCategory === 'ALL' ||
      !selectedCategory ||
      a.category?.toLowerCase() === selectedCategory.toLowerCase() ||
      a.categoryMl?.toLowerCase() === selectedCategory.toLowerCase() ||
      (Array.isArray(a.categories) && a.categories.some((c) => c.toLowerCase() === selectedCategory.toLowerCase()));

    return matchesSearch && matchesCategory;
  });

  // Pagination & stats calculation for News Management
  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / CARDS_PER_PAGE));
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE
  );
  const featuredCount = articles.filter((a) => a.featured === true).length;

  // Reset to first page when search query or category filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // Adjust current page if total pages decreases (e.g., after deletion)
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // ==========================================
  // VIEW 1: LOGIN CARD (When not signed in)
  // ==========================================
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[linear-gradient(135deg,#111111_0%,#1a1a1a_50%,#222222_100%)]">
        <div className="w-full max-w-[420px] bg-white rounded-2xl p-10 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-[#e0e0e0]">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-3">
              <img
                src="/images/logo%20hexa.png"
                alt="HEXA NEWS"
                className="h-12 w-auto object-contain mx-auto rounded-lg"
              />
            </Link>
            <h2 className="text-[22px] font-bold text-[#111111] mb-2 font-['Inter',sans-serif]">
              Admin Panel
            </h2>
            <p className="text-[#888888] text-[13px]">
              Sign in to manage your news portal
            </p>
          </div>

          {loginError && (
            <div className="p-3 mb-5 rounded-lg bg-red-50 border border-red-200 text-xs text-[#c91f26] font-medium text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[13px] font-semibold text-[#555555] mb-1.5">
                Username or Email
              </label>
              <input
                type="text"
                required
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                placeholder="admin"
                className="w-full px-3.5 py-3 bg-[#f9f9f9] border border-[#dddddd] rounded-lg text-sm text-[#111111] outline-none focus:border-[#c91f26] focus:bg-white focus:ring-2 focus:ring-[#c91f26]/10 transition"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#555555] mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3.5 py-3 bg-[#f9f9f9] border border-[#dddddd] rounded-lg text-sm text-[#111111] outline-none focus:border-[#c91f26] focus:bg-white focus:ring-2 focus:ring-[#c91f26]/10 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3.5 bg-[#c91f26] hover:bg-[#a8191f] text-white font-semibold text-[15px] rounded-lg shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {loggingIn ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-5 border-t border-[#f0f0f0] text-center">
            <Link to="/" className="text-xs text-[#c91f26] hover:underline font-medium">
              ← Return to public website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: AUTHENTICATED ADMIN DASHBOARD
  // Exactly matching admin.html & user screenshot
  // ==========================================
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex font-['Inter',sans-serif]">
      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed top-5 right-5 z-[999] px-5 py-3.5 rounded-lg text-[13px] font-semibold text-white shadow-lg transition-transform duration-300 ${
            toast.type === 'error' ? 'bg-[#c62828]' : 'bg-[#2e7d32]'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* 1. Left Sidebar (Fixed 250px) */}
      <aside className="fixed left-0 top-0 bottom-0 w-[250px] bg-[#111111] border-r border-[#222222] py-5 z-40 flex flex-col justify-between">
        <div>
          {/* Logo Area */}
          <div className="px-5 pb-6 border-b border-[#222222] mb-2 flex items-center">
            <img
              src="/images/logo%20hexa.png"
              alt="HEXA NEWS"
              className="h-[36px] w-auto object-contain rounded-[6px]"
            />
            <span className="text-[#c91f26] font-bold text-[16px] ml-2.5 tracking-wide">
              HEXA NEWS
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="mt-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: 'bi-grid' },
              { id: 'articles', label: 'News Management', icon: 'bi-newspaper' },
              { id: 'categories', label: 'Categories', icon: 'bi-tags' },
              { id: 'authors', label: 'Authors', icon: 'bi-people' },
              { id: 'settings', label: 'Settings', icon: 'bi-gear' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === 'articles') setNewsView('list');
                  }}
                  className={`w-full flex items-center gap-3 px-6 py-3 text-[14px] font-medium transition-all cursor-pointer text-left ${
                    isActive
                      ? 'text-white bg-[rgba(201,31,38,0.12)] border-r-[3px] border-[#c91f26]'
                      : 'text-[#999999] hover:text-white hover:bg-[rgba(201,31,38,0.12)]'
                  }`}
                >
                  <i className={`bi ${tab.icon} text-[18px] w-[22px] text-center`}></i>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="px-5 pb-2">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-2.5 px-3 bg-[rgba(201,31,38,0.1)] border border-[rgba(201,31,38,0.25)] rounded-[8px] text-[#c91f26] hover:bg-[#c91f26] hover:text-white text-[13px] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <i className="bi bi-box-arrow-left text-[14px]"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="ml-[250px] flex-1 p-6 lg:p-8 bg-[#f5f5f5] min-h-screen text-[#222222]">
        {/* Top Bar matching screenshot */}
        <div className="flex items-center justify-between mb-7">
          <h1 className="text-[24px] font-bold text-[#111111] capitalize">
            {activeTab}
          </h1>
          <div className="flex items-center gap-2 text-[13px] text-[#666666]">
            <i className="bi bi-person-circle text-[#c91f26]"></i>
            <span className="font-medium">{user?.name || 'HEXA NEWS Admin'}</span>
          </div>
        </div>

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            {/* 4 Stats Cards matching screenshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white border border-[#e5e5e5] rounded-[12px] p-5 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="text-[28px] font-extrabold text-[#c91f26] leading-none mb-1">
                  {stats.articles}
                </div>
                <div className="text-[12px] text-[#888888] uppercase tracking-[1px] font-medium">
                  ARTICLES
                </div>
              </div>

              <div className="bg-white border border-[#e5e5e5] rounded-[12px] p-5 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="text-[28px] font-extrabold text-[#c91f26] leading-none mb-1">
                  {stats.categories}
                </div>
                <div className="text-[12px] text-[#888888] uppercase tracking-[1px] font-medium">
                  CATEGORIES
                </div>
              </div>

              <div className="bg-white border border-[#e5e5e5] rounded-[12px] p-5 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="text-[28px] font-extrabold text-[#c91f26] leading-none mb-1">
                  {stats.authors}
                </div>
                <div className="text-[12px] text-[#888888] uppercase tracking-[1px] font-medium">
                  AUTHORS
                </div>
              </div>

              <div className="bg-white border border-[#e5e5e5] rounded-[12px] p-5 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="text-[28px] font-extrabold text-[#c91f26] leading-none mb-1">
                  {stats.views.toLocaleString()}
                </div>
                <div className="text-[12px] text-[#888888] uppercase tracking-[1px] font-medium">
                  TOTAL VIEWS
                </div>
              </div>
            </div>

            {/* Recent Articles Panel */}
            <div className="bg-white border border-[#e5e5e5] rounded-[12px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[18px] font-bold text-[#111111]">Recent Articles</h3>
                {articles.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('articles')}
                    className="text-xs text-[#c91f26] hover:underline font-semibold"
                  >
                    View All →
                  </button>
                )}
              </div>

              {articles.length === 0 ? (
                <div className="py-20 text-center text-[#888888] text-[14px]">
                  No articles found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[13px]">
                    <thead>
                      <tr className="border-b-2 border-[#eeeeee] text-[12px] text-[#888888] uppercase tracking-[1px]">
                        <th className="py-3 px-3.5">Title</th>
                        <th className="py-3 px-3.5">Category</th>
                        <th className="py-3 px-3.5">Author</th>
                        <th className="py-3 px-3.5">Views</th>
                        <th className="py-3 px-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f0f0]">
                      {articles.slice(0, 5).map((a, idx) => (
                        <tr key={idx} className="hover:bg-[#fafafa]">
                          <td className="py-3 px-3.5 max-w-[280px] truncate font-semibold text-[#111111]">
                            <Link
                              to={`/post-detail?slug=${a.slug}`}
                              className="hover:text-[#c91f26]"
                            >
                              {a.title}
                            </Link>
                          </td>
                          <td className="py-3 px-3.5">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#e3f2fd] text-[#1565c0]">
                              {a.category}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 text-[#555555]">{a.author || '-'}</td>
                          <td className="py-3 px-3.5 text-[#555555]">{a.views || 0}</td>
                          <td className="py-3 px-3.5">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                a.published !== false
                                  ? 'bg-[#e8f5e9] text-[#2e7d32]'
                                  : 'bg-[#ffebee] text-[#c91f26]'
                              }`}
                            >
                              {a.published !== false ? 'Published' : 'Draft'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ARTICLES (NEWS MANAGEMENT) */}
        {activeTab === 'articles' && (
          <div className="space-y-6">
            {/* Header with Breadcrumb and Primary Add Button */}
            <div id="news-management-top" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-semibold text-[#64748b]">Admin</span>
                <i className="bi bi-chevron-right text-[11px] text-[#94a3b8]"></i>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a] tracking-tight">
                  News Management
                </h2>
                {newsView === 'list' && (
                  <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fee2e2] text-[#c91f26]">
                    {filteredArticles.length}
                  </span>
                )}
              </div>

              {newsView === 'list' && (
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={openNewArticleModal}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c91f26] hover:bg-[#a8191f] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition active:scale-[0.98] cursor-pointer"
                  >
                    <i className="bi bi-plus-lg font-bold"></i>
                    <span>Add News</span>
                  </button>
                </div>
              )}
            </div>

            {/* CONDITION: IN-PAGE EDITOR VIEW vs 10-CARD LIST VIEW */}
            {newsView === 'editor' ? (
              <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6 sm:p-8">
                {/* Header inside card: Add New News & Cancel button */}
                <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#f1f5f9]">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#111827]">
                    {editingArticleId ? 'Edit Article' : 'Add New News'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setNewsView('list');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569] text-xs sm:text-sm font-semibold rounded-lg transition cursor-pointer"
                  >
                    <i className="bi bi-x-lg text-xs"></i>
                    <span>Cancel</span>
                  </button>
                </div>

                <form onSubmit={handleSaveArticle} className="space-y-6">
                  {/* TWO COLUMN GRID: Basic Information (Left) & Media & Display (Right) */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {/* LEFT COLUMN: Basic Information */}
                    <div className="space-y-5">
                      <h4 className="text-[16px] font-bold text-[#1f2937]">Basic Information</h4>

                      {/* Title (Malayalam / Headline) */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-[13px] font-semibold text-[#374151]">
                            Title (Malayalam) *
                          </label>
                          {artForm.backgroundColor && (
                            <span className="text-[11px] text-[#6b7280] flex items-center gap-1.5">
                              <span>Title BG:</span>
                              <span
                                className="w-3.5 h-3.5 rounded-full inline-block border border-black/10 shadow-sm"
                                style={{ backgroundColor: artForm.backgroundColor }}
                              ></span>
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          required
                          value={artForm.title}
                          onChange={(e) => setArtForm({ ...artForm, title: e.target.value })}
                          placeholder="Enter news title in Malayalam"
                          className="w-full px-3.5 py-2.5 bg-white border border-[#d1d5db] rounded-lg text-sm text-[#111827] outline-none focus:border-[#c91f26] focus:ring-1 focus:ring-[#c91f26] transition"
                        />
                        {/* Live Title Banner Preview */}
                        {artForm.title && (
                          <div
                            style={{ backgroundColor: artForm.backgroundColor || '#c91f26' }}
                            className="mt-2.5 p-3 rounded-lg text-white text-xs font-semibold shadow-sm transition-colors flex items-center justify-between gap-2"
                          >
                            <span className="truncate">{artForm.title}</span>
                            <span className="text-[10px] uppercase font-bold opacity-80 whitespace-nowrap bg-white/20 px-2 py-0.5 rounded">Title BG Preview</span>
                          </div>
                        )}
                      </div>

                      {/* Excerpt */}
                      <div>
                        <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">
                          Excerpt
                        </label>
                        <textarea
                          rows={3}
                          value={artForm.excerpt}
                          onChange={(e) => setArtForm({ ...artForm, excerpt: e.target.value })}
                          placeholder="Brief summary of the news"
                          className="w-full px-3.5 py-2.5 bg-white border border-[#d1d5db] rounded-lg text-sm text-[#111827] outline-none focus:border-[#c91f26] focus:ring-1 focus:ring-[#c91f26] transition"
                        />
                      </div>


                      {/* Primary Category & Author (2-cols) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">
                            Primary Category *
                          </label>
                          <select
                            value={artForm.category}
                            onChange={(e) => setArtForm({ ...artForm, category: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-white border border-[#d1d5db] rounded-lg text-sm text-[#111827] outline-none focus:border-[#c91f26] focus:ring-1 focus:ring-[#c91f26] transition"
                          >
                            {categories.map((c, i) => (
                              <option key={i} value={c.label}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">
                            Author
                          </label>
                          <select
                            value={artForm.author}
                            onChange={(e) => setArtForm({ ...artForm, author: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-white border border-[#d1d5db] rounded-lg text-sm text-[#111827] outline-none focus:border-[#c91f26] focus:ring-1 focus:ring-[#c91f26] transition"
                          >
                            {authors.length > 0 ? (
                              authors.map((a, i) => (
                                <option key={i} value={a.name}>
                                  {a.name}
                                </option>
                              ))
                            ) : (
                              <>
                                <option value="Staff Reporter">Staff Reporter</option>
                                <option value="HEXA NEWS Admin">HEXA NEWS Admin</option>
                                <option value="Chief Editor">Chief Editor</option>
                              </>
                            )}
                          </select>
                        </div>
                      </div>


                      {/* Date & Read Time (2-cols) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">
                            Date
                          </label>
                          <input
                            type="text"
                            value={artForm.date || ''}
                            onChange={(e) => setArtForm({ ...artForm, date: e.target.value })}
                            placeholder="e.g., June 27, 2026"
                            className="w-full px-3.5 py-2.5 bg-white border border-[#d1d5db] rounded-lg text-sm text-[#111827] outline-none focus:border-[#c91f26] focus:ring-1 focus:ring-[#c91f26] transition"
                          />
                        </div>

                        <div>
                          <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">
                            Read Time
                          </label>
                          <input
                            type="text"
                            value={artForm.readTime || ''}
                            onChange={(e) => setArtForm({ ...artForm, readTime: e.target.value })}
                            placeholder="e.g., 4 min read"
                            className="w-full px-3.5 py-2.5 bg-white border border-[#d1d5db] rounded-lg text-sm text-[#111827] outline-none focus:border-[#c91f26] focus:ring-1 focus:ring-[#c91f26] transition"
                          />
                        </div>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: Media & Display */}
                    <div className="space-y-5">
                      <h4 className="text-[16px] font-bold text-[#1f2937]">Media & Display</h4>

                      {/* Image URL or Upload */}
                      <div>
                        <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">
                          Image URL or Upload
                        </label>
                        <input
                          type="text"
                          value={artForm.image || ''}
                          onChange={(e) => setArtForm({ ...artForm, image: e.target.value })}
                          placeholder="https://... or /uploads/..."
                          className="w-full px-3.5 py-2.5 bg-white border border-[#d1d5db] rounded-lg text-sm text-[#111827] outline-none focus:border-[#c91f26] focus:ring-1 focus:ring-[#c91f26] transition mb-2"
                        />
                        <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#064e3b] hover:bg-[#043d2e] text-white text-xs font-semibold rounded-lg cursor-pointer transition shadow-sm">
                          <i className="bi bi-upload"></i>
                          <span>Upload Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileUpload}
                            className="hidden"
                          />
                        </label>
                        {artForm.image && (
                          <div className="mt-3 h-28 w-44 rounded-lg overflow-hidden border border-[#e5e7eb] shadow-sm">
                            <img src={artForm.image} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>

                      {/* Gallery Images (multiple) */}
                      <div>
                        <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">
                          Gallery Images (multiple)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={galleryInput}
                            onChange={(e) => setGalleryInput(e.target.value)}
                            placeholder="Image URL"
                            className="flex-1 px-3.5 py-2.5 bg-white border border-[#d1d5db] rounded-lg text-sm text-[#111827] outline-none focus:border-[#c91f26] focus:ring-1 focus:ring-[#c91f26] transition"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (galleryInput.trim()) {
                                setArtForm({
                                  ...artForm,
                                  gallery: [...(artForm.gallery || []), galleryInput.trim()],
                                });
                                setGalleryInput('');
                              }
                            }}
                            className="px-4 py-2.5 bg-[#e5e7eb] hover:bg-[#d1d5db] text-[#374151] text-xs font-semibold rounded-lg transition"
                          >
                            + Add URL
                          </button>
                          <label className="px-4 py-2.5 bg-[#064e3b] hover:bg-[#043d2e] text-white text-xs font-semibold rounded-lg cursor-pointer transition flex items-center gap-1.5 shadow-sm">
                            <i className="bi bi-upload"></i>
                            <span>Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleGalleryFileUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                        {/* Gallery Thumbnails */}
                        {artForm.gallery && artForm.gallery.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2.5">
                            {artForm.gallery.map((gUrl, gIdx) => (
                              <div key={gIdx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-[#d1d5db] group">
                                <img src={gUrl} alt={`Gallery ${gIdx}`} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setArtForm({
                                      ...artForm,
                                      gallery: artForm.gallery.filter((_, idx) => idx !== gIdx),
                                    });
                                  }}
                                  className="absolute top-0.5 right-0.5 bg-black/70 hover:bg-red-600 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] transition"
                                  title="Remove image"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Media Type & Video URL (2-cols) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">
                            Media Type
                          </label>
                          <select
                            value={artForm.media || 'standard'}
                            onChange={(e) => setArtForm({ ...artForm, media: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-white border border-[#d1d5db] rounded-lg text-sm text-[#111827] outline-none focus:border-[#c91f26] focus:ring-1 focus:ring-[#c91f26] transition"
                          >
                            <option value="standard">Standard</option>
                            <option value="video">Video</option>
                            <option value="gallery">Gallery</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">
                            Video URL (YouTube, Vimeo, etc.)
                          </label>
                          <input
                            type="text"
                            value={artForm.videoUrl || ''}
                            onChange={(e) => setArtForm({ ...artForm, videoUrl: e.target.value })}
                            placeholder="Paste any video link: YouTube..."
                            className="w-full px-3.5 py-2.5 bg-white border border-[#d1d5db] rounded-lg text-sm text-[#111827] outline-none focus:border-[#c91f26] focus:ring-1 focus:ring-[#c91f26] transition"
                          />
                        </div>
                      </div>

                      {/* Simple Placement Checkboxes without separate highlighted box */}
                      {/* Featured Checkbox */}
                      <div className="pt-2">
                        <label className="flex items-center gap-2 cursor-pointer text-[13px] font-semibold text-[#1f2937]">
                          <input
                            type="checkbox"
                            checked={!!artForm.featured}
                            onChange={(e) => setArtForm({ ...artForm, featured: e.target.checked })}
                            className="w-4 h-4 text-[#c91f26] rounded border-[#d1d5db] focus:ring-[#c91f26] cursor-pointer"
                          />
                          <span>🌟 Featured Story (Main Home Page Carousel)</span>
                        </label>
                      </div>

                      {/* Title Background Color swatch */}
                      <div className="pt-2">
                        <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">
                          Title / Badge Background Color
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={artForm.backgroundColor || '#c91f26'}
                            onChange={(e) => setArtForm({ ...artForm, backgroundColor: e.target.value })}
                            className="w-9 h-9 p-0.5 rounded border border-[#d1d5db] cursor-pointer"
                          />
                          <span className="text-xs font-mono text-[#6b7280]">
                            {artForm.backgroundColor || '#c91f26'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CONTENT SECTION (Full-Width Card Below) */}
                  <div className="pt-6 border-t border-[#e5e7eb] space-y-4">
                    <h4 className="text-[16px] font-bold text-[#1f2937]">Content</h4>

                    <div>
                      <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">
                        Body Content *
                      </label>
                      <HtmlEditor
                        value={artForm.content}
                        onChange={(content) => setArtForm({ ...artForm, content })}
                        placeholder="Write the full news content here..."
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">
                        Tags <span className="text-xs text-[#6b7280] font-normal">(comma separated)</span>
                      </label>
                      <input
                        type="text"
                        value={artForm.tags || ''}
                        onChange={(e) => setArtForm({ ...artForm, tags: e.target.value })}
                        placeholder="e.g., kerala, rain, alert"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#d1d5db] rounded-lg text-sm text-[#111827] outline-none focus:border-[#c91f26] focus:ring-1 focus:ring-[#c91f26] transition"
                      />
                    </div>
                  </div>

                  {/* BOTTOM ACTIONS (Matching image: Red Publish News + Cancel) */}
                  <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#e5e7eb]">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#c91f26] hover:bg-[#a8191f] text-white text-sm font-semibold rounded-lg shadow-sm transition active:scale-[0.98] cursor-pointer"
                    >
                      <i className="bi bi-floppy"></i>
                      <span>{editingArticleId ? 'Update Article' : 'Publish News'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewsView('list');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-5 py-2.5 bg-[#e5e7eb] hover:bg-[#d1d5db] text-[#374151] text-sm font-semibold rounded-lg transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                {/* Filter & Search Bar matching screenshot */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-[#e2e8f0] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              {/* Search input with icon */}
              <div className="relative flex-1 w-full">
                <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] text-sm"></i>
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-sm text-[#0f172a] placeholder-[#94a3b8] outline-none focus:border-[#c91f26] focus:bg-white transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] text-sm cursor-pointer"
                  >
                    <i className="bi bi-x-circle-fill"></i>
                  </button>
                )}
              </div>

              {/* Category dropdown with filter icon */}
              <div className="relative w-full sm:w-64">
                <i className="bi bi-funnel absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-sm pointer-events-none"></i>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-sm font-medium text-[#334155] outline-none focus:border-[#c91f26] focus:bg-white appearance-none cursor-pointer transition"
                >
                  <option value="ALL">All Categories</option>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat.slug || cat.label}>
                      {cat.label || cat.slug}
                    </option>
                  ))}
                </select>
                <i className="bi bi-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-xs pointer-events-none"></i>
              </div>

              {/* Secondary Add News button matching right filter element */}
              <button
                type="button"
                onClick={openNewArticleModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#c91f26] hover:bg-[#a8191f] text-white text-sm font-semibold rounded-xl shadow-sm transition active:scale-[0.98] cursor-pointer"
              >
                <i className="bi bi-plus-lg font-bold"></i>
                <span>Add News</span>
              </button>
            </div>

            {/* Content: Cards Grid View */}
            {filteredArticles.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#e2e8f0] p-16 text-center shadow-sm">
                <div className="w-16 h-16 rounded-full bg-[#f1f5f9] flex items-center justify-center mx-auto mb-4 text-[#94a3b8] text-2xl">
                  <i className="bi bi-newspaper"></i>
                </div>
                <h4 className="text-base font-bold text-[#0f172a] mb-1">No news articles found</h4>
                <p className="text-xs text-[#64748b] max-w-sm mx-auto mb-6">
                  {searchQuery || selectedCategory !== 'ALL'
                    ? 'No articles match your current search and category filters. Try clearing your search.'
                    : 'Get started by creating your first article.'}
                </p>
                {searchQuery || selectedCategory !== 'ALL' ? (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}
                    className="px-4 py-2 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#334155] text-xs font-semibold rounded-lg transition cursor-pointer"
                  >
                    Clear Filters
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={openNewArticleModal}
                    className="px-5 py-2.5 bg-[#c91f26] hover:bg-[#a8191f] text-white text-xs font-semibold rounded-lg transition shadow-sm cursor-pointer"
                  >
                    + Create First Article
                  </button>
                )}
              </div>
            ) : (
              /* GRID CARDS VIEW (Matching user screenshot) */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedArticles.map((a, idx) => {
                  const cardId = a._id || a.slug || idx;
                  const categoryName = a.categoryMl || a.category || 'News';
                  const dateStr = a.date ? (a.date.includes('T') ? a.date.split('T')[0] : a.date) : '2026-10-12';
                  const viewsCount = a.views || 0;
                  const isFeatured = a.featured === true;
                  const cleanExcerpt = a.excerpt || (a.content ? a.content.replace(/<[^>]*>/g, '').slice(0, 140) : '');

                  return (
                    <div
                      key={cardId}
                      className="bg-white rounded-2xl border border-[#e2e8f0] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.07)] hover:border-[#cbd5e1] transition-all duration-300 overflow-hidden flex flex-col group"
                    >
                      {/* Image with Tag / Badge */}
                      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#f1f5f9]">
                        <img
                          src={a.image || '/images/blog/1.jpg'}
                          alt={a.title}
                          onError={(e) => { e.target.src = '/images/blog/1.jpg'; }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        {/* Top-Right Badge: FEATURED or STANDARD */}
                        <div className="absolute top-3 right-3">
                          {isFeatured ? (
                            <span className="inline-block px-2.5 py-1 bg-[#f59e0b] text-[#1c1917] text-[10px] font-black uppercase tracking-wider rounded-md shadow-sm">
                              FEATURED
                            </span>
                          ) : (
                            <span className="inline-block px-2.5 py-1 bg-[#1e293b]/90 text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm backdrop-blur-sm">
                              STANDARD
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Category (Red) & Date | Views (Gray) */}
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="font-bold text-[#c91f26] uppercase tracking-wide truncate max-w-[150px]">
                              {categoryName}
                            </span>
                            <span className="text-[#94a3b8] font-medium flex items-center gap-1.5 shrink-0 text-[11px]">
                              <span>{dateStr}</span>
                              <span>|</span>
                              <span className="flex items-center gap-1">
                                <i className="bi bi-eye"></i>
                                <span>{viewsCount}</span>
                              </span>
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className="font-bold text-[#0f172a] text-[15px] sm:text-[16px] leading-snug line-clamp-2 mb-2 group-hover:text-[#c91f26] transition-colors">
                            <Link to={`/post-detail?slug=${a.slug}`} target="_blank">
                              {a.title}
                            </Link>
                          </h4>

                          {/* Excerpt */}
                          <p className="text-xs text-[#64748b] line-clamp-2 leading-relaxed mb-4">
                            {cleanExcerpt || 'No excerpt available for this article.'}
                          </p>
                        </div>

                        {/* Action Buttons (Right-aligned, eye, edit, delete) */}
                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#f1f5f9]">
                          <Link
                            to={`/post-detail?slug=${a.slug}`}
                            target="_blank"
                            className="w-8 h-8 rounded-lg bg-[#ecfdf5] text-[#059669] hover:bg-[#d1fae5] flex items-center justify-center transition shadow-sm"
                            title="View live article"
                          >
                            <i className="bi bi-eye text-sm"></i>
                          </Link>

                          <button
                            type="button"
                            onClick={() => openEditArticleModal(a)}
                            className="w-8 h-8 rounded-lg bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] flex items-center justify-center transition shadow-sm cursor-pointer"
                            title="Edit article"
                          >
                            <i className="bi bi-pencil text-sm"></i>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteArticle(a._id || a.slug)}
                            className="w-8 h-8 rounded-lg bg-[#fef2f2] text-[#dc2626] hover:bg-[#fee2e2] flex items-center justify-center transition shadow-sm cursor-pointer"
                            title="Delete article"
                          >
                            <i className="bi bi-trash text-sm"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Component (10 cards per page) matching screenshot */}
            {filteredArticles.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  const anchor = document.getElementById('news-management-top');
                  if (anchor) {
                    anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              />
            )}

            {/* 4 Bottom Stats Cards matching user screenshot */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <div className="text-[32px] sm:text-[38px] font-extrabold text-[#c91f26] leading-none mb-2">
                  {stats.articles || articles.length}
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#64748b]">Total News</div>
              </div>

              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <div className="text-[32px] sm:text-[38px] font-extrabold text-[#c91f26] leading-none mb-2">
                  {featuredCount}
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#64748b]">Featured</div>
              </div>

              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <div className="text-[32px] sm:text-[38px] font-extrabold text-[#c91f26] leading-none mb-2">
                  {categories.length || stats.categories}
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#64748b]">Categories</div>
              </div>

              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <div className="text-[32px] sm:text-[38px] font-extrabold text-[#c91f26] leading-none mb-2">
                  {stats.views ? stats.views.toLocaleString() : '0'}
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#64748b]">Total Views</div>
              </div>
            </div>
          </>
        )}
      </div>
    )}

        {/* TAB 3: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="bg-white border border-[#e5e5e5] rounded-[12px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[18px] font-bold text-[#111111]">Categories</h3>
              <button
                type="button"
                onClick={() => {
                  setCatForm({ id: '', label: '', slug: '' });
                  setCategoryModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#c91f26] hover:bg-[#a8191f] text-white text-[13px] font-semibold rounded-[8px] transition cursor-pointer"
              >
                <i className="bi bi-plus-lg"></i>
                <span>New Category</span>
              </button>
            </div>

            {categories.length === 0 ? (
              <div className="py-16 text-center text-[#888888] text-[14px]">
                No categories found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b-2 border-[#eeeeee] text-[12px] text-[#888888] uppercase tracking-[1px]">
                      <th className="py-3 px-3.5">ID</th>
                      <th className="py-3 px-3.5">Label</th>
                      <th className="py-3 px-3.5">Slug</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f0f0]">
                    {categories.map((c, idx) => (
                      <tr key={idx} className="hover:bg-[#fafafa]">
                        <td className="py-3 px-3.5 font-mono text-[12px] text-[#555555]">
                          {c.id || c._id}
                        </td>
                        <td className="py-3 px-3.5 font-semibold text-[#111111]">
                          {c.label}
                        </td>
                        <td className="py-3 px-3.5 text-[#555555]">{c.slug}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: AUTHORS */}
        {activeTab === 'authors' && (
          <div className="bg-white border border-[#e5e5e5] rounded-[12px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[18px] font-bold text-[#111111]">Authors</h3>
              <button
                type="button"
                onClick={() => {
                  setAuthorForm({ name: '', role: 'Reporter', bio: '' });
                  setAuthorModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#c91f26] hover:bg-[#a8191f] text-white text-[13px] font-semibold rounded-[8px] transition cursor-pointer"
              >
                <i className="bi bi-plus-lg"></i>
                <span>New Author</span>
              </button>
            </div>

            {authors.length === 0 ? (
              <div className="py-16 text-center text-[#888888] text-[14px]">
                No authors found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b-2 border-[#eeeeee] text-[12px] text-[#888888] uppercase tracking-[1px]">
                      <th className="py-3 px-3.5">Name</th>
                      <th className="py-3 px-3.5">Role</th>
                      <th className="py-3 px-3.5">Bio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f0f0]">
                    {authors.map((a, idx) => (
                      <tr key={idx} className="hover:bg-[#fafafa]">
                        <td className="py-3 px-3.5 font-semibold text-[#111111]">{a.name}</td>
                        <td className="py-3 px-3.5 text-[#555555]">{a.role || 'Writer'}</td>
                        <td className="py-3 px-3.5 text-[#555555] max-w-[300px] truncate">
                          {a.bio || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white border border-[#e5e5e5] rounded-[12px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] max-w-2xl">
            <h3 className="text-[18px] font-bold text-[#111111] mb-5">Site Settings</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast('Settings saved successfully!', 'success');
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-[12px] font-semibold text-[#555555] uppercase tracking-wider mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#f9f9f9] border border-[#dddddd] rounded-[8px] text-[13px] text-[#111111] outline-none focus:border-[#c91f26]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#555555] uppercase tracking-wider mb-1">
                  Site Description
                </label>
                <input
                  type="text"
                  value={settings.siteDescription}
                  onChange={(e) =>
                    setSettings({ ...settings, siteDescription: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#f9f9f9] border border-[#dddddd] rounded-[8px] text-[13px] text-[#111111] outline-none focus:border-[#c91f26]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#555555] uppercase tracking-wider mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#f9f9f9] border border-[#dddddd] rounded-[8px] text-[13px] text-[#111111] outline-none focus:border-[#c91f26]"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#c91f26] hover:bg-[#a8191f] text-white text-[13px] font-semibold rounded-[8px] transition cursor-pointer"
              >
                Save Settings
              </button>
            </form>
          </div>
        )}
      </main>

      {/* ==========================================
          MODALS
      ========================================== */}



      {/* Category Modal */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl">
            <button
              type="button"
              onClick={() => setCategoryModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-[#c91f26] text-xl"
            >
              <i className="bi bi-x-lg"></i>
            </button>

            <h3 className="text-[18px] font-bold text-[#111111] mb-5">New Category</h3>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-[13px]">
              <div>
                <label className="block text-[12px] font-semibold text-[#888888] mb-1">
                  Category ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. business"
                  value={catForm.id}
                  onChange={(e) => setCatForm({ ...catForm, id: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f9f9f9] border border-[#dddddd] rounded-lg text-sm text-[#111111] outline-none focus:border-[#c91f26]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#888888] mb-1">
                  Label *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Business"
                  value={catForm.label}
                  onChange={(e) => setCatForm({ ...catForm, label: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f9f9f9] border border-[#dddddd] rounded-lg text-sm text-[#111111] outline-none focus:border-[#c91f26]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2 border border-[#dddddd] text-[#666666] text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#c91f26] hover:bg-[#a8191f] text-white text-xs font-semibold rounded-lg"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Author Modal */}
      {authorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl">
            <button
              type="button"
              onClick={() => setAuthorModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-[#c91f26] text-xl"
            >
              <i className="bi bi-x-lg"></i>
            </button>

            <h3 className="text-[18px] font-bold text-[#111111] mb-5">New Author</h3>

            <form onSubmit={handleSaveAuthor} className="space-y-4 text-[13px]">
              <div>
                <label className="block text-[12px] font-semibold text-[#888888] mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Author Name"
                  value={authorForm.name}
                  onChange={(e) => setAuthorForm({ ...authorForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f9f9f9] border border-[#dddddd] rounded-lg text-sm text-[#111111] outline-none focus:border-[#c91f26]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#888888] mb-1">
                  Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Reporter"
                  value={authorForm.role}
                  onChange={(e) => setAuthorForm({ ...authorForm, role: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f9f9f9] border border-[#dddddd] rounded-lg text-sm text-[#111111] outline-none focus:border-[#c91f26]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setAuthorModalOpen(false)}
                  className="px-4 py-2 border border-[#dddddd] text-[#666666] text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#c91f26] hover:bg-[#a8191f] text-white text-xs font-semibold rounded-lg"
                >
                  Save Author
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

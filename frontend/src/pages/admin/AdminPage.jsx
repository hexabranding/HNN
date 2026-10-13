import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchApi } from '../../services/api';

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
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Article Modal State
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState(null);
  const [artForm, setArtForm] = useState({
    title: '',
    category: 'Technology',
    author: 'Staff Reporter',
    excerpt: '',
    content: '',
    image: '',
    tags: '',
    readTime: '4 min read',
    featured: false,
    breaking: false,
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
        fetchApi('/news?limit=100').catch(() => null),
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

  // Article Modal Actions
  const openNewArticleModal = () => {
    setEditingArticleId(null);
    setArtForm({
      title: '',
      category: categories[0]?.label || 'Technology',
      author: user?.name || 'HEXA NEWS Admin',
      excerpt: '',
      content: '',
      image: '',
      tags: '',
      readTime: '4 min read',
      featured: false,
      breaking: false,
      published: true,
    });
    setArticleModalOpen(true);
  };

  const openEditArticleModal = (art) => {
    setEditingArticleId(art._id || art.slug);
    setArtForm({
      title: art.title || '',
      category: art.category || 'Technology',
      author: art.author || 'Staff Reporter',
      excerpt: art.excerpt || art.description || '',
      content: art.content || art.description || '',
      image: art.image || '',
      tags: Array.isArray(art.tags) ? art.tags.join(', ') : art.tags || '',
      readTime: art.readTime || '4 min read',
      featured: !!art.featured,
      breaking: !!art.breaking,
      published: art.published !== false,
    });
    setArticleModalOpen(true);
  };

  const handleSaveArticle = async (e) => {
    e.preventDefault();
    if (!artForm.title || !artForm.category || !artForm.content) {
      showToast('Title, category, and content are required', 'error');
      return;
    }

    const payload = {
      ...artForm,
      tags: artForm.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
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
      setArticleModalOpen(false);
      loadDashboardData();
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
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

  const filteredArticles = articles.filter(
    (a) =>
      !searchQuery ||
      a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              { id: 'articles', label: 'Articles', icon: 'bi-newspaper' },
              { id: 'categories', label: 'Categories', icon: 'bi-tags' },
              { id: 'authors', label: 'Authors', icon: 'bi-people' },
              { id: 'settings', label: 'Settings', icon: 'bi-gear' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
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

        {/* TAB 2: ARTICLES */}
        {activeTab === 'articles' && (
          <div className="bg-white border border-[#e5e5e5] rounded-[12px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[18px] font-bold text-[#111111]">All Articles</h3>
              <button
                type="button"
                onClick={openNewArticleModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#c91f26] hover:bg-[#a8191f] text-white text-[13px] font-semibold rounded-[8px] transition cursor-pointer"
              >
                <i className="bi bi-plus-lg"></i>
                <span>New Article</span>
              </button>
            </div>

            <div className="mb-5 flex gap-2">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-[#f9f9f9] border border-[#dddddd] rounded-[8px] text-[13px] text-[#111111] outline-none focus:border-[#c91f26]"
              />
            </div>

            {filteredArticles.length === 0 ? (
              <div className="py-16 text-center text-[#888888] text-[14px]">
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
                      <th className="py-3 px-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f0f0]">
                    {filteredArticles.map((a, idx) => (
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
                        <td className="py-3 px-3.5 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => openEditArticleModal(a)}
                            className="p-1.5 px-2.5 border border-[#dddddd] rounded-[6px] text-[#666666] hover:border-[#c91f26] hover:text-[#c91f26] transition"
                            title="Edit"
                          >
                            <i className="bi bi-pencil text-[12px]"></i>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteArticle(a._id || a.slug)}
                            className="p-1.5 px-2.5 bg-[#c62828] text-white rounded-[6px] hover:bg-[#b71c1c] transition"
                            title="Delete"
                          >
                            <i className="bi bi-trash text-[12px]"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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

      {/* Article Modal */}
      {articleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button
              type="button"
              onClick={() => setArticleModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-[#c91f26] text-xl"
            >
              <i className="bi bi-x-lg"></i>
            </button>

            <h3 className="text-[18px] font-bold text-[#111111] mb-5">
              {editingArticleId ? 'Edit Article' : 'New Article'}
            </h3>

            <form onSubmit={handleSaveArticle} className="space-y-4 text-[13px]">
              <div>
                <label className="block text-[12px] font-semibold text-[#888888] mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={artForm.title}
                  onChange={(e) => setArtForm({ ...artForm, title: e.target.value })}
                  placeholder="Article title"
                  className="w-full px-3 py-2 bg-[#f9f9f9] border border-[#dddddd] rounded-lg text-sm text-[#111111] outline-none focus:border-[#c91f26]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#888888] mb-1">
                    Category *
                  </label>
                  <select
                    value={artForm.category}
                    onChange={(e) => setArtForm({ ...artForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#f9f9f9] border border-[#dddddd] rounded-lg text-sm text-[#111111] outline-none focus:border-[#c91f26]"
                  >
                    {categories.length > 0 ? (
                      categories.map((c, i) => (
                        <option key={i} value={c.label}>
                          {c.label}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Technology">Technology</option>
                        <option value="Business">Business</option>
                        <option value="Sports">Sports</option>
                        <option value="Health">Health</option>
                        <option value="Asia">Asia</option>
                        <option value="Europe">Europe</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[#888888] mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    value={artForm.author}
                    onChange={(e) => setArtForm({ ...artForm, author: e.target.value })}
                    className="w-full px-3 py-2 bg-[#f9f9f9] border border-[#dddddd] rounded-lg text-sm text-[#111111] outline-none focus:border-[#c91f26]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#888888] mb-1">
                  Excerpt
                </label>
                <textarea
                  rows={2}
                  value={artForm.excerpt}
                  onChange={(e) => setArtForm({ ...artForm, excerpt: e.target.value })}
                  placeholder="Short description"
                  className="w-full px-3 py-2 bg-[#f9f9f9] border border-[#dddddd] rounded-lg text-sm text-[#111111] outline-none focus:border-[#c91f26]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#888888] mb-1">
                  Content *
                </label>
                <textarea
                  rows={5}
                  required
                  value={artForm.content}
                  onChange={(e) => setArtForm({ ...artForm, content: e.target.value })}
                  placeholder="Full article content"
                  className="w-full px-3 py-2 bg-[#f9f9f9] border border-[#dddddd] rounded-lg text-sm text-[#111111] outline-none focus:border-[#c91f26]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#888888] mb-1">
                    <i className="bi bi-link-45deg"></i> Image URL
                  </label>
                  <input
                    type="text"
                    value={artForm.image}
                    onChange={(e) => setArtForm({ ...artForm, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-[#f9f9f9] border border-[#dddddd] rounded-lg text-sm text-[#111111] outline-none focus:border-[#c91f26]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[#888888] mb-1">
                    <i className="bi bi-upload"></i> Or Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="w-full px-3 py-1.5 bg-[#f9f9f9] border border-[#dddddd] rounded-lg text-xs text-[#555555] file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-[#c91f26] file:text-white"
                  />
                </div>
              </div>

              {artForm.image && (
                <div className="mt-2 h-28 w-full rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={artForm.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setArticleModalOpen(false)}
                  className="px-4 py-2 border border-[#dddddd] text-[#666666] text-xs font-semibold rounded-lg hover:border-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#c91f26] hover:bg-[#a8191f] text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

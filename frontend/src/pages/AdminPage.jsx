import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchApi } from '../services/api';

export default function AdminPage() {
  const [token, setToken] = useState(localStorage.getItem('hexa_admin_token') || '');
  const [user, setUser] = useState(null);

  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Dashboard state
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [modalForm, setModalForm] = useState({
    title: '',
    slug: '',
    category: 'Technology',
    author: 'Admin',
    description: '',
    content: '',
    image: '',
  });

  // Check login on load
  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((data) => {
          if (data && data.user) setUser(data.user);
        })
        .catch(() => {
          // Keep token for demonstration or fallback
        });
      loadAdminArticles();
    }
  }, [token]);

  const loadAdminArticles = async () => {
    setLoadingArticles(true);
    try {
      const res = await fetchApi('/news?limit=50');
      if (res && res.news) {
        setArticles(res.news);
      }
    } catch (err) {
      console.warn('Failed to load articles for admin:', err);
    } finally {
      setLoadingArticles(false);
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
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      localStorage.setItem('hexa_admin_token', data.token);
      setToken(data.token);
      setUser(data.user);
      loadAdminArticles();
    } catch (err) {
      setLoginError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('hexa_admin_token');
    setToken('');
    setUser(null);
  };

  const openCreateModal = () => {
    setEditingArticle(null);
    setModalForm({
      title: '',
      slug: '',
      category: 'Technology',
      author: user?.name || 'Admin',
      description: '',
      content: '',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    });
    setModalOpen(true);
  };

  const openEditModal = (art) => {
    setEditingArticle(art);
    setModalForm({
      title: art.title || '',
      slug: art.slug || '',
      category: art.category || 'Technology',
      author: art.author || 'Admin',
      description: art.description || art.excerpt || '',
      content: art.content || art.description || '',
      image: art.image || '',
    });
    setModalOpen(true);
  };

  const handleSaveArticle = async (e) => {
    e.preventDefault();
    const endpoint = editingArticle ? `/news/${editingArticle._id || editingArticle.slug}` : '/news';
    const method = editingArticle ? 'PUT' : 'POST';

    try {
      const res = await fetch(`/api${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(modalForm),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
      }

      setModalOpen(false);
      loadAdminArticles();
    } catch (err) {
      alert(`Error saving article: ${err.message}`);
    }
  };

  const handleDeleteArticle = async (art) => {
    if (!window.confirm(`Are you sure you want to delete "${art.title}"?`)) return;

    try {
      await fetch(`/api/news/${art._id || art.slug}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      loadAdminArticles();
    } catch (err) {
      alert(`Error deleting article: ${err.message}`);
    }
  };

  // Filtered articles
  const filteredArticles = articles.filter((a) => {
    const matchesSearch =
      !searchQuery ||
      a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.author?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      selectedCategory === 'all' ||
      a.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  // IF NOT LOGGED IN: Render Login Screen matching admin.html
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[linear-gradient(135deg,#111111_0%,#1a1a1a_50%,#222222_100%)]">
        <div className="w-full max-w-[420px] bg-white rounded-2xl p-8 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-gray-200">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-3">
              <img
                src="/images/logo%20hexa.png"
                alt="HEXA NEWS"
                className="h-12 w-auto object-contain mx-auto"
              />
            </Link>
            <h2 className="font-['Prompt',sans-serif] text-2xl font-bold text-gray-900 mb-1">
              Admin Portal
            </h2>
            <p className="text-xs text-gray-500">
              Sign in to manage news publications & content
            </p>
          </div>

          {loginError && (
            <div className="p-3 mb-5 rounded-lg bg-red-50 border border-red-200 text-xs text-[#c91f26] font-medium text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Username / Email
              </label>
              <input
                type="text"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none focus:border-[#c91f26] focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none focus:border-[#c91f26] focus:bg-white transition"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 bg-[#c91f26] hover:bg-[#a8191f] text-white font-['Prompt',sans-serif] font-bold text-sm uppercase tracking-wider rounded-lg shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {loggingIn ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
            <Link to="/" className="text-[#c91f26] hover:underline font-medium">
              ← Return to public website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // IF LOGGED IN: Render Admin Dashboard
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex">
      {/* 1. Sidebar matching admin.html */}
      <aside className="w-64 bg-[#111111] text-gray-300 flex flex-col justify-between fixed inset-y-0 left-0 z-30 border-r border-[#222222]">
        <div>
          {/* Logo area */}
          <div className="p-6 border-b border-[#222222] flex items-center gap-3">
            <img src="/images/logo%20hexa.png" alt="HEXA" className="h-8 w-auto object-contain" />
            <span className="font-['Prompt',sans-serif] font-bold text-[#c91f26] text-base tracking-wide">
              Admin Portal
            </span>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            <a
              href="#articles"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold bg-[#c91f26]/15 text-white border-r-4 border-[#c91f26]"
            >
              <i className="bi bi-newspaper text-base text-[#c91f26]"></i>
              <span>Articles</span>
            </a>
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition"
            >
              <i className="bi bi-box-arrow-up-right text-base"></i>
              <span>View Website</span>
            </Link>
          </nav>
        </div>

        {/* User info & Logout */}
        <div className="p-4 border-t border-[#222222]">
          <div className="mb-3 px-2 text-xs text-gray-400">
            Signed in as <strong className="text-white">{user?.username || 'admin'}</strong>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 bg-[#c91f26]/10 hover:bg-[#c91f26] text-[#c91f26] hover:text-white border border-[#c91f26]/30 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 ml-64 p-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-gray-200 gap-4">
          <div>
            <h1 className="font-['Prompt',sans-serif] text-2xl sm:text-3xl font-bold text-gray-900">
              Articles Management
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Create, edit, and organize news stories published across HEXA NEWS
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c91f26] hover:bg-[#a8191f] text-white font-['Prompt',sans-serif] font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all cursor-pointer"
          >
            <i className="bi bi-plus-lg"></i>
            <span>Create New Article</span>
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { num: articles.length || 32, label: 'Total Articles' },
            { num: '45.8K', label: 'Total Article Views' },
            { num: '8', label: 'Active Categories' },
            { num: '100%', label: 'API Uptime' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-center">
              <span className="block font-['Prompt',sans-serif] text-3xl font-extrabold text-[#c91f26]">
                {stat.num}
              </span>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mt-1 block">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full sm:w-auto">
            <i className="bi bi-search absolute left-3.5 top-3 text-gray-400 text-sm"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or author..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:border-[#c91f26] focus:bg-white"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:border-[#c91f26]"
          >
            <option value="all">All Categories</option>
            <option value="sports">Sports</option>
            <option value="health">Health</option>
            <option value="technology">Technology</option>
            <option value="business">Business</option>
            <option value="lifestyle">Lifestyle</option>
          </select>
        </div>

        {/* Articles Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {loadingArticles ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      Loading articles from database...
                    </td>
                  </tr>
                ) : filteredArticles.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      No articles match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredArticles.map((art, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={art.image || 'https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=120&q=80'}
                            alt="thumb"
                            className="w-12 h-10 object-cover rounded-md flex-shrink-0 bg-gray-200"
                          />
                          <span className="font-semibold text-gray-900 line-clamp-1 max-w-md">
                            {art.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 bg-red-50 text-[#c91f26] border border-red-100 rounded-full text-xs font-semibold">
                          {art.category || 'News'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-xs">{art.author || 'Staff'}</td>
                      <td className="py-3 px-4 text-gray-500 text-xs">
                        {art.date ? new Date(art.date).toLocaleDateString() : 'Jul 2026'}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(art)}
                          className="px-2.5 py-1 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(art)}
                          className="px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. Modal matching admin.html */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h3 className="font-['Prompt',sans-serif] text-xl font-bold text-gray-900">
                {editingArticle ? 'Edit Article' : 'Create New Article'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={modalForm.title}
                  onChange={(e) =>
                    setModalForm({
                      ...modalForm,
                      title: e.target.value,
                      slug: e.target.value
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/[\s_-]+/g, '-')
                        .replace(/^-+|-+$/g, ''),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none focus:border-[#c91f26]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={modalForm.slug}
                    onChange={(e) => setModalForm({ ...modalForm, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none focus:border-[#c91f26]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={modalForm.category}
                    onChange={(e) => setModalForm({ ...modalForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none focus:border-[#c91f26]"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Sports">Sports</option>
                    <option value="Health">Health</option>
                    <option value="Business">Business</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="International">International</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={modalForm.image}
                  onChange={(e) => setModalForm({ ...modalForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none focus:border-[#c91f26]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Short Excerpt
                </label>
                <textarea
                  rows={2}
                  value={modalForm.description}
                  onChange={(e) => setModalForm({ ...modalForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none focus:border-[#c91f26] resize-y"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Full Article Body
                </label>
                <textarea
                  rows={5}
                  value={modalForm.content}
                  onChange={(e) => setModalForm({ ...modalForm, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none focus:border-[#c91f26] resize-y"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#c91f26] hover:bg-[#a8191f] text-white rounded-lg text-sm font-semibold cursor-pointer"
                >
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

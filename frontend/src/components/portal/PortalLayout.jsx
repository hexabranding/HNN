import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { fetchApi, formatImageUrl } from '../../services/api';

export default function PortalLayout({ portalType = 'admin' }) {
  const isAuthor = portalType === 'author';
  const location = useLocation();
  const navigate = useNavigate();

  // Storage keys depending on portal type
  const tokenKey = isAuthor ? 'hexa_author_token' : 'hexa_token';
  const userKey = isAuthor ? 'hexa_author_user' : 'hexa_user';

  const [token, setToken] = useState(
    localStorage.getItem(tokenKey) || localStorage.getItem('hexa_token') || ''
  );
  const [user, setUser] = useState(
    (() => {
      try {
        return (
          JSON.parse(localStorage.getItem(userKey) || 'null') ||
          JSON.parse(localStorage.getItem('hexa_user') || 'null')
        );
      } catch {
        return null;
      }
    })()
  );

  // Login form state
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Shared Data State
  const [stats, setStats] = useState({
    articles: 0,
    categories: 0,
    authors: 0,
    views: 0,
  });
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Settings State (for Admin)
  const [settings, setSettings] = useState({
    siteName: 'HEXA NEWS',
    siteDescription: 'Latest Global & Regional News Portal',
    contactEmail: 'contact@hexanews.in',
  });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

  const loadData = async (forceClear = false) => {
    try {
      if (forceClear) {
        clearApiCache('/news');
        clearApiCache('/categories');
        clearApiCache('/authors');
      }
      const [statsRes, artRes, catRes, authRes] = await Promise.all([
        fetchApi('/news/stats', { skipCache: true }).catch(() => null),
        fetchApi('/news?limit=200', { skipCache: true }).catch(() => null),
        fetchApi('/categories', { skipCache: true }).catch(() => null),
        fetchApi('/authors', { skipCache: true }).catch(() => null),
      ]);

      const newsList = artRes?.news || (Array.isArray(artRes) ? artRes : []);
      const catList = Array.isArray(catRes) ? catRes : [];
      const authList = Array.isArray(authRes) ? authRes : [];

      setArticles(newsList);
      setCategories(catList);
      setAuthors(authList);

      setStats({
        articles: statsRes?.articles ?? (artRes?.total || newsList.length),
        categories: statsRes?.categories ?? catList.length,
        authors: statsRes?.authors ?? authList.length,
        views: statsRes?.views ?? newsList.reduce((acc, curr) => acc + (curr.views || 0), 0),
      });
    } catch (err) {
      console.warn('Portal data load warning:', err);
    }
  };

  const clearSession = (reason = '') => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
    localStorage.removeItem('hexa_token');
    localStorage.removeItem('hexa_admin_token');
    localStorage.removeItem('hexa_author_token');
    localStorage.removeItem('hexa_user');
    localStorage.removeItem('hexa_author_user');
    setToken('');
    setUser(null);
    if (reason) {
      setLoginError(reason);
    }
  };

  // Verify and hydrate session from token
  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => {
          if (r.status === 401) {
            clearSession('Your session has expired or is invalid. Please sign in again.');
            return null;
          }
          return r.ok ? r.json() : null;
        })
        .then((data) => {
          if (data && data.user) {
            setUser(data.user);
            localStorage.setItem(userKey, JSON.stringify(data.user));
            localStorage.setItem('hexa_user', JSON.stringify(data.user));
          }
        })
        .catch(() => {
          // Keep cached user if offline or network hiccup
        });

      loadData();
    }
  }, [token]);

  // Listen to global 401 expiration events from any API call
  useEffect(() => {
    const handleAuthExpired = () => {
      clearSession('Your session has expired. Please sign in again.');
    };
    window.addEventListener('hexa_auth_expired', handleAuthExpired);
    return () => window.removeEventListener('hexa_auth_expired', handleAuthExpired);
  }, []);

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

      localStorage.setItem(tokenKey, data.token);
      localStorage.setItem(userKey, JSON.stringify(data.user));
      localStorage.setItem('hexa_token', data.token);
      localStorage.setItem('hexa_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      showToast(`Welcome back, ${data.user.name || 'User'}!`, 'success');
      loadData();

      // Smart role-based redirect: send authors to author workstation and admins to admin panel
      if (data.user?.isAuthor && !isAuthor) {
        navigate('/author-dashboard');
      } else if (!data.user?.isAuthor && isAuthor) {
        navigate('/admin');
      }
    } catch (err) {
      setLoginError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoggingIn(false);
    }
  };

  // Guard: If an author accesses /admin, redirect to /author-dashboard
  useEffect(() => {
    if (token && user?.isAuthor && !isAuthor) {
      navigate('/author-dashboard', { replace: true });
    }
  }, [token, user, isAuthor]);

  const handleLogout = () => {
    clearSession();
    navigate(isAuthor ? '/author-dashboard' : '/admin');
  };

  // Determine active section title
  const pathname = location.pathname.toLowerCase();
  let pageTitle = 'Dashboard';
  if (pathname.includes('/news') || pathname.includes('/articles')) {
    pageTitle = 'News Management';
  } else if (pathname.includes('/categor')) {
    pageTitle = 'Categories';
  } else if (pathname.includes('/author')) {
    pageTitle = isAuthor ? (pathname.includes('/settings') ? 'Profile & Settings' : 'Dashboard') : 'Authors';
  } else if (pathname.includes('/setting')) {
    pageTitle = isAuthor ? 'Profile & Settings' : 'Site Settings';
  }

  // Navigation Links definition
  const adminTabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'bi-grid',
      path: '/admin',
      isActive: pathname === '/admin' || pathname === '/admin/',
    },
    {
      id: 'articles',
      label: 'News Management',
      icon: 'bi-newspaper',
      path: '/admin/news',
      isActive: pathname.startsWith('/admin/news') || pathname.startsWith('/admin/articles'),
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: 'bi-tags',
      path: '/admin/categories',
      isActive: pathname.startsWith('/admin/categor'),
    },
    {
      id: 'authors',
      label: 'Authors',
      icon: 'bi-people',
      path: '/admin/authors',
      isActive: pathname.startsWith('/admin/author'),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'bi-gear',
      path: '/admin/settings',
      isActive: pathname.startsWith('/admin/setting'),
    },
  ];

  const authorTabs = [
    {
      id: 'dashboard',
      label: 'Home Dashboard',
      icon: 'bi-grid',
      path: '/author-dashboard',
      isActive: pathname === '/author-dashboard' || pathname === '/author-dashboard/',
    },
    {
      id: 'news',
      label: 'News Management',
      icon: 'bi-newspaper',
      path: '/author-dashboard/news',
      isActive: pathname.startsWith('/author-dashboard/news'),
    },
    {
      id: 'settings',
      label: 'Profile & Settings',
      icon: 'bi-gear',
      path: '/author-dashboard/settings',
      isActive: pathname.startsWith('/author-dashboard/settings'),
    },
  ];

  const currentTabs = isAuthor ? authorTabs : adminTabs;

  // Filter my articles for author mode
  const currentAuthorName = user?.name?.toLowerCase().trim() || '';
  const myArticles = articles.filter(
    (a) => a.author && a.author.toLowerCase().trim() === currentAuthorName
  );
  const totalMyViews = myArticles.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const publishedCount = myArticles.filter((a) => a.published !== false).length;

  const authorStats = {
    articlesCount: myArticles.length,
    viewsCount: totalMyViews,
    publishedCount,
    role: user?.role || (isAuthor ? 'Staff Reporter' : 'Administrator'),
  };

  // Avatar and Photo fallbacks
  const userPhoto = user?.photo ? formatImageUrl(user.photo) : null;
  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.name || (isAuthor ? 'Author' : 'Admin')
  )}&background=c91f26&color=fff&bold=true`;

  // ==========================================
  // VIEW 1: SIGN IN CARD (When unauthenticated)
  // ==========================================
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[linear-gradient(135deg,#111111_0%,#1a1a1a_50%,#222222_100%)]">
        <div className="w-full max-w-[420px] bg-white rounded-2xl px-7 py-8 sm:px-9 sm:py-9 shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-[#e0e0e0]">
          <div className="text-center mb-5">
            <Link to="/" className="inline-block mb-2.5">
              <img
                src="/images/logo%20hexa.png"
                alt="HEXA NEWS"
                className="h-11 w-auto object-contain mx-auto rounded-lg"
              />
            </Link>
            <h2 className="text-[22px] font-bold text-[#111111] mb-1 font-['Inter',sans-serif]">
              {isAuthor ? 'Author Portal' : 'Admin Panel'}
            </h2>
            <p className="text-[#777777] text-[13px] mb-4">
              {isAuthor
                ? 'Sign in to your journalist workstation'
                : 'Sign in to manage your news portal'}
            </p>

            {/* Portal Switcher Buttons: Admin & Author */}
            <div className="flex items-center p-1 bg-[#f1f5f9] rounded-xl border border-[#e2e8f0]">
              <button
                type="button"
                onClick={() => {
                  setLoginError('');
                  navigate('/admin');
                }}
                className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-[13px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  !isAuthor
                    ? 'bg-[#c91f26] text-white shadow-sm'
                    : 'text-[#64748b] hover:text-[#0f172a] hover:bg-white/60'
                }`}
              >
                <i className="bi bi-shield-lock-fill text-sm"></i>
                <span>Admin</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginError('');
                  navigate('/author-dashboard');
                }}
                className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-[13px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isAuthor
                    ? 'bg-[#c91f26] text-white shadow-sm'
                    : 'text-[#64748b] hover:text-[#0f172a] hover:bg-white/60'
                }`}
              >
                <i className="bi bi-pen-fill text-sm"></i>
                <span>Author</span>
              </button>
            </div>
          </div>

          {isAuthor && (
            <div className="px-3.5 py-2.5 mb-4 rounded-xl bg-blue-50/80 border border-blue-200/80 text-xs text-[#1e40af] flex items-center gap-2.5">
              <i className="bi bi-info-circle-fill shrink-0 text-[#2563eb] text-sm"></i>
              <span className="leading-snug">Author accounts are created by Admin. Use your assigned credentials.</span>
            </div>
          )}

          {loginError && (
            <div className="px-3.5 py-2.5 mb-4 rounded-lg bg-red-50 border border-red-200 text-xs text-[#c91f26] font-medium text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#555555] mb-1.5">
                {isAuthor ? 'Author Email or Name' : 'Username or Email'}
              </label>
              <input
                type="text"
                required
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                placeholder={isAuthor ? 'author@hexanews.in' : 'admin or admin@hexanews.in'}
                className="w-full px-3.5 py-2.5 sm:py-3 bg-[#f9f9f9] border border-[#dddddd] rounded-lg text-sm text-[#111111] outline-none focus:border-[#c91f26] focus:bg-white focus:ring-2 focus:ring-[#c91f26]/10 transition"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#555555] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-3.5 pr-10 py-2.5 sm:py-3 bg-[#f9f9f9] border border-[#dddddd] rounded-lg text-sm text-[#111111] outline-none focus:border-[#c91f26] focus:bg-white focus:ring-2 focus:ring-[#c91f26]/10 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#111111] p-1 transition cursor-pointer flex items-center justify-center"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'} text-base`}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 sm:py-3.5 bg-[#c91f26] hover:bg-[#a8191f] text-white font-semibold text-sm sm:text-[15px] rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50 !mt-5 sm:!mt-6"
            >
              {loggingIn ? 'Signing In...' : isAuthor ? 'Sign In to Author Portal' : 'Sign In to Admin Panel'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#f0f0f0] text-center text-xs font-medium">
            <Link to="/" className="text-xs text-[#c91f26] hover:underline inline-flex items-center gap-1.5">
              <span>←</span>
              <span>Return to HEXA NEWS website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: UNIFIED DASHBOARD LAYOUT (#111111 THEME)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex font-['Inter',sans-serif]">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-5 right-5 z-[999] px-5 py-3.5 rounded-lg text-[13px] font-semibold text-white shadow-xl transition-transform duration-300 ${
            toast.type === 'error' ? 'bg-[#c62828]' : 'bg-[#2e7d32]'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* 1. Shared Left Sidebar (Fixed 250px, #111111 Dark) */}
      <aside className="fixed left-0 top-0 bottom-0 w-[250px] bg-[#111111] border-r border-[#222222] py-5 z-40 flex flex-col justify-between">
        <div>
          {/* Logo & Portal Identity */}
          <div className="px-5 pb-5 border-b border-[#222222] mb-3">
            <Link to="/" className="flex items-center">
              <img
                src="/images/logo%20hexa.png"
                alt="HEXA NEWS"
                className="h-[36px] w-auto object-contain rounded-[6px]"
              />
              <span className="text-[#c91f26] font-bold text-[16px] ml-2.5 tracking-wide">
                HEXA NEWS
              </span>
            </Link>
            {isAuthor && (
              <div className="mt-2.5 inline-block px-2.5 py-0.5 bg-[#c91f26]/20 border border-[#c91f26]/40 rounded-full text-[10px] font-bold text-red-400 tracking-wider uppercase">
                AUTHOR WORKSTATION
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="mt-2 space-y-0.5">
            {currentTabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.path}
                className={`w-full flex items-center gap-3 px-6 py-3 text-[14px] font-medium transition-all cursor-pointer text-left ${
                  tab.isActive
                    ? 'text-white bg-[rgba(201,31,38,0.12)] border-r-[3px] border-[#c91f26] font-semibold'
                    : 'text-[#999999] hover:text-white hover:bg-[rgba(201,31,38,0.12)]'
                }`}
              >
                <i className={`bi ${tab.icon} text-[18px] w-[22px] text-center`}></i>
                <span>{tab.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* User Profile Card & Logout Button */}
        <div className="px-5 pb-3 space-y-3">

          <Link
            to="/"
            target="_blank"
            className="w-full py-2 px-3 bg-[#1e1e1e] hover:bg-[#282828] border border-[#2e2e2e] rounded-[8px] text-[#cccccc] hover:text-white text-[13px] font-medium transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <i className="bi bi-box-arrow-up-right text-[12px] text-[#c91f26] group-hover:scale-110 transition-transform"></i>
            <span>View Site</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-2 px-3 bg-[rgba(201,31,38,0.1)] border border-[rgba(201,31,38,0.25)] rounded-[8px] text-[#c91f26] hover:bg-[#c91f26] hover:text-white text-[13px] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <i className="bi bi-box-arrow-left text-[14px]"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="ml-[250px] flex-1 p-6 lg:p-8 bg-[#f5f5f5] min-h-screen text-[#222222]">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-7">
          <h1 className="text-[24px] font-bold text-[#111111] capitalize">
            {pageTitle}
          </h1>

          <div className="flex items-center gap-2 text-[13px] text-[#666666]">
            <i className="bi bi-person-circle text-[#c91f26]"></i>
            <span className="font-medium">{user?.name || (isAuthor ? 'Author' : 'HEXA NEWS Admin')}</span>
          </div>
        </div>

        {/* Render Child Pages via Outlet */}
        <Outlet
          context={{
            token,
            user,
            setUser,
            authorUser: user,
            setAuthorUser: setUser,
            stats,
            articles,
            allArticles: articles,
            categories,
            authors,
            myArticles,
            authorStats,
            settings,
            setSettings,
            loadData,
            loadDashboardData: loadData,
            loadAuthorData: loadData,
            showToast,
            portalType,
            isAuthor,
          }}
        />
      </main>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link, useOutletContext, useLocation, useParams, useNavigate } from 'react-router-dom';
import HtmlEditor from '../admin/HtmlEditor';
import Pagination from '../common/Pagination';
import { formatImageUrl } from '../../services/api';

export default function NewsManagementView({ mode = 'admin', defaultEditor = false }) {
  const context = useOutletContext() || {};
  const {
    token,
    user,
    authorUser,
    stats = {},
    articles = [],
    allArticles = [],
    categories = [],
    authors = [],
    myArticles: contextMyArticles,
    loadData,
    loadDashboardData,
    loadAuthorData,
    showToast = () => {},
  } = context;

  const refreshData = loadData || loadDashboardData || loadAuthorData || (() => {});
  const activeUser = user || authorUser;
  const isAuthorMode = mode === 'author';
  const authorName = (activeUser?.name || '').toLowerCase().trim();

  const location = useLocation();
  const navigate = useNavigate();
  const { id: routeArticleId } = useParams();

  // Articles source
  const sourceArticles = articles.length > 0 ? articles : allArticles;

  // Author filter mode: 'my' (My stories) or 'all' (All publication stories)
  const [authorFilterScope, setAuthorFilterScope] = useState('my');

  // View state: 'list' (cards grid) or 'editor' (in-page form)
  const [newsView, setNewsView] = useState(defaultEditor || routeArticleId ? 'editor' : 'list');
  const [editingArticleId, setEditingArticleId] = useState(routeArticleId || null);
  const [galleryInput, setGalleryInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const CARDS_PER_PAGE = 10;

  // Article Form State
  const defaultAuthorName = isAuthorMode
    ? activeUser?.name || 'Staff Reporter'
    : activeUser?.name || 'HEXA NEWS Admin';

  const [artForm, setArtForm] = useState({
    title: '',
    titleEn: '',
    slug: '',
    category: 'Technology',
    categories: [],
    author: defaultAuthorName,
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

  // Handle location state shortcuts (e.g. from Dashboard "Write New Story" or "Edit")
  useEffect(() => {
    if (location.state?.openEditor) {
      openNewArticleModal();
      navigate(location.pathname, { replace: true, state: {} });
    } else if (location.state?.editArticle) {
      populateArticleForm(location.state.editArticle);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  // Handle route article id prefill
  useEffect(() => {
    if (routeArticleId && sourceArticles.length > 0) {
      const found = sourceArticles.find((a) => a._id === routeArticleId || a.slug === routeArticleId);
      if (found) {
        populateArticleForm(found);
      }
    }
  }, [routeArticleId, sourceArticles]);

  const populateArticleForm = (art) => {
    setEditingArticleId(art._id || art.slug);
    setGalleryInput('');
    setArtForm({
      title: art.title || '',
      titleEn: art.titleEn || '',
      slug: art.slug || art.engSlug || '',
      category: art.category || (categories[0]?.label || 'Technology'),
      categories: Array.isArray(art.categories) ? art.categories : [],
      author: isAuthorMode ? (activeUser?.name || art.author || 'Staff Reporter') : (art.author || defaultAuthorName),
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
  };

  const openNewArticleModal = () => {
    setEditingArticleId(null);
    setGalleryInput('');
    setArtForm({
      title: '',
      titleEn: '',
      slug: '',
      category: categories[0]?.label || 'Technology',
      categories: [],
      author: isAuthorMode ? (activeUser?.name || 'Staff Reporter') : (activeUser?.name || 'HEXA NEWS Admin'),
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

  const closeEditor = () => {
    setNewsView('list');
    setEditingArticleId(null);
    const basePath = isAuthorMode ? '/author-dashboard/news' : '/admin/news';
    if (routeArticleId || defaultEditor) {
      navigate(basePath);
    }
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
      author: isAuthorMode ? (activeUser?.name || 'Staff Reporter') : artForm.author,
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

      showToast(editingArticleId ? 'Article updated successfully!' : 'Article published successfully!', 'success');
      closeEditor();
      refreshData();
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    }
  };

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
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      const res = await fetch(`/api/news/${idOrSlug}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showToast('Article deleted successfully', 'success');
        refreshData();
      } else {
        throw new Error('Failed to delete article');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Base list depending on author scope
  let baseArticles = sourceArticles;
  if (isAuthorMode && authorFilterScope === 'my') {
    baseArticles = sourceArticles.filter(
      (a) => a.author && a.author.toLowerCase().trim() === authorName
    );
  }

  // Filter & Search
  const filteredArticles = baseArticles.filter((a) => {
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

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / CARDS_PER_PAGE));
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE
  );

  const featuredCount = filteredArticles.filter((a) => a.featured === true).length;
  const totalViewsSum = filteredArticles.reduce((acc, curr) => acc + (curr.views || 0), 0);

  // Reset to first page on search or category filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, authorFilterScope]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  return (
    <div className="space-y-6">
      {/* Header with Breadcrumb and Action Buttons */}
      <div id="news-management-top" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-semibold text-[#64748b]">
            {isAuthorMode ? 'Author Portal' : 'Admin'}
          </span>
          <i className="bi bi-chevron-right text-[11px] text-[#94a3b8]"></i>
          <h2 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
            News Management
          </h2>
          {newsView === 'list' && (
            <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fee2e2] text-[#c91f26]">
              {filteredArticles.length}
            </span>
          )}
        </div>

        {newsView === 'list' && (
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {/* Author filter scope toggle: "My Stories" vs "All News" */}
            {isAuthorMode && (
              <div className="inline-flex p-1 bg-white border border-[#e0e0e0] rounded-xl shadow-sm">
                <button
                  type="button"
                  onClick={() => setAuthorFilterScope('my')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    authorFilterScope === 'my'
                      ? 'bg-[#c91f26] text-white shadow-sm'
                      : 'text-[#666666] hover:text-[#111111]'
                  }`}
                >
                  My Stories
                </button>
                <button
                  type="button"
                  onClick={() => setAuthorFilterScope('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    authorFilterScope === 'all'
                      ? 'bg-[#c91f26] text-white shadow-sm'
                      : 'text-[#666666] hover:text-[#111111]'
                  }`}
                >
                  All News
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={openNewArticleModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c91f26] hover:bg-[#a8191f] text-white text-sm font-semibold rounded-xl shadow-sm transition active:scale-[0.98] cursor-pointer"
            >
              <i className="bi bi-plus-lg font-bold"></i>
              <span>{isAuthorMode ? 'Write Story' : 'Add News'}</span>
            </button>
          </div>
        )}
      </div>

      {/* VIEW 1: IN-PAGE NEWS EDITOR */}
      {newsView === 'editor' ? (
        <div className="bg-white rounded-2xl border border-[#e5e5e5] shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#f0f0f0]">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#111111]">
                {editingArticleId ? 'Edit Article' : (isAuthorMode ? 'Draft New Story' : 'Add New News')}
              </h3>
              <p className="text-xs text-[#888888] mt-0.5">
                {isAuthorMode
                  ? 'Compose, attach media, and publish to Hexa News under your byline'
                  : 'Manage and publish news reports across all publication categories'}
              </p>
            </div>
            <button
              type="button"
              onClick={closeEditor}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#f0f0f0] hover:bg-[#e4e4e4] text-[#444444] text-xs sm:text-sm font-semibold rounded-lg transition cursor-pointer"
            >
              <i className="bi bi-x-lg text-xs"></i>
              <span>Cancel</span>
            </button>
          </div>

          <form onSubmit={handleSaveArticle} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* LEFT COLUMN: Basic Information */}
              <div className="space-y-5">
                <h4 className="text-[16px] font-bold text-[#111111]">Basic Information</h4>

                {/* Title (Malayalam / Headline) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[13px] font-semibold text-[#444444]">
                      Title (Malayalam) *
                    </label>
                    {artForm.backgroundColor && (
                      <span className="text-[11px] text-[#888888] flex items-center gap-1.5">
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
                    className="w-full px-3.5 py-2.5 bg-white border border-[#d1d5db] rounded-lg text-sm text-[#111111] outline-none focus:border-[#c91f26] focus:ring-1 focus:ring-[#c91f26] transition"
                  />
                  {artForm.title && (
                    <div
                      style={{ backgroundColor: artForm.backgroundColor || '#c91f26' }}
                      className="mt-2.5 p-3 rounded-lg text-white text-xs font-semibold shadow-sm transition-colors flex items-center justify-between gap-2"
                    >
                      <span className="truncate">{artForm.title}</span>
                      <span className="text-[10px] uppercase font-bold opacity-90 whitespace-nowrap bg-white/20 px-2 py-0.5 rounded">
                        Title Preview
                      </span>
                    </div>
                  )}
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-[13px] font-semibold text-[#444444] mb-1.5">
                    Excerpt / Short Description
                  </label>
                  <textarea
                    rows={3}
                    value={artForm.excerpt}
                    onChange={(e) => setArtForm({ ...artForm, excerpt: e.target.value })}
                    placeholder="Brief summary of the news story..."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#d1d5db] rounded-lg text-sm text-[#111111] outline-none focus:border-[#c91f26] focus:ring-1 focus:ring-[#c91f26] transition"
                  />
                </div>

                {/* Primary Category & Author */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#444444] mb-1.5">
                      Primary Category *
                    </label>
                    <select
                      value={artForm.category}
                      onChange={(e) => setArtForm({ ...artForm, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#d1d5db] rounded-lg text-sm text-[#111111] outline-none focus:border-[#c91f26] focus:ring-1 focus:ring-[#c91f26] transition"
                    >
                      {categories.map((c, i) => (
                        <option key={i} value={c.label || c.slug}>
                          {c.label || c.slug}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-[#444444] mb-1.5">
                      Author / Byline
                    </label>
                    {isAuthorMode ? (
                      <div className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-[#d1d5db] rounded-lg text-sm text-[#111111] font-semibold flex items-center justify-between">
                        <span>{activeUser?.name || 'Staff Reporter'}</span>
                        <span className="text-[10px] uppercase font-bold text-[#c91f26] bg-red-50 px-2 py-0.5 rounded">
                          Your Byline
                        </span>
                      </div>
                    ) : (
                      <select
                        value={artForm.author}
                        onChange={(e) => setArtForm({ ...artForm, author: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#d1d5db] rounded-lg text-sm text-[#111111] outline-none focus:border-[#c91f26] focus:ring-1 focus:ring-[#c91f26] transition"
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
                    )}
                  </div>
                </div>

                {/* Date & Read Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#444444] mb-1.5">
                      Date
                    </label>
                    <input
                      type="text"
                      value={artForm.date || ''}
                      onChange={(e) => setArtForm({ ...artForm, date: e.target.value })}
                      placeholder="e.g., June 27, 2026"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#d1d5db] rounded-lg text-sm text-[#111111] outline-none focus:border-[#c91f26] focus:ring-1 focus:ring-[#c91f26] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-[#444444] mb-1.5">
                      Read Time
                    </label>
                    <input
                      type="text"
                      value={artForm.readTime || ''}
                      onChange={(e) => setArtForm({ ...artForm, readTime: e.target.value })}
                      placeholder="e.g., 4 min read"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#d1d5db] rounded-lg text-sm text-[#111111] outline-none focus:border-[#c91f26] focus:ring-1 focus:ring-[#c91f26] transition"
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Media & Display */}
              <div className="space-y-5">
                <h4 className="text-[16px] font-bold text-[#111111]">Media & Display</h4>

                {/* Featured Image */}
                <div>
                  <label className="block text-[13px] font-semibold text-[#444444] mb-1.5">
                    Featured Image URL or Upload
                  </label>
                  <input
                    type="text"
                    value={artForm.image || ''}
                    onChange={(e) => setArtForm({ ...artForm, image: e.target.value })}
                    placeholder="https://... or /uploads/..."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#d1d5db] rounded-lg text-sm text-[#111111] outline-none focus:border-[#c91f26] focus:ring-1 focus:ring-[#c91f26] transition mb-2"
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
                    <div className="mt-3 h-28 w-44 rounded-lg overflow-hidden border border-[#e5e5e5] shadow-sm">
                      <img
                        src={formatImageUrl(artForm.image)}
                        alt="Preview"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=800&q=80';
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Gallery Images */}
                <div>
                  <label className="block text-[13px] font-semibold text-[#444444] mb-1.5">
                    Gallery Images (multiple)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={galleryInput}
                      onChange={(e) => setGalleryInput(e.target.value)}
                      placeholder="Image URL"
                      className="flex-1 px-3.5 py-2.5 bg-white border border-[#d1d5db] rounded-lg text-sm text-[#111111] outline-none focus:border-[#c91f26] focus:ring-1 focus:ring-[#c91f26] transition"
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
                      className="px-4 py-2.5 bg-[#e5e5e5] hover:bg-[#d8d8d8] text-[#333333] text-xs font-semibold rounded-lg transition"
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

                  {artForm.gallery && artForm.gallery.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2.5">
                      {artForm.gallery.map((gUrl, gIdx) => (
                        <div key={gIdx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-[#d1d5db] group">
                          <img
                            src={formatImageUrl(gUrl)}
                            alt={`Gallery ${gIdx}`}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=800&q=80';
                            }}
                            className="w-full h-full object-cover"
                          />
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

                {/* Media Type & Video URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#444444] mb-1.5">
                      Media Type
                    </label>
                    <select
                      value={artForm.media || 'standard'}
                      onChange={(e) => setArtForm({ ...artForm, media: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#d1d5db] rounded-lg text-sm text-[#111111] outline-none focus:border-[#c91f26] focus:ring-1 focus:ring-[#c91f26] transition"
                    >
                      <option value="standard">Standard</option>
                      <option value="video">Video</option>
                      <option value="gallery">Gallery</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-[#444444] mb-1.5">
                      Video URL (YouTube, Vimeo)
                    </label>
                    <input
                      type="text"
                      value={artForm.videoUrl || ''}
                      onChange={(e) => setArtForm({ ...artForm, videoUrl: e.target.value })}
                      placeholder="Paste video link..."
                      className="w-full px-3.5 py-2.5 bg-white border border-[#d1d5db] rounded-lg text-sm text-[#111111] outline-none focus:border-[#c91f26] focus:ring-1 focus:ring-[#c91f26] transition"
                    />
                  </div>
                </div>

                {/* Featured Story Checkbox */}
                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-[13px] font-semibold text-[#222222]">
                    <input
                      type="checkbox"
                      checked={!!artForm.featured}
                      onChange={(e) => setArtForm({ ...artForm, featured: e.target.checked })}
                      className="w-4 h-4 text-[#c91f26] rounded border-[#d1d5db] focus:ring-[#c91f26] cursor-pointer"
                    />
                    <span>🌟 Featured Story (Top carousel placement)</span>
                  </label>
                </div>

                {/* Title BG Swatch */}
                <div className="pt-2">
                  <label className="block text-[13px] font-semibold text-[#444444] mb-1.5">
                    Title / Badge Background Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={artForm.backgroundColor || '#c91f26'}
                      onChange={(e) => setArtForm({ ...artForm, backgroundColor: e.target.value })}
                      className="w-9 h-9 p-0.5 rounded border border-[#d1d5db] cursor-pointer"
                    />
                    <span className="text-xs font-mono text-[#666666]">
                      {artForm.backgroundColor || '#c91f26'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* FULL-WIDTH CONTENT SECTION */}
            <div className="pt-6 border-t border-[#f0f0f0] space-y-4">
              <h4 className="text-[16px] font-bold text-[#111111]">Body Content</h4>

              <div>
                <label className="block text-[13px] font-semibold text-[#444444] mb-1.5">
                  Full Article Text & Formatting *
                </label>
                <HtmlEditor
                  value={artForm.content}
                  onChange={(content) => setArtForm({ ...artForm, content })}
                  placeholder="Write the full news story here..."
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#444444] mb-1.5">
                  Tags <span className="text-xs text-[#888888] font-normal">(comma separated)</span>
                </label>
                <input
                  type="text"
                  value={artForm.tags || ''}
                  onChange={(e) => setArtForm({ ...artForm, tags: e.target.value })}
                  placeholder="e.g., kerala, politics, sports, weather"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#d1d5db] rounded-lg text-sm text-[#111111] outline-none focus:border-[#c91f26] focus:ring-1 focus:ring-[#c91f26] transition"
                />
              </div>
            </div>

            {/* BOTTOM ACTIONS */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#f0f0f0]">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#c91f26] hover:bg-[#a8191f] text-white text-sm font-semibold rounded-lg shadow-sm transition active:scale-[0.98] cursor-pointer"
              >
                <i className="bi bi-floppy"></i>
                <span>{editingArticleId ? 'Update Article' : (isAuthorMode ? 'Publish Story' : 'Publish News')}</span>
              </button>
              <button
                type="button"
                onClick={closeEditor}
                className="px-5 py-2.5 bg-[#f0f0f0] hover:bg-[#e4e4e4] text-[#444444] text-sm font-semibold rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* VIEW 2: 10-CARD GRID DASHBOARD VIEW */
        <>
          {/* Search, Category Filter, and Add Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-[#e2e8f0] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="relative flex-1 w-full">
              <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] text-sm"></i>
              <input
                type="text"
                placeholder={isAuthorMode ? 'Search my stories...' : 'Search news articles...'}
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

            <button
              type="button"
              onClick={openNewArticleModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#c91f26] hover:bg-[#a8191f] text-white text-sm font-semibold rounded-xl shadow-sm transition active:scale-[0.98] cursor-pointer"
            >
              <i className="bi bi-plus-lg font-bold"></i>
              <span>{isAuthorMode ? 'Write Story' : 'Add News'}</span>
            </button>
          </div>

          {/* Cards Grid */}
          {filteredArticles.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-16 text-center shadow-sm">
              <div className="w-16 h-16 rounded-full bg-[#f1f5f9] flex items-center justify-center mx-auto mb-4 text-[#94a3b8] text-2xl">
                <i className="bi bi-newspaper"></i>
              </div>
              <h4 className="text-base font-bold text-[#0f172a] mb-1">No news articles found</h4>
              <p className="text-xs text-[#64748b] max-w-sm mx-auto mb-6">
                {searchQuery || selectedCategory !== 'ALL'
                  ? 'No articles match your current search or category filters. Try clearing filters.'
                  : (isAuthorMode ? 'You have not written any stories yet. Start drafting your first article!' : 'Get started by creating your first article.')}
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
                  + Create First Story
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedArticles.map((a, idx) => {
                const cardId = a._id || a.slug || idx;
                const categoryName = a.categoryMl || a.category || 'News';
                const dateStr = a.date ? (a.date.includes('T') ? a.date.split('T')[0] : a.date) : '2026-10-12';
                const viewsCount = a.views || 0;
                const isFeatured = a.featured === true;
                const cleanExcerpt = a.excerpt || (a.content ? a.content.replace(/<[^>]*>/g, '').slice(0, 140) : '');

                // Check ownership for Author mode
                const isMyStory = !isAuthorMode || (a.author && a.author.toLowerCase().trim() === authorName);

                return (
                  <div
                    key={cardId}
                    className="bg-white rounded-2xl border border-[#e2e8f0] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.07)] hover:border-[#cbd5e1] transition-all duration-300 overflow-hidden flex flex-col group"
                  >
                    {/* Thumbnail Image with Badge */}
                    <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#f1f5f9]">
                      <img
                        src={formatImageUrl(a.image)}
                        alt={a.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=800&q=80';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        {isFeatured && (
                          <span className="inline-block px-2.5 py-1 bg-[#f59e0b] text-[#1c1917] text-[10px] font-black uppercase tracking-wider rounded-md shadow-sm">
                            FEATURED
                          </span>
                        )}
                        {isAuthorMode && isMyStory && (
                          <span className="inline-block px-2 py-0.5 bg-[#c91f26] text-white text-[9px] font-bold uppercase tracking-wider rounded-md shadow-sm">
                            MY STORY
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Category & Date / Views */}
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

                      {/* Byline & Action Buttons */}
                      <div className="flex items-center justify-between pt-3 border-t border-[#f1f5f9]">
                        <span className="text-[11px] text-[#64748b] truncate max-w-[140px]">
                          By {a.author || 'Staff Reporter'}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <Link
                            to={`/post-detail?slug=${a.slug}`}
                            target="_blank"
                            className="w-8 h-8 rounded-lg bg-[#ecfdf5] text-[#059669] hover:bg-[#d1fae5] flex items-center justify-center transition shadow-sm"
                            title="View live article"
                          >
                            <i className="bi bi-eye text-sm"></i>
                          </Link>

                          {isMyStory ? (
                            <>
                              <button
                                type="button"
                                onClick={() => populateArticleForm(a)}
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
                            </>
                          ) : (
                            <span className="text-[10px] text-gray-400 italic px-1">
                              View only
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
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

          {/* 4 Bottom Stats Metric Cards in Matching Theme */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div className="text-[32px] sm:text-[38px] font-extrabold text-[#c91f26] leading-none mb-2">
                {filteredArticles.length}
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#64748b]">
                {isAuthorMode ? (authorFilterScope === 'my' ? 'My Articles' : 'Total Articles') : 'Total News'}
              </div>
            </div>

            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div className="text-[32px] sm:text-[38px] font-extrabold text-[#c91f26] leading-none mb-2">
                {featuredCount}
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#64748b]">Featured</div>
            </div>

            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div className="text-[32px] sm:text-[38px] font-extrabold text-[#c91f26] leading-none mb-2">
                {categories.length || stats.categories || 0}
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#64748b]">Categories</div>
            </div>

            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div className="text-[32px] sm:text-[38px] font-extrabold text-[#c91f26] leading-none mb-2">
                {totalViewsSum.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#64748b]">Total Views</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

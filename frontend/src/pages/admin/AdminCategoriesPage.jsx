import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { clearApiCache } from '../../services/api';

export default function AdminCategoriesPage() {
  const { categories = [], token, loadDashboardData, showToast } = useOutletContext() || {};

  const activeToken =
    token ||
    localStorage.getItem('hexa_token') ||
    localStorage.getItem('hexa_admin_token') ||
    '';

  // Local categories state for instant UI updates (independent of parent layout delay)
  const [localCategories, setLocalCategories] = useState(categories || []);
  const [isLoadingDirect, setIsLoadingDirect] = useState(false);

  // Search, filter & accordion states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'WITH_SUB' | 'SINGLE'
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedMap, setExpandedMap] = useState({});

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // null when creating
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formError, setFormError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    label: '',
    slug: '',
    parent: '',
  });
  const [autoSlug, setAutoSlug] = useState(true);

  // Helper to generate a clean URL slug from a label
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Direct fetch from backend to ensure categories are 100% fresh
  const fetchFreshCategories = useCallback(async () => {
    try {
      setIsLoadingDirect(true);
      const res = await fetch(`/api/categories?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setLocalCategories(data);
        }
      }
    } catch (err) {
      console.warn('Direct category fetch warning:', err);
    } finally {
      setIsLoadingDirect(false);
    }
  }, []);

  // Fetch on mount and listen to global updates
  useEffect(() => {
    fetchFreshCategories();

    const handleCategoriesUpdate = () => {
      fetchFreshCategories();
    };
    window.addEventListener('hexa_categories_updated', handleCategoriesUpdate);
    window.addEventListener('storage', handleCategoriesUpdate);

    return () => {
      window.removeEventListener('hexa_categories_updated', handleCategoriesUpdate);
      window.removeEventListener('storage', handleCategoriesUpdate);
    };
  }, [fetchFreshCategories]);

  // Keep in sync when context categories update from parent
  useEffect(() => {
    if (categories && Array.isArray(categories) && categories.length > 0) {
      setLocalCategories(categories);
    }
  }, [categories]);

  // Automatically expand parent categories that have children on initial load
  useEffect(() => {
    if (localCategories && localCategories.length > 0) {
      setExpandedMap((prev) => {
        const next = { ...prev };
        localCategories.forEach((cat) => {
          if (next[cat.slug] === undefined) {
            next[cat.slug] = Boolean(cat.children && cat.children.length > 0);
          }
        });
        return next;
      });
    }
  }, [localCategories]);

  // Toggle single category accordion
  const toggleCategory = (slug) => {
    setExpandedMap((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  // Toggle all accordions open/close
  const allExpanded = useMemo(() => {
    if (!localCategories || localCategories.length === 0) return false;
    return localCategories.every((cat) => Boolean(expandedMap[cat.slug]));
  }, [localCategories, expandedMap]);

  const toggleAll = () => {
    const newState = !allExpanded;
    const next = {};
    (localCategories || []).forEach((c) => {
      next[c.slug] = newState;
    });
    setExpandedMap(next);
  };

  // Open modal for creating a new category
  const handleOpenCreateModal = (parentSlug = '') => {
    setEditingCategory(null);
    setFormError('');
    setFormData({
      label: '',
      slug: '',
      parent: parentSlug || '',
    });
    setAutoSlug(true);
    setModalOpen(true);
  };

  // Open modal for editing an existing category
  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat);
    setFormError('');
    setFormData({
      label: cat.label || '',
      slug: cat.slug || '',
      parent: cat.parent || '',
    });
    setAutoSlug(false);
    setModalOpen(true);
  };

  // Open delete confirmation modal
  const handleOpenDeleteModal = (cat) => {
    setCategoryToDelete(cat);
    setDeleteConfirmOpen(true);
  };

  // Handle label change and auto-slug
  const handleLabelChange = (e) => {
    const newLabel = e.target.value;
    setFormError('');
    if (autoSlug && !editingCategory) {
      setFormData({
        ...formData,
        label: newLabel,
        slug: generateSlug(newLabel),
      });
    } else {
      setFormData({
        ...formData,
        label: newLabel,
      });
    }
  };

  // Flatten categories list to calculate stats, check duplicates, and search
  const { topLevelCategories, allFlatCategories, stats } = useMemo(() => {
    const flat = [];
    const topLevel = [];

    (localCategories || []).forEach((cat) => {
      topLevel.push(cat);
      flat.push({
        ...cat,
        isChild: false,
        parentLabel: null,
      });

      if (cat.children && Array.isArray(cat.children)) {
        cat.children.forEach((child) => {
          flat.push({
            ...child,
            isChild: true,
            parentLabel: cat.label,
            parentSlug: cat.slug,
          });
        });
      }
    });

    const totalArticles = flat.reduce((acc, c) => acc + (c.count || 0), 0);
    const mainCount = topLevel.length;
    const subCount = flat.filter((c) => c.isChild).length;

    return {
      topLevelCategories: topLevel,
      allFlatCategories: flat,
      stats: {
        total: flat.length,
        mainNavbar: mainCount,
        subcategories: subCount,
        articles: totalArticles,
      },
    };
  }, [localCategories]);

  // Check if current form slug is already taken
  const currentCleanSlug = generateSlug(formData.slug || formData.label);
  const isSlugTaken = useMemo(() => {
    if (!currentCleanSlug) return false;
    return allFlatCategories.some(
      (c) =>
        c.slug?.toLowerCase() === currentCleanSlug.toLowerCase() &&
        (!editingCategory || c.slug !== editingCategory.slug)
    );
  }, [allFlatCategories, currentCleanSlug, editingCategory]);

  // Filtered categories according to search query and filterType
  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return topLevelCategories
      .map((cat) => {
        const catMatches =
          !q ||
          cat.label?.toLowerCase().includes(q) ||
          cat.slug?.toLowerCase().includes(q);

        const matchingChildren = (cat.children || []).filter((child) => {
          if (!q) return true;
          return (
            child.label?.toLowerCase().includes(q) ||
            child.slug?.toLowerCase().includes(q)
          );
        });

        const hasSub = cat.children && cat.children.length > 0;

        if (filterType === 'WITH_SUB' && !hasSub) return null;
        if (filterType === 'SINGLE' && hasSub) return null;

        if (!catMatches && matchingChildren.length === 0) {
          return null;
        }

        return {
          ...cat,
          children: matchingChildren,
          hasMatchInChild: matchingChildren.length > 0 && !catMatches,
        };
      })
      .filter(Boolean);
  }, [topLevelCategories, searchQuery, filterType]);

  // Synchronize data and fire global events
  const syncCategoriesAfterChange = async () => {
    clearApiCache('/categories');
    clearApiCache();
    window.dispatchEvent(new Event('hexa_categories_updated'));
    localStorage.setItem('hexa_categories_version', String(Date.now()));
    if (typeof loadDashboardData === 'function') {
      loadDashboardData(true);
    }
  };

  // Refresh handler
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchFreshCategories();
      await syncCategoriesAfterChange();
      if (showToast) showToast('Categories refreshed from database', 'success');
    } catch {
      if (showToast) showToast('Failed to refresh categories', 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Save (Create or Update) Category
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setFormError('');

    const cleanLabel = formData.label.trim();
    const cleanSlug = generateSlug(formData.slug || formData.label);

    if (!cleanLabel) {
      setFormError('Category Name is required.');
      return;
    }
    if (!cleanSlug) {
      setFormError('A valid URL Slug is required.');
      return;
    }

    // Client-side duplicate check to prevent unnecessary 409 errors
    if (isSlugTaken) {
      setFormError(
        `A category with slug "/${cleanSlug}" already exists. Please customize the URL slug to make it unique.`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const isEditing = Boolean(editingCategory);
      const url = isEditing
        ? `/api/categories/${encodeURIComponent(editingCategory.slug)}`
        : '/api/categories';
      const method = isEditing ? 'PUT' : 'POST';

      const payload = {
        label: cleanLabel,
        slug: cleanSlug,
        titleMl: '',
        parent: formData.parent && formData.parent.trim() ? formData.parent.trim() : null,
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        if (res.status === 409) {
          setFormError(
            data?.error ||
              `A category with slug "/${cleanSlug}" already exists in the database. Please change the URL slug.`
          );
          setIsSubmitting(false);
          return;
        }
        throw new Error(data?.error || `Failed to ${isEditing ? 'update' : 'create'} category`);
      }

      // Automatically expand parent if a subcategory was added
      if (payload.parent) {
        setExpandedMap((prev) => ({
          ...prev,
          [payload.parent]: true,
        }));
      }

      setModalOpen(false);
      setEditingCategory(null);
      setFormData({ label: '', slug: '', parent: '' });
      setFormError('');

      // 1. Immediately refresh local state directly from backend
      await fetchFreshCategories();

      // 2. Clear cache and notify global components (Header, PortalLayout)
      await syncCategoriesAfterChange();

      if (showToast) {
        showToast(
          isEditing
            ? `Category "${cleanLabel}" updated successfully!`
            : `Category "${cleanLabel}" created successfully!`,
          'success'
        );
      }
    } catch (err) {
      setFormError(err.message);
      if (showToast) {
        showToast(err.message, 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Category
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/categories/${encodeURIComponent(categoryToDelete.slug)}`, {
        method: 'DELETE',
        headers: {
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to delete category');
      }

      setDeleteConfirmOpen(false);
      const deletedName = categoryToDelete.label;
      setCategoryToDelete(null);

      // 1. Immediately refresh local state
      await fetchFreshCategories();

      // 2. Clear cache and notify global components
      await syncCategoriesAfterChange();

      if (showToast) {
        showToast(`Category "${deletedName}" deleted successfully!`, 'success');
      }
    } catch (err) {
      if (showToast) {
        showToast(err.message, 'error');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-red-50 text-[#c91f26] flex items-center justify-center text-lg">
              <i className="bi bi-folder2-open"></i>
            </span>
            <h2 className="text-xl font-bold text-[#0f172a]">Category Management</h2>
            {isLoadingDirect && (
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
                <i className="bi bi-arrow-repeat animate-spin text-[#c91f26]"></i>
                <span>Syncing...</span>
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#64748b] mt-1 pl-11">
            Organize main categories and nested subcategories for the navbar and news portal
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto pl-11 sm:pl-0">
          <button
            type="button"
            onClick={toggleAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] text-[#475569] text-xs font-semibold rounded-xl transition cursor-pointer"
            title={allExpanded ? 'Collapse All' : 'Expand All'}
          >
            <i className={`bi ${allExpanded ? 'bi-chevron-contract' : 'bi-chevron-expand'} text-sm`}></i>
            <span>{allExpanded ? 'Collapse All' : 'Expand All'}</span>
          </button>

          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] text-[#475569] text-xs font-semibold rounded-xl transition cursor-pointer disabled:opacity-60"
            title="Refresh from DB"
          >
            <i className={`bi bi-arrow-clockwise text-sm ${isRefreshing ? 'animate-spin' : ''}`}></i>
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenCreateModal()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#c91f26] hover:bg-[#a8191f] text-white text-xs sm:text-[13px] font-semibold rounded-xl shadow-[0_2px_8px_rgba(201,31,38,0.25)] transition active:scale-[0.98] cursor-pointer"
          >
            <i className="bi bi-plus-lg"></i>
            <span>New Category</span>
          </button>
        </div>
      </div>

      {/* 2. Top Stats Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Categories */}
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-4 sm:p-5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">Total Categories</span>
            <span className="w-8 h-8 rounded-lg bg-red-50 text-[#c91f26] flex items-center justify-center text-sm">
              <i className="bi bi-tags"></i>
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#0f172a]">{stats.total}</div>
          <div className="text-[11px] text-[#94a3b8] mt-1">Main & subcategories combined</div>
        </div>

        {/* Card 2: Main Categories */}
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-4 sm:p-5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">Main Navbar Tabs</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
              <i className="bi bi-layout-text-window-reverse"></i>
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#0f172a]">{stats.mainNavbar}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Shown on header navbar</div>
        </div>

        {/* Card 3: Subcategories */}
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-4 sm:p-5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">Subcategories</span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm">
              <i className="bi bi-diagram-3"></i>
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#0f172a]">{stats.subcategories}</div>
          <div className="text-[11px] text-[#94a3b8] mt-1">Nested in dropdown menus</div>
        </div>

        {/* Card 4: Total Articles */}
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-4 sm:p-5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">Articles Mapped</span>
            <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-sm">
              <i className="bi bi-newspaper"></i>
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#0f172a]">{stats.articles}</div>
          <div className="text-[11px] text-[#94a3b8] mt-1">Classified stories in DB</div>
        </div>
      </div>

      {/* 3. Search and Quick Filters */}
      <div className="bg-white border border-[#e5e7eb] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
        <div className="relative w-full sm:w-80">
          <i className="bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
          <input
            type="text"
            placeholder="Search categories or slugs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-xs sm:text-sm text-[#0f172a] outline-none focus:border-[#c91f26] focus:bg-white transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
            >
              <i className="bi bi-x-circle-fill"></i>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center p-1 bg-[#f1f5f9] rounded-lg border border-[#e2e8f0] text-xs font-semibold w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer flex-1 sm:flex-initial text-center ${
                filterType === 'ALL'
                  ? 'bg-white text-[#0f172a] shadow-xs'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              All ({topLevelCategories.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('WITH_SUB')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer flex-1 sm:flex-initial text-center ${
                filterType === 'WITH_SUB'
                  ? 'bg-white text-[#0f172a] shadow-xs'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              With Subcategories
            </button>
            <button
              type="button"
              onClick={() => setFilterType('SINGLE')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer flex-1 sm:flex-initial text-center ${
                filterType === 'SINGLE'
                  ? 'bg-white text-[#0f172a] shadow-xs'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              Standalone
            </button>
          </div>
        </div>
      </div>

      {/* 4. ACCORDION CATEGORIES HIERARCHY (Inspired by user design) */}
      <div className="space-y-3.5">
        {filteredCategories.length === 0 ? (
          <div className="bg-white border border-[#e5e7eb] rounded-2xl py-20 text-center px-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
            <div className="w-14 h-14 mx-auto mb-3 bg-red-50 text-[#c91f26] rounded-full flex items-center justify-center text-2xl">
              <i className="bi bi-folder-x"></i>
            </div>
            <h4 className="text-base font-bold text-[#0f172a] mb-1">
              {searchQuery ? 'No matching categories found' : 'No categories available'}
            </h4>
            <p className="text-xs text-[#64748b] max-w-sm mx-auto mb-4">
              {searchQuery
                ? `No category or subcategory matches "${searchQuery}".`
                : 'Get started by creating your first category for the portal.'}
            </p>
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition cursor-pointer"
              >
                Clear Search
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleOpenCreateModal()}
                className="px-4 py-2 bg-[#c91f26] hover:bg-[#a8191f] text-white text-xs font-semibold rounded-lg transition cursor-pointer"
              >
                <i className="bi bi-plus-lg mr-1.5"></i>
                Create Category
              </button>
            )}
          </div>
        ) : (
          filteredCategories.map((cat, idx) => {
            const isExpanded = Boolean(expandedMap[cat.slug]);
            const subcategories = cat.children || [];
            const hasSubcategories = subcategories.length > 0;

            return (
              <div
                key={idx}
                className="bg-white border border-[#e5e7eb] rounded-xl shadow-[0_1px_6px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-200 hover:border-[#cbd5e1]"
              >
                {/* ACCORDION HEADER (Top-Level Category Row) */}
                <div
                  onClick={() => toggleCategory(cat.slug)}
                  className={`flex flex-col md:flex-row md:items-center justify-between p-4 sm:px-6 cursor-pointer select-none transition-colors ${
                    isExpanded ? 'bg-[#fcfdfd]' : 'bg-white hover:bg-[#f8fafc]'
                  }`}
                >
                  {/* Left: Chevron + Name + Slug */}
                  <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                    {/* Expand/Collapse Chevron */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCategory(cat.slug);
                      }}
                      className="w-7 h-7 rounded-lg bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569] flex items-center justify-center transition shrink-0 cursor-pointer"
                      title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      <i
                        className={`bi bi-chevron-down text-xs transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-[#c91f26]' : ''
                        }`}
                      ></i>
                    </button>

                    {/* Category Label (Bold Dark) */}
                    <span className="font-bold text-[15px] sm:text-[16px] text-[#0f172a] tracking-tight">
                      {cat.label}
                    </span>

                    {/* URL Slug */}
                    <span className="font-mono text-[12px] text-[#64748b] bg-[#f8fafc] border border-[#e2e8f0] px-2.5 py-0.5 rounded-md">
                      /{cat.slug}
                    </span>
                  </div>

                  {/* Right: Badges & Action Buttons */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 mt-3 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#f1f5f9] flex-wrap justify-between md:justify-end"
                  >
                    {/* Badge: Main Navbar */}
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>Main Navbar</span>
                    </span>

                    {/* Subcategories count badge */}
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      <i className="bi bi-diagram-3 text-[10px]"></i>
                      <span>{subcategories.length} sub</span>
                    </span>

                    {/* Articles count badge */}
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700">
                      <i className="bi bi-newspaper text-[10px]"></i>
                      <span>{cat.count || 0} stories</span>
                    </span>

                    {/* Action Buttons Toolbar */}
                    <div className="flex items-center gap-1.5 ml-2">
                      {/* Add Subcategory Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenCreateModal(cat.slug)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-[#c91f26] text-[#c91f26] hover:text-white text-xs font-semibold transition cursor-pointer"
                        title={`Add subcategory under ${cat.label}`}
                      >
                        <i className="bi bi-plus-lg text-[11px]"></i>
                        <span className="hidden sm:inline">Add Sub</span>
                      </button>

                      {/* View on Site Link */}
                      <Link
                        to={`/${cat.slug}`}
                        target="_blank"
                        className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-[#0f172a] transition flex items-center justify-center cursor-pointer"
                        title="View public page"
                      >
                        <i className="bi bi-box-arrow-up-right text-xs"></i>
                      </Link>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(cat)}
                        className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition flex items-center justify-center cursor-pointer"
                        title="Edit category"
                      >
                        <i className="bi bi-pencil text-xs"></i>
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenDeleteModal(cat)}
                        className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 transition flex items-center justify-center cursor-pointer"
                        title="Delete category"
                      >
                        <i className="bi bi-trash text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* ACCORDION BODY (Nested Subcategories List) */}
                {isExpanded && (
                  <div className="border-t border-[#f1f5f9] bg-white">
                    {hasSubcategories ? (
                      <div className="divide-y divide-[#f1f5f9]">
                        {subcategories.map((child, cIdx) => (
                          <div
                            key={cIdx}
                            className="flex flex-col sm:flex-row sm:items-center justify-between py-3 px-4 sm:px-6 sm:pl-14 hover:bg-[#fbfcfe] transition-colors gap-2"
                          >
                            {/* Left: Subcategory Name + Slug */}
                            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                              {/* Subcategory Label (Bold Dark) */}
                              <span className="font-bold text-[14px] text-[#0f172a]">
                                {child.label}
                              </span>

                              {/* Slug */}
                              <span className="font-mono text-[12px] text-[#64748b] bg-[#f8fafc] border border-[#e2e8f0] px-2 py-0.5 rounded-md">
                                /{cat.slug}/{child.slug}
                              </span>
                            </div>

                            {/* Right: Articles Count + Action Buttons */}
                            <div className="flex items-center gap-2 self-end sm:self-auto">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600">
                                <i className="bi bi-file-text text-[10px]"></i>
                                <span>{child.count || 0} stories</span>
                              </span>

                              <Link
                                to={`/${cat.slug}/${child.slug}`}
                                target="_blank"
                                className="w-7 h-7 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-[#0f172a] transition flex items-center justify-center cursor-pointer"
                                title="View subcategory on website"
                              >
                                <i className="bi bi-box-arrow-up-right text-[11px]"></i>
                              </Link>

                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(child)}
                                className="w-7 h-7 rounded-lg bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition flex items-center justify-center cursor-pointer"
                                title="Edit subcategory"
                              >
                                <i className="bi bi-pencil text-[11px]"></i>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenDeleteModal(child)}
                                className="w-7 h-7 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 transition flex items-center justify-center cursor-pointer"
                                title="Delete subcategory"
                              >
                                <i className="bi bi-trash text-[11px]"></i>
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* Quick Add Subcategory bottom banner inside card */}
                        <div className="py-2.5 px-4 sm:px-6 sm:pl-14 bg-[#f8fafc]/50 flex items-center justify-between text-xs text-[#64748b]">
                          <span>
                            Subcategories appear inside the <strong>{cat.label}</strong> dropdown menu.
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenCreateModal(cat.slug)}
                            className="inline-flex items-center gap-1 font-semibold text-[#c91f26] hover:text-[#a8191f] transition cursor-pointer"
                          >
                            <i className="bi bi-plus-circle"></i>
                            <span>Add Another Subcategory</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-6 px-6 text-center bg-[#fafafa]">
                        <p className="text-xs text-[#64748b] mb-2">
                          No subcategories under <strong>{cat.label}</strong> yet.
                        </p>
                        <button
                          type="button"
                          onClick={() => handleOpenCreateModal(cat.slug)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e2e8f0] hover:border-[#c91f26] text-[#0f172a] hover:text-[#c91f26] text-xs font-semibold rounded-lg shadow-2xs transition cursor-pointer"
                        >
                          <i className="bi bi-plus-lg text-[11px]"></i>
                          <span>Add Subcategory to {cat.label}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 5. CREATE / EDIT CATEGORY MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full relative shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Close button */}
            <button
              type="button"
              onClick={() => {
                setModalOpen(false);
                setFormError('');
              }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition cursor-pointer"
            >
              <i className="bi bi-x-lg text-xs"></i>
            </button>

            {/* Modal Title */}
            <div className="flex items-center gap-3 mb-5">
              <span className="w-10 h-10 rounded-xl bg-red-50 text-[#c91f26] flex items-center justify-center text-lg">
                <i className={editingCategory ? 'bi bi-pencil-fill' : 'bi bi-plus-circle-fill'}></i>
              </span>
              <div>
                <h3 className="text-lg font-bold text-[#0f172a]">
                  {editingCategory
                    ? `Edit: ${editingCategory.label}`
                    : formData.parent
                    ? `New Subcategory under ${topLevelCategories.find((c) => c.slug === formData.parent)?.label || formData.parent}`
                    : 'New Top-Level Category'}
                </h3>
                <p className="text-xs text-gray-500">
                  {formData.parent
                    ? 'Subcategories appear inside parent dropdown menus'
                    : 'Top-level categories appear directly on the website navbar'}
                </p>
              </div>
            </div>

            {/* Form Error Banner */}
            {formError && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in">
                <i className="bi bi-exclamation-triangle-fill text-red-600 mt-0.5 shrink-0 text-sm"></i>
                <div className="flex-1 font-medium leading-relaxed">{formError}</div>
              </div>
            )}

            <form onSubmit={handleSaveCategory} className="space-y-4 text-[13px]">
              {/* Category Name / Label */}
              <div>
                <label className="block text-[12px] font-semibold text-[#444444] mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Entertainment, Celebrty Talk, Cinema Talkies"
                  value={formData.label}
                  onChange={handleLabelChange}
                  className="w-full px-3.5 py-2.5 bg-[#f9fafb] border border-[#d1d5db] rounded-xl text-sm text-[#0f172a] outline-none focus:border-[#c91f26] focus:bg-white focus:ring-2 focus:ring-[#c91f26]/10 transition"
                />
              </div>

              {/* URL Slug & Live URL Preview */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[12px] font-semibold text-[#444444]">
                    URL Slug *
                  </label>
                  {!editingCategory && (
                    <button
                      type="button"
                      onClick={() => setAutoSlug(!autoSlug)}
                      className="text-[11px] text-[#c91f26] hover:underline cursor-pointer"
                    >
                      {autoSlug ? 'Manual edit' : 'Auto-sync from name'}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-xs">
                    /
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. entertainment"
                    value={formData.slug}
                    onChange={(e) => {
                      setAutoSlug(false);
                      setFormError('');
                      setFormData({ ...formData, slug: generateSlug(e.target.value) });
                    }}
                    className={`w-full pl-7 pr-3.5 py-2.5 bg-[#f9fafb] border rounded-xl font-mono text-xs sm:text-sm text-[#0f172a] outline-none focus:bg-white transition ${
                      isSlugTaken
                        ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                        : 'border-[#d1d5db] focus:border-[#c91f26]'
                    }`}
                  />
                </div>

                {/* Inline Slug Warning if duplicate */}
                {currentCleanSlug && isSlugTaken ? (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                    <i className="bi bi-exclamation-circle-fill"></i>
                    <span>This slug &quot;/{currentCleanSlug}&quot; is already in use. Please enter a different slug.</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-gray-500 mt-1">
                    Public URL preview: <span className="font-mono text-[#c91f26]">hexanews.in/{formData.parent ? `${formData.parent}/` : ''}{currentCleanSlug || 'slug'}</span>
                  </p>
                )}
              </div>

              {/* Parent Category / Hierarchy */}
              <div>
                <label className="block text-[12px] font-semibold text-[#444444] mb-1.5">
                  Parent Category & Placement
                </label>
                <select
                  value={formData.parent}
                  onChange={(e) => {
                    setFormError('');
                    setFormData({ ...formData, parent: e.target.value });
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#f9fafb] border border-[#d1d5db] rounded-xl text-sm text-[#0f172a] outline-none focus:border-[#c91f26] focus:bg-white transition cursor-pointer"
                >
                  <option value="">
                    ⭐ None — Top-Level (Appears Directly on Main Navbar)
                  </option>
                  {topLevelCategories
                    .filter((c) => !editingCategory || c.slug !== editingCategory.slug)
                    .map((cat, idx) => (
                      <option key={idx} value={cat.slug}>
                        📁 Subcategory under: {cat.label}
                      </option>
                    ))}
                </select>
                <p className="text-[11px] text-gray-500 mt-1.5">
                  Top-level categories show on the main website navbar. Subcategories appear inside their parent category&apos;s dropdown.
                </p>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    setFormError('');
                  }}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 border border-[#dddddd] hover:bg-gray-50 text-[#555555] text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || (Boolean(currentCleanSlug) && isSlugTaken)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c91f26] hover:bg-[#a8191f] text-white text-xs font-semibold rounded-xl shadow-sm transition active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting && <i className="bi bi-arrow-repeat animate-spin"></i>}
                  <span>{editingCategory ? 'Update Category' : 'Save Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. DELETE CONFIRMATION MODAL */}
      {deleteConfirmOpen && categoryToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-7 max-w-md w-full relative shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xl mx-auto mb-4">
              <i className="bi bi-exclamation-triangle-fill"></i>
            </div>

            <h3 className="text-lg font-bold text-[#0f172a] text-center mb-1">
              Delete &quot;{categoryToDelete.label}&quot;?
            </h3>
            <p className="text-xs text-gray-500 text-center mb-4">
              This category will be permanently removed from the database and the public navbar.
            </p>

            {categoryToDelete.count > 0 && (
              <div className="p-3 mb-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                <i className="bi bi-exclamation-circle-fill shrink-0 text-amber-600"></i>
                <span>
                  <strong>Warning:</strong> {categoryToDelete.count} published news article(s) are currently tagged under this category.
                </span>
              </div>
            )}

            {categoryToDelete.children && categoryToDelete.children.length > 0 && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <i className="bi bi-diagram-3-fill shrink-0 text-red-600"></i>
                <span>
                  <strong>Warning:</strong> Deleting this parent category will also delete its {categoryToDelete.children.length} subcategory item(s).
                </span>
              </div>
            )}

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setCategoryToDelete(null);
                }}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 border border-[#dddddd] hover:bg-gray-50 text-[#555555] text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCategory}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-sm transition active:scale-[0.98] cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isDeleting && <i className="bi bi-arrow-repeat animate-spin"></i>}
                <span>Delete Category</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

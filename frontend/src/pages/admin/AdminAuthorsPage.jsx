import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { formatImageUrl, handleImageError } from '../../services/api';

const ROLE_OPTIONS = [
  'Chief Editor',
  'Staff Reporter',
  'Senior Editor',
  'Reporter',
  'Editor',
  'Columnist',
  'Contributor',
];

export default function AdminAuthorsPage() {
  const { authors, token, loadDashboardData, showToast } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchFromUrl = searchParams.get('search') || '';

  const [authorModalOpen, setAuthorModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [searchQuery, setSearchQuery] = useState(searchFromUrl);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const updateAuthorUrlParams = useCallback((updates) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(value));
      }
    });
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  // Sync state on browser back/forward
  useEffect(() => {
    const s = searchParams.get('search') || '';
    if (s !== searchQuery) setSearchQuery(s);
  }, [searchParams]);

  // Debounced search sync
  const isFirstAuthorSearch = useRef(true);
  useEffect(() => {
    if (isFirstAuthorSearch.current) {
      isFirstAuthorSearch.current = false;
      return;
    }
    const timer = setTimeout(() => {
      const currentParam = searchParams.get('search') || '';
      if (searchQuery !== currentParam) {
        updateAuthorUrlParams({ search: searchQuery });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery('');
    updateAuthorUrlParams({ search: '' });
  };

  const [authorForm, setAuthorForm] = useState({
    name: '',
    role: 'Staff Reporter',
    email: '',
    password: '',
    photo: '',
    bio: '',
  });

  const openNewAuthorModal = () => {
    setEditingAuthor(null);
    setShowPassword(false);
    setAuthorForm({
      name: '',
      role: 'Staff Reporter',
      email: '',
      password: '',
      photo: '',
      bio: '',
    });
    setAuthorModalOpen(true);
  };

  const openEditAuthorModal = (author) => {
    setEditingAuthor(author);
    setShowPassword(false);
    setAuthorForm({
      name: author.name || '',
      role: author.role || 'Staff Reporter',
      email: author.email || '',
      password: '', // Blank by default, leave blank to keep unchanged
      photo: author.photo || '',
      bio: author.bio || '',
    });
    setAuthorModalOpen(true);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploadingPhoto(true);

    try {
      const res = await fetch('/api/upload/image', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setAuthorForm((prev) => ({ ...prev, photo: data.url }));
        showToast('Photo uploaded successfully!', 'success');
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveAuthor = async (e) => {
    e.preventDefault();
    if (!authorForm.name.trim()) {
      showToast('Author name is required', 'error');
      return;
    }

    const isEdit = Boolean(editingAuthor);
    const authorId = editingAuthor?._id || editingAuthor?.name;
    const endpoint = isEdit ? `/api/authors/${authorId}` : '/api/authors';
    const method = isEdit ? 'PUT' : 'POST';

    const payload = {
      name: authorForm.name.trim(),
      role: authorForm.role,
      email: authorForm.email.trim(),
      photo: authorForm.photo.trim(),
      bio: authorForm.bio.trim(),
    };

    // Only send password if provided
    if (authorForm.password.trim()) {
      payload.password = authorForm.password.trim();
    }

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save author');
      }

      showToast(isEdit ? 'Author updated successfully!' : 'Author created successfully!', 'success');
      setAuthorModalOpen(false);
      setEditingAuthor(null);
      loadDashboardData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteAuthor = async (author) => {
    const authorId = author._id || author.name;
    const confirmMessage = `Are you sure you want to delete "${author.name}"? This action cannot be undone.`;
    if (!window.confirm(confirmMessage)) return;

    try {
      const res = await fetch(`/api/authors/${authorId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete author');
      }

      showToast(`Author "${author.name}" deleted`, 'success');
      loadDashboardData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Filter authors by search query
  const filteredAuthors = authors.filter((a) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      a.name?.toLowerCase().includes(q) ||
      a.role?.toLowerCase().includes(q) ||
      a.email?.toLowerCase().includes(q) ||
      a.bio?.toLowerCase().includes(q)
    );
  });

  // Role pill badge styling helper
  const getRoleBadgeClass = (role = '') => {
    const r = role.toLowerCase();
    if (r.includes('chief')) {
      return 'bg-purple-100 text-purple-700 border-purple-200';
    }
    if (r.includes('staff')) {
      return 'bg-blue-100 text-blue-700 border-blue-200';
    }
    if (r.includes('senior')) {
      return 'bg-amber-100 text-amber-700 border-amber-200';
    }
    return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-semibold text-[#64748b]">Admin</span>
          <i className="bi bi-chevron-right text-[11px] text-[#94a3b8]"></i>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a] tracking-tight">
            Authors Management
          </h2>
          <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fee2e2] text-[#c91f26]">
            {filteredAuthors.length}
          </span>
        </div>

        <button
          type="button"
          onClick={openNewAuthorModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c91f26] hover:bg-[#a8191f] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition active:scale-[0.98] cursor-pointer self-start sm:self-auto"
        >
          <i className="bi bi-plus-lg font-bold"></i>
          <span>Add Author</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-[#e2e8f0] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="relative flex-1 w-full">
          <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] text-sm"></i>
          <input
            type="text"
            placeholder="Search authors by name, role, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-sm text-[#0f172a] placeholder-[#94a3b8] outline-none focus:border-[#c91f26] focus:bg-white transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] text-sm cursor-pointer"
              title="Clear search"
            >
              <i className="bi bi-x-circle-fill"></i>
            </button>
          )}
        </div>
      </div>

      {/* Authors List Table */}
      <div className="bg-white border border-[#e5e5e5] rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        {filteredAuthors.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-[#f1f5f9] flex items-center justify-center mx-auto mb-4 text-[#94a3b8] text-2xl">
              <i className="bi bi-people"></i>
            </div>
            <h4 className="text-base font-bold text-[#0f172a] mb-1">No authors found</h4>
            <p className="text-xs text-[#64748b] max-w-sm mx-auto mb-6">
              {searchQuery
                ? 'No authors matched your search criteria. Try a different keyword.'
                : 'Get started by creating your first author profile.'}
            </p>
            {searchQuery ? (
              <button
                type="button"
                onClick={handleClearSearch}
                className="px-4 py-2 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#334155] text-xs font-semibold rounded-lg transition cursor-pointer"
              >
                Clear Search
              </button>
            ) : (
              <button
                type="button"
                onClick={openNewAuthorModal}
                className="px-5 py-2.5 bg-[#c91f26] hover:bg-[#a8191f] text-white text-xs font-semibold rounded-lg transition shadow-sm cursor-pointer"
              >
                + Add Author
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="bg-[#fafafa] border-b border-[#e5e5e5] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                  <th className="py-3.5 px-5">Author</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Bio</th>
                  <th className="py-3.5 px-4 text-center">Articles</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f0f0]">
                {filteredAuthors.map((a, idx) => {
                  const authorKey = a._id || a.name || idx;
                  const photoUrl = a.photo ? formatImageUrl(a.photo) : null;
                  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(a.name)}&background=c91f26&color=fff&bold=true`;

                  return (
                    <tr key={authorKey} className="hover:bg-[#fafafa] transition-colors">
                      {/* Photo & Name */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-[#e2e8f0] border border-black/5 flex-shrink-0 shadow-sm">
                            <img
                              src={photoUrl || defaultAvatar}
                              alt={a.name}
                              onError={(e) => handleImageError(e, defaultAvatar)}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-[#111827] text-sm">
                              {a.name}
                            </div>
                            {a.nameMl && (
                              <div className="text-[11px] text-[#64748b]">
                                {a.nameMl}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${getRoleBadgeClass(
                            a.role
                          )}`}
                        >
                          {a.role || 'Staff Reporter'}
                        </span>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-4 text-[#475569]">
                        {a.email ? (
                          <a
                            href={`mailto:${a.email}`}
                            className="hover:text-[#c91f26] transition-colors flex items-center gap-1.5"
                          >
                            <i className="bi bi-envelope text-xs text-[#94a3b8]"></i>
                            <span>{a.email}</span>
                          </a>
                        ) : (
                          <span className="text-[#94a3b8] italic">No email</span>
                        )}
                      </td>

                      {/* Bio */}
                      <td className="py-4 px-4 max-w-[280px]">
                        <p className="text-xs text-[#64748b] line-clamp-2 leading-relaxed" title={a.bio}>
                          {a.bio || <span className="italic text-[#94a3b8]">No bio provided</span>}
                        </p>
                      </td>

                      {/* Articles Count */}
                      <td className="py-4 px-4 text-center">
                        <span className="inline-block px-2 py-0.5 bg-[#f1f5f9] text-[#334155] rounded-md font-bold text-xs">
                          {a.count || 0}
                        </span>
                      </td>

                      {/* Actions: Edit & Delete */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditAuthorModal(a)}
                            className="w-8 h-8 rounded-lg bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] hover:text-[#0f172a] flex items-center justify-center transition shadow-sm cursor-pointer"
                            title="Edit author"
                          >
                            <i className="bi bi-pencil text-sm"></i>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAuthor(a)}
                            className="w-8 h-8 rounded-lg bg-[#fef2f2] text-[#dc2626] hover:bg-[#fee2e2] flex items-center justify-center transition shadow-sm cursor-pointer"
                            title="Delete author"
                          >
                            <i className="bi bi-trash text-sm"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ==========================================
          AUTHOR MODAL (Create & Edit)
      ========================================== */}
      {authorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl my-8">
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => {
                setAuthorModalOpen(false);
                setEditingAuthor(null);
              }}
              className="absolute top-5 right-5 text-gray-400 hover:text-[#c91f26] text-xl transition cursor-pointer"
            >
              <i className="bi bi-x-lg"></i>
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <h3 className="text-[20px] font-bold text-[#111111]">
                {editingAuthor ? 'Edit Author' : 'New Author'}
              </h3>
              <p className="text-xs text-[#64748b] mt-1">
                {editingAuthor
                  ? `Update details and credentials for ${editingAuthor.name}`
                  : 'Add a new author to your editorial and reporting team'}
              </p>
            </div>

            <form onSubmit={handleSaveAuthor} className="space-y-4 text-[13px]">
              {/* Photo Upload & Preview Row */}
              <div>
                <label className="block text-[12px] font-semibold text-[#374151] mb-1.5">
                  Author Photo
                </label>
                <div className="flex items-center gap-4">
                  {/* Photo Avatar Thumbnail */}
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-[#f1f5f9] border border-[#d1d5db] flex-shrink-0 shadow-inner">
                    <img
                      src={
                        authorForm.photo
                          ? formatImageUrl(authorForm.photo)
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              authorForm.name || 'Author'
                            )}&background=c91f26&color=fff&bold=true`
                      }
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => handleImageError(e, 'https://ui-avatars.com/api/?name=Author&background=c91f26&color=fff')}
                    />
                  </div>

                  {/* Upload Button & URL field */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#064e3b] hover:bg-[#043d2e] text-white text-xs font-semibold rounded-lg cursor-pointer transition shadow-sm">
                        <i className="bi bi-upload"></i>
                        <span>{uploadingPhoto ? 'Uploading...' : 'Upload Photo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          disabled={uploadingPhoto}
                          className="hidden"
                        />
                      </label>
                      {authorForm.photo && (
                        <button
                          type="button"
                          onClick={() => setAuthorForm({ ...authorForm, photo: '' })}
                          className="px-2.5 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Or paste image URL"
                      value={authorForm.photo}
                      onChange={(e) => setAuthorForm({ ...authorForm, photo: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#f9f9f9] border border-[#dddddd] rounded-lg text-xs text-[#111111] outline-none focus:border-[#c91f26]"
                    />
                  </div>
                </div>
              </div>

              {/* Name (Required) */}
              <div>
                <label className="block text-[12px] font-semibold text-[#374151] mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={authorForm.name}
                  onChange={(e) => setAuthorForm({ ...authorForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#f9f9f9] border border-[#dddddd] rounded-lg text-sm text-[#111111] outline-none focus:border-[#c91f26] focus:bg-white transition"
                />
              </div>

              {/* Role Dropdown */}
              <div>
                <label className="block text-[12px] font-semibold text-[#374151] mb-1">
                  Role *
                </label>
                <div className="relative">
                  <select
                    value={authorForm.role}
                    onChange={(e) => setAuthorForm({ ...authorForm, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#f9f9f9] border border-[#dddddd] rounded-lg text-sm text-[#111111] outline-none focus:border-[#c91f26] focus:bg-white appearance-none cursor-pointer transition"
                  >
                    {ROLE_OPTIONS.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <i className="bi bi-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-xs pointer-events-none"></i>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[12px] font-semibold text-[#374151] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="e.g. author@hexanews.in"
                  value={authorForm.email}
                  onChange={(e) => setAuthorForm({ ...authorForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#f9f9f9] border border-[#dddddd] rounded-lg text-sm text-[#111111] outline-none focus:border-[#c91f26] focus:bg-white transition"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[12px] font-semibold text-[#374151]">
                    Password
                  </label>
                  {editingAuthor && (
                    <span className="text-[11px] text-[#64748b]">
                      (Leave blank to keep unchanged)
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={editingAuthor ? '•••••••• (unchanged)' : 'Enter author password'}
                    value={authorForm.password}
                    onChange={(e) => setAuthorForm({ ...authorForm, password: e.target.value })}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-[#f9f9f9] border border-[#dddddd] rounded-lg text-sm text-[#111111] outline-none focus:border-[#c91f26] focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-[12px] font-semibold text-[#374151] mb-1">
                  Bio / Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief author biography, specialization, experience..."
                  value={authorForm.bio}
                  onChange={(e) => setAuthorForm({ ...authorForm, bio: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#f9f9f9] border border-[#dddddd] rounded-lg text-sm text-[#111111] outline-none focus:border-[#c91f26] focus:bg-white transition"
                />
              </div>

              {/* Modal Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#f1f5f9]">
                <button
                  type="button"
                  onClick={() => {
                    setAuthorModalOpen(false);
                    setEditingAuthor(null);
                  }}
                  className="px-4 py-2 border border-[#dddddd] text-[#666666] hover:bg-gray-100 text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingPhoto}
                  className="px-5 py-2 bg-[#c91f26] hover:bg-[#a8191f] text-white text-xs font-semibold rounded-lg transition shadow-sm active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  {editingAuthor ? 'Update Author' : 'Create Author'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

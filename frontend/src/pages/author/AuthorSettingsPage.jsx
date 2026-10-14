import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { formatImageUrl } from '../../services/api';

export default function AuthorSettingsPage() {
  const context = useOutletContext() || {};
  const { token, showToast = () => {} } = context;
  const activeUser = context.authorUser || context.user;
  const setActiveUser = context.setAuthorUser || context.setUser || (() => {});

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: activeUser?.name || '',
    email: activeUser?.email || '',
    role: activeUser?.role || 'Staff Reporter',
    photo: activeUser?.photo || '',
    bio: activeUser?.bio || '',
  });

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const body = new FormData();
    body.append('image', file);
    setUploading(true);

    try {
      const res = await fetch('/api/upload/image', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setFormData((prev) => ({ ...prev, photo: data.url }));
        showToast('Photo uploaded! Click Save Profile to apply.', 'success');
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showToast('Name is required', 'error');
      return;
    }

    setSaving(true);
    const authorId = activeUser?.id || activeUser?._id || activeUser?.name;

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      photo: formData.photo.trim(),
      bio: formData.bio.trim(),
    };

    try {
      const res = await fetch(`/api/authors/${authorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      // Update state and localStorage
      const updatedUser = {
        ...activeUser,
        name: data.name || payload.name,
        email: data.email || payload.email,
        photo: data.photo || payload.photo,
        bio: data.bio || payload.bio,
      };

      setActiveUser(updatedUser);
      localStorage.setItem('hexa_author_user', JSON.stringify(updatedUser));
      localStorage.setItem('hexa_user', JSON.stringify(updatedUser));
      showToast('Author profile updated successfully!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    formData.name || 'Author'
  )}&background=c91f26&color=fff&bold=true`;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="pb-5 mb-6 border-b border-[#f1f5f9]">
          <h3 className="text-[20px] font-bold text-[#111827]">Author Profile Settings</h3>
          <p className="text-xs text-[#64748b] mt-0.5">
            Manage your personal byline, bio, credentials, and avatar photo
          </p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6 text-[13px]">
          {/* Avatar & Photo Upload Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-white border-2 border-white shadow-md flex-shrink-0">
              <img
                src={formData.photo ? formatImageUrl(formData.photo) : defaultAvatar}
                alt={formData.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultAvatar;
                }}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 space-y-2">
              <div className="font-bold text-[#111827] text-sm">Profile Avatar</div>
              <p className="text-xs text-[#64748b]">
                This photo appears in your byline and author bio card on published articles.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#064e3b] hover:bg-[#043d2e] text-white text-xs font-semibold rounded-lg cursor-pointer transition shadow-sm">
                  <i className="bi bi-upload"></i>
                  <span>{uploading ? 'Uploading...' : 'Upload New Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                {formData.photo && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, photo: '' })}
                    className="px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    Reset to Default
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Name & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#374151] mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-[#d1d5db] rounded-lg text-sm text-[#111827] outline-none focus:border-[#c91f26] focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#374151] mb-1">
                Editorial Role
              </label>
              <input
                type="text"
                disabled
                value={formData.role}
                className="w-full px-3.5 py-2.5 bg-[#f1f5f9] border border-[#d1d5db] rounded-lg text-sm text-[#64748b] font-medium cursor-not-allowed"
              />
              <span className="text-[10px] text-[#94a3b8] mt-1 inline-block">
                Assigned by Hexa News Chief Administration
              </span>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[12px] font-semibold text-[#374151] mb-1">
              Email Address
            </label>
            <input
              type="email"
              disabled
              value={formData.email}
              className="w-full px-3.5 py-2.5 bg-[#f1f5f9] border border-[#d1d5db] rounded-lg text-sm text-[#64748b] font-medium cursor-not-allowed"
            />
            <span className="text-[10px] text-[#94a3b8] mt-1 inline-block">
              Assigned by Hexa News Administration. Can only be modified by Admin.
            </span>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-[12px] font-semibold text-[#374151] mb-1">
              Author Biography
            </label>
            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Write a brief professional overview about yourself, beats you cover, and journalism background..."
              className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-[#d1d5db] rounded-lg text-sm text-[#111827] outline-none focus:border-[#c91f26] focus:bg-white transition"
            />
          </div>

          {/* Account Security Note */}
          <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-3 text-xs text-[#64748b]">
            <i className="bi bi-shield-lock-fill text-base text-[#c91f26]"></i>
            <div>
              <span className="font-semibold text-[#111827]">Account Security: </span>
              Author login credentials and password updates are managed directly by the Chief Administrator.
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-[#f1f5f9]">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#c91f26] hover:bg-[#a8191f] text-white text-sm font-semibold rounded-xl shadow-sm transition active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              <i className="bi bi-check2"></i>
              <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

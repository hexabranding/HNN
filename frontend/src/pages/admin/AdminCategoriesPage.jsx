import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

export default function AdminCategoriesPage() {
  const { categories, token, loadDashboardData, showToast } = useOutletContext();

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [catForm, setCatForm] = useState({ id: '', label: '', slug: '' });

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
        setCatForm({ id: '', label: '', slug: '' });
        loadDashboardData();
      } else {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create category');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
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
    </div>
  );
}

import React from 'react';
import { Link, useOutletContext, useNavigate } from 'react-router-dom';

export default function DashboardOverviewView({ mode = 'admin' }) {
  const context = useOutletContext() || {};
  const {
    token,
    user,
    authorUser,
    stats = { articles: 0, categories: 0, authors: 0, views: 0 },
    articles = [],
    allArticles = [],
    myArticles: contextMyArticles,
    authorStats = { articlesCount: 0, viewsCount: 0, publishedCount: 0, role: 'Staff Reporter' },
    loadData,
    loadDashboardData,
    loadAuthorData,
    showToast = () => {},
  } = context;

  const navigate = useNavigate();
  const refreshData = loadData || loadDashboardData || loadAuthorData || (() => {});
  const activeUser = user || authorUser;
  const isAuthorMode = mode === 'author';
  const authorName = (activeUser?.name || '').toLowerCase().trim();

  const sourceArticles = articles.length > 0 ? articles : allArticles;

  // Filter author's articles if in author mode
  const myStories = contextMyArticles || sourceArticles.filter(
    (a) => a.author && a.author.toLowerCase().trim() === authorName
  );

  const displayRecentArticles = isAuthorMode ? myStories.slice(0, 6) : sourceArticles.slice(0, 6);

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

  const newsPath = isAuthorMode ? '/author-dashboard/news' : '/admin/news';
  const settingsPath = isAuthorMode ? '/author-dashboard/settings' : '/admin/settings';

  return (
    <div className="space-y-7">
      {/* 1. Metric Stats Cards */}
      {isAuthorMode ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#e5e5e5] rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wider">
                My Articles
              </span>
              <div className="w-8 h-8 rounded-lg bg-red-50 text-[#c91f26] flex items-center justify-center text-sm">
                <i className="bi bi-file-earmark-text"></i>
              </div>
            </div>
            <div className="text-[28px] font-extrabold text-[#c91f26] leading-none mb-1">
              {authorStats.articlesCount || myStories.length}
            </div>
            <div className="text-[11px] text-[#888888]">Authored news stories</div>
          </div>

          <div className="bg-white border border-[#e5e5e5] rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wider">
                Total Readers
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm">
                <i className="bi bi-eye"></i>
              </div>
            </div>
            <div className="text-[28px] font-extrabold text-[#111111] leading-none mb-1">
              {(authorStats.viewsCount || 0).toLocaleString()}
            </div>
            <div className="text-[11px] text-[#888888]">Article readership count</div>
          </div>

          <div className="bg-white border border-[#e5e5e5] rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wider">
                Published
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
                <i className="bi bi-check-circle"></i>
              </div>
            </div>
            <div className="text-[28px] font-extrabold text-[#2e7d32] leading-none mb-1">
              {authorStats.publishedCount || myStories.filter((a) => a.published !== false).length}
            </div>
            <div className="text-[11px] text-[#888888]">Live stories on portal</div>
          </div>

          <div className="bg-white border border-[#e5e5e5] rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wider">
                Editorial Role
              </span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-sm">
                <i className="bi bi-shield-check"></i>
              </div>
            </div>
            <div className="text-[18px] font-bold text-[#111111] leading-snug mb-1 truncate">
              {authorStats.role || activeUser?.role || 'Staff Reporter'}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Active Author</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#e5e5e5] rounded-[12px] p-5 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="text-[28px] font-extrabold text-[#c91f26] leading-none mb-1">
              {stats.articles || sourceArticles.length}
            </div>
            <div className="text-[12px] text-[#888888] uppercase tracking-[1px] font-medium">
              ARTICLES
            </div>
          </div>

          <div className="bg-white border border-[#e5e5e5] rounded-[12px] p-5 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="text-[28px] font-extrabold text-[#c91f26] leading-none mb-1">
              {stats.categories || 0}
            </div>
            <div className="text-[12px] text-[#888888] uppercase tracking-[1px] font-medium">
              CATEGORIES
            </div>
          </div>

          <div className="bg-white border border-[#e5e5e5] rounded-[12px] p-5 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="text-[28px] font-extrabold text-[#c91f26] leading-none mb-1">
              {stats.authors || 0}
            </div>
            <div className="text-[12px] text-[#888888] uppercase tracking-[1px] font-medium">
              AUTHORS
            </div>
          </div>

          <div className="bg-white border border-[#e5e5e5] rounded-[12px] p-5 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="text-[28px] font-extrabold text-[#c91f26] leading-none mb-1">
              {(stats.views || 0).toLocaleString()}
            </div>
            <div className="text-[12px] text-[#888888] uppercase tracking-[1px] font-medium">
              TOTAL VIEWS
            </div>
          </div>
        </div>
      )}

      {/* 2. Unified Welcome & Quick Action Card (#111111 Dark Banner) */}
      <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6 sm:p-7 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-lg">
        <div>
          <div className="inline-block px-2.5 py-0.5 bg-[#c91f26]/20 border border-[#c91f26]/40 rounded-full text-[10px] font-bold text-red-400 tracking-wider uppercase mb-2">
            {isAuthorMode ? 'JOURNALIST DESK' : 'ADMIN CONTROL CENTER'}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
            Welcome back, {activeUser?.name || (isAuthorMode ? 'Author' : 'Admin')}!
          </h3>
          <p className="text-[#a0a0a0] text-xs sm:text-sm max-w-xl mt-1 leading-relaxed">
            {isAuthorMode
              ? `You have published ${authorStats.articlesCount || myStories.length} stories reaching ${(authorStats.viewsCount || 0).toLocaleString()} readers worldwide.`
              : 'Monitor live reader metrics, manage publication categories, and publish breaking news reports.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={newsPath}
            state={{ openEditor: true }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c91f26] hover:bg-[#a8191f] text-white text-sm font-semibold rounded-xl shadow-md transition active:scale-[0.98] cursor-pointer whitespace-nowrap"
          >
            <i className="bi bi-plus-lg font-bold"></i>
            <span>{isAuthorMode ? 'Write New Story' : 'Add New News'}</span>
          </Link>
          <Link
            to={settingsPath}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-xl transition cursor-pointer whitespace-nowrap"
          >
            <i className="bi bi-gear"></i>
            <span>{isAuthorMode ? 'Profile' : 'Settings'}</span>
          </Link>
        </div>
      </div>

      {/* 3. Recent Articles Panel */}
      <div className="bg-white border border-[#e5e5e5] rounded-[12px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-[18px] font-bold text-[#111111]">
              {isAuthorMode ? 'My Recent Stories' : 'Recent Articles'}
            </h3>
            <p className="text-xs text-[#888888] mt-0.5">
              {isAuthorMode ? 'Your latest drafted and published reports' : 'Latest published stories on HEXA NEWS'}
            </p>
          </div>
          {displayRecentArticles.length > 0 && (
            <Link
              to={newsPath}
              className="text-xs text-[#c91f26] hover:underline font-semibold"
            >
              {isAuthorMode ? 'Manage All My Stories →' : 'View All →'}
            </Link>
          )}
        </div>

        {displayRecentArticles.length === 0 ? (
          <div className="py-16 text-center text-[#888888] text-[14px]">
            <div className="w-12 h-12 rounded-full bg-[#f5f5f5] flex items-center justify-center mx-auto mb-3 text-[#888888] text-xl">
              <i className="bi bi-pencil-square"></i>
            </div>
            <p className="font-semibold text-[#111111] mb-1">No articles found</p>
            <p className="text-xs text-[#888888] mb-4">
              {isAuthorMode ? 'You have not written any stories yet.' : 'No published stories found in the portal.'}
            </p>
            <Link
              to={newsPath}
              state={{ openEditor: true }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#c91f26] hover:bg-[#a8191f] text-white text-xs font-semibold rounded-lg shadow-sm transition"
            >
              + Create First Story
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b-2 border-[#eeeeee] text-[11px] text-[#888888] uppercase tracking-[1px]">
                  <th className="py-3 px-3.5">Title</th>
                  <th className="py-3 px-3.5">Category</th>
                  {!isAuthorMode && <th className="py-3 px-3.5">Author</th>}
                  <th className="py-3 px-3.5">Date</th>
                  <th className="py-3 px-3.5">Views</th>
                  <th className="py-3 px-3.5">Status</th>
                  <th className="py-3 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f0f0]">
                {displayRecentArticles.map((a, idx) => (
                  <tr key={a._id || a.slug || idx} className="hover:bg-[#fafafa] transition-colors">
                    <td className="py-3 px-3.5 max-w-[280px] truncate font-semibold text-[#111111]">
                      <Link
                        to={`/post-detail?slug=${a.slug}`}
                        target="_blank"
                        className="hover:text-[#c91f26] transition"
                      >
                        {a.title}
                      </Link>
                    </td>
                    <td className="py-3 px-3.5">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#e3f2fd] text-[#1565c0]">
                        {a.category}
                      </span>
                    </td>
                    {!isAuthorMode && (
                      <td className="py-3 px-3.5 text-[#555555]">{a.author || '-'}</td>
                    )}
                    <td className="py-3 px-3.5 text-[#555555] text-xs">
                      {a.date ? (a.date.includes('T') ? a.date.split('T')[0] : a.date) : '-'}
                    </td>
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
                    <td className="py-3 px-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/post-detail?slug=${a.slug}`}
                          target="_blank"
                          className="w-7 h-7 rounded-lg bg-[#ecfdf5] text-[#059669] hover:bg-[#d1fae5] flex items-center justify-center transition"
                          title="View live"
                        >
                          <i className="bi bi-eye text-xs"></i>
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            navigate(newsPath, { state: { editArticle: a } });
                          }}
                          className="w-7 h-7 rounded-lg bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] flex items-center justify-center transition cursor-pointer"
                          title="Edit article"
                        >
                          <i className="bi bi-pencil text-xs"></i>
                        </button>
                        {isAuthorMode && (
                          <button
                            type="button"
                            onClick={() => handleDeleteArticle(a._id || a.slug)}
                            className="w-7 h-7 rounded-lg bg-[#fef2f2] text-[#dc2626] hover:bg-[#fee2e2] flex items-center justify-center transition cursor-pointer"
                            title="Delete article"
                          >
                            <i className="bi bi-trash text-xs"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { useOutletContext } from 'react-router-dom';

export default function AdminSettingsPage() {
  const { settings, setSettings, showToast } = useOutletContext();

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Settings saved successfully!', 'success');
  };

  return (
    <div className="bg-white border border-[#e5e5e5] rounded-[12px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] max-w-2xl">
      <h3 className="text-[18px] font-bold text-[#111111] mb-5">Site Settings</h3>
      <form onSubmit={handleSave} className="space-y-4">
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
  );
}

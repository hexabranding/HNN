import React, { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section className="pt-5 pb-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-8 sm:p-14 text-center shadow-2xl">
          {/* Radial decorative light elements */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#c91f26]/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-[#c91f26]/15 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-prompt tracking-tight mb-3">
              Get the latest news and updates into your inbox
            </h2>

            <p className="text-sm sm:text-base text-gray-300 mb-8 font-normal">
              Connect Us now &mdash; subscribe for daily updates straight to your inbox.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full sm:flex-1 px-5 py-3.5 rounded-xl bg-white text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#c91f26] shadow-inner"
              />

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#c91f26] hover:bg-[#a8191f] text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 whitespace-nowrap"
              >
                <span>Subscribe</span>
                <i className="bi bi-send-fill text-xs"></i>
              </button>
            </form>

            {submitted && (
              <p className="text-emerald-400 text-sm font-semibold mt-4 animate-fadeIn">
                <i className="bi bi-check-circle-fill mr-1.5"></i>
                Thank you! You have successfully subscribed to HEXA NEWS updates.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

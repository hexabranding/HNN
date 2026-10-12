import React, { useState } from 'react';
import { STATIC_EDITOR_CHOICE } from '../data/staticHomeData';
import { formatImageUrl } from '../services/api';

export default function Footer({ topArticles = [] }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 5000);
  };

  const picks = (topArticles && topArticles.length >= 2)
    ? topArticles.slice(0, 2)
    : STATIC_EDITOR_CHOICE.slice(0, 2);

  return (
    <footer className="bg-[#111111] text-gray-400 pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-gray-800">
          {/* Col 1: Brand & Newsletter */}
          <div className="lg:col-span-4 space-y-4">
            <img
              src="/images/logo%20hexa.png"
              alt="HEXA NEWS"
              className="h-16 w-auto object-contain brightness-110"
            />
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              HEXA NEWS delivers credible, fearless, and insightful coverage across politics, diaspora, economy, and culture.
            </p>

            <form onSubmit={handleSubscribe} className="pt-2">
              <p className="text-xs font-semibold text-gray-300 mb-2">
                Get our best stories delivered to your inbox.
              </p>
              <div className="flex rounded-lg overflow-hidden border border-gray-700 focus-within:border-[#c91f26]">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full bg-[#1c1c1f] px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#c91f26] hover:bg-[#a8191f] text-white px-4 text-xs font-bold transition flex-shrink-0"
                >
                  Subscribe
                </button>
              </div>
              {subscribed && (
                <p className="text-xs text-green-400 mt-2 font-medium">
                  ✓ Thank you! You've been subscribed to our newsletter.
                </p>
              )}
            </form>
          </div>

          {/* Col 2: Top Articles */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-prompt border-b border-gray-800 pb-2">
              Top Articles This Week
            </h4>
            <div className="space-y-3.5">
              {picks.map((item, idx) => (
                <a
                  key={item._id || item.slug || idx}
                  href={`/post-detail.html?slug=${item.slug}`}
                  className="flex gap-3.5 items-center group"
                >
                  <img
                    src={formatImageUrl(item.image)}
                    alt={item.title}
                    className="w-16 h-14 rounded object-cover flex-shrink-0 bg-gray-800"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-semibold text-gray-200 group-hover:text-[#c91f26] transition line-clamp-2 leading-snug">
                      {item.title}
                    </h5>
                    <span className="text-[11px] text-gray-500 mt-1 block">
                      <i className="bi bi-calendar3 mr-1"></i> {item.date || 'Jul 2026'}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-prompt border-b border-gray-800 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="/sports.html" className="hover:text-white transition">Sports</a></li>
              <li><a href="/health.html" className="hover:text-white transition">Health</a></li>
              <li><a href="/technology.html" className="hover:text-white transition">Technology</a></li>
              <li><a href="/business.html" className="hover:text-white transition">Business</a></li>
              <li><a href="/contact.html" className="hover:text-white transition">Contact</a></li>
              <li><a href="/admin" className="hover:text-[#c91f26] transition font-bold">Admin Portal</a></li>
            </ul>
          </div>

          {/* Col 4: Social */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-prompt border-b border-gray-800 pb-2">
              Follow Us
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-white transition">
                  <i className="bi bi-facebook text-[#c91f26]"></i> Facebook
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-white transition">
                  <i className="bi bi-twitter-x text-[#c91f26]"></i> Twitter
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-white transition">
                  <i className="bi bi-pinterest text-[#c91f26]"></i> Pinterest
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-white transition">
                  <i className="bi bi-instagram text-[#c91f26]"></i> Instagram
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-white transition">
                  <i className="bi bi-youtube text-[#c91f26]"></i> YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} HEXA NEWS. Powered by{' '}
            <span className="text-[#c91f26] font-semibold">Hexa Branding</span>.
          </p>

          <div className="flex gap-4">
            <a href="/contact.html" className="hover:text-gray-300">Privacy Policy</a>
            <span>•</span>
            <a href="/contact.html" className="hover:text-gray-300">Terms & Conditions</a>
            <span>•</span>
            <a href="/contact.html" className="hover:text-gray-300">Help Center</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

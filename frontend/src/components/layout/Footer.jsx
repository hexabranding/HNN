import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchApi } from '../../services/api';

export default function Footer({ topArticles = [] }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [footerCategories, setFooterCategories] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function loadFooterCategories() {
      try {
        const cats = await fetchApi('/categories');
        if (isMounted && Array.isArray(cats) && cats.length > 0) {
          setFooterCategories(cats.slice(0, 6));
        }
      } catch (_err) {}
    }
    loadFooterCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  const defaultTopArticles = [
    {
      title: 'Our Begin Now To Being What You Will Be.',
      date: 'Jul 02, 2026',
      comments: '520 Comment',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=120&q=80',
      slug: 'our-begin-now-to-being-what-you-will-be',
    },
    {
      title: 'Our Begin Now To Being What You Will Be.',
      date: 'Jul 11, 2026',
      comments: '454 Comment',
      image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=120&q=80',
      slug: 'our-begin-now-to-being-what-you-will-be-2',
    },
  ];

  const articlesToDisplay =
    topArticles && topArticles.length >= 2
      ? topArticles.slice(0, 2).map((a, i) => ({
          title: a.title || defaultTopArticles[i].title,
          date: a.date || defaultTopArticles[i].date,
          comments: `${a.comments || 500} Comment`,
          image: a.image || defaultTopArticles[i].image,
          slug: a.slug || `post-${i + 1}`,
        }))
      : defaultTopArticles;

  return (
    <footer className="footer style-1 relative overflow-hidden bg-[linear-gradient(135deg,#0c1118_0%,#151d29_55%,#101820_100%)] text-white/70 w-full before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[4px] before:bg-[linear-gradient(90deg,#ff4c60,#ff9b78,#548f6f)] after:content-[''] after:absolute after:w-[430px] after:h-[430px] after:-right-[180px] after:-top-[250px] after:rounded-full after:bg-[rgba(255,76,96,0.08)] after:pointer-events-none">
      <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Widget Area */}
        <div className="pt-[90px] pb-[72px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Col 1: Brand Info & Newsletter (lg:col-span-3) */}
            <div className="lg:col-span-3 max-w-[290px]">
              <div className="mb-[24px]">
                <a href="/" className="inline-block">
                  <img
                    src="/images/logo%20hexa.png"
                    alt="HEXA NEWS"
                    className="h-[75px] md:h-[80px] w-auto object-contain"
                  />
                </a>
              </div>
              <h3 className="font-['Prompt',sans-serif] text-[18px] text-white font-semibold leading-[1.45] mb-[15px]">
                Stay informed. Stay ahead.
              </h3>
              <div>
                <p className="text-[14px] text-white/70 mb-[10px] leading-relaxed">
                  Get our best stories delivered to your inbox.
                </p>
                <form
                  onSubmit={handleSubscribe}
                  className="flex rounded-[6px] overflow-hidden border border-white/[0.14] bg-white/[0.06] transition-colors focus-within:border-[#ff4c60]"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Your Email..."
                    className="flex-1 min-w-0 px-3 py-2 bg-transparent text-white text-[13px] font-['Inter',sans-serif] outline-none placeholder:text-white/55"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#ff4c60] text-white font-['Prompt',sans-serif] font-semibold text-[13px] hover:bg-[#548f6f] transition-all cursor-pointer whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </form>
                {subscribed && (
                  <p className="text-xs text-[#548f6f] mt-2 font-medium">
                    ✓ Subscribed successfully!
                  </p>
                )}
              </div>
            </div>

            {/* Col 2: Top Article This Week (lg:col-span-4) */}
            <div className="lg:col-span-4 lg:pl-4">
              <h4 className="relative text-[17px] tracking-[0.02em] text-white mb-[24px] pb-[14px] border-b border-white/10 font-semibold font-['Prompt',sans-serif] after:content-[''] after:absolute after:left-0 after:-bottom-[1px] after:w-[42px] after:h-[2px] after:bg-[#ff4c60]">
                Top Article This Week
              </h4>
              <div className="space-y-[14px]">
                {articlesToDisplay.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-[12px] p-[10px] border border-white/[0.08] rounded-[10px] bg-white/[0.035] hover:-translate-y-[3px] hover:border-[#ff4c60]/50 hover:bg-white/[0.06] transition-all duration-300 group"
                  >
                    <a
                      href={`/post-detail?slug=${item.slug}`}
                      className="w-[80px] h-[70px] rounded-[6px] overflow-hidden flex-shrink-0 bg-gray-800 block"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-110"
                        loading="lazy"
                      />
                    </a>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <h6 className="font-['Prompt',sans-serif] text-[15px] font-semibold text-white/80 leading-[1.4] mb-[6px] group-hover:text-[#ff4c60] transition-colors line-clamp-2">
                        <a href={`/post-detail?slug=${item.slug}`}>{item.title}</a>
                      </h6>
                      <ul className="flex items-center gap-[12px] text-[12px] text-white/40 list-none p-0 m-0">
                        <li className="flex items-center gap-[4px]">
                          <i className="bi bi-calendar3 text-[11px]"></i>
                          <span>{item.date}</span>
                        </li>
                        <li className="flex items-center gap-[4px]">
                          <i className="bi bi-chat text-[11px]"></i>
                          <span>{item.comments}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Col 3: Quick Link (lg:col-span-3) */}
            <div className="lg:col-span-3 lg:pl-6">
              <h4 className="relative text-[17px] tracking-[0.02em] text-white mb-[24px] pb-[14px] border-b border-white/10 font-semibold font-['Prompt',sans-serif] after:content-[''] after:absolute after:left-0 after:-bottom-[1px] after:w-[42px] after:h-[2px] after:bg-[#ff4c60]">
                Quick Link
              </h4>
              <ul className="space-y-[12px] list-none p-0 m-0">
                {(footerCategories.length > 0
                  ? footerCategories.map((c) => ({
                      name: c.label || c.slug,
                      path: `/${c.slug}`,
                    }))
                  : [
                      { name: 'About', path: '/about' },
                      { name: 'Business', path: '/business' },
                      { name: 'Technology', path: '/technology' },
                      { name: 'Sports', path: '/sports' },
                      { name: 'Contact', path: '/contact' },
                    ]
                ).map((item, i) => (
                  <li key={i}>
                    <Link
                      to={item.path}
                      className="text-[14px] text-white/60 hover:text-white transition-all duration-300 flex items-center gap-[6px] group"
                    >
                      <span className="text-[#ff4c60] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
                        →
                      </span>
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {item.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Social Media (lg:col-span-2) */}
            <div className="lg:col-span-2">
              <h4 className="relative text-[17px] tracking-[0.02em] text-white mb-[24px] pb-[14px] border-b border-white/10 font-semibold font-['Prompt',sans-serif] after:content-[''] after:absolute after:left-0 after:-bottom-[1px] after:w-[42px] after:h-[2px] after:bg-[#ff4c60]">
                Social Media
              </h4>
              <ul className="space-y-[10px] list-none p-0 m-0">
                {[
                  { name: 'Facebook', icon: 'bi-facebook' },
                  { name: 'Twitter', icon: 'bi-twitter-x' },
                  { name: 'Pinterest', icon: 'bi-pinterest' },
                  { name: 'Instagram', icon: 'bi-instagram' },
                ].map((item, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="flex items-center gap-[8px] text-[14px] text-white/60 hover:text-white transition-all duration-300 group"
                    >
                      <i
                        className={`inline-flex items-center justify-center w-[30px] h-[30px] rounded-full text-[14px] text-white bg-white/10 group-hover:bg-[#ff4c60] group-hover:-translate-y-0.5 transition-all duration-300 bi ${item.icon}`}
                      ></i>
                      <span>{item.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Help Center Bar */}
        <div className="py-[22px] border-t border-b border-white/[0.08] flex flex-col md:flex-row justify-between items-center gap-4">
          <h5 className="font-['Prompt',sans-serif] text-[18px] font-semibold text-white">
            <a href="/contact" className="hover:text-[#ff4c60] transition-colors">
              Help Center
            </a>
          </h5>
          <ul className="flex flex-wrap items-center gap-[25px] list-none p-0 m-0">
            {['Privacy Policy', 'Terms & Conditions', 'Services', 'Help'].map((item, i) => (
              <li key={i}>
                <a
                  href={item === 'Help' ? '/contact' : '#'}
                  className="text-[14px] text-white/50 hover:text-[#ff4c60] transition-colors duration-200"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Copyright Area */}
        <div className="pt-[30px] pb-[30px] text-center">
          <p className="text-[14px] text-white/40 m-0">
            &copy; 2026 HEXA NEWS is Proudly Powered by{' '}
            <a href="#" className="text-[#ff4c60] hover:underline font-medium">
              Hexa Branding
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

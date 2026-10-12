import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header({ onOpenSearch }) {
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 110);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    {
      name: 'International News',
      dropdown: [
        { name: 'Asia', path: '/asia.html' },
        { name: 'North America', path: '/north-america.html' },
        { name: 'Antarctica', path: '/antarctica.html' },
        { name: 'Europe', path: '/europe.html' },
        { name: 'Australia', path: '/australia.html' },
        { name: 'South America', path: '/south-america.html' },
        { name: 'Africa', path: '/africa.html' },
      ],
    },
    { name: 'Sports', path: '/sports.html' },
    { name: 'Health', path: '/health.html' },
    { name: 'Technology', path: '/technology.html' },
    { name: 'Business', path: '/business.html' },
    { name: 'Contact', path: '/contact.html' },
  ];

  return (
    <>
      <header
        className={`w-full z-40 transition-all duration-300 ${
          isSticky
            ? 'fixed top-0 left-0 bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100 py-3'
            : 'bg-white border-y border-gray-200 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Menu toggle button & Mobile Logo */}
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="flex flex-col justify-center items-center w-7 h-7 gap-1 focus:outline-none group cursor-pointer"
                aria-label="Open sidebar menu"
              >
                <span className="w-5 h-[2px] bg-[#c91f26] rounded transition group-hover:bg-[#a8191f]"></span>
                <span className="w-5 h-[2px] bg-[#c91f26] rounded transition group-hover:bg-[#a8191f]"></span>
                <span className="w-5 h-[2px] bg-[#c91f26] rounded transition group-hover:bg-[#a8191f]"></span>
              </button>

              <div className="lg:hidden">
                <Link to="/" className="inline-block">
                  <img
                    src="/images/logo%20hexa.png"
                    alt="HEXA NEWS"
                    className="h-8 w-auto object-contain"
                  />
                </Link>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-7">
              {navLinks.map((item, idx) => {
                if (item.dropdown) {
                  return (
                    <div
                      key={idx}
                      className="relative group py-2"
                      onMouseEnter={() => setDropdownOpen(true)}
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      <button className="flex items-center gap-1.5 text-sm font-semibold tracking-wide text-gray-800 hover:text-[#c91f26] transition py-1">
                        <span>{item.name}</span>
                        <i className="bi bi-chevron-down text-xs transition-transform group-hover:rotate-180"></i>
                      </button>

                      {/* Dropdown menu */}
                      <div className="absolute left-0 top-full w-52 bg-white rounded-lg shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-1">
                        {item.dropdown.map((sub, sIdx) => (
                          <a
                            key={sIdx}
                            href={sub.path}
                            className="block px-4 py-2 text-xs font-medium text-gray-700 hover:bg-red-50 hover:text-[#c91f26] transition"
                          >
                            {sub.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={idx}
                    to={item.path}
                    className={`text-sm font-semibold tracking-wide transition py-1 ${
                      location.pathname === item.path
                        ? 'text-[#c91f26]'
                        : 'text-gray-800 hover:text-[#c91f26]'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Header Right Actions */}
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onOpenSearch}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#c91f26] hover:text-white text-gray-700 flex items-center justify-center transition-all duration-200"
                title="Search"
              >
                <i className="bi bi-search text-sm"></i>
              </button>

              <a
                href="/admin"
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#c91f26] hover:text-white text-gray-700 flex items-center justify-center transition-all duration-200"
                title="Admin Dashboard"
              >
                <i className="bi bi-person text-base"></i>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed inset-y-0 left-0 w-72 bg-white p-6 shadow-2xl flex flex-col z-50 transform transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <img
                src="/images/logo%20hexa.png"
                alt="HEXA NEWS"
                className="h-10 w-auto"
              />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-500 hover:text-[#c91f26]"
              >
                <i className="bi bi-x-lg text-lg"></i>
              </button>
            </div>

            <nav className="mt-6 flex-1 space-y-3 overflow-y-auto">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-gray-800 hover:text-[#c91f26] py-1.5"
              >
                Home
              </Link>

              <div className="py-1">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center justify-between w-full text-sm font-semibold text-gray-800 hover:text-[#c91f26] py-1.5"
                >
                  <span>International News</span>
                  <i className={`bi bi-chevron-down text-xs transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}></i>
                </button>
                {dropdownOpen && (
                  <div className="pl-4 space-y-2 mt-2 border-l-2 border-red-100">
                    {navLinks[1].dropdown.map((sub, i) => (
                      <a
                        key={i}
                        href={sub.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-xs font-medium text-gray-600 hover:text-[#c91f26]"
                      >
                        {sub.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <a href="/sports.html" className="block text-sm font-semibold text-gray-800 hover:text-[#c91f26] py-1.5">Sports</a>
              <a href="/health.html" className="block text-sm font-semibold text-gray-800 hover:text-[#c91f26] py-1.5">Health</a>
              <a href="/technology.html" className="block text-sm font-semibold text-gray-800 hover:text-[#c91f26] py-1.5">Technology</a>
              <a href="/business.html" className="block text-sm font-semibold text-gray-800 hover:text-[#c91f26] py-1.5">Business</a>
              <a href="/contact.html" className="block text-sm font-semibold text-gray-800 hover:text-[#c91f26] py-1.5">Contact</a>
            </nav>

            <div className="pt-6 border-t border-gray-100">
              <a
                href="/admin"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#c91f26] text-white text-xs font-bold uppercase rounded-md hover:bg-[#a8191f] transition"
              >
                <i className="bi bi-person"></i> Admin Portal
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

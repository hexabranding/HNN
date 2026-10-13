import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header({ onOpenSearch }) {
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 110);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close desktop dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDesktopDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    {
      name: 'International News',
      dropdown: [
        { name: 'Asia', path: '/asia' },
        { name: 'North America', path: '/north-america' },
        { name: 'Antarctica', path: '/antarctica' },
        { name: 'Europe', path: '/europe' },
        { name: 'Australia', path: '/australia' },
        { name: 'South America', path: '/south-america' },
        { name: 'Africa', path: '/africa' },
      ],
    },
    { name: 'Sports', path: '/sports' },
    { name: 'Health', path: '/health' },
    { name: 'Technology', path: '/technology' },
    { name: 'Business', path: '/business' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header
        className={`w-full relative z-50 transition-all duration-300 ${
          isSticky
            ? 'fixed top-0 left-0 bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100 py-3'
            : 'bg-white border-y border-gray-200 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Menu toggle button & Mobile Logo (ONLY visible on responsive / mobile screens, HIDDEN on big desktop screens) */}
            <div className="flex lg:hidden items-center space-x-4">
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

              <div>
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
                      ref={dropdownRef}
                      className="relative group py-2"
                      onMouseEnter={() => setDesktopDropdownOpen(true)}
                      onMouseLeave={() => setDesktopDropdownOpen(false)}
                    >
                      <button
                        type="button"
                        onClick={() => setDesktopDropdownOpen((prev) => !prev)}
                        className={`flex items-center gap-1.5 text-sm font-semibold tracking-wide transition py-1 cursor-pointer ${
                          desktopDropdownOpen ? 'text-[#c91f26]' : 'text-gray-800 hover:text-[#c91f26]'
                        }`}
                        aria-expanded={desktopDropdownOpen}
                      >
                        <span>{item.name}</span>
                        <i
                          className={`bi bi-chevron-down text-xs transition-transform duration-200 ${
                            desktopDropdownOpen ? 'rotate-180 text-[#c91f26]' : 'group-hover:rotate-180'
                          }`}
                        ></i>
                      </button>

                      {/* Dropdown menu */}
                      <div
                        className={`absolute left-0 top-full pt-1.5 z-50 ${
                          desktopDropdownOpen ? 'block' : 'hidden group-hover:block'
                        }`}
                      >
                        <div className="w-56 bg-white rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.12)] border border-gray-100 py-2.5 overflow-hidden">
                          {item.dropdown.map((sub, sIdx) => {
                            const isSubActive = location.pathname === sub.path;
                            return (
                              <Link
                                key={sIdx}
                                to={sub.path}
                                onClick={() => setDesktopDropdownOpen(false)}
                                className={`block px-5 py-2.5 text-sm font-medium transition-all ${
                                  isSubActive
                                    ? 'text-[#c91f26] bg-red-50/70 font-semibold'
                                    : 'text-gray-700 hover:text-[#c91f26] hover:bg-red-50/50 hover:pl-6'
                                }`}
                              >
                                {sub.name}
                              </Link>
                            );
                          })}
                        </div>
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
              {navLinks.map((item, idx) => {
                if (item.dropdown) {
                  return (
                    <div key={idx} className="py-1">
                      <button
                        onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                        className="flex items-center justify-between w-full text-sm font-semibold text-gray-800 hover:text-[#c91f26] py-1.5 cursor-pointer"
                      >
                        <span>{item.name}</span>
                        <i
                          className={`bi bi-chevron-down text-xs transition-transform ${
                            mobileDropdownOpen ? 'rotate-180' : ''
                          }`}
                        ></i>
                      </button>
                      {mobileDropdownOpen && (
                        <div className="pl-4 space-y-2 mt-2 border-l-2 border-red-100">
                          {item.dropdown.map((sub, sIdx) => (
                            <Link
                              key={sIdx}
                              to={sub.path}
                              onClick={() => {
                                setMobileMenuOpen(false);
                                setMobileDropdownOpen(false);
                              }}
                              className="block text-xs font-medium text-gray-600 hover:text-[#c91f26]"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={idx}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-semibold text-gray-800 hover:text-[#c91f26] py-1.5"
                  >
                    {item.name}
                  </Link>
                );
              })}
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

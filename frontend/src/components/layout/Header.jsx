import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchApi } from '../../services/api';

export default function Header({ onOpenSearch }) {
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [openMobileDropdowns, setOpenMobileDropdowns] = useState({});
  const [categories, setCategories] = useState([]);
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
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch dynamic categories from API
  useEffect(() => {
    let isMounted = true;
    async function loadCategories(forceSkipCache = false) {
      try {
        const data = await fetchApi('/categories', { skipCache: forceSkipCache });
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      } catch (err) {
        console.warn('Could not load categories for navbar:', err);
      }
    }
    loadCategories();

    const handleCategoriesUpdate = () => {
      loadCategories(true);
    };

    const handleStorageUpdate = (e) => {
      if (e.key === 'hexa_categories_version' || e.key === 'hexa_categories_updated') {
        loadCategories(true);
      }
    };

    window.addEventListener('hexa_categories_updated', handleCategoriesUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('hexa_categories_updated', handleCategoriesUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  const defaultNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    {
      name: 'International News',
      dropdown: [
        { name: 'Africa', path: '/international-news/africa' },
        { name: 'Antarctica', path: '/international-news/antarctica' },
        { name: 'Asia', path: '/international-news/asia' },
        { name: 'Australia', path: '/international-news/australia' },
        { name: 'Europe', path: '/international-news/europe' },
        { name: 'North America', path: '/international-news/north-america' },
        { name: 'South America', path: '/international-news/south-america' },
      ],
    },
    { name: 'Sports', path: '/sports' },
    { name: 'Health', path: '/health' },
    { name: 'Technology', path: '/technology' },
    { name: 'Business', path: '/business' },
    { name: 'Contact', path: '/contact' },
  ];

  const formatLabel = (label) => {
    if (!label) return '';
    const trimmed = label.trim();
    if (trimmed === trimmed.toUpperCase()) {
      return trimmed.charAt(0) + trimmed.slice(1).toLowerCase();
    }
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  };

  const navLinks = useMemo(() => {
    if (!categories || categories.length === 0) {
      return defaultNavLinks;
    }

    const links = [
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
    ];

    // Find international news category
    const regionsCat = categories.find(
      (c) =>
        c.slug?.toLowerCase() === 'international-news' ||
        c.slug?.toLowerCase() === 'regions' ||
        c.label?.toLowerCase() === 'international news' ||
        c.label?.toLowerCase() === 'regions'
    );

    const intlSlug = regionsCat?.slug || 'international-news';

    const regionalDropdown =
      regionsCat?.children && regionsCat.children.length > 0
        ? [...regionsCat.children]
            .sort((a, b) => (a.label || a.slug).localeCompare(b.label || b.slug))
            .map((ch) => ({
              name: ch.label || formatLabel(ch.slug),
              path: `/${intlSlug}/${ch.slug || ch.id}`,
            }))
        : defaultNavLinks[2].dropdown;

    links.push({
      name: 'International News',
      dropdown: regionalDropdown,
    });

    const standardPriority = ['sports', 'health', 'technology', 'business'];

    const otherCats = categories.filter((c) => {
      const slug = (c.slug || c.id || '').toLowerCase();
      return (
        !c.parent &&
        slug !== 'regions' &&
        slug !== 'international-news' &&
        slug !== 'news'
      );
    });

    otherCats.sort((a, b) => {
      const slugA = (a.slug || a.id || '').toLowerCase();
      const slugB = (b.slug || b.id || '').toLowerCase();
      const idxA = standardPriority.indexOf(slugA);
      const idxB = standardPriority.indexOf(slugB);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });

    otherCats.forEach((c) => {
      const slug = (c.slug || c.id || '').toLowerCase();
      const label = formatLabel(c.label || c.slug || c.id);
      if (c.children && c.children.length > 0) {
        links.push({
          name: label,
          dropdown: c.children.map((ch) => ({
            name: ch.label || formatLabel(ch.slug),
            path: `/${slug}/${ch.slug || ch.id}`,
          })),
        });
      } else {
        links.push({
          name: label,
          path: `/${slug}`,
        });
      }
    });

    links.push({ name: 'Contact', path: '/contact' });
    return links;
  }, [categories]);

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
            {/* Left: Menu toggle button & Mobile Logo (with desktop balancing spacer) */}
            <div className="flex items-center space-x-4 lg:w-9">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="flex lg:hidden flex-col justify-center items-center w-7 h-7 gap-1 focus:outline-none group cursor-pointer"
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

            {/* Desktop Navigation - Centralized */}
            <nav
              ref={dropdownRef}
              className="hidden lg:flex items-center justify-center flex-1 space-x-5 xl:space-x-6 flex-wrap"
            >
              {navLinks.map((item, idx) => {
                if (item.dropdown) {
                  const isDropdownOpen = activeDropdown === idx;
                  const isChildActive = item.dropdown.some(
                    (sub) => location.pathname === sub.path
                  );

                  return (
                    <div
                      key={idx}
                      className="relative group py-2"
                      onMouseEnter={() => setActiveDropdown(idx)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setActiveDropdown((prev) => (prev === idx ? null : idx))
                        }
                        className={`flex items-center gap-1.5 text-sm font-semibold tracking-wide transition py-1 cursor-pointer ${
                          isDropdownOpen || isChildActive
                            ? 'text-[#c91f26]'
                            : 'text-gray-800 hover:text-[#c91f26]'
                        }`}
                        aria-expanded={isDropdownOpen}
                      >
                        <span>{item.name}</span>
                        <i
                          className={`bi bi-chevron-down text-xs transition-transform duration-200 ${
                            isDropdownOpen ? 'rotate-180 text-[#c91f26]' : 'group-hover:rotate-180'
                          }`}
                        ></i>
                      </button>

                      {/* Dropdown menu */}
                      <div
                        className={`absolute left-0 top-full pt-1.5 z-50 ${
                          isDropdownOpen ? 'block' : 'hidden group-hover:block'
                        }`}
                      >
                        <div className="w-56 bg-white rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.12)] border border-gray-100 py-2.5 overflow-hidden max-h-[380px] overflow-y-auto">
                          {item.dropdown.map((sub, sIdx) => {
                            const isSubActive = location.pathname === sub.path;
                            return (
                              <Link
                                key={sIdx}
                                to={sub.path}
                                onClick={() => setActiveDropdown(null)}
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
            <div className="flex items-center justify-end space-x-3 lg:w-9">
              <button
                type="button"
                onClick={onOpenSearch}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#c91f26] hover:text-white text-gray-700 flex items-center justify-center transition-all duration-200"
                title="Search"
              >
                <i className="bi bi-search text-sm"></i>
              </button>
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
                  const isMobileOpen = Boolean(openMobileDropdowns[idx]);
                  return (
                    <div key={idx} className="py-1">
                      <button
                        onClick={() =>
                          setOpenMobileDropdowns((prev) => ({
                            ...prev,
                            [idx]: !prev[idx],
                          }))
                        }
                        className="flex items-center justify-between w-full text-sm font-semibold text-gray-800 hover:text-[#c91f26] py-1.5 cursor-pointer"
                      >
                        <span>{item.name}</span>
                        <i
                          className={`bi bi-chevron-down text-xs transition-transform ${
                            isMobileOpen ? 'rotate-180 text-[#c91f26]' : ''
                          }`}
                        ></i>
                      </button>
                      {isMobileOpen && (
                        <div className="pl-4 space-y-2 mt-2 border-l-2 border-red-100">
                          {item.dropdown.map((sub, sIdx) => (
                            <Link
                              key={sIdx}
                              to={sub.path}
                              onClick={() => {
                                setMobileMenuOpen(false);
                              }}
                              className="block text-xs font-medium text-gray-600 hover:text-[#c91f26] py-1"
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


          </div>
        </div>
      )}
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Topbar from './Topbar';
import Header from './Header';
import SearchModal from './SearchModal';
import Footer from './Footer';
import BackToTop from './BackToTop';

export default function MainLayout() {
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  // Scroll smoothly to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 font-inter antialiased">
      {/* 1. Global Topbar */}
      <Topbar />

      {/* 2. Global Navigation Header */}
      <Header onOpenSearch={() => setSearchOpen(true)} />

      {/* 3. Global Slide-Over Search Drawer */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* 4. Active Page Content */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* 5. Global Footer */}
      <Footer />

      {/* 6. Global Floating Scroll-To-Top Button */}
      <BackToTop />
    </div>
  );
}

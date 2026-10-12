import React, { useState, useEffect } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-[#c91f26] hover:bg-[#a8191f] text-white shadow-xl flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 focus:outline-none ring-4 ring-red-500/20"
      aria-label="Back to top"
    >
      <i className="bi bi-chevron-up text-lg"></i>
    </button>
  );
}

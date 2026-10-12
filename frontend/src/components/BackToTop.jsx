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
      className="fixed bottom-[30px] right-[30px] z-50 w-[44px] h-[44px] rounded-full bg-[#ff4c60] hover:bg-[#101820] text-white shadow-[0_4px_15px_rgba(255,76,96,0.4)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex items-center justify-center transition-all duration-300 cursor-pointer"
      aria-label="Back to top"
    >
      <i className="bi bi-arrow-up text-[18px]"></i>
    </button>
  );
}

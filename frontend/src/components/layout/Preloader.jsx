import React from 'react';

export default function Preloader({ fullScreen = true, fading = false }) {
  return (
    <div
      className={
        fullScreen
          ? `fixed inset-0 w-screen h-screen bg-white z-[999999] flex items-center justify-center transition-opacity duration-300 ease-out ${
              fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`
          : 'w-full py-16 flex items-center justify-center'
      }
      aria-label="Loading..."
    >
      <div className="relative overflow-visible">
        <svg
          width="48"
          height="20"
          viewBox="0 0 39 16"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible block"
        >
          <g fill="#ff4c60">
            <path
              className="animate-seq-preloader"
              style={{ animationDelay: '0s' }}
              d="M3.999 12.012c2.209 0 3.999-1.791 3.999-3.999s-1.79-3.999-3.999-3.999-3.999 1.791-3.999 3.999 1.79 3.999 3.999 3.999z"
            />
            <path
              className="animate-seq-preloader"
              style={{ animationDelay: '0.15s' }}
              d="M15.996 13.468c3.018 0 5.465-2.447 5.465-5.466 0-3.018-2.447-5.465-5.465-5.465-3.019 0-5.466 2.447-5.466 5.465 0 3.019 2.447 5.466 5.466 5.466z"
            />
            <path
              className="animate-seq-preloader"
              style={{ animationDelay: '0.3s' }}
              d="M31.322 15.334c4.049 0 7.332-3.282 7.332-7.332 0-4.049-3.282-7.332-7.332-7.332s-7.332 3.283-7.332 7.332c0 4.05 3.283 7.332 7.332 7.332z"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

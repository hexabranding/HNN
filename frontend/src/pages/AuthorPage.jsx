import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Topbar from '../components/Topbar';
import Header from '../components/Header';
import SearchModal from '../components/SearchModal';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';

export default function AuthorPage() {
  const [searchOpen, setSearchOpen] = useState(false);

  const authors = [
    {
      name: 'John Doe',
      role: 'Senior Tech Editor',
      articles: 142,
      followers: '12.5K',
      avatar: 'https://i.pravatar.cc/120?img=1',
      cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
    },
    {
      name: 'Sarah Connor',
      role: 'Lead Sports Analyst',
      articles: 98,
      followers: '8.9K',
      avatar: 'https://i.pravatar.cc/120?img=5',
      cover: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80',
    },
    {
      name: 'Michael Chang',
      role: 'Global Economics Editor',
      articles: 115,
      followers: '15.2K',
      avatar: 'https://i.pravatar.cc/120?img=8',
      cover: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&q=80',
    },
    {
      name: 'Emma Watson',
      role: 'Health & Wellness Lead',
      articles: 84,
      followers: '9.4K',
      avatar: 'https://i.pravatar.cc/120?img=9',
      cover: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80',
    },
    {
      name: 'Daniel Reed',
      role: 'Investigative Correspondent',
      articles: 164,
      followers: '21.0K',
      avatar: 'https://i.pravatar.cc/120?img=12',
      cover: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
    },
    {
      name: 'Dr. Rachel Green',
      role: 'Science & Medical Contributor',
      articles: 72,
      followers: '6.7K',
      avatar: 'https://i.pravatar.cc/120?img=16',
      cover: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80',
    },
    {
      name: 'Carlos Mendez',
      role: 'International Politics Desk',
      articles: 130,
      followers: '11.8K',
      avatar: 'https://i.pravatar.cc/120?img=15',
      cover: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80',
    },
    {
      name: 'Lisa Zhang',
      role: 'Culture & Ideas Lead',
      articles: 95,
      followers: '10.3K',
      avatar: 'https://i.pravatar.cc/120?img=20',
      cover: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=80',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 font-inter antialiased">
      <Topbar />
      <Header onOpenSearch={() => setSearchOpen(true)} />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <main className="flex-1 w-full">
        {/* Breadcrumb Section with background image matching author.html */}
        <section
          className="relative py-20 bg-cover bg-center text-white text-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1400&q=80')` }}
        >
          <div className="absolute inset-0 bg-black/75"></div>
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <nav className="flex justify-center items-center gap-2 text-sm text-white/60 mb-4">
              <Link to="/" className="text-[#ff4c60] hover:underline font-semibold">Home</Link>
              <span>/</span>
              <span className="text-white">Authors</span>
            </nav>
            <h1 className="font-['Prompt',sans-serif] text-4xl sm:text-5xl font-bold tracking-tight mb-3">
              Our Authors
            </h1>
            <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto">
              Meet the talented journalists, editors, and researchers behind HEXA NEWS.
            </p>
          </div>
        </section>

        {/* Authors Grid Section */}
        <section className="py-20 bg-white">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {authors.map((author, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl overflow-hidden border border-[#e8e5dc] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    {/* Cover Photo */}
                    <div className="h-32 w-full overflow-hidden relative bg-gray-900">
                      <img
                        src={author.cover}
                        alt="cover"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </div>

                    {/* Avatar Overlap */}
                    <div className="px-6 relative -mt-12 flex justify-center">
                      <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-md bg-white">
                        <img
                          src={author.avatar}
                          alt={author.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-6 pt-3 text-center">
                      <h4 className="font-['Prompt',sans-serif] text-lg font-bold text-[#101820] mb-1">
                        {author.name}
                      </h4>
                      <span className="text-xs font-semibold text-[#ff4c60] block mb-4">
                        {author.role}
                      </span>

                      {/* Stats */}
                      <div className="grid grid-cols-2 py-3 border-y border-gray-100 mb-5 bg-[#fff6ef]/50 rounded-lg">
                        <div className="text-center border-r border-gray-200">
                          <span className="block font-['Prompt',sans-serif] text-lg font-bold text-gray-900">
                            {author.articles}
                          </span>
                          <span className="text-[11px] text-gray-500 uppercase tracking-wider">
                            Articles
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="block font-['Prompt',sans-serif] text-lg font-bold text-gray-900">
                            {author.followers}
                          </span>
                          <span className="text-[11px] text-gray-500 uppercase tracking-wider">
                            Followers
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Social links */}
                  <div className="px-6 pb-6 pt-0 flex justify-center items-center gap-2">
                    {['bi-facebook', 'bi-twitter-x', 'bi-instagram', 'bi-linkedin'].map((icon, i) => (
                      <a
                        key={i}
                        href="#"
                        className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 text-gray-600 hover:bg-[#ff4c60] hover:text-white hover:border-[#ff4c60] flex items-center justify-center text-xs transition-colors"
                      >
                        <i className={`bi ${icon}`}></i>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}

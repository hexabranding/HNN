import React from 'react';
import { Link } from 'react-router-dom';
import NewsletterSection from '../../components/home/NewsletterSection';

export default function AboutPage() {

  const stats = [
    { number: '15M+', label: 'Monthly Readers' },
    { number: '50+', label: 'Global Correspondents' },
    { number: '120+', label: 'Countries Covered' },
    { number: '10+', label: 'Years of Excellence' },
  ];

  const teamMembers = [
    {
      name: 'Sarah Jenkins',
      role: 'Editor-in-Chief',
      bio: 'Pulitzer-nominated journalist with 18 years of investigative and global editorial experience.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    },
    {
      name: 'David Chen',
      role: 'Managing Editor',
      bio: 'Former foreign correspondent specializing in Asian geopolitical and economic developments.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    },
    {
      name: 'Marcus Brody',
      role: 'Head of Investigative Journalism',
      bio: 'Specialized in uncovering corporate transparency and digital privacy stories worldwide.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    },
    {
      name: 'Elena Rostova',
      role: 'Senior Tech & AI Editor',
      bio: 'Award-winning technology analyst covering artificial intelligence and technological ethics.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    },
  ];

  const values = [
    {
      icon: 'bi-shield-check',
      title: 'Integrity First',
      desc: 'We adhere to the strictest verification protocols and never compromise factual rigor for clicks.',
    },
    {
      icon: 'bi-search',
      title: 'Deep Investigation',
      desc: 'Our journalists dig beyond headlines to uncover systemic context and provide actionable understanding.',
    },
    {
      icon: 'bi-lightning-charge',
      title: 'Speed & Clarity',
      desc: 'Real-time coverage delivered with concise clarity, eliminating fluff to respect reader time.',
    },
  ];

  return (
    <div className="w-full">
        {/* 1. About Hero matching about.html */}
        <section className="py-20 text-center bg-[linear-gradient(135deg,#1a1a2e_0%,#16213e_50%,#0f3460_100%)] relative overflow-hidden">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <nav className="flex items-center justify-center gap-2 text-sm mb-6 text-white/60">
              <Link to="/" className="text-[#ff4c60] hover:underline font-medium">
                Home
              </Link>
              <span>/</span>
              <span className="text-white/80">About Us</span>
            </nav>

            <h1
              className="font-['Prompt',sans-serif] text-5xl sm:text-7xl font-extrabold italic tracking-tight mb-5"
              style={{
                WebkitTextStroke: '2px rgba(255,255,255,0.85)',
                color: 'transparent',
              }}
            >
              ABOUT{' '}
              <span
                style={{
                  WebkitTextStroke: '2px #ff4c60',
                  color: 'transparent',
                }}
              >
                US
              </span>
            </h1>

            <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Dedicated to truth, transparency, and stories that matter across the globe.
            </p>
          </div>
        </section>

        {/* 2. Who We Are / Our Mission */}
        <section className="py-20 sm:py-24 bg-white">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Image */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl overflow-hidden shadow-2xl group border border-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                    alt="Our Newsroom Team"
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Text */}
              <div className="lg:col-span-6">
                <span className="inline-block text-xs font-bold text-[#ff4c60] uppercase tracking-widest mb-3">
                  Who We Are
                </span>
                <h2 className="font-['Prompt',sans-serif] text-3xl sm:text-4xl font-bold text-[#101820] leading-tight mb-6">
                  Delivering Accurate News You Can Truly Trust
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4 text-base">
                  HEXA NEWS was founded with a singular conviction: independent, verified journalism is essential to an informed and free society. In an era of rapid noise and sensationalism, our worldwide editorial bureau focuses on deep investigative rigor and human-centered storytelling.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6 text-base">
                  From breaking international geopolitics to technological revolutions and cultural movements, we deliver balanced perspectives that empower readers to understand the shifting world around them.
                </p>

                {/* Checklist */}
                <ul className="space-y-3 mb-8">
                  {[
                    '100% verified sources and rigorous multi-stage fact checking',
                    'Editorial independence free from corporate or political influence',
                    'Award-winning international correspondents on every continent',
                    '24/7 breaking news desk delivering timely, transparent context',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                      <i className="bi bi-check-circle-fill text-[#ff4c60] text-base flex-shrink-0 mt-0.5"></i>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff4c60] hover:bg-[#548f6f] text-white font-['Prompt',sans-serif] font-semibold text-sm rounded-full transition-all duration-300 shadow-md cursor-pointer"
                >
                  <span>Connect With Our Team</span>
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Stats Section matching about.html */}
        <section className="py-20 bg-[linear-gradient(135deg,#1a1a2e_0%,#16213e_50%,#0f3460_100%)] text-white relative overflow-hidden">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, idx) => (
                <div key={idx} className="p-4">
                  <div className="font-['Prompt',sans-serif] text-4xl sm:text-5xl font-extrabold text-[#ff4c60] mb-2 tracking-tight">
                    {stat.number}
                  </div>
                  <div className="text-sm sm:text-base text-white/80 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Core Values */}
        <section className="py-20 sm:py-24 bg-[#fff6ef]">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold text-[#ff4c60] uppercase tracking-widest mb-2 block">
                Our Standards
              </span>
              <h2 className="font-['Prompt',sans-serif] text-3xl sm:text-4xl font-bold text-[#101820]">
                Values That Guide Every Story
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((val, idx) => (
                <div
                  key={idx}
                  className="bg-white p-8 rounded-2xl border border-[#e8e5dc] shadow-sm hover:-translate-y-1.5 transition-all duration-300 group"
                >
                  <div className="w-14 h-14 rounded-xl bg-[#ff4c60]/10 text-[#ff4c60] flex items-center justify-center text-2xl mb-6 group-hover:bg-[#ff4c60] group-hover:text-white transition-colors">
                    <i className={`bi ${val.icon}`}></i>
                  </div>
                  <h3 className="font-['Prompt',sans-serif] text-xl font-bold text-[#101820] mb-3">
                    {val.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Editorial Leadership Team */}
        <section className="py-20 sm:py-24 bg-white">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold text-[#ff4c60] uppercase tracking-widest mb-2 block">
                Our Team
              </span>
              <h2 className="font-['Prompt',sans-serif] text-3xl sm:text-4xl font-bold text-[#101820]">
                Meet Our Editorial Leadership
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl overflow-hidden border border-[#e8e5dc] shadow-sm group hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-[4/4] overflow-hidden bg-gray-100">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <h4 className="font-['Prompt',sans-serif] text-lg font-bold text-[#101820] mb-1">
                      {member.name}
                    </h4>
                    <span className="text-xs font-semibold text-[#ff4c60] block mb-3">
                      {member.role}
                    </span>
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                      {member.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Newsletter Subscription Banner */}
        <NewsletterSection />
    </div>
  );
}

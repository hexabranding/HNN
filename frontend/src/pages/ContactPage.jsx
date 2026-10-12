import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Topbar from '../components/Topbar';
import Header from '../components/Header';
import SearchModal from '../components/SearchModal';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import CategorySlider from '../components/CategorySlider';

export default function ContactPage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 5000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 font-inter antialiased">
      <Topbar />
      <Header onOpenSearch={() => setSearchOpen(true)} />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <main className="flex-1 w-full">
        {/* 1. Breadcrumb matching contact.html */}
        <section className="bg-[#f2f2de] py-7 border-b border-[#e8e5dc]">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2 font-medium">
              <Link to="/" className="text-[#ff4c60] hover:underline font-semibold">
                Home
              </Link>
              <span>/</span>
              <span className="text-gray-800 font-semibold">Contact</span>
            </nav>
            <h1 className="font-['Prompt',sans-serif] text-3xl sm:text-4xl font-bold text-[#101820]">
              Get In Touch
            </h1>
          </div>
        </section>

        {/* 2. Contact Section */}
        <section className="py-20 bg-white">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left Column: Contact Info Box (lg:col-span-5) */}
              <div className="lg:col-span-5">
                <div className="bg-[#fff6ef] border border-[#e8e5dc] rounded-2xl p-8 sm:p-10 shadow-sm h-full flex flex-col justify-between">
                  <div>
                    <h2 className="font-['Prompt',sans-serif] text-3xl font-bold text-[#101820] mb-4">
                      Contact Us
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-8 text-sm sm:text-base">
                      We'd love to hear from you. Whether you have a question, news tip, editorial feedback, or want to partner with HEXA NEWS, feel free to reach out.
                    </p>

                    {/* Social Media */}
                    <div className="flex items-center gap-3 mb-10">
                      {[
                        { icon: 'bi-facebook', url: '#' },
                        { icon: 'bi-twitter-x', url: '#' },
                        { icon: 'bi-pinterest', url: '#' },
                        { icon: 'bi-instagram', url: '#' },
                      ].map((item, idx) => (
                        <a
                          key={idx}
                          href={item.url}
                          className="w-10 h-10 rounded-full bg-white border border-[#e8e5dc] text-gray-700 flex items-center justify-center text-sm hover:bg-[#ff4c60] hover:text-white hover:border-[#ff4c60] transition-all duration-300 shadow-sm"
                        >
                          <i className={`bi ${item.icon}`}></i>
                        </a>
                      ))}
                    </div>

                    {/* Contact Info List */}
                    <ul className="space-y-6 list-none p-0 m-0">
                      <li className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#ff4c60]/10 text-[#ff4c60] flex items-center justify-center text-xl flex-shrink-0">
                          <i className="bi bi-telephone"></i>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                            Phone Numbers
                          </div>
                          <a href="tel:+1234567890" className="block text-sm font-semibold text-gray-800 hover:text-[#ff4c60]">
                            +1 (234) 567-890
                          </a>
                          <a href="tel:+0987654321" className="block text-sm text-gray-600 hover:text-[#ff4c60]">
                            +0 (987) 654-321
                          </a>
                        </div>
                      </li>

                      <li className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#ff4c60]/10 text-[#ff4c60] flex items-center justify-center text-xl flex-shrink-0">
                          <i className="bi bi-envelope"></i>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                            Email Inquiries
                          </div>
                          <a href="mailto:info@hexanews.com" className="block text-sm font-semibold text-gray-800 hover:text-[#ff4c60]">
                            info@hexanews.com
                          </a>
                          <a href="mailto:support@hexanews.com" className="block text-sm text-gray-600 hover:text-[#ff4c60]">
                            support@hexanews.com
                          </a>
                        </div>
                      </li>

                      <li className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#ff4c60]/10 text-[#ff4c60] flex items-center justify-center text-xl flex-shrink-0">
                          <i className="bi bi-geo-alt"></i>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                            Bureau Headquarters
                          </div>
                          <p className="text-sm font-semibold text-gray-800 leading-snug">
                            123 News Street, Media City,
                            <br />
                            New York, NY 10001
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-8 pt-6 border-t border-[#e8e5dc] text-xs text-gray-500">
                    Open Mon – Fri: 08:00 AM – 07:00 PM EST
                  </div>
                </div>
              </div>

              {/* Right Column: Contact Form (lg:col-span-7) */}
              <div className="lg:col-span-7">
                <div className="bg-white border border-[#e8e5dc] rounded-2xl p-8 sm:p-10 shadow-sm">
                  <h3 className="font-['Prompt',sans-serif] text-2xl font-bold text-[#101820] mb-2">
                    Send Us a Message
                  </h3>
                  <p className="text-sm text-gray-500 mb-8">
                    Our editors and support correspondents typically respond within 24 hours.
                  </p>

                  {submitted ? (
                    <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                      <i className="bi bi-check-circle-fill text-4xl text-[#548f6f] mb-3 block"></i>
                      <h4 className="font-['Prompt',sans-serif] text-lg font-bold text-green-900 mb-1">
                        Message Sent Successfully!
                      </h4>
                      <p className="text-sm text-green-700">
                        Thank you for reaching out. We have received your note and will be in touch shortly.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                            Your Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="John Doe"
                            className="w-full px-4 py-3 bg-[#fdfbf7] border border-[#e8e5dc] rounded-lg text-sm text-gray-900 focus:bg-white focus:border-[#ff4c60] focus:ring-2 focus:ring-[#ff4c60]/10 outline-none transition"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                            Your Email *
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="john@example.com"
                            className="w-full px-4 py-3 bg-[#fdfbf7] border border-[#e8e5dc] rounded-lg text-sm text-gray-900 focus:bg-white focus:border-[#ff4c60] focus:ring-2 focus:ring-[#ff4c60]/10 outline-none transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                          Subject
                        </label>
                        <input
                          type="text"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder="News Tip / Partnership / Editorial Feedback"
                          className="w-full px-4 py-3 bg-[#fdfbf7] border border-[#e8e5dc] rounded-lg text-sm text-gray-900 focus:bg-white focus:border-[#ff4c60] focus:ring-2 focus:ring-[#ff4c60]/10 outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                          Your Message *
                        </label>
                        <textarea
                          required
                          rows={6}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Please provide details about your inquiry..."
                          className="w-full px-4 py-3 bg-[#fdfbf7] border border-[#e8e5dc] rounded-lg text-sm text-gray-900 focus:bg-white focus:border-[#ff4c60] focus:ring-2 focus:ring-[#ff4c60]/10 outline-none transition resize-y"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#ff4c60] hover:bg-[#548f6f] text-white font-['Prompt',sans-serif] font-bold text-sm uppercase tracking-wider rounded-lg transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                      >
                        <span>Send Message</span>
                        <i className="bi bi-send text-xs"></i>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Google Maps Section matching contact.html */}
        <section className="w-full h-[450px] relative bg-gray-200 border-t border-[#e8e5dc]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215573291865!2d-73.98785312401601!3d40.75797637138946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
            className="w-full h-full border-0"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Office Location Map"
          ></iframe>
        </section>

        {/* 4. Topic Carousel Section */}
        <CategorySlider />
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}

/* ==========================================
   HEXA NEWS - JavaScript (BlogXton Match)
   ========================================== */

const API_BASE = window.location.origin + '/api';

var ARTICLE_CACHE_TTL = 5 * 60 * 1000;

async function apiFetch(path, options) {
    try {
        var cacheKey = 'hexa_cache_' + path;
        if (!options || !options.method || options.method === 'GET') {
            try {
                var cached = localStorage.getItem(cacheKey);
                if (cached) {
                    cached = JSON.parse(cached);
                    if (Date.now() - cached.ts < ARTICLE_CACHE_TTL) return cached.data;
                }
            } catch(e) {}
        }
        const res = await fetch(API_BASE + path, options);
        if (!res.ok) throw new Error('API error ' + res.status);
        var data = await res.json();
        try {
            if (!options || !options.method || options.method === 'GET') {
                localStorage.setItem(cacheKey, JSON.stringify({ data: data, ts: Date.now() }));
            }
        } catch(e) {}
        return data;
    } catch (e) {
        console.warn('API fetch failed:', path, e.message);
        try {
            var fallback = localStorage.getItem('hexa_cache_' + path);
            if (fallback) return JSON.parse(fallback).data;
        } catch(e2) {}
        return null;
    }
}

document.addEventListener('DOMContentLoaded', function () {

    // Use the current PNG brand asset for every header and footer logo.
    document.querySelectorAll('img.site-logo').forEach(function (logo) {
        logo.src = 'images/logo hexa.png';
    });
    document.querySelectorAll('link[rel="icon"]').forEach(function (icon) {
        icon.href = 'images/logo hexa.png';
        icon.type = 'image/png';
    });

    // --- Live Date & Temperature ---
    function updateLiveDate() {
        var el = document.getElementById('liveDate');
        if (!el) return;
        var now = new Date();
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        el.textContent = now.toLocaleDateString('en-US', options);
    }
    updateLiveDate();
    setInterval(updateLiveDate, 60000);

    function fetchTemperature() {
        var tempEl = document.getElementById('liveTemp');
        if (!tempEl) return;
        if (!navigator.geolocation) { tempEl.textContent = '28°C'; return; }
        navigator.geolocation.getCurrentPosition(function (pos) {
            var lat = pos.coords.latitude;
            var lon = pos.coords.longitude;
            fetch('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&current=temperature_2m&timezone=auto')
                .then(function (r) { return r.json(); })
                .then(function (data) {
                    if (data && data.current && data.current.temperature_2m !== undefined) {
                        tempEl.textContent = Math.round(data.current.temperature_2m) + '°C';
                    } else {
                        tempEl.textContent = '28°C';
                    }
                })
                .catch(function () { tempEl.textContent = '28°C'; });
        }, function () {
            fetch('https://api.open-meteo.com/v1/forecast?latitude=10.0&longitude=76.3&current=temperature_2m&timezone=Asia/Kolkata')
                .then(function (r) { return r.json(); })
                .then(function (data) {
                    if (data && data.current && data.current.temperature_2m !== undefined) {
                        tempEl.textContent = Math.round(data.current.temperature_2m) + '°C';
                    } else {
                        tempEl.textContent = '28°C';
                    }
                })
                .catch(function () { tempEl.textContent = '28°C'; });
        });
    }
    fetchTemperature();
    setInterval(fetchTemperature, 600000);

    // --- Dynamic API Content Loading ---
    loadApiContent();
    setupSearchApi();

    // The About page is currently disabled. Redirect direct visits and remove its links site-wide.
    if (window.location.pathname.split('/').pop().toLowerCase() === 'about.html') {
        window.location.replace('index.html');
        return;
    }
    document.querySelectorAll('a[href="about.html"]').forEach(function (link) {
        const menuItem = link.closest('li');
        if (menuItem) {
            menuItem.remove();
        } else {
            link.remove();
        }
    });

    // Keep category navigation consistent across every page that uses this shared script.
    const categoryPages = {
        Sports: 'sports.html',
        Health: 'health.html',
        Technology: 'technology.html',
        Business: 'business.html'
    };
    document.querySelectorAll('a').forEach(function (link) {
        const label = link.textContent.trim();
        if (categoryPages[label]) link.setAttribute('href', categoryPages[label]);
    });

    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', function () {
        setTimeout(function () {
            preloader.classList.add('loaded');
        }, 800);
    });
    setTimeout(function () {
        preloader.classList.add('loaded');
    }, 3000);

    // --- Sticky Header ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // --- Mobile Menu ---
    const mainNav = document.getElementById('mainNav');
    const closeMenu = document.getElementById('closeMenu');
    const menuBtn = document.getElementById('menuBtn');

    // Create menu overlay
    const menuOverlay = document.createElement('div');
    menuOverlay.className = 'menu-overlay';
    document.body.appendChild(menuOverlay);

    function openMenu() {
        mainNav.classList.add('show-menu');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeMenuFn() {
        mainNav.classList.remove('show-menu');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (mainNav.classList.contains('show-menu')) {
                closeMenuFn();
            } else {
                openMenu();
            }
        });
    }
    if (closeMenu) {
        closeMenu.addEventListener('click', function () {
            closeMenuFn();
        });
    }
    menuOverlay.addEventListener('click', function () {
        closeMenuFn();
    });

    // Submenu toggle
    document.querySelectorAll('.main-nav > ul > li.menu-item-has-children > a').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const subMenu = this.nextElementSibling;
            if (subMenu) {
                subMenu.classList.toggle('active');
            }
        });
    });

    // --- Search Sidebar ---
    var searchToggle = document.getElementById('searchToggle');
    var searchSidebar = document.getElementById('searchSidebar');
    var searchOverlaySidebar = document.getElementById('searchOverlaySidebar');
    var closeSearchSidebar = document.getElementById('closeSearchSidebar');
    var searchInput = document.getElementById('searchInput');
    var searchSuggestions = document.getElementById('searchSuggestions');
    var searchResults = document.getElementById('searchResults');

    if (searchToggle && searchSidebar) {
        searchToggle.addEventListener('click', function () {
            searchSidebar.classList.add('active');
            searchOverlaySidebar.classList.add('active');
            setTimeout(function () { searchInput.focus(); }, 400);
        });
    }
    if (closeSearchSidebar) {
        closeSearchSidebar.addEventListener('click', function () {
            searchSidebar.classList.remove('active');
            searchOverlaySidebar.classList.remove('active');
            searchInput.value = '';
            searchSuggestions.style.display = 'block';
            searchResults.classList.remove('active');
        });
    }
    if (searchOverlaySidebar) {
        searchOverlaySidebar.addEventListener('click', function () {
            searchSidebar.classList.remove('active');
            searchOverlaySidebar.classList.remove('active');
            searchInput.value = '';
            searchSuggestions.style.display = 'block';
            searchResults.classList.remove('active');
        });
    }

    // Search Input - Show/Hide Results
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            var val = this.value.trim().toLowerCase();
            if (val.length > 0) {
                searchSuggestions.style.display = 'none';
                searchResults.classList.add('active');
            } else {
                searchSuggestions.style.display = 'block';
                searchResults.classList.remove('active');
            }
        });
    }

    // Suggestion click fills input
    document.querySelectorAll('.search-suggestion-list li').forEach(function (item) {
        item.addEventListener('click', function () {
            var text = this.querySelector('span').textContent;
            searchInput.value = text;
            searchSuggestions.style.display = 'none';
            searchResults.classList.add('active');
        });
    });

    // --- Hero Slider ---
    var heroSlider = document.querySelector('.heroSlider');
    if (heroSlider) {
        new Swiper(heroSlider, {
            loop: true,
            speed: 1200,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            effect: 'fade',
            fadeEffect: { crossFade: true },
            navigation: {
                nextEl: '.hero-next',
                prevEl: '.hero-prev',
            },
            pagination: {
                el: '.hero-pagination',
                clickable: true,
            },
        });
    }

    // --- Banner Slider 1 (per tab) ---
    document.querySelectorAll('.banner-1-slider').forEach(function (slider) {
        new Swiper(slider, {
            slidesPerView: 3,
            spaceBetween: 20,
            loop: true,
            speed: 800,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: slider.querySelector('.swiper-next-arrow'),
                prevEl: slider.querySelector('.swiper-prev-arrow'),
            },
            breakpoints: {
                0: { slidesPerView: 1 },
                576: { slidesPerView: 2 },
                992: { slidesPerView: 3 },
            },
        });
    });

    // --- Blog Multi List Slider ---
    const blogMultiSlider = document.querySelector('.blog-multi-list-slider');
    if (blogMultiSlider) {
        new Swiper(blogMultiSlider, {
            slidesPerView: 1,
            loop: true,
            speed: 800,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: '.blog-multi-next',
                prevEl: '.blog-multi-prev',
            },
        });
    }

    // --- Author Slider ---
    const authorSlider = document.querySelector('.author-1-slider');
    if (authorSlider) {
        new Swiper(authorSlider, {
            slidesPerView: 4,
            spaceBetween: 25,
            loop: true,
            speed: 800,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: '.author1-next',
                prevEl: '.author1-prev',
            },
            breakpoints: {
                0: { slidesPerView: 1 },
                576: { slidesPerView: 2 },
                992: { slidesPerView: 3 },
                1200: { slidesPerView: 4 },
            },
        });
    }

    // --- Category Slider ---
    const categorySlider = document.querySelector('.category-1-slider');
    if (categorySlider) {
        new Swiper(categorySlider, {
            slidesPerView: 4,
            spaceBetween: 25,
            loop: true,
            speed: 800,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: '.category1-next',
                prevEl: '.category1-prev',
            },
            breakpoints: {
                0: { slidesPerView: 1 },
                576: { slidesPerView: 2 },
                992: { slidesPerView: 3 },
                1200: { slidesPerView: 4 },
            },
        });
    }

    // --- Recent Post Slider ---
    const recentSlider = document.querySelector('.recent-1-slider');
    if (recentSlider) {
        new Swiper(recentSlider, {
            slidesPerView: 4,
            spaceBetween: 25,
            loop: true,
            speed: 800,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: '.recent1-next',
                prevEl: '.recent1-prev',
            },
            breakpoints: {
                0: { slidesPerView: 1 },
                576: { slidesPerView: 2 },
                992: { slidesPerView: 3 },
                1200: { slidesPerView: 4 },
            },
        });
    }

    // --- Back to Top ---
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Fade Up Animations ---
    const fadeEls = document.querySelectorAll('.fade-up');
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    fadeEls.forEach(function (el) { observer.observe(el); });

    // --- Hero 2 Slider (if present on other pages) ---
    const hero2Slider = document.querySelector('.hero2Slider');
    if (hero2Slider) {
        new Swiper(hero2Slider, {
            loop: true,
            speed: 1000,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            effect: 'fade',
            fadeEffect: { crossFade: true },
            pagination: {
                el: '.hero-pagination',
                clickable: true,
            },
        });
    }

    // --- Video Play Button ---
    document.querySelectorAll('.video-btn').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            var videoId = this.getAttribute('data-video');
            if (videoId) {
                var modal = document.createElement('div');
                modal.className = 'modal-video';
                modal.innerHTML = '<div class="modal-video-movie-wrap"><iframe width="100%" height="500" src="https://www.youtube.com/embed/' + videoId + '" frameborder="0" allowfullscreen></iframe></div>';
                document.body.appendChild(modal);
                setTimeout(function () { modal.classList.add('active'); }, 10);
                modal.addEventListener('click', function (ev) {
                    if (ev.target === modal) {
                        modal.classList.remove('active');
                        setTimeout(function () { modal.remove(); }, 300);
                    }
                });
            }
        });
    });

    // --- Banner Slide Text Animation ---
    document.querySelectorAll('.banner-1-slider').forEach(function (slider) {
        var swiperInstance = slider.swiper;
        if (swiperInstance) {
            swiperInstance.on('slideChange', function () {
                var activeSlide = swiperInstance.slides[swiperInstance.activeIndex];
                if (activeSlide) {
                    var headings = activeSlide.querySelectorAll('h1, h2, h4, span');
                    var btns = activeSlide.querySelectorAll('.eg-btn, p');
                    headings.forEach(function (el) {
                        el.style.animation = 'none';
                        el.offsetHeight;
                        el.style.animation = 'fadeInDown 1.7s ease forwards';
                    });
                    btns.forEach(function (el) {
                        el.style.animation = 'none';
                        el.offsetHeight;
                        el.style.animation = 'fadeInUp 1.7s ease forwards';
                    });
                }
            });
        }
    });

    // --- Fade Up Staggered ---
    var fadeUpEls = document.querySelectorAll('.fade-up-stagger');
    var fadeObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var children = entry.target.querySelectorAll('.fade-up');
                children.forEach(function (child, i) {
                    setTimeout(function () {
                        child.classList.add('visible');
                    }, i * 100);
                });
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    fadeUpEls.forEach(function (el) { fadeObserver.observe(el); });

    // --- API Content Loading ---
    function articleToHeroSlide(article) {
        var img = article.image || 'https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=1600&q=80';
        if (img && !img.startsWith('http') && !img.startsWith('/')) img = 'images/' + img;
        return '<div class="swiper-slide"><div class="hero-slide" style="background-image: url(\'' + img + '\');"><div class="hero-overlay"></div><div class="hero-content"><span class="hero-badge">' + (article.featured ? 'Featured' : article.breaking ? 'Breaking' : article.category) + '</span><h1 class="hero-title">' + article.title + '</h1><p class="hero-excerpt">' + (article.excerpt || '') + '</p><div class="hero-meta"><span><i class="bi bi-person"></i> ' + (article.author || 'Staff') + '</span><span><i class="bi bi-clock"></i> ' + (article.readTime || '3 min read') + '</span><span><i class="bi bi-eye"></i> ' + (article.views || 0) + ' Views</span></div><a href="post-detail.html?slug=' + article.slug + '" class="eg-btn btn--primary btn--lg">Read Article <i class="bi bi-arrow-right"></i></a></div></div></div>';
    }
    function articleToGrid3(article) {
        var img = article.image || 'https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=600&q=80';
        if (img && !img.startsWith('http') && !img.startsWith('/')) img = 'images/' + img;
        return '<div class="swiper-slide"><div class="blog-grid-3"><span class="eg-badge badge--red">' + article.category + '</span><a href="post-detail.html?slug=' + article.slug + '" class="image"><img src="' + img + '" alt="' + article.title + '"></a><div class="content"><ul><li><i class="bi bi-person"></i> ' + (article.author || 'Staff') + '</li><li>' + (article.views || 0) + ' View</li></ul><h4><a href="post-detail.html?slug=' + article.slug + '">' + article.title + '</a></h4><div class="bottom-area"><a href="post-detail.html?slug=' + article.slug + '" class="eg-btn arrow-btn">View Details <i class="bi bi-arrow-right"></i></a></div></div></div></div>';
    }
    function articleToList2(article) {
        var img = article.image || 'https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=300&q=80';
        if (img && !img.startsWith('http') && !img.startsWith('/')) img = 'images/' + img;
        var d = article.date ? new Date(article.date) : new Date();
        var day = d.getDate().toString().padStart(2, '0');
        var mon = d.toLocaleString('en', { month: 'short' });
        return '<div class="blog-list-2"><div class="date"><h3>' + day + '</h3><p>' + mon + '</p></div><div class="content"><ul><li><i class="bi bi-person"></i> ' + (article.author || 'Staff') + '</li><li><span class="tag-name">' + article.category + '</span></li></ul><h4><a href="post-detail.html?slug=' + article.slug + '">' + article.title + '</a></h4><div class="bottom-area"><a href="post-detail.html?slug=' + article.slug + '" class="eg-btn arrow-btn">View Details <i class="bi bi-arrow-right"></i></a><span class="read-time"><i class="bi bi-clock"></i> ' + (article.readTime || '3 min read') + '</span></div></div><a href="post-detail.html?slug=' + article.slug + '" class="image"><img src="' + img + '" alt="' + article.title + '"></a></div>';
    }
    function articleToList3(article) {
        var img = article.image || 'https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=120&q=80';
        if (img && !img.startsWith('http') && !img.startsWith('/')) img = 'images/' + img;
        return '<div class="blog-list-3"><a href="post-detail.html?slug=' + article.slug + '" class="image"><img src="' + img + '" alt="' + article.title + '"></a><div class="content"><h6><a href="post-detail.html?slug=' + article.slug + '">' + article.title + '</a></h6><ul><li><i class="bi bi-calendar3"></i> ' + (article.date || '') + '</li><li><i class="bi bi-chat"></i> ' + (article.comments || 0) + '</li></ul></div></div>';
    }
    function articleToGrid1(article) {
        var img = article.image || 'https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=500&q=80';
        if (img && !img.startsWith('http') && !img.startsWith('/')) img = 'images/' + img;
        return '<div class="col-lg-4 col-md-6"><div class="fade-up blog-grid-1"><span class="eg-badge badge--red">' + article.category + '</span><a href="post-detail.html?slug=' + article.slug + '" class="image"><img src="' + img + '" alt="' + article.title + '"></a><div class="content"><h4><a href="post-detail.html?slug=' + article.slug + '">' + article.title + '</a></h4><div class="bottom-area"><a href="post-detail.html?slug=' + article.slug + '" class="eg-btn arrow-btn">View Details <i class="bi bi-arrow-right"></i></a></div></div></div></div>';
    }

    async function loadApiContent() {
        var rawPage = window.location.pathname.split('/').pop() || 'index.html';
        var page = rawPage.includes('.') ? rawPage : rawPage + '.html';
        var isHome = page === '' || page === 'index.html';

        var categoryMap = {
            'sports.html': 'sports', 'health.html': 'health', 'technology.html': 'technology',
            'business.html': 'business', 'asia.html': 'asia', 'europe.html': 'europe',
            'africa.html': 'africa', 'australia.html': 'australia',
            'north-america.html': 'north-america', 'south-america.html': 'south-america',
            'antarctica.html': 'antarctica',
        };
        var currentCategory = categoryMap[page] || null;

        if (isHome) {
            // 1) Hero slider - featured
            var featuredData = await apiFetch('/news?featured=true&limit=5');
            if (featuredData && featuredData.news && featuredData.news.length > 0) {
                var heroWrapper = document.querySelector('.heroSlider .swiper-wrapper');
                if (heroWrapper) {
                    heroWrapper.innerHTML = featuredData.news.map(articleToHeroSlide).join('');
                    var heroSlider = document.querySelector('.heroSlider');
                    if (heroSlider && heroSlider.swiper) heroSlider.swiper.destroy(true, true);
                    if (heroSlider) new Swiper(heroSlider, { loop: true, speed: 1200, autoplay: { delay: 5000, disableOnInteraction: false }, effect: 'fade', fadeEffect: { crossFade: true }, navigation: { nextEl: '.hero-next', prevEl: '.hero-prev' }, pagination: { el: '.hero-pagination', clickable: true } });
                }
            }

            // Fetch all articles for tabs
            var allData = await apiFetch('/news?limit=24');
            var allArticles = (allData && allData.news) ? allData.news : [];

            // 2) Tab 1: Newest (already sorted by date desc)
            var newestArticles = allArticles.slice(0, 5);
            var tabOne = document.querySelector('#tab-one .swiper-wrapper');
            if (tabOne && newestArticles.length > 0) {
                tabOne.innerHTML = newestArticles.map(articleToGrid3).join('');
                var tabSlider1 = document.querySelector('#tab-one .banner-1-slider');
                if (tabSlider1 && tabSlider1.swiper) tabSlider1.swiper.destroy(true, true);
                if (tabSlider1) new Swiper(tabSlider1, { slidesPerView: 3, spaceBetween: 20, navigation: { nextEl: '#tab-one .banner1-next', prevEl: '#tab-one .banner1-prev' }, breakpoints: { 0: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } } });
            }

            // Tab 2: Trending (by views desc)
            var trending = allArticles.slice().sort(function(a, b) { return (b.views || 0) - (a.views || 0); }).slice(0, 5);
            var tabTwo = document.querySelector('#tab-two .swiper-wrapper');
            if (tabTwo && trending.length > 0) {
                tabTwo.innerHTML = trending.map(articleToGrid3).join('');
                var tabSlider2 = document.querySelector('#tab-two .banner-1-slider');
                if (tabSlider2 && tabSlider2.swiper) tabSlider2.swiper.destroy(true, true);
                if (tabSlider2) new Swiper(tabSlider2, { slidesPerView: 3, spaceBetween: 20, navigation: { nextEl: '#tab-two .banner1-next', prevEl: '#tab-two .banner1-prev' }, breakpoints: { 0: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } } });
            }

            // Tab 3: Top View (same as trending top 5)
            var topView = trending.slice(0, 4);
            var tabThree = document.querySelector('#tab-three .swiper-wrapper');
            if (tabThree && topView.length > 0) {
                tabThree.innerHTML = topView.map(articleToGrid3).join('');
                var tabSlider3 = document.querySelector('#tab-three .banner-1-slider');
                if (tabSlider3 && tabSlider3.swiper) tabSlider3.swiper.destroy(true, true);
                if (tabSlider3) new Swiper(tabSlider3, { slidesPerView: 3, spaceBetween: 20, navigation: { nextEl: '#tab-three .banner1-next', prevEl: '#tab-three .banner1-prev' }, breakpoints: { 0: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } } });
            }

            // Tab 4: Top Like (by comments desc)
            var topLike = allArticles.slice().sort(function(a, b) { return (b.comments || 0) - (a.comments || 0); }).slice(0, 4);
            var tabFour = document.querySelector('#tab-four .swiper-wrapper');
            if (tabFour && topLike.length > 0) {
                tabFour.innerHTML = topLike.map(articleToGrid3).join('');
                var tabSlider4 = document.querySelector('#tab-four .banner-1-slider');
                if (tabSlider4 && tabSlider4.swiper) tabSlider4.swiper.destroy(true, true);
                if (tabSlider4) new Swiper(tabSlider4, { slidesPerView: 3, spaceBetween: 20, navigation: { nextEl: '#tab-four .banner1-next', prevEl: '#tab-four .banner1-prev' }, breakpoints: { 0: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } } });
            }

            // Tab 5: Recent (first 3)
            var recent = allArticles.slice(0, 3);
            var tabFive = document.querySelector('#tab-five .swiper-wrapper');
            if (tabFive && recent.length > 0) {
                tabFive.innerHTML = recent.map(articleToGrid3).join('');
                var tabSlider5 = document.querySelector('#tab-five .banner-1-slider');
                if (tabSlider5 && tabSlider5.swiper) tabSlider5.swiper.destroy(true, true);
                if (tabSlider5) new Swiper(tabSlider5, { slidesPerView: 3, spaceBetween: 20, navigation: { nextEl: '#tab-five .banner1-next', prevEl: '#tab-five .banner1-prev' }, breakpoints: { 0: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } } });
            }

            // 3) Blog List Slider (3 slide groups from all articles)
            var blogMultiWrapper = document.querySelector('.blog-multi-list-slider .swiper-wrapper');
            if (blogMultiWrapper && allArticles.length > 0) {
                var slideTitles = [
                    { main: 'Latest News', sub: 'Top Stories' },
                    { main: 'Across the World', sub: 'Global News' },
                    { main: 'Culture & Ideas', sub: 'Fresh Reads' },
                ];
                blogMultiWrapper.innerHTML = '';
                for (var s = 0; s < 3; s++) {
                    var start = s * 5;
                    var slice = allArticles.slice(start, start + 5);
                    if (slice.length === 0) break;
                    var slideHtml = '<div class="swiper-slide"><div class="section-title-1 mb-40"><h2>' + slideTitles[s].main + ' <span class="subtitle">' + slideTitles[s].sub + '</span></h2></div>' + slice.map(articleToList2).join('') + '</div>';
                    blogMultiWrapper.innerHTML += slideHtml;
                }
                var blogMultiSlider = document.querySelector('.blog-multi-list-slider');
                if (blogMultiSlider && blogMultiSlider.swiper) blogMultiSlider.swiper.destroy(true, true);
                if (blogMultiSlider) new Swiper(blogMultiSlider, { loop: false, speed: 800, navigation: { nextEl: '.blog-multi-next', prevEl: '.blog-multi-prev' } });
            }

            // 4) Sidebar Editor Choice
            var editorArticles = allArticles.slice(0, 5);
            var sidebarEditor = document.querySelector('.post-side-bar-1 .sidebar-widget-1');
            if (sidebarEditor && editorArticles.length > 0) {
                sidebarEditor.innerHTML = '<h6 class="title">Editor Choice</h6>' + editorArticles.map(articleToList3).join('');
            }

            // 5) Latest Blog Section
            var latestArticles = allArticles.slice(0, 3);
            var blogCards = document.querySelectorAll('.latest-blog-section .blog-grid-1');
            latestArticles.forEach(function (article, i) {
                if (blogCards[i]) {
                    var img = article.image || '';
                    if (img && !img.startsWith('http') && !img.startsWith('/')) img = 'images/' + img;
                    if (img) blogCards[i].querySelector('.image img').src = img;
                    blogCards[i].querySelector('h4 a').textContent = article.title;
                    var badge = blogCards[i].querySelector('.eg-badge');
                    if (badge) badge.textContent = article.category;
                    blogCards[i].querySelector('.image').href = 'post-detail.html?slug=' + article.slug;
                    blogCards[i].querySelector('h4 a').href = 'post-detail.html?slug=' + article.slug;
                }
            });

            // 6) Recent Post slider
            var recentSliderData = allArticles.slice(0, 5);
            var recentWrapper = document.querySelector('.recent-1-slider .swiper-wrapper');
            if (recentWrapper && recentSliderData.length > 0) {
                recentWrapper.innerHTML = '';
                recentSliderData.forEach(function (article) {
                    var img = article.image || 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400&q=80';
                    if (img && !img.startsWith('http') && !img.startsWith('/')) img = 'images/' + img;
                    recentWrapper.innerHTML += '<div class="swiper-slide"><div class="blog-image-1"><div class="image"><img src="' + img + '" alt="' + article.title + '"><div class="content"><a href="#" class="subtitle">' + article.category + '</a><h4 class="title"><a href="post-detail.html?slug=' + article.slug + '">' + article.title + '</a></h4><ul><li><i class="bi bi-calendar3"></i> ' + (article.date || '') + '</li><li><i class="bi bi-chat"></i> ' + (article.comments || 0) + ' Comment</li></ul></div></div></div></div>';
                });
                var recentSlider = document.querySelector('.recent-1-slider');
                if (recentSlider && recentSlider.swiper) recentSlider.swiper.destroy(true, true);
                if (recentSlider) new Swiper(recentSlider, { loop: true, speed: 1000, autoplay: { delay: 4000, disableOnInteraction: false }, slidesPerView: 3, spaceBetween: 24, navigation: { nextEl: '.recent1-next', prevEl: '.recent1-prev' }, breakpoints: { 0: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } } });
            }

            // 7) Category section - update counts and make interactive
            var catCounts = {};
            allArticles.forEach(function (a) { catCounts[a.category] = (catCounts[a.category] || 0) + 1; });
            var catViews = {};
            allArticles.forEach(function (a) { catViews[a.category] = (catViews[a.category] || 0) + (a.views || 0); });
            document.querySelectorAll('.category-1').forEach(function (el) {
                var nameEl = el.querySelector('h4 a');
                if (!nameEl) return;
                var catName = nameEl.textContent.trim().toLowerCase();
                var count = catCounts[catName] || 0;
                var views = catViews[catName] || 0;
                var lis = el.querySelectorAll('ul li');
                if (lis[0]) lis[0].textContent = count + ' Articles';
                if (lis[1]) lis[1].textContent = views >= 1000 ? (views / 1000).toFixed(1) + 'k View' : views + ' View';
            });

            // 8) Footer top articles
            var footerArticles = allArticles.slice(0, 2);
            var footerCards = document.querySelectorAll('.footer .blog-list-1');
            footerArticles.forEach(function (article, i) {
                if (footerCards[i]) {
                    var img = article.image || '';
                    if (img && !img.startsWith('http') && !img.startsWith('/')) img = 'images/' + img;
                    if (img) footerCards[i].querySelector('.image img').src = img;
                    footerCards[i].querySelector('h6 a').textContent = article.title;
                    footerCards[i].querySelector('h6 a').href = 'post-detail.html?slug=' + article.slug;
                    footerCards[i].querySelector('.image').href = 'post-detail.html?slug=' + article.slug;
                }
            });
        }

        // Category pages
        if (currentCategory) {
            var catData = await apiFetch('/news?category=' + encodeURIComponent(currentCategory) + '&limit=50');
            if (catData && catData.news && catData.news.length > 0) {
                var mainContent = document.querySelector('.blog-section .row .col-lg-8')
                    || document.querySelector('.blog-section .col-lg-8')
                    || document.querySelector('.blog-section main .col-lg-8')
                    || document.querySelector('main.blog-section .col-lg-8')
                    || document.querySelector('.col-lg-8');
                if (mainContent) {
                    var rowHtml = '<div class="row g-4">';
                    catData.news.forEach(function (article, index) {
                        var img = article.image || '';
                        if (img && !img.startsWith('http') && !img.startsWith('/')) img = 'images/' + img;
                        rowHtml += '<div class="col-md-6"><div class="blog-grid-1 fade-up" style="animation-delay:' + (index * 0.1) + 's;"><div class="image"><a href="post-detail.html?slug=' + article.slug + '"><img src="' + img + '" alt="' + article.title + '"></a><span class="badge badge-primary">' + article.category + '</span></div><div class="content"><div class="blog-meta"><span class="meta-author"><i class="bi bi-person"></i> ' + (article.author || 'Staff') + '</span><span class="meta-date"><i class="bi bi-calendar3"></i> ' + (article.date || '') + '</span><span class="meta-views"><i class="bi bi-eye"></i> ' + (article.views || 0) + '</span></div><h3><a href="post-detail.html?slug=' + article.slug + '">' + article.title + '</a></h3><p>' + (article.excerpt || '') + '</p><div class="blog-bottom"><a href="post-detail.html?slug=' + article.slug + '" class="arrow-btn">View Details <span class="arrow"><i class="bi bi-arrow-right"></i></span></a><span class="read-time"><i class="bi bi-clock"></i> ' + (article.readTime || '3 min read') + '</span></div></div></div></div>';
                    });
                    rowHtml += '</div>';
                    mainContent.innerHTML = rowHtml;

                    // Also update sidebar with latest from same category
                    var sidebar = document.querySelector('.blog-section .col-lg-4')
                        || document.querySelector('.blog-section aside')
                        || document.querySelector('.col-lg-4');
                    if (sidebar && catData.news.length > 0) {
                        var sideHtml = '<div class="post-side-bar-1"><div class="sidebar-widget-1 mb-40"><h6 class="title">Latest in ' + currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1).replace(/-/g, ' ') + '</h6>';
                        catData.news.slice(0, 5).forEach(function (a) {
                            var sImg = a.image || '';
                            if (sImg && !sImg.startsWith('http') && !sImg.startsWith('/')) sImg = 'images/' + sImg;
                            sideHtml += '<div class="blog-list-3"><a href="post-detail.html?slug=' + a.slug + '" class="image"><img src="' + sImg + '" alt="' + a.title + '"></a><div class="content"><h6><a href="post-detail.html?slug=' + a.slug + '">' + a.title + '</a></h6><ul><li><i class="bi bi-calendar3"></i> ' + (a.date || '') + '</li><li><i class="bi bi-chat"></i> ' + (a.comments || 0) + '</li></ul></div></div>';
                        });
                        sideHtml += '</div></div>';
                        sidebar.innerHTML = sideHtml;
                    }
                }
            }
        }

        // Blog listing pages (classic, masonry, standard)
        var blogPages = ['blog-classic.html', 'blog-masonry.html', 'blog-standard.html'];
        if (blogPages.indexOf(page) !== -1) {
            var allData = await apiFetch('/news?limit=50');
            if (allData && allData.news && allData.news.length > 0) {
                var mainContent = document.querySelector('.blog-section .row .col-lg-8');
                if (mainContent) {
                    var rowHtml = '<div class="row g-4">';
                    allData.news.forEach(function (article, index) {
                        var img = article.image || '';
                        if (img && !img.startsWith('http') && !img.startsWith('/')) img = 'images/' + img;
                        rowHtml += '<div class="col-md-6"><div class="blog-grid-1 fade-up" style="animation-delay:' + (index * 0.1) + 's;"><div class="image"><a href="post-detail.html?slug=' + article.slug + '"><img src="' + img + '" alt="' + article.title + '"></a><span class="badge badge-primary">' + article.category + '</span></div><div class="content"><div class="blog-meta"><span class="meta-author"><i class="bi bi-person"></i> ' + (article.author || 'Staff') + '</span><span class="meta-date"><i class="bi bi-calendar3"></i> ' + (article.date || '') + '</span><span class="meta-views"><i class="bi bi-eye"></i> ' + (article.views || 0) + '</span></div><h3><a href="post-detail.html?slug=' + article.slug + '">' + article.title + '</a></h3><p>' + (article.excerpt || '') + '</p><div class="blog-bottom"><a href="post-detail.html?slug=' + article.slug + '" class="arrow-btn">View Details <span class="arrow"><i class="bi bi-arrow-right"></i></span></a><span class="read-time"><i class="bi bi-clock"></i> ' + (article.readTime || '3 min read') + '</span></div></div></div></div>';
                    });
                    rowHtml += '</div>';
                    mainContent.innerHTML = rowHtml;
                }
            }
        }

        // Post detail page - handled by inline script in post-detail.html (API-first, no hardcoded data)
    }

    // --- API Search ---
    function setupSearchApi() {
        var searchInput = document.getElementById('searchInput');
        var searchResults = document.getElementById('searchResults');
        if (!searchInput || !searchResults) return;

        var debounceTimer;
        searchInput.addEventListener('input', function () {
            clearTimeout(debounceTimer);
            var val = this.value.trim();
            if (val.length < 2) return;
            debounceTimer = setTimeout(async function () {
                var data = await apiFetch('/news?search=' + encodeURIComponent(val) + '&limit=5');
                if (data && data.news && data.news.length > 0) {
                    var html = '<div class="search-suggestion-title">Search Results</div>';
                    data.news.forEach(function (a) {
                        var img = a.image || '';
                        if (img && !img.startsWith('http') && !img.startsWith('/')) img = 'images/' + img;
                        html += '<div class="search-result-item" onclick="window.location=\'post-detail.html?slug=' + a.slug + '\'"><img src="' + img + '" alt="result"><div class="result-content"><h6>' + a.title + '</h6><span>' + a.category + ' &bull; ' + (a.readTime || '3 min read') + '</span></div></div>';
                    });
                    searchResults.innerHTML = html;
                }
            }, 400);
        });
    }

    // --- Newsletter Form ---
    var newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var email = document.getElementById('newsletterEmail').value.trim();
            var msg = document.getElementById('newsletterMsg');
            if (!email) return;
            msg.textContent = 'Thank you for subscribing! You\'ll receive our best stories at ' + email;
            msg.style.display = 'block';
            msg.style.color = '#4caf50';
            document.getElementById('newsletterEmail').value = '';
            setTimeout(function () { msg.style.display = 'none'; }, 5000);
        });
    }

});

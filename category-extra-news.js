document.addEventListener('DOMContentLoaded', function () {
    var rawPage = window.location.pathname.split('/').pop();
    var page = rawPage.includes('.') ? rawPage : rawPage + '.html';
    var stories = {
        'sports.html': [
            { tag: 'Football', date: 'July 19, 2026', time: '5 min read', title: 'The Young Players Bringing New Energy to Football', text: 'A fearless new generation is changing the rhythm and ambition of the game.', image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=1200&q=85', alt: 'Football on a pitch' },
            { tag: 'Tennis', date: 'July 18, 2026', time: '4 min read', title: 'How Tennis Is Finding Its Next Great Rivalries', text: 'Fresh matchups and bold styles are giving fans more reasons to watch every tournament.', image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=1200&q=85', alt: 'Tennis player serving' }
        ],
        'health.html': [
            { tag: 'Fitness', date: 'July 19, 2026', time: '5 min read', title: 'Why Strength Training Belongs in Every Routine', text: 'Simple, sustainable movement can support confidence, mobility and long-term health.', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=85', alt: 'Person strength training' },
            { tag: 'Sleep', date: 'July 18, 2026', time: '4 min read', title: 'Creating an Evening Routine That Helps You Unwind', text: 'Small changes before bed can make room for more restorative, consistent rest.', image: 'https://images.unsplash.com/photo-1511295742362-92c96b1cf484?w=1200&q=85', alt: 'Peaceful bedroom at night' }
        ],
        'technology.html': [
            { tag: 'Cybersecurity', date: 'July 19, 2026', time: '6 min read', title: 'The Simple Security Habits That Protect Digital Life', text: 'Better passwords, thoughtful updates and awareness can make a meaningful difference.', image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=85', alt: 'Digital security screen' },
            { tag: 'Science', date: 'July 18, 2026', time: '5 min read', title: 'New Materials Could Change the Devices We Carry', text: 'Researchers are exploring lighter, smarter materials for the next wave of everyday technology.', image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=1200&q=85', alt: 'Scientific technology equipment' }
        ]
    };

    if (!stories[page]) return;

    const contentColumn = document.querySelector('.blog-section .col-lg-8');
    if (!contentColumn) return;

    stories[page].forEach(function (story) {
        const card = document.createElement('article');
        card.className = 'blog-standard-card fade-up';
        card.innerHTML = '<div class="image"><a href="post-detail.html"><img src="' + story.image + '" alt="' + story.alt + '"></a><span class="badge badge-primary">' + story.tag + '</span></div>' +
            '<div class="content"><div class="blog-meta"><span class="meta-date"><i class="bi bi-calendar3"></i> ' + story.date + '</span><span class="meta-readtime"><i class="bi bi-clock"></i> ' + story.time + '</span></div>' +
            '<h2><a href="post-detail.html">' + story.title + '</a></h2><p>' + story.text + '</p><div class="blog-footer"><a href="post-detail.html" class="arrow-btn">Read More <span class="arrow"><i class="bi bi-arrow-right"></i></span></a></div></div>';
        contentColumn.appendChild(card);
    });

    const sidebar = document.querySelector('.blog-section aside');
    if (sidebar) {
        const related = stories[page];
        const mostRead = document.createElement('div');
        mostRead.className = 'sidebar-widget category-most-read';
        mostRead.innerHTML = '<h4 class="widget-title">Most Read</h4>' + related.map(function (story, index) {
            return '<a class="category-read-item" href="post-detail.html"><span>0' + (index + 1) + '</span><div><strong>' + story.title + '</strong><small>' + story.time + '</small></div></a>';
        }).join('');
        sidebar.querySelector('.sidebar-widget:last-child').after(mostRead);

        const newsletter = document.createElement('div');
        newsletter.className = 'sidebar-widget category-newsletter';
        newsletter.innerHTML = '<i class="bi bi-envelope-paper"></i><h4>Get the weekly briefing</h4><p>Top stories and useful updates, delivered every week.</p><a href="#" class="arrow-btn">Subscribe <span class="arrow"><i class="bi bi-arrow-right"></i></span></a>';
        sidebar.appendChild(newsletter);
    }
});

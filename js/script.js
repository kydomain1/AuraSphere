// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');

        // Animate bars
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            if (navToggle.classList.contains('active')) {
                if (index === 0) bar.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) bar.style.opacity = '0';
                if (index === 2) bar.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            }
        });
    });
}

// Search Functionality
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');

if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function performSearch() {
    const query = searchInput.value.trim();
    if (query) {
        // Redirect to search results page (to be implemented)
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animation on Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.category-card, .article-card, .hero-content');
    animateElements.forEach(el => {
        observer.observe(el);
    });
});

// Navbar Scroll Effect
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'var(--white)';
        header.style.backdropFilter = 'none';
    }

    lastScrollY = currentScrollY;
});

// Category Filter (for category pages)
function filterArticles(category) {
    const articles = document.querySelectorAll('.article-card');

    articles.forEach(article => {
        const articleCategory = article.querySelector('.article-category').textContent.toLowerCase();

        if (category === 'all' || articleCategory.includes(category.toLowerCase())) {
            article.style.display = 'block';
            article.classList.add('fade-in');
        } else {
            article.style.display = 'none';
        }
    });
}

// Pagination
let currentPage = 1;
const articlesPerPage = 6;

function setupPagination() {
    const articles = document.querySelectorAll('.article-card');
    const totalPages = Math.ceil(articles.length / articlesPerPage);

    showPage(currentPage);
    createPaginationButtons(totalPages);
}

function showPage(page) {
    const articles = document.querySelectorAll('.article-card');
    const startIndex = (page - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;

    articles.forEach((article, index) => {
        if (index >= startIndex && index < endIndex) {
            article.style.display = 'block';
        } else {
            article.style.display = 'none';
        }
    });
}

function createPaginationButtons(totalPages) {
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;

    paginationContainer.innerHTML = '';

    // Previous button
    if (currentPage > 1) {
        const prevBtn = createPaginationButton('Previous', currentPage - 1);
        paginationContainer.appendChild(prevBtn);
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = createPaginationButton(i, i);
        if (i === currentPage) {
            pageBtn.classList.add('active');
        }
        paginationContainer.appendChild(pageBtn);
    }

    // Next button
    if (currentPage < totalPages) {
        const nextBtn = createPaginationButton('Next', currentPage + 1);
        paginationContainer.appendChild(nextBtn);
    }
}

function createPaginationButton(text, page) {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add('pagination-btn');
    button.addEventListener('click', () => {
        currentPage = page;
        showPage(currentPage);
        createPaginationButtons(Math.ceil(document.querySelectorAll('.article-card').length / articlesPerPage));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    return button;
}

// Initialize pagination if on a page with articles
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.articles-grid')) {
        setupPagination();
    }
});

// Form Validation (for contact form)
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        const errorElement = input.parentNode.querySelector('.error-message');

        if (!input.value.trim()) {
            showError(input, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
            showError(input, 'Please enter a valid email address');
            isValid = false;
        } else {
            hideError(input);
        }
    });

    return isValid;
}

function showError(input, message) {
    input.classList.add('error');
    let errorElement = input.parentNode.querySelector('.error-message');

    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.classList.add('error-message');
        input.parentNode.appendChild(errorElement);
    }

    errorElement.textContent = message;
}

function hideError(input) {
    input.classList.remove('error');
    const errorElement = input.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Lazy Loading for Images
const lazyImages = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('fade-in');
            observer.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// Reading Progress Bar (for article pages)
function createReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.classList.add('reading-progress');
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const article = document.querySelector('.article-content');
        if (!article) return;

        const articleTop = article.offsetTop;
        const articleHeight = article.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.scrollY;

        const progress = (scrollTop - articleTop + windowHeight) / articleHeight;
        const percentage = Math.min(Math.max(progress * 100, 0), 100);

        progressBar.style.width = percentage + '%';
    });
}

// Initialize reading progress on article pages
if (document.querySelector('.article-content')) {
    createReadingProgress();
}

// Back to Top Button
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopBtn.classList.add('back-to-top');
backToTopBtn.style.display = 'none';
document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.style.display = 'flex';
    } else {
        backToTopBtn.style.display = 'none';
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Theme Toggle (optional feature)
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('darkTheme', document.body.classList.contains('dark-theme'));
}

// Load saved theme
if (localStorage.getItem('darkTheme') === 'true') {
    document.body.classList.add('dark-theme');
}

// Auto-hide loading elements
window.addEventListener('load', () => {
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(el => el.style.display = 'none');
});

// Create scroll indicator
function createScrollIndicator() {
    const indicator = document.createElement('div');
    indicator.classList.add('scroll-indicator');
    document.body.appendChild(indicator);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        indicator.style.width = scrolled + '%';
    });
}

// Initialize scroll indicator
createScrollIndicator();

// Create floating social media widget
function createSocialWidget() {
    const socialWidget = document.createElement('div');
    socialWidget.classList.add('social-widget');
    socialWidget.innerHTML = `
        <a href="#" class="social-link facebook" title="Follow on Facebook">
            <i class="fab fa-facebook-f"></i>
        </a>
        <a href="#" class="social-link twitter" title="Follow on Twitter">
            <i class="fab fa-twitter"></i>
        </a>
        <a href="#" class="social-link instagram" title="Follow on Instagram">
            <i class="fab fa-instagram"></i>
        </a>
        <a href="#" class="social-link pinterest" title="Follow on Pinterest">
            <i class="fab fa-pinterest-p"></i>
        </a>
    `;
    document.body.appendChild(socialWidget);
}

// Initialize social widget on larger screens
if (window.innerWidth > 768) {
    createSocialWidget();
}

// Enhanced search with suggestions
function enhanceSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;

    const suggestions = [
        'sustainable fashion',
        'skincare routine',
        'minimalist home',
        'european travel',
        'coffee culture',
        'investment tips',
        'eco-friendly',
        'wellness'
    ];

    let suggestionBox = null;

    searchInput.addEventListener('focus', () => {
        if (!suggestionBox) {
            suggestionBox = document.createElement('div');
            suggestionBox.className = 'search-suggestions';
            suggestionBox.style.cssText = `
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border: 1px solid var(--border-color);
                border-radius: 6px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                z-index: 1000;
                max-height: 200px;
                overflow-y: auto;
                display: none;
            `;
            searchInput.parentNode.style.position = 'relative';
            searchInput.parentNode.appendChild(suggestionBox);
        }
    });

    searchInput.addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase();
        if (value.length > 0) {
            const filtered = suggestions.filter(s => s.includes(value));
            if (filtered.length > 0) {
                suggestionBox.innerHTML = filtered.map(s =>
                    `<div style="padding: 0.5rem; cursor: pointer; border-bottom: 1px solid #eee;"
                         onclick="selectSuggestion('${s}')">${s}</div>`
                ).join('');
                suggestionBox.style.display = 'block';
            } else {
                suggestionBox.style.display = 'none';
            }
        } else {
            suggestionBox.style.display = 'none';
        }
    });

    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && suggestionBox) {
            suggestionBox.style.display = 'none';
        }
    });
}

function selectSuggestion(suggestion) {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.value = suggestion;
        performSearch();
    }
}

// Initialize enhanced search
enhanceSearch();
// Category page functionality
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('cat');

    // Category configurations
    const categories = {
        fashion: {
            title: 'Fashion & Accessories',
            description: 'Discover sustainable fashion trends, style guides, and carefully selected accessories that reflect your personal aesthetic.',
            icon: 'fas fa-tshirt',
            class: 'category-fashion'
        },
        health: {
            title: 'Health & Beauty',
            description: 'Science-backed wellness advice, skincare routines, and beauty products that enhance your natural radiance.',
            icon: 'fas fa-heart',
            class: 'category-health'
        },
        home: {
            title: 'Home & Garden',
            description: 'Interior design inspiration, functional furniture recommendations, and gardening tips for beautiful living spaces.',
            icon: 'fas fa-home',
            class: 'category-home'
        },
        travel: {
            title: 'Travel & Accommodation',
            description: 'Hidden destinations, responsible travel practices, and accommodation reviews for mindful exploration.',
            icon: 'fas fa-plane',
            class: 'category-travel'
        },
        finance: {
            title: 'Finance & Insurance',
            description: 'Practical financial advice, investment insights, and insurance guidance for building security and achieving goals.',
            icon: 'fas fa-chart-line',
            class: 'category-finance'
        },
        food: {
            title: 'Food & Beverage',
            description: 'Culinary experiences, kitchen equipment reviews, and food culture explorations that celebrate good living.',
            icon: 'fas fa-utensils',
            class: 'category-food'
        }
    };

    // Initialize page based on category parameter
    initializePage(categoryParam, categories);

    // Set up filter functionality
    setupFilters();

    // Set up sorting functionality
    setupSorting();

    // Set up pagination
    setupPagination();

    // Initial filter application
    applyFilters();
});

function initializePage(categoryParam, categories) {
    const categoryTitle = document.getElementById('category-title');
    const categoryDescription = document.getElementById('category-description');
    const categoryIcon = document.getElementById('category-icon');
    const categoryBreadcrumb = document.getElementById('category-breadcrumb');
    const pageTitle = document.getElementById('page-title');

    if (categoryParam && categories[categoryParam]) {
        const category = categories[categoryParam];

        // Update page elements
        categoryTitle.textContent = category.title;
        categoryDescription.textContent = category.description;
        categoryIcon.innerHTML = `<i class="${category.icon}"></i>`;
        categoryBreadcrumb.textContent = category.title;
        pageTitle.textContent = `${category.title} - AuraSphere`;

        // Add category-specific class
        document.body.classList.add(category.class);

        // Set active filter
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => btn.classList.remove('active'));
        const targetFilter = document.querySelector(`[data-filter="${categoryParam}"]`);
        if (targetFilter) {
            targetFilter.classList.add('active');
        }

        // Filter articles immediately
        filterArticles(categoryParam);
    } else {
        // Default view - all categories
        categoryTitle.textContent = 'All Categories';
        categoryDescription.textContent = 'Explore our comprehensive collection of lifestyle articles and recommendations.';
        categoryIcon.innerHTML = '<i class="fas fa-th-large"></i>';
        categoryBreadcrumb.textContent = 'All Categories';
        pageTitle.textContent = 'All Categories - AuraSphere';
    }
}

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Get filter value
            const filterValue = this.getAttribute('data-filter');

            // Update URL
            updateURL(filterValue);

            // Apply filter
            filterArticles(filterValue);
        });
    });
}

function setupSorting() {
    const sortSelect = document.getElementById('sort-select');

    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        sortArticles(sortValue);
    });
}

function filterArticles(category) {
    const articles = document.querySelectorAll('.article-card');
    const noResults = document.getElementById('no-results');
    let visibleCount = 0;

    articles.forEach(article => {
        const articleCategory = article.getAttribute('data-category');

        if (category === 'all' || articleCategory === category) {
            article.style.display = 'block';
            article.classList.remove('hidden');
            visibleCount++;
        } else {
            article.style.display = 'none';
            article.classList.add('hidden');
        }
    });

    // Show/hide no results message
    if (visibleCount === 0) {
        noResults.style.display = 'block';
    } else {
        noResults.style.display = 'none';
    }

    // Update pagination
    updatePagination();
}

function sortArticles(sortType) {
    const articlesGrid = document.getElementById('articles-grid');
    const articles = Array.from(document.querySelectorAll('.article-card:not(.hidden)'));

    articles.sort((a, b) => {
        const dateA = new Date(a.getAttribute('data-date'));
        const dateB = new Date(b.getAttribute('data-date'));

        switch (sortType) {
            case 'newest':
                return dateB - dateA;
            case 'oldest':
                return dateA - dateB;
            case 'popular':
                // For demo purposes, sort by title length as a proxy for popularity
                const titleA = a.querySelector('.article-title a').textContent.length;
                const titleB = b.querySelector('.article-title a').textContent.length;
                return titleB - titleA;
            default:
                return dateB - dateA;
        }
    });

    // Remove all articles from grid
    articles.forEach(article => {
        articlesGrid.removeChild(article);
    });

    // Add articles back in sorted order
    articles.forEach(article => {
        articlesGrid.appendChild(article);
    });

    // Update pagination after sorting
    updatePagination();
}

function setupPagination() {
    // Pagination will be updated dynamically based on visible articles
    updatePagination();
}

function updatePagination() {
    const pagination = document.getElementById('pagination');
    const visibleArticles = document.querySelectorAll('.article-card:not(.hidden)');
    const articlesPerPage = 6;
    const totalPages = Math.ceil(visibleArticles.length / articlesPerPage);

    // Clear existing pagination
    pagination.innerHTML = '';

    if (totalPages <= 1) {
        return; // No pagination needed
    }

    let currentPage = 1;

    // Show first page of articles
    showPage(1, visibleArticles, articlesPerPage);

    // Create pagination buttons
    createPaginationButtons(totalPages, currentPage, visibleArticles, articlesPerPage);
}

function createPaginationButtons(totalPages, currentPage, visibleArticles, articlesPerPage) {
    const pagination = document.getElementById('pagination');

    // Previous button
    if (currentPage > 1) {
        const prevBtn = createPageButton('Previous', currentPage - 1, visibleArticles, articlesPerPage);
        pagination.appendChild(prevBtn);
    }

    // Page number buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = createPageButton(i, i, visibleArticles, articlesPerPage);
        if (i === currentPage) {
            pageBtn.classList.add('active');
        }
        pagination.appendChild(pageBtn);
    }

    // Next button
    if (currentPage < totalPages) {
        const nextBtn = createPageButton('Next', currentPage + 1, visibleArticles, articlesPerPage);
        pagination.appendChild(nextBtn);
    }
}

function createPageButton(text, page, visibleArticles, articlesPerPage) {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add('pagination-btn');
    button.addEventListener('click', () => {
        showPage(page, visibleArticles, articlesPerPage);

        // Update active state
        document.querySelectorAll('.pagination-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        if (typeof text === 'number') {
            button.classList.add('active');
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Recreate pagination with new current page
        const totalPages = Math.ceil(visibleArticles.length / articlesPerPage);
        createPaginationButtons(totalPages, page, visibleArticles, articlesPerPage);
    });

    return button;
}

function showPage(page, visibleArticles, articlesPerPage) {
    const startIndex = (page - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;

    visibleArticles.forEach((article, index) => {
        if (index >= startIndex && index < endIndex) {
            article.style.display = 'block';
        } else {
            article.style.display = 'none';
        }
    });
}

function updateURL(category) {
    const url = new URL(window.location);

    if (category === 'all') {
        url.searchParams.delete('cat');
    } else {
        url.searchParams.set('cat', category);
    }

    window.history.pushState({}, '', url);
}

function applyFilters() {
    // Apply any initial filters based on URL parameters or active states
    const activeFilter = document.querySelector('.filter-btn.active');
    if (activeFilter) {
        const filterValue = activeFilter.getAttribute('data-filter');
        filterArticles(filterValue);
    }
}

// Handle no results reset button
document.addEventListener('click', function(e) {
    if (e.target.closest('.no-results .filter-btn')) {
        const allButton = document.querySelector('.filter-btn[data-filter="all"]');
        if (allButton) {
            allButton.click();
        }
    }
});

// Search functionality integration
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            searchArticles(searchTerm);
        });
    }
});

function searchArticles(searchTerm) {
    const articles = document.querySelectorAll('.article-card');
    const noResults = document.getElementById('no-results');
    let visibleCount = 0;

    articles.forEach(article => {
        const title = article.querySelector('.article-title a').textContent.toLowerCase();
        const excerpt = article.querySelector('.article-excerpt').textContent.toLowerCase();
        const category = article.querySelector('.article-category').textContent.toLowerCase();

        const isVisible = !searchTerm ||
                         title.includes(searchTerm) ||
                         excerpt.includes(searchTerm) ||
                         category.includes(searchTerm);

        if (isVisible) {
            article.style.display = 'block';
            article.classList.remove('hidden');
            visibleCount++;
        } else {
            article.style.display = 'none';
            article.classList.add('hidden');
        }
    });

    // Show/hide no results message
    if (visibleCount === 0 && searchTerm) {
        noResults.style.display = 'block';
        noResults.querySelector('h3').textContent = 'No search results found';
        noResults.querySelector('p').textContent = `No articles found for "${searchTerm}". Try different keywords.`;
    } else if (visibleCount === 0) {
        noResults.style.display = 'block';
        noResults.querySelector('h3').textContent = 'No articles found';
        noResults.querySelector('p').textContent = 'Try adjusting your filters or browse all categories.';
    } else {
        noResults.style.display = 'none';
    }

    // Update pagination
    updatePagination();
}
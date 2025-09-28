// Search functionality for search.html
document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q') || '';
    
    // Initialize search
    if (query) {
        performSearch(query);
    }
    
    // Set up search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = query;
        
        // Add event listeners
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
    }
    
    // Set up search button
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            performSearch(searchInput.value);
        });
    }
    
    // Set up filters
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            performSearch(searchInput.value);
        });
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            performSearch(searchInput.value);
        });
    }
});

// Article database
const articles = [
    {
        id: 1,
        title: "The Rise of Sustainable Fashion: Top 10 Eco-Friendly Brands to Watch",
        excerpt: "Discover the latest sustainable fashion trends and the brands leading the eco-conscious revolution...",
        category: "fashion",
        date: "March 15, 2025",
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=400&q=80",
        link: "article-1.html",
        tags: ["sustainable fashion", "eco-friendly", "brands", "trends", "environment"]
    },
    {
        id: 2,
        title: "The Perfect Morning Skincare Routine: 7 Steps for Glowing Skin",
        excerpt: "Transform your morning routine with these scientifically-backed skincare steps and product recommendations...",
        category: "health",
        date: "April 2, 2025",
        image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=400&q=80",
        link: "article-2.html",
        tags: ["skincare", "routine", "beauty", "morning", "glowing skin", "products"]
    },
    {
        id: 3,
        title: "Creating a Minimalist Home: Essential Furniture and Decor Pieces",
        excerpt: "Learn how to transform your space with carefully curated minimalist furniture and accessories...",
        category: "home",
        date: "May 18, 2025",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80",
        link: "article-3.html",
        tags: ["minimalist", "home", "furniture", "decor", "interior design", "simple living"]
    },
    {
        id: 4,
        title: "Hidden Gems of Europe: 12 Underrated Destinations for 2025",
        excerpt: "Explore Europe's best-kept secrets with our guide to stunning lesser-known destinations...",
        category: "travel",
        date: "June 10, 2025",
        image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=400&q=80",
        link: "article-4.html",
        tags: ["europe", "travel", "destinations", "hidden gems", "2025", "vacation"]
    },
    {
        id: 5,
        title: "The Evolution of Coffee Culture: From Bean to Cup Excellence",
        excerpt: "Dive into the world of specialty coffee and discover the tools and techniques for the perfect brew...",
        category: "food",
        date: "August 22, 2025",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80",
        link: "article-5.html",
        tags: ["coffee", "culture", "brewing", "specialty", "beans", "techniques"]
    },
    {
        id: 6,
        title: "LATAM Best Fares & Deals: Your Gateway to South American Adventures",
        excerpt: "Discover unbeatable flight deals and explore the vibrant cultures, stunning landscapes, and rich heritage of South America...",
        category: "travel",
        date: "December 15, 2024",
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=400&q=80",
        link: "article-6.html",
        tags: ["latam airlines", "south america", "flight deals", "travel", "adventure", "budget travel", "airline deals"]
    },
    {
        id: 7,
        title: "LATAM: Connecting the Americas with Pride",
        excerpt: "Discover how LATAM Airlines connects the Americas with pride, offering exceptional service and connectivity across South America, North America, and beyond...",
        category: "travel",
        date: "December 15, 2024",
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=400&q=80",
        link: "article-7.html",
        tags: ["latam airlines", "americas", "aviation", "connectivity", "pride", "service", "airline", "travel"]
    }
];

function performSearch(query) {
    if (!query || query.trim() === '') {
        showNoResults();
        return;
    }
    
    const searchQuery = query.toLowerCase().trim();
    const categoryFilter = document.getElementById('category-filter').value;
    const sortFilter = document.getElementById('sort-filter').value;
    
    // Update URL
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('q', searchQuery);
    window.history.pushState({}, '', newUrl);
    
    // Update search query display
    document.getElementById('search-query').textContent = searchQuery;
    
    // Filter articles
    let results = articles.filter(article => {
        const matchesQuery = article.title.toLowerCase().includes(searchQuery) ||
                           article.excerpt.toLowerCase().includes(searchQuery) ||
                           article.tags.some(tag => tag.toLowerCase().includes(searchQuery));
        
        const matchesCategory = !categoryFilter || article.category === categoryFilter;
        
        return matchesQuery && matchesCategory;
    });
    
    // Sort results
    switch (sortFilter) {
        case 'date':
            results.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'title':
            results.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'relevance':
        default:
            // Sort by relevance (title matches first, then excerpt, then tags)
            results.sort((a, b) => {
                const aTitle = a.title.toLowerCase().includes(searchQuery) ? 3 : 0;
                const aExcerpt = a.excerpt.toLowerCase().includes(searchQuery) ? 2 : 0;
                const aTags = a.tags.some(tag => tag.toLowerCase().includes(searchQuery)) ? 1 : 0;
                const aScore = aTitle + aExcerpt + aTags;
                
                const bTitle = b.title.toLowerCase().includes(searchQuery) ? 3 : 0;
                const bExcerpt = b.excerpt.toLowerCase().includes(searchQuery) ? 2 : 0;
                const bTags = b.tags.some(tag => tag.toLowerCase().includes(searchQuery)) ? 1 : 0;
                const bScore = bTitle + bExcerpt + bTags;
                
                return bScore - aScore;
            });
            break;
    }
    
    // Display results
    displayResults(results, searchQuery);
}

function displayResults(results, query) {
    const resultsContainer = document.getElementById('search-results');
    const noResults = document.getElementById('no-results');
    const resultsCount = document.getElementById('results-count');
    
    // Update results count
    resultsCount.textContent = `${results.length} result${results.length !== 1 ? 's' : ''} found`;
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    // Generate HTML for results
    const resultsHTML = results.map(article => {
        const categoryNames = {
            fashion: 'Fashion & Accessories',
            health: 'Health & Beauty',
            home: 'Home & Garden',
            travel: 'Travel & Accommodation',
            finance: 'Finance & Insurance',
            food: 'Food & Beverage'
        };
        
        return `
            <article class="search-result-card">
                <div class="result-image">
                    <img src="${article.image}" alt="${article.title}">
                </div>
                <div class="result-content">
                    <div class="result-meta">
                        <span class="result-category">${categoryNames[article.category]}</span>
                        <span class="result-date">${article.date}</span>
                    </div>
                    <h3 class="result-title">
                        <a href="${article.link}">${highlightSearchTerms(article.title, query)}</a>
                    </h3>
                    <p class="result-excerpt">${highlightSearchTerms(article.excerpt, query)}</p>
                    <div class="result-tags">
                        ${article.tags.map(tag => 
                            `<span class="result-tag">${tag}</span>`
                        ).join('')}
                    </div>
                    <a href="${article.link}" class="result-link">Read More <i class="fas fa-arrow-right"></i></a>
                </div>
            </article>
        `;
    }).join('');
    
    resultsContainer.innerHTML = resultsHTML;
}

function highlightSearchTerms(text, query) {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

function showNoResults() {
    const resultsContainer = document.getElementById('search-results');
    const noResults = document.getElementById('no-results');
    const resultsCount = document.getElementById('results-count');
    
    resultsContainer.innerHTML = '';
    noResults.style.display = 'block';
    resultsCount.textContent = '0 results found';
}

function searchSuggestion(suggestion) {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = suggestion;
        performSearch(suggestion);
    }
}

// Add search suggestions functionality
function addSearchSuggestions() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    const suggestions = [
        'sustainable fashion',
        'skincare routine',
        'minimalist home',
        'european travel',
        'coffee culture',
        'investment tips',
        'eco-friendly',
        'wellness',
        'interior design',
        'healthy living'
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
                         onclick="searchSuggestion('${s}')">${s}</div>`
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

// Initialize search suggestions
addSearchSuggestions();

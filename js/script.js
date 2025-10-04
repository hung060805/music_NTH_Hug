class MusicApp {
    constructor() {
        this.currentSection = 'home';
        this.searchResults = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadFeaturedSongs();
        this.loadGenres();
        this.updateAuthUI();
        this.showHome();
    }

    bindEvents() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.updateActiveNav(item);
            });
        });

        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch();
                }
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.handleSearch();
            });
        }

        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                this.handleContactForm(e);
            });
        }

        window.addEventListener('resize', () => {
            this.handleResize();
        });

        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    updateActiveNav(activeItem) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => item.classList.remove('active'));
        
        activeItem.classList.add('active');
    }

    showSection(sectionId) {
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => section.classList.remove('active'));
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId.replace('Section', '').toLowerCase();
        }
    }

    showHome() {
        this.showSection('homeSection');
        this.loadFeaturedSongs();
    }

    showGenres() {
        this.showSection('genresSection');
        this.loadGenres();
    }

    showPlayer() {
        this.showSection('playerSection');
    }

    showContact() {
        this.showSection('contactSection');
    }

    loadFeaturedSongs() {
        const container = document.getElementById('featuredSongs');
        if (!container || typeof musicData === 'undefined') return;

        container.innerHTML = '';

        const featuredSongs = musicData.slice(0, 8);
        
        featuredSongs.forEach(song => {
            const songCard = this.createSongCard(song);
            container.appendChild(songCard);
        });
    }

    createSongCard(song, showPlayButton = true) {
        const card = document.createElement('div');
        card.className = 'song-card';
        
        card.innerHTML = `
            <img src="${song.image || 'images/placeholder.jpg'}" alt="${song.title}" loading="lazy">
            <h3>${song.title}</h3>
            <p class="artist">${song.artist}</p>
            <div class="song-card-footer">
                <span class="genre">${song.genre}</span>
                ${showPlayButton ? `
                    <div class="song-actions">
                        <button class="btn-play-song" onclick="musicApp.playSong(${song.id})" title="Phát nhạc">
                            <i class="fas fa-play"></i>
                        </button>
                        <button class="btn-add-favorite" onclick="musicApp.toggleFavorite(${song.id})" title="Yêu thích">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                ` : ''}
            </div>
        `;

        if (showPlayButton && typeof authManager !== 'undefined' && authManager.isLoggedIn()) {
            const favoriteBtn = card.querySelector('.btn-add-favorite i');
            if (favoriteBtn && authManager.isFavorite(song.id)) {
                favoriteBtn.className = 'fas fa-heart';
                favoriteBtn.style.color = '#e74c3c';
            }
        }

        return card;
    }

    loadGenres() {
        const container = document.getElementById('genresGrid');
        if (!container || typeof genres === 'undefined') return;

        container.innerHTML = '';

        const genreIcons = {
            'Lofi': 'fas fa-star',
            'Noel': 'fas fa-flag',
            'US_UK': 'fas fa-heart',
            'Rap': 'fas fa-guitar',
            'Sơn Tùng MTP': 'fas fa-bolt',
            'Mono': 'fas fa-music'
        };

        genres.forEach(genre => {
            const genreCard = document.createElement('div');
            genreCard.className = 'genre-card';
            genreCard.onclick = () => this.showGenreSongs(genre);
            
            genreCard.innerHTML = `
                <i class="${genreIcons[genre] || 'fas fa-music'}"></i>
                <h3>${genre}</h3>
                <p>${this.getSongCountByGenre(genre)} bài hát</p>
            `;

            container.appendChild(genreCard);
        });
    }

    getSongCountByGenre(genre) {
        if (typeof musicData === 'undefined') return 0;
        return musicData.filter(song => song.genre === genre).length;
    }

    showGenreSongs(genre) {
        const container = document.getElementById('genreSongs');
        if (!container) return;

        container.innerHTML = `
            <h3>Thể loại: ${genre}</h3>
            <div class="genre-songs-grid"></div>
        `;

        const songsGrid = container.querySelector('.genre-songs-grid');
        const songs = this.getSongsByGenre(genre);

        songs.forEach(song => {
            const songCard = this.createSongCard(song);
            songsGrid.appendChild(songCard);
        });

        container.classList.add('active');

        container.scrollIntoView({ behavior: 'smooth' });
    }

    getSongsByGenre(genre) {
        if (typeof musicData === 'undefined') return [];
        return musicData.filter(song => song.genre === genre);
    }

    handleSearch() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;

        const query = searchInput.value.trim();
        if (!query) return;

        this.performSearch(query);
    }

    performSearch(query) {
        if (typeof searchSongs === 'undefined') return;

        this.searchResults = searchSongs(query);
        this.displaySearchResults(query);
    }

    displaySearchResults(query) {
        let searchSection = document.getElementById('searchSection');
        if (!searchSection) {
            searchSection = document.createElement('section');
            searchSection.id = 'searchSection';
            searchSection.className = 'section';
            document.querySelector('.main-content').appendChild(searchSection);
        }

        searchSection.innerHTML = `
            <div class="container">
                <div class="search-results-header">
                    <h2>Kết quả tìm kiếm cho: "${query}"</h2>
                    <p>${this.searchResults.length} kết quả</p>
                </div>
                <div id="searchResultsGrid" class="song-grid">
                    ${this.searchResults.length === 0 ? 
                        '<div class="no-results"><i class="fas fa-search"></i><p>Không tìm thấy kết quả nào</p></div>' : 
                        ''
                    }
                </div>
            </div>
        `;

        if (this.searchResults.length > 0) {
            const resultsGrid = searchSection.querySelector('#searchResultsGrid');
            this.searchResults.forEach(song => {
                const songCard = this.createSongCard(song);
                resultsGrid.appendChild(songCard);
            });
        }

        this.showSection('searchSection');

        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => item.classList.remove('active'));
    }

    playSong(songId, playlist = null) {
        if (typeof musicPlayer !== 'undefined') {
            const success = musicPlayer.playSong(songId, playlist || musicData);
            if (success) {
                this.showNotification('Đang phát nhạc', 'success');
                if (this.currentSection !== 'player') {
                    this.showPlayer();
                    const navItems = document.querySelectorAll('.nav-item');
                    navItems.forEach(item => {
                        if (item.textContent.trim() === 'Nghe nhạc') {
                            item.classList.add('active');
                        } else {
                            item.classList.remove('active');
                        }
                    });
                }
            } else {
                this.showNotification('Không thể phát nhạc', 'error');
            }
        }
    }

    toggleFavorite(songId) {
        if (typeof authManager === 'undefined' || !authManager.isLoggedIn()) {
            this.showNotification('Cần đăng nhập để thêm vào yêu thích', 'warning');
            return;
        }

        const isFavorite = authManager.isFavorite(songId);
        
        if (isFavorite) {
            authManager.removeFromFavorites(songId);
            this.showNotification('Đã xóa khỏi yêu thích', 'info');
        } else {
            authManager.addToFavorites(songId);
            this.showNotification('Đã thêm vào yêu thích', 'success');
        }

        this.updateFavoriteButtons();
    }

    updateFavoriteButtons() {
        const favoriteButtons = document.querySelectorAll('.btn-add-favorite');
        favoriteButtons.forEach(btn => {
            const songCard = btn.closest('.song-card');
            const songTitle = songCard.querySelector('h3').textContent;
            const song = musicData.find(s => s.title === songTitle);
            
            if (song) {
                const icon = btn.querySelector('i');
                if (typeof authManager !== 'undefined' && authManager.isLoggedIn() && authManager.isFavorite(song.id)) {
                    icon.className = 'fas fa-heart';
                    icon.style.color = '#e74c3c';
                } else {
                    icon.className = 'far fa-heart';
                    icon.style.color = '';
                }
            }
        });
    }

    handleContactForm(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const data = {
            name: formData.get('name') || event.target.querySelector('input[type="text"]').value,
            email: formData.get('email') || event.target.querySelector('input[type="email"]').value,
            message: formData.get('message') || event.target.querySelector('textarea').value
        };

        if (!data.name || !data.email || !data.message) {
            this.showNotification('Vui lòng điền đầy đủ thông tin', 'warning');
            return;
        }

        this.showNotification('Đang gửi tin nhắn...', 'info');
        
        setTimeout(() => {
            this.showNotification('Tin nhắn đã được gửi thành công!', 'success');
            event.target.reset();
        }, 2000);
    }

    updateAuthUI() {
        const loggedOutButtons = document.getElementById('loggedOutButtons');
        const loggedInButtons = document.getElementById('loggedInButtons');
        const userName = document.getElementById('userName');

        if (typeof authManager !== 'undefined') {
            const user = authManager.getCurrentUser();
            
            if (loggedOutButtons && loggedInButtons) {
                if (user) {
                    loggedOutButtons.style.display = 'none';
                    loggedInButtons.style.display = 'block';
                    if (userName) {
                        userName.textContent = user.displayName;
                    }
                } else {
                    loggedOutButtons.style.display = 'flex';
                    loggedInButtons.style.display = 'none';
                }
            }
        }
    }

    handleResize() {
        const width = window.innerWidth;
        
        if (width <= 768) {
            this.adjustMobileLayout();
        } else {
            this.adjustDesktopLayout();
        }
    }

    adjustMobileLayout() {
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            searchContainer.style.order = '3';
        }
    }

    adjustDesktopLayout() {
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            searchContainer.style.order = '';
        }
    }

    handleKeyboardShortcuts(event) {
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
            event.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
            }
        }

        if (event.code === 'Space' && event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
            event.preventDefault();
            if (typeof musicPlayer !== 'undefined') {
                musicPlayer.togglePlay();
            }
        }

        if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
            if (event.key === 'ArrowLeft' && typeof musicPlayer !== 'undefined') {
                event.preventDefault();
                musicPlayer.previous();
            }
            if (event.key === 'ArrowRight' && typeof musicPlayer !== 'undefined') {
                event.preventDefault();
                musicPlayer.next();
            }
        }
    }

    showNotification(message, type = 'info', duration = 3000) {
        const existingNotifications = document.querySelectorAll('.app-notification');
        existingNotifications.forEach(notification => {
            notification.remove();
        });

        const notification = document.createElement('div');
        notification.className = `app-notification ${type}`;
        notification.textContent = message;
        
        // Tạo kiểu cho thông báo
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10001;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;

        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

const musicApp = new MusicApp();

function showHome() {
    musicApp.showHome();
}

function showGenres() {
    musicApp.showGenres();
}

function showPlayer() {
    musicApp.showPlayer();
}

function showContact() {
    musicApp.showContact();
}

document.addEventListener('DOMContentLoaded', function() {
    // hoạt ảnh tải
    document.body.classList.add('loaded');
    
    // chú giải công cụ cho các nút
    const buttons = document.querySelectorAll('[title]');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', showTooltip);
        button.addEventListener('mouseleave', hideTooltip);
    });

    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
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

    // Cập nhật giao diện người dùng xác thực
    musicApp.updateAuthUI();

    // Thêm kiểu tùy chỉnh cho thẻ bài hát
    addCustomStyles();
});

function showTooltip(event) {
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = event.target.getAttribute('title');
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        pointer-events: none;
        z-index: 10000;
        white-space: nowrap;
    `;

    document.body.appendChild(tooltip);

    const rect = event.target.getBoundingClientRect();
    tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';

    event.target.tooltip = tooltip;
}

function hideTooltip(event) {
    if (event.target.tooltip) {
        event.target.tooltip.remove();
        event.target.tooltip = null;
    }
}

function addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .song-card {
            position: relative;
            overflow: hidden;
        }

        .song-card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 1rem;
        }

        .song-actions {
            display: flex;
            gap: 0.5rem;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .song-card:hover .song-actions {
            opacity: 1;
        }

        .btn-play-song,
        .btn-add-favorite {
            width: 32px;
            height: 32px;
            border: none;
            border-radius: 50%;
            background: #667eea;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.9rem;
        }

        .btn-play-song:hover,
        .btn-add-favorite:hover {
            background: #5a6fd8;
            transform: scale(1.1);
        }

        .btn-add-favorite.favorited {
            background: #e74c3c;
        }

        .no-results {
            text-align: center;
            padding: 4rem 2rem;
            color: #999;
        }

        .no-results i {
            font-size: 4rem;
            margin-bottom: 1rem;
            opacity: 0.5;
        }

        .search-results-header {
            margin-bottom: 2rem;
        }

        .search-results-header h2 {
            margin-bottom: 0.5rem;
            color: #333;
        }

        .search-results-header p {
            color: #666;
        }

        .genre-songs-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1.5rem;
            margin-top: 1rem;
        }

        .loaded {
            opacity: 1;
        }

        @media (max-width: 768px) {
            .song-actions {
                opacity: 1;
            }
            
            .btn-play-song,
            .btn-add-favorite {
                width: 28px;
                height: 28px;
                font-size: 0.8rem;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Xuất để sử dụng trong các tập tin khác
window.musicApp = musicApp;

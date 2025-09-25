class MusicPlayer {
    constructor() {
        this.currentSong = null;
        this.currentPlaylist = [];
        this.currentIndex = -1;
        this.isPlaying = false;
        this.isShuffled = false;
        this.repeatMode = 'none';
        this.volume = 0.5;
        this.audioElement = null;
        
        this.init();
    }

    init() {
        this.audioElement = document.getElementById('audioPlayer');
        if (!this.audioElement) {
            this.audioElement = document.createElement('audio');
            this.audioElement.id = 'audioPlayer';
            this.audioElement.preload = 'metadata';
            document.body.appendChild(this.audioElement);
        }

        this.bindAudioEvents();
        this.bindControlEvents();
        this.loadDefaultPlaylist();
        
        // Set initial volume
        this.audioElement.volume = this.volume;

        this.updatePlaylistUI();
    }

    bindAudioEvents() {
        this.audioElement.addEventListener('loadedmetadata', () => {
            this.updateDuration();
        });

        this.audioElement.addEventListener('timeupdate', () => {
            this.updateProgress();
        });

        this.audioElement.addEventListener('ended', () => {
            this.handleSongEnd();
        });

        this.audioElement.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            this.showNotification('Lỗi phát nhạc. Chuyển sang bài tiếp theo.', 'error');
            this.next();
        });
    }

    bindControlEvents() {
        // Main player controls
        const playBtn = document.getElementById('playBtn');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const shuffleBtn = document.getElementById('shuffleBtn');
        const repeatBtn = document.getElementById('repeatBtn');
        const favoriteBtn = document.getElementById('favoriteBtn');
        const shareBtn = document.getElementById('shareBtn');
        const volumeSlider = document.getElementById('volumeSlider');
        const progressBar = document.querySelector('.progress-bar');

        // Bottom bar controls
        const bottomPlayBtn = document.getElementById('bottomPlayBtn');
        const bottomPrevBtn = document.getElementById('bottomPrevBtn');
        const bottomNextBtn = document.getElementById('bottomNextBtn');
        const bottomProgressBar = document.querySelector('.bottom-progress-bar');

        if (playBtn) playBtn.addEventListener('click', () => this.togglePlay());
        if (prevBtn) prevBtn.addEventListener('click', () => this.previous());
        if (nextBtn) nextBtn.addEventListener('click', () => this.next());
        if (shuffleBtn) shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        if (repeatBtn) repeatBtn.addEventListener('click', () => this.toggleRepeat());
        if (favoriteBtn) favoriteBtn.addEventListener('click', () => this.toggleFavorite());
        if (shareBtn) shareBtn.addEventListener('click', () => this.shareSong());
        if (volumeSlider) volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value / 100));
        
        if (bottomPlayBtn) bottomPlayBtn.addEventListener('click', () => this.togglePlay());
        if (bottomPrevBtn) bottomPrevBtn.addEventListener('click', () => this.previous());
        if (bottomNextBtn) bottomNextBtn.addEventListener('click', () => this.next());

        if (progressBar) {
            progressBar.addEventListener('click', (e) => this.seekTo(e));
        }
        if (bottomProgressBar) {
            bottomProgressBar.addEventListener('click', (e) => this.seekTo(e));
        }
    }

    loadDefaultPlaylist() {
        if (typeof musicData !== 'undefined') {
            this.currentPlaylist = [...musicData];
        }
    }

    playSong(songId, playlist = null) {
        const song = this.getSongById(songId);
        if (!song) {
            console.error('Song not found:', songId);
            return false;
        }

        // Update playlist if provided
        if (playlist) {
            this.currentPlaylist = playlist;
        }

        // Find song index in current playlist
        this.currentIndex = this.currentPlaylist.findIndex(s => s.id === songId);
        if (this.currentIndex === -1) {
            this.currentPlaylist.push(song);
            this.currentIndex = this.currentPlaylist.length - 1;
        }

        this.currentSong = song;
        this.loadSong();
        this.play();
        
        if (typeof authManager !== 'undefined' && authManager.isLoggedIn()) {
            authManager.addToHistory(songId);
        }

        return true;
    }

    loadSong() {
        if (!this.currentSong) return;

        this.audioElement.src = this.currentSong.audio || '#';
        
        this.updatePlayerUI();
        this.updateBottomBar();
        this.updatePlaylistUI();
        
        this.updateFavoriteButton();
        
        this.showBottomBar();
    }

    updatePlayerUI() {
        if (!this.currentSong) return;

        // Update main player
        const albumArt = document.getElementById('playerAlbumArt');
        const songTitle = document.getElementById('playerSongTitle');
        const artist = document.getElementById('playerArtist');
        const genre = document.getElementById('playerGenre');
        const year = document.getElementById('playerYear');

        if (albumArt) albumArt.src = this.currentSong.image || 'images/placeholder.jpg';
        if (songTitle) songTitle.textContent = this.currentSong.title;
        if (artist) artist.textContent = this.currentSong.artist;
        if (genre) genre.textContent = this.currentSong.genre;
        if (year) year.textContent = this.currentSong.year;
    }

    updateBottomBar() {
        if (!this.currentSong) return;

        const bottomAlbumArt = document.getElementById('bottomAlbumArt');
        const bottomSongTitle = document.getElementById('bottomSongTitle');
        const bottomArtist = document.getElementById('bottomArtist');

        if (bottomAlbumArt) bottomAlbumArt.src = this.currentSong.image || 'images/placeholder.jpg';
        if (bottomSongTitle) bottomSongTitle.textContent = this.currentSong.title;
        if (bottomArtist) bottomArtist.textContent = this.currentSong.artist;
    }

    updatePlaylistUI() {
        const playlistContainer = document.getElementById('playlistSongs');
        if (!playlistContainer) return;

        playlistContainer.innerHTML = '';

        this.currentPlaylist.forEach((song, index) => {
            const item = document.createElement('div');
            item.className = `playlist-item ${index === this.currentIndex ? 'active' : ''}`;
            item.onclick = () => this.playByIndex(index);

            item.innerHTML = `
                <img src="${song.image || 'images/placeholder.jpg'}" alt="${song.title}">
                <div class="playlist-item-info">
                    <h4>${song.title}</h4>
                    <p>${song.artist}</p>
                </div>
                <span class="playlist-item-duration">${song.duration || '0:00'}</span>
            `;

            playlistContainer.appendChild(item);
        });
    }

    playByIndex(index) {
        if (index < 0 || index >= this.currentPlaylist.length) return;

        this.currentIndex = index;
        this.currentSong = this.currentPlaylist[index];
        this.loadSong();
        this.play();
    }

    play() {
        if (this.audioElement && this.currentSong) {
            this.audioElement.play().then(() => {
                this.isPlaying = true;
                this.updatePlayButtons();
            }).catch(error => {
                console.error('Play failed:', error);
                this.showNotification('Không thể phát nhạc', 'error');
            });
        }
    }

    pause() {
        if (this.audioElement) {
            this.audioElement.pause();
            this.isPlaying = false;
            this.updatePlayButtons();
        }
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            if (this.currentSong) {
                this.play();
            } else if (this.currentPlaylist.length > 0) {
                this.playByIndex(0);
            }
        }
    }

    previous() {
        if (this.currentPlaylist.length === 0) return;

        let prevIndex;
        if (this.isShuffled) {
            prevIndex = Math.floor(Math.random() * this.currentPlaylist.length);
        } else {
            prevIndex = this.currentIndex - 1;
            if (prevIndex < 0) {
                prevIndex = this.currentPlaylist.length - 1;
            }
        }

        this.playByIndex(prevIndex);
    }

    next() {
        if (this.currentPlaylist.length === 0) return;

        let nextIndex;
        if (this.isShuffled) {
            nextIndex = Math.floor(Math.random() * this.currentPlaylist.length);
        } else {
            nextIndex = this.currentIndex + 1;
            if (nextIndex >= this.currentPlaylist.length) {
                nextIndex = 0;
            }
        }

        this.playByIndex(nextIndex);
    }

    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        
        const shuffleBtn = document.getElementById('shuffleBtn');
        if (shuffleBtn) {
            if (this.isShuffled) {
                shuffleBtn.classList.add('active');
            } else {
                shuffleBtn.classList.remove('active');
            }
        }

        this.showNotification(
            this.isShuffled ? 'Bật phát ngẫu nhiên' : 'Tắt phát ngẫu nhiên',
            'info'
        );
    }

    toggleRepeat() {
        const modes = ['none', 'all', 'one'];
        const currentModeIndex = modes.indexOf(this.repeatMode);
        this.repeatMode = modes[(currentModeIndex + 1) % modes.length];

        const repeatBtn = document.getElementById('repeatBtn');
        if (repeatBtn) {
            repeatBtn.classList.remove('active');
            const icon = repeatBtn.querySelector('i');
            
            switch(this.repeatMode) {
                case 'one':
                    repeatBtn.classList.add('active');
                    icon.className = 'fas fa-redo-alt';
                    break;
                case 'all':
                    repeatBtn.classList.add('active');
                    icon.className = 'fas fa-redo';
                    break;
                default:
                    icon.className = 'fas fa-redo';
            }
        }

        const messages = {
            'none': 'Tắt lặp lại',
            'all': 'Lặp lại tất cả',
            'one': 'Lặp lại một bài'
        };

        this.showNotification(messages[this.repeatMode], 'info');
    }

    toggleFavorite() {
        if (!this.currentSong) return;

        if (typeof authManager === 'undefined' || !authManager.isLoggedIn()) {
            this.showNotification('Cần đăng nhập để thêm vào yêu thích', 'warning');
            return;
        }

        const isFavorite = authManager.isFavorite(this.currentSong.id);
        
        if (isFavorite) {
            authManager.removeFromFavorites(this.currentSong.id);
            this.showNotification('Đã xóa khỏi yêu thích', 'info');
        } else {
            authManager.addToFavorites(this.currentSong.id);
            this.showNotification('Đã thêm vào yêu thích', 'success');
        }

        this.updateFavoriteButton();
    }

    updateFavoriteButton() {
        const favoriteBtn = document.getElementById('favoriteBtn');
        if (!favoriteBtn || !this.currentSong) return;

        const icon = favoriteBtn.querySelector('i');
        if (typeof authManager !== 'undefined' && authManager.isLoggedIn() && authManager.isFavorite(this.currentSong.id)) {
            icon.className = 'fas fa-heart';
            favoriteBtn.style.color = '#e74c3c';
        } else {
            icon.className = 'far fa-heart';
            favoriteBtn.style.color = '';
        }
    }

    shareSong() {
        if (!this.currentSong) return;

        if (navigator.share) {
            navigator.share({
                title: this.currentSong.title,
                text: `Nghe "${this.currentSong.title}" của ${this.currentSong.artist} trên MusicVibe`,
                url: window.location.href
            });
        } else {
            const shareText = `Nghe "${this.currentSong.title}" của ${this.currentSong.artist} trên MusicVibe: ${window.location.href}`;
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(shareText).then(() => {
                    this.showNotification('Đã sao chép link chia sẻ', 'success');
                });
            } else {
                // Further fallback
                const textArea = document.createElement('textarea');
                textArea.value = shareText;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    this.showNotification('Đã sao chép link chia sẻ', 'success');
                } catch (err) {
                    this.showNotification('Không thể chia sẻ', 'error');
                }
                document.body.removeChild(textArea);
            }
        }
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.audioElement) {
            this.audioElement.volume = this.volume;
        }

        // Update volume icon
        const volumeIcon = document.querySelector('.volume-control i');
        if (volumeIcon) {
            if (this.volume === 0) {
                volumeIcon.className = 'fas fa-volume-mute';
            } else if (this.volume < 0.5) {
                volumeIcon.className = 'fas fa-volume-down';
            } else {
                volumeIcon.className = 'fas fa-volume-up';
            }
        }
    }

    seekTo(event) {
        if (!this.audioElement || this.audioElement.duration === 0) return;

        const rect = event.currentTarget.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const percentage = clickX / rect.width;
        const newTime = percentage * this.audioElement.duration;

        this.audioElement.currentTime = newTime;
    }

    updateProgress() {
        if (!this.audioElement) return;

        const currentTime = this.audioElement.currentTime;
        const duration = this.audioElement.duration;

        if (duration > 0) {
            const percentage = (currentTime / duration) * 100;
            
            // Update progress bars
            const progress = document.getElementById('progress');
            const bottomProgress = document.getElementById('bottomProgress');
            
            if (progress) progress.style.width = percentage + '%';
            if (bottomProgress) bottomProgress.style.width = percentage + '%';

            // Update time displays
            const currentTimeEl = document.getElementById('currentTime');
            if (currentTimeEl) {
                currentTimeEl.textContent = this.formatTime(currentTime);
            }
        }
    }

    updateDuration() {
        if (!this.audioElement) return;

        const duration = this.audioElement.duration;
        const totalTimeEl = document.getElementById('totalTime');
        
        if (totalTimeEl && duration) {
            totalTimeEl.textContent = this.formatTime(duration);
        }
    }

    formatTime(seconds) {
        if (isNaN(seconds) || seconds === 0) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    updatePlayButtons() {
        const playBtns = [
            document.getElementById('playBtn'),
            document.getElementById('bottomPlayBtn')
        ];

        playBtns.forEach(btn => {
            if (btn) {
                const icon = btn.querySelector('i');
                if (this.isPlaying) {
                    icon.className = 'fas fa-pause';
                } else {
                    icon.className = 'fas fa-play';
                }
            }
        });
    }

    handleSongEnd() {
        switch(this.repeatMode) {
            case 'one':
                this.audioElement.currentTime = 0;
                this.play();
                break;
            case 'all':
                this.next();
                break;
            default:
                if (this.currentIndex < this.currentPlaylist.length - 1) {
                    this.next();
                } else {
                    this.isPlaying = false;
                    this.updatePlayButtons();
                }
        }
    }

    showBottomBar() {
        const bottomBar = document.getElementById('bottomMusicBar');
        if (bottomBar && this.currentSong) {
            bottomBar.style.display = 'block';
            document.body.style.paddingBottom = '80px';
        }
    }

    hideBottomBar() {
        const bottomBar = document.getElementById('bottomMusicBar');
        if (bottomBar) {
            bottomBar.style.display = 'none';
            document.body.style.paddingBottom = '0';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
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
        }, 3000);
    }

    getSongById(id) {
        if (typeof musicData !== 'undefined') {
            return musicData.find(song => song.id === parseInt(id));
        }
        return null;
    }

    getCurrentSong() {
        return this.currentSong;
    }

    getPlaylist() {
        return this.currentPlaylist;
    }

    setPlaylist(playlist) {
        this.currentPlaylist = playlist;
        this.updatePlaylistUI();
    }

    isCurrentlyPlaying() {
        return this.isPlaying;
    }
}

const musicPlayer = new MusicPlayer();

window.musicPlayer = musicPlayer;
class ProfileManager {
    constructor() {
        this.currentTab = 'info';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadUserProfile();
    }

    bindEvents() {
        const navItems = document.querySelectorAll('.profile-nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const tabName = item.textContent.trim();
                const tabMap = {
                    'Thông tin cá nhân': 'info',
                    'Bài hát yêu thích': 'favorites',
                    'Playlist của tôi': 'playlists',
                    'Lịch sử nghe': 'history',
                    'Cài đặt': 'settings'
                };
                this.showProfileTab(tabMap[tabName] || 'info');
            });
        });

        // Form events
        const updateProfileForm = document.getElementById('updateProfileForm');
        if (updateProfileForm) {
            updateProfileForm.addEventListener('submit', (e) => this.updateProfile(e));
        }

        const changePasswordForm = document.getElementById('changePasswordForm');
        if (changePasswordForm) {
            changePasswordForm.addEventListener('submit', (e) => this.changePassword(e));
        }

        const createPlaylistForm = document.getElementById('createPlaylistForm');
        if (createPlaylistForm) {
            createPlaylistForm.addEventListener('submit', (e) => this.handleCreatePlaylist(e));
        }

        this.bindSettingsEvents();
    }

    bindSettingsEvents() {
        const settingsInputs = document.querySelectorAll('#profileSettingsTab input, #profileSettingsTab select');
        settingsInputs.forEach(input => {
            input.addEventListener('change', () => this.saveSettings());
        });
    }

    loadUserProfile() {
        if (typeof authManager === 'undefined' || !authManager.isLoggedIn()) {
            window.location.href = 'login.html';
            return;
        }

        const user = authManager.getCurrentUser();
        this.populateProfileInfo(user);
        this.loadFavorites();
        this.loadPlaylists();
        this.loadHistory();
        this.loadSettings();
    }

    populateProfileInfo(user) {
        const profileAvatar = document.getElementById('profileAvatar');
        const profileDisplayName = document.getElementById('profileDisplayName');
        const profileEmail = document.getElementById('profileEmail');
        const joinDate = document.getElementById('joinDate');

        if (profileAvatar) profileAvatar.src = user.avatar || 'images/default-avatar.jpg';
        if (profileDisplayName) profileDisplayName.textContent = user.displayName;
        if (profileEmail) profileEmail.textContent = user.email;
        if (joinDate) {
            const date = new Date(user.joinDate);
            joinDate.textContent = date.getFullYear();
        }

        const updateDisplayName = document.getElementById('updateDisplayName');
        const updateEmail = document.getElementById('updateEmail');

        if (updateDisplayName) updateDisplayName.value = user.displayName;
        if (updateEmail) updateEmail.value = user.email;

        const preferenceCheckboxes = document.querySelectorAll('input[name="preferences"]');
        preferenceCheckboxes.forEach(checkbox => {
            checkbox.checked = (user.preferences || []).includes(checkbox.value);
        });
    }

    showProfileTab(tabName) {
        const tabs = document.querySelectorAll('.profile-tab');
        tabs.forEach(tab => tab.classList.remove('active'));

        const targetTab = document.getElementById(`profile${tabName.charAt(0).toUpperCase() + tabName.slice(1)}Tab`);
        if (targetTab) {
            targetTab.classList.add('active');
            this.currentTab = tabName;
        }

        const navItems = document.querySelectorAll('.profile-nav-item');
        navItems.forEach(item => item.classList.remove('active'));

        navItems.forEach(item => {
            const itemText = item.textContent.trim();
            const tabMap = {
                'info': 'Thông tin cá nhân',
                'favorites': 'Bài hát yêu thích',
                'playlists': 'Playlist của tôi',
                'history': 'Lịch sử nghe',
                'settings': 'Cài đặt'
            };
            
            if (itemText === tabMap[tabName]) {
                item.classList.add('active');
            }
        });

        switch(tabName) {
            case 'favorites':
                this.loadFavorites();
                break;
            case 'playlists':
                this.loadPlaylists();
                break;
            case 'history':
                this.loadHistory();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }

    updateProfile(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const displayName = formData.get('displayName');
        const email = formData.get('email');

        const preferences = [];
        const preferenceCheckboxes = document.querySelectorAll('input[name="preferences"]:checked');
        preferenceCheckboxes.forEach(checkbox => {
            preferences.push(checkbox.value);
        });

        try {
            authManager.updateProfile({
                displayName,
                email,
                preferences
            });

            this.showNotification('Cập nhật thông tin thành công!', 'success');
            this.loadUserProfile(); 
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    changePassword(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const currentPassword = formData.get('currentPassword');
        const newPassword = formData.get('newPassword');
        const confirmNewPassword = formData.get('confirmNewPassword');

        if (newPassword !== confirmNewPassword) {
            this.showNotification('Mật khẩu mới không khớp', 'error');
            return;
        }

        if (newPassword.length < 6) {
            this.showNotification('Mật khẩu mới phải có ít nhất 6 ký tự', 'error');
            return;
        }

        try {
            authManager.changePassword(currentPassword, newPassword);
            this.showNotification('Đổi mật khẩu thành công!', 'success');
            event.target.reset();
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    loadFavorites() {
        const container = document.getElementById('favoritesList');
        if (!container) return;

        const user = authManager.getCurrentUser();
        if (!user || !user.favorites || user.favorites.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-heart"></i>
                    <p>Chưa có bài hát yêu thích nào</p>
                    <button class="btn-primary" onclick="showHome()">Khám phá nhạc</button>
                </div>
            `;
            return;
        }

        container.innerHTML = '';

        user.favorites.forEach(songId => {
            const song = this.getSongById(songId);
            if (song) {
                const songItem = this.createSongListItem(song, true);
                container.appendChild(songItem);
            }
        });
    }

    loadPlaylists() {
        const container = document.getElementById('userPlaylistsList');
        if (!container) return;

        const playlists = authManager.getPlaylists();
        
        if (playlists.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-list"></i>
                    <p>Chưa có playlist nào</p>
                    <button class="btn-primary" onclick="profileManager.createNewPlaylist()">Tạo playlist đầu tiên</button>
                </div>
            `;
            return;
        }

        container.innerHTML = '';

        playlists.forEach(playlist => {
            const playlistCard = this.createPlaylistCard(playlist);
            container.appendChild(playlistCard);
        });
    }

    loadHistory() {
        const container = document.getElementById('listeningHistory');
        if (!container) return;

        const history = authManager.getHistory();
        
        if (history.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-history"></i>
                    <p>Chưa có lịch sử nghe nhạc</p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';

        history.forEach(historyItem => {
            const song = this.getSongById(historyItem.songId);
            if (song) {
                const songItem = this.createHistoryItem(song, historyItem.playedAt);
                container.appendChild(songItem);
            }
        });
    }

    loadSettings() {
        const user = authManager.getCurrentUser();
        if (!user || !user.settings) return;

        const settings = user.settings;

        const emailNotifications = document.getElementById('emailNotifications');
        const newMusicNotifications = document.getElementById('newMusicNotifications');
        const audioQuality = document.getElementById('audioQuality');
        const publicProfile = document.getElementById('publicProfile');
        const showListeningHistory = document.getElementById('showListeningHistory');

        if (emailNotifications) emailNotifications.checked = settings.emailNotifications;
        if (newMusicNotifications) newMusicNotifications.checked = settings.newMusicNotifications;
        if (audioQuality) audioQuality.value = settings.audioQuality;
        if (publicProfile) publicProfile.checked = settings.publicProfile;
        if (showListeningHistory) showListeningHistory.checked = settings.showListeningHistory;
    }

    saveSettings() {
        const settings = {
            emailNotifications: document.getElementById('emailNotifications')?.checked || false,
            newMusicNotifications: document.getElementById('newMusicNotifications')?.checked || false,
            audioQuality: document.getElementById('audioQuality')?.value || 'normal',
            publicProfile: document.getElementById('publicProfile')?.checked || false,
            showListeningHistory: document.getElementById('showListeningHistory')?.checked || false
        };

        try {
            authManager.updateProfile({ settings });
            this.showNotification('Cài đặt đã được lưu', 'success');
        } catch (error) {
            this.showNotification('Lỗi khi lưu cài đặt', 'error');
        }
    }

    createSongListItem(song, showRemoveButton = false) {
        const item = document.createElement('div');
        item.className = 'song-list-item';
        
        item.innerHTML = `
            <img src="${song.image || 'images/placeholder.jpg'}" alt="${song.title}">
            <div class="song-list-item-info">
                <h4>${song.title}</h4>
                <p>${song.artist} • ${song.genre}</p>
            </div>
            <div class="song-list-item-actions">
                <button title="Phát nhạc" onclick="profileManager.playSong(${song.id})">
                    <i class="fas fa-play"></i>
                </button>
                ${showRemoveButton ? `
                    <button title="Xóa khỏi yêu thích" onclick="profileManager.removeFromFavorites(${song.id})">
                        <i class="fas fa-times"></i>
                    </button>
                ` : ''}
            </div>
        `;

        return item;
    }

    createHistoryItem(song, playedAt) {
        const item = document.createElement('div');
        item.className = 'song-list-item';
        
        const playedDate = new Date(playedAt);
        const timeAgo = this.getTimeAgo(playedDate);
        
        item.innerHTML = `
            <img src="${song.image || 'images/placeholder.jpg'}" alt="${song.title}">
            <div class="song-list-item-info">
                <h4>${song.title}</h4>
                <p>${song.artist} • Nghe ${timeAgo}</p>
            </div>
            <div class="song-list-item-actions">
                <button title="Phát lại" onclick="profileManager.playSong(${song.id})">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        `;

        return item;
    }

    createPlaylistCard(playlist) {
        const card = document.createElement('div');
        card.className = 'playlist-card';
        
        card.innerHTML = `
            <h4>${playlist.name}</h4>
            <p>${playlist.description || 'Không có mô tả'}</p>
            <div class="playlist-stats">
                <span>${playlist.songs.length} bài hát</span>
                <span>${playlist.isPublic ? 'Công khai' : 'Riêng tư'}</span>
            </div>
            <div class="playlist-actions">
                <button class="btn-secondary" onclick="profileManager.playPlaylist(${playlist.id})" title="Phát playlist">
                    <i class="fas fa-play"></i> Phát
                </button>
                <button class="btn-secondary" onclick="profileManager.editPlaylist(${playlist.id})" title="Chỉnh sửa">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-danger" onclick="profileManager.deletePlaylistConfirm(${playlist.id})" title="Xóa">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        return card;
    }

    playSong(songId) {
        if (typeof musicPlayer !== 'undefined') {
            musicPlayer.playSong(songId);
            this.showNotification('Đang phát nhạc', 'success');
        }
    }

    removeFromFavorites(songId) {
        if (confirm('Bạn có chắc muốn xóa bài hát này khỏi danh sách yêu thích?')) {
            authManager.removeFromFavorites(songId);
            this.loadFavorites();
            this.showNotification('Đã xóa khỏi yêu thích', 'info');
        }
    }

    clearHistory() {
        if (confirm('Bạn có chắc muốn xóa toàn bộ lịch sử nghe nhạc?')) {
            authManager.clearHistory();
            this.loadHistory();
            this.showNotification('Đã xóa lịch sử nghe nhạc', 'info');
        }
    }

    createNewPlaylist() {
        this.showCreatePlaylistModal();
    }

    showCreatePlaylistModal() {
        const modal = document.getElementById('createPlaylistModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    closeCreatePlaylist() {
        const modal = document.getElementById('createPlaylistModal');
        if (modal) {
            modal.style.display = 'none';
            document.getElementById('createPlaylistForm').reset();
        }
    }

    handleCreatePlaylist(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const name = formData.get('name');
        const description = formData.get('description');
        const isPublic = formData.get('public') === 'on';

        if (!name.trim()) {
            this.showNotification('Vui lòng nhập tên playlist', 'warning');
            return;
        }

        try {
            authManager.createPlaylist(name, description, isPublic);
            this.showNotification('Tạo playlist thành công!', 'success');
            this.closeCreatePlaylist();
            this.loadPlaylists();
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    playPlaylist(playlistId) {
        const playlists = authManager.getPlaylists();
        const playlist = playlists.find(p => p.id === playlistId);
        
        if (playlist && playlist.songs.length > 0) {
            const songs = playlist.songs.map(songId => this.getSongById(songId)).filter(song => song);
            if (typeof musicPlayer !== 'undefined' && songs.length > 0) {
                musicPlayer.playSong(songs[0].id, songs);
                this.showNotification(`Đang phát playlist "${playlist.name}"`, 'success');
            }
        } else {
            this.showNotification('Playlist trống', 'warning');
        }
    }

    editPlaylist(playlistId) {
        this.showNotification('Chức năng chỉnh sửa playlist sẽ được phát triển', 'info');
    }

    deletePlaylistConfirm(playlistId) {
        const playlists = authManager.getPlaylists();
        const playlist = playlists.find(p => p.id === playlistId);
        
        if (playlist && confirm(`Bạn có chắc muốn xóa playlist "${playlist.name}"?`)) {
            authManager.deletePlaylist(playlistId);
            this.loadPlaylists();
            this.showNotification('Đã xóa playlist', 'info');
        }
    }

    uploadAvatar() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const avatarImg = document.getElementById('profileAvatar');
                    if (avatarImg) {
                        avatarImg.src = e.target.result;
                        authManager.updateProfile({ avatar: e.target.result });
                        this.showNotification('Cập nhật ảnh đại diện thành công!', 'success');
                    }
                };
                reader.readAsDataURL(file);
            }
        });

        input.click();
    }

    deleteAccount() {
        const confirmText = prompt('Để xác nhận xóa tài khoản, vui lòng nhập "XOA TAI KHOAN":');
        
        if (confirmText === 'XOA TAI KHOAN') {
            try {
                authManager.deleteAccount();
                alert('Tài khoản đã được xóa');
                window.location.href = 'index.html';
            } catch (error) {
                this.showNotification(error.message, 'error');
            }
        } else if (confirmText !== null) {
            this.showNotification('Xác nhận không đúng', 'warning');
        }
    }

    getSongById(id) {
        if (typeof musicData !== 'undefined') {
            return musicData.find(song => song.id === parseInt(id));
        }
        return null;
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'vừa xong';
        if (diffMins < 60) return `${diffMins} phút trước`;
        if (diffHours < 24) return `${diffHours} giờ trước`;
        if (diffDays < 7) return `${diffDays} ngày trước`;
        
        return date.toLocaleDateString('vi-VN');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `profile-notification ${type}`;
        notification.textContent = message;
        
        // Tạo kiểu cho thông báo
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
}

const profileManager = new ProfileManager();

function showProfileTab(tabName) {
    profileManager.showProfileTab(tabName);
}

function updateProfile(event) {
    profileManager.updateProfile(event);
}

function changePassword(event) {
    profileManager.changePassword(event);
}

function handleCreatePlaylist(event) {
    profileManager.handleCreatePlaylist(event);
}

function createNewPlaylist() {
    profileManager.createNewPlaylist();
}

function closeCreatePlaylist() {
    profileManager.closeCreatePlaylist();
}

function uploadAvatar() {
    profileManager.uploadAvatar();
}

function clearHistory() {
    profileManager.clearHistory();
}

function deleteAccount() {
    profileManager.deleteAccount();
}

function loadUserProfile() {
    profileManager.loadUserProfile();
}

document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .empty-state {
            text-align: center;
            padding: 4rem 2rem;
            color: #999;
        }

        .empty-state i {
            font-size: 4rem;
            margin-bottom: 1rem;
            opacity: 0.5;
        }

        .empty-state p {
            margin-bottom: 2rem;
            font-size: 1.1rem;
        }

        .playlist-actions {
            display: flex;
            gap: 0.5rem;
            margin-top: 1rem;
        }

        .playlist-actions button {
            flex: 1;
            padding: 8px;
            font-size: 0.8rem;
        }
    `;
    
    document.head.appendChild(style);
});

window.profileManager = profileManager;
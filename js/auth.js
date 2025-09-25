class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadCurrentUser();
    }

    loadCurrentUser() {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
    }

    saveUser(userData) {
        this.currentUser = userData;
        localStorage.setItem('currentUser', JSON.stringify(userData));
    }

    getAllUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }

    saveAllUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    register(userData) {
        const users = this.getAllUsers();
        
        if (users.find(user => user.email === userData.email)) {
            throw new Error('Email đã được sử dụng');
        }

        const newUser = {
            id: Date.now(),
            displayName: userData.displayName,
            email: userData.email,
            password: userData.password, 
            preferences: userData.preferences || [],
            joinDate: new Date().toISOString(),
            avatar: 'images/default-avatar.jpg',
            favorites: [],
            playlists: [],
            history: [],
            settings: {
                emailNotifications: true,
                newMusicNotifications: true,
                audioQuality: 'normal',
                publicProfile: false,
                showListeningHistory: true
            }
        };

        users.push(newUser);
        this.saveAllUsers(users);
        
        return newUser;
    }

    login(email, password, rememberMe = false) {
        const users = this.getAllUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            throw new Error('Email hoặc mật khẩu không đúng');
        }

        this.saveUser(user);
        
        if (rememberMe) {
            localStorage.setItem('rememberLogin', 'true');
        }

        return user;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('rememberLogin');
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    updateProfile(updates) {
        if (!this.currentUser) {
            throw new Error('Không có người dùng đang đăng nhập');
        }

        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex === -1) {
            throw new Error('Không tìm thấy người dùng');
        }

        users[userIndex] = { ...users[userIndex], ...updates };
        this.saveAllUsers(users);
        
        this.currentUser = users[userIndex];
        this.saveUser(this.currentUser);
        
        return this.currentUser;
    }

    changePassword(currentPassword, newPassword) {
        if (!this.currentUser) {
            throw new Error('Không có người dùng đang đăng nhập');
        }

        if (this.currentUser.password !== currentPassword) {
            throw new Error('Mật khẩu hiện tại không đúng');
        }

        return this.updateProfile({ password: newPassword });
    }

    addToFavorites(songId) {
        if (!this.currentUser) return false;
        
        const favorites = this.currentUser.favorites || [];
        if (!favorites.includes(songId)) {
            favorites.push(songId);
            this.updateProfile({ favorites });
            return true;
        }
        return false;
    }

    removeFromFavorites(songId) {
        if (!this.currentUser) return false;
        
        const favorites = this.currentUser.favorites || [];
        const index = favorites.indexOf(songId);
        if (index > -1) {
            favorites.splice(index, 1);
            this.updateProfile({ favorites });
            return true;
        }
        return false;
    }

    isFavorite(songId) {
        if (!this.currentUser) return false;
        return (this.currentUser.favorites || []).includes(songId);
    }

    addToHistory(songId) {
        if (!this.currentUser) return;
        
        const history = this.currentUser.history || [];

        const existingIndex = history.findIndex(item => item.songId === songId);
        if (existingIndex > -1) {
            history.splice(existingIndex, 1);
        }

        history.unshift({
            songId,
            playedAt: new Date().toISOString()
        });

        if (history.length > 100) {
            history.splice(100);
        }

        this.updateProfile({ history });
    }

    getHistory() {
        if (!this.currentUser) return [];
        return this.currentUser.history || [];
    }

    clearHistory() {
        if (!this.currentUser) return;
        this.updateProfile({ history: [] });
    }

    createPlaylist(name, description = '', isPublic = false) {
        if (!this.currentUser) {
            throw new Error('Cần đăng nhập để tạo playlist');
        }

        const playlist = {
            id: Date.now(),
            name,
            description,
            isPublic,
            songs: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const playlists = this.currentUser.playlists || [];
        playlists.push(playlist);
        this.updateProfile({ playlists });
        
        return playlist;
    }

    getPlaylists() {
        if (!this.currentUser) return [];
        return this.currentUser.playlists || [];
    }

    addToPlaylist(playlistId, songId) {
        if (!this.currentUser) return false;
        
        const playlists = this.currentUser.playlists || [];
        const playlist = playlists.find(p => p.id === playlistId);
        
        if (playlist && !playlist.songs.includes(songId)) {
            playlist.songs.push(songId);
            playlist.updatedAt = new Date().toISOString();
            this.updateProfile({ playlists });
            return true;
        }
        return false;
    }

    removeFromPlaylist(playlistId, songId) {
        if (!this.currentUser) return false;
        
        const playlists = this.currentUser.playlists || [];
        const playlist = playlists.find(p => p.id === playlistId);
        
        if (playlist) {
            const index = playlist.songs.indexOf(songId);
            if (index > -1) {
                playlist.songs.splice(index, 1);
                playlist.updatedAt = new Date().toISOString();
                this.updateProfile({ playlists });
                return true;
            }
        }
        return false;
    }

    deletePlaylist(playlistId) {
        if (!this.currentUser) return false;
        
        const playlists = this.currentUser.playlists || [];
        const index = playlists.findIndex(p => p.id === playlistId);
        
        if (index > -1) {
            playlists.splice(index, 1);
            this.updateProfile({ playlists });
            return true;
        }
        return false;
    }

    deleteAccount() {
        if (!this.currentUser) {
            throw new Error('Không có người dùng đang đăng nhập');
        }

        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex > -1) {
            users.splice(userIndex, 1);
            this.saveAllUsers(users);
        }

        this.logout();
    }
}

const authManager = new AuthManager();

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function showSuccess(elementId, message) {
    const successElement = document.getElementById(elementId);
    if (successElement) {
        successElement.textContent = message;
        successElement.style.display = 'block';
    }
}

function hideSuccess(elementId) {
    const successElement = document.getElementById(elementId);
    if (successElement) {
        successElement.style.display = 'none';
    }
}

function handleLogin(event) {
    event.preventDefault();
    hideError('errorMessage');

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    if (!email || !password) {
        showError('errorMessage', 'Vui lòng điền đầy đủ thông tin');
        return;
    }

    try {
        authManager.login(email, password, rememberMe);

        window.location.href = 'index.html';
    } catch (error) {
        showError('errorMessage', error.message);
    }
}

function handleRegister(event) {
    event.preventDefault();
    hideError('errorMessage');
    hideSuccess('successMessage');

    const displayName = document.getElementById('displayName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    if (!displayName || !email || !password || !confirmPassword) {
        showError('errorMessage', 'Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
    }

    if (password.length < 6) {
        showError('errorMessage', 'Mật khẩu phải có ít nhất 6 ký tự');
        return;
    }

    if (password !== confirmPassword) {
        showError('errorMessage', 'Mật khẩu xác nhận không khớp');
        return;
    }

    if (!agreeTerms) {
        showError('errorMessage', 'Vui lòng đồng ý với điều khoản sử dụng');
        return;
    }

    const preferences = [];
    const preferenceCheckboxes = document.querySelectorAll('input[name="preferences"]:checked');
    preferenceCheckboxes.forEach(checkbox => {
        preferences.push(checkbox.value);
    });

    try {
        const newUser = authManager.register({
            displayName,
            email,
            password,
            preferences
        });

        showSuccess('successMessage', 'Đăng ký thành công! Chuyển hướng đến trang đăng nhập...');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);

    } catch (error) {
        showError('errorMessage', error.message);
    }
}

function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

function showForgotPassword() {
    document.getElementById('forgotPasswordModal').style.display = 'flex';
}

function closeForgotPassword() {
    document.getElementById('forgotPasswordModal').style.display = 'none';
}

function handleForgotPassword(event) {
    event.preventDefault();
    const email = document.getElementById('forgotEmail').value.trim();
    
    if (!email) {
        alert('Vui lòng nhập email');
        return;
    }

    alert('Link đặt lại mật khẩu đã được gửi đến email của bạn!');
    closeForgotPassword();
}

function showTerms() {
    document.getElementById('termsModal').style.display = 'flex';
}

function closeTerms() {
    document.getElementById('termsModal').style.display = 'none';
}

function showPrivacy() {
    document.getElementById('privacyModal').style.display = 'flex';
}

function closePrivacy() {
    document.getElementById('privacyModal').style.display = 'none';
}

function loginWithGoogle() {
    alert('Chức năng đăng nhập bằng Google sẽ được triển khai trong phiên bản tiếp theo');
}

function loginWithFacebook() {
    alert('Chức năng đăng nhập bằng Facebook sẽ được triển khai trong phiên bản tiếp theo');
}

function loginWithApple() {
    alert('Chức năng đăng nhập bằng Apple sẽ được triển khai trong phiên bản tiếp theo');
}

function registerWithGoogle() {
    alert('Chức năng đăng ký bằng Google sẽ được triển khai trong phiên bản tiếp theo');
}

function registerWithFacebook() {
    alert('Chức năng đăng ký bằng Facebook sẽ được triển khai trong phiên bản tiếp theo');
}

function registerWithApple() {
    alert('Chức năng đăng ký bằng Apple sẽ được triển khai trong phiên bản tiếp theo');
}

function logout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        authManager.logout();
        window.location.href = 'index.html';
    }
}

function isLoggedIn() {
    return authManager.isLoggedIn();
}

function getCurrentUser() {
    return authManager.getCurrentUser();
}

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'flex') {
                modal.style.display = 'none';
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const user = authManager.getCurrentUser();
    
    const loggedOutButtons = document.getElementById('loggedOutButtons');
    const loggedInButtons = document.getElementById('loggedInButtons');
    const userName = document.getElementById('userName');
    
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
});
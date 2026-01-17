// ========================================
// ADMIN PANEL GLOBAL JAVASCRIPT
// ========================================

// Authentication
function checkAuth() {
    const adminUser = localStorage.getItem('adminUser');
    if (!adminUser) {
        window.location.href = 'index.html';
        return null;
    }
    return JSON.parse(adminUser);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('adminUser');
        window.location.href = 'index.html';
    }
}

// Sidebar Toggle
function toggleSidebar() {
    const sidebar = document.querySelector('.admin-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (sidebar) {
        sidebar.classList.toggle('active');
    }

    if (overlay) {
        overlay.classList.toggle('active');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    // Only check auth if we are NOT on the login page (index.html)
    // This assumes admin.js is only included in admin pages
    const path = window.location.pathname;
    const isLoginPage = path.includes('index.html') || path.endsWith('/admin/') || path.endsWith('/admin');

    if (!isLoginPage) {
        checkAuth();
    }
});

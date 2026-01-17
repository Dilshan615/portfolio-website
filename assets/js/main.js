// ========================================
// PORTFOLIO MARKETPLACE - MAIN JAVASCRIPT
// ========================================

// === GLOBAL STATE ===
const state = {
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    user: JSON.parse(localStorage.getItem('user')) || null
};

// === NAVIGATION SCROLL EFFECT ===
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Set active nav link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// === MOBILE MENU ===
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!mobileToggle || !navLinks) return;

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navLinks.classList.toggle('active');

        // Prevent scrolling when menu is open
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// === CART MANAGEMENT ===
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function addToCart(project) {
    const existingItem = state.cart.find(item => item.id === project.id);

    if (existingItem) {
        showNotification('This project is already in your cart!', 'info');
        return;
    }

    state.cart.push({
        id: project.id,
        title: project.title,
        price: project.price,
        image: project.image,
        quantity: 1
    });

    localStorage.setItem('cart', JSON.stringify(state.cart));
    updateCartCount();
    showNotification('Added to cart successfully!', 'success');
}

function removeFromCart(projectId) {
    state.cart = state.cart.filter(item => item.id !== projectId);
    localStorage.setItem('cart', JSON.stringify(state.cart));
    updateCartCount();
    showNotification('Removed from cart', 'info');
}

function clearCart() {
    state.cart = [];
    localStorage.setItem('cart', JSON.stringify(state.cart));
    updateCartCount();
}

function getCartTotal() {
    return state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// === NOTIFICATION SYSTEM ===
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${getNotificationIcon(type)}</span>
      <span class="notification-message">${message}</span>
    </div>
  `;

    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '1rem 1.5rem',
        background: type === 'success' ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' :
            type === 'error' ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' :
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        zIndex: '9999',
        animation: 'slideInRight 0.3s ease',
        fontWeight: '500'
    });

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return '✓';
        case 'error': return '✕';
        case 'info': return 'ℹ';
        default: return '•';
    }
}

// Add notification animations to document
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
    .notification-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .notification-icon {
      font-size: 1.25rem;
      font-weight: bold;
    }
  `;
    document.head.appendChild(style);
}

// === MODAL MANAGEMENT ===
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal on outside click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target.id);
    }
});

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            closeModal(modal.id);
        });
    }
});

// === SMOOTH SCROLL ===
function initSmoothScroll() {
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
}

// === INTERSECTION OBSERVER FOR ANIMATIONS ===
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card, .project-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// === SEARCH AND FILTER ===
function filterProjects(searchTerm, category = 'all') {
    const projects = document.querySelectorAll('.project-card');

    projects.forEach(project => {
        const title = project.querySelector('.project-title')?.textContent.toLowerCase() || '';
        const description = project.querySelector('.project-description')?.textContent.toLowerCase() || '';
        const projectCategory = project.dataset.category?.toLowerCase() || '';

        const matchesSearch = title.includes(searchTerm.toLowerCase()) ||
            description.includes(searchTerm.toLowerCase());
        const matchesCategory = category === 'all' || projectCategory === category;

        if (matchesSearch && matchesCategory) {
            project.style.display = '';
            setTimeout(() => {
                project.style.opacity = '1';
                project.style.transform = 'translateY(0)';
            }, 10);
        } else {
            project.style.opacity = '0';
            project.style.transform = 'translateY(20px)';
            setTimeout(() => {
                project.style.display = 'none';
            }, 300);
        }
    });
}

// === FORM VALIDATION ===
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#f5576c';

            // Remove error styling on input
            input.addEventListener('input', function () {
                this.style.borderColor = '';
            }, { once: true });
        }
    });

    // Email validation
    const emailInputs = form.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (input.value && !emailRegex.test(input.value)) {
            isValid = false;
            input.style.borderColor = '#f5576c';
            showNotification('Please enter a valid email address', 'error');
        }
    });

    if (!isValid) {
        showNotification('Please fill in all required fields', 'error');
    }

    return isValid;
}

// === LOCAL STORAGE HELPERS ===
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Error saving to localStorage:', e);
        return false;
    }
}

function getFromLocalStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return defaultValue;
    }
}

// === FORMAT CURRENCY ===
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// === COPY TO CLIPBOARD ===
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy', 'error');
    });
}

// === DEBOUNCE UTILITY ===
function debounce(func, wait) {
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

// === LOADING SPINNER ===
function showLoading(element) {
    if (!element) return;
    element.classList.add('loading');
    element.style.pointerEvents = 'none';
}

function hideLoading(element) {
    if (!element) return;
    element.classList.remove('loading');
    element.style.pointerEvents = '';
}

// === INITIALIZE ON PAGE LOAD ===
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    updateCartCount();
    initSmoothScroll();

    // Load saved colors from admin settings
    loadSavedColors();
    initTheme();

    // Delay scroll animations slightly for better performance
    setTimeout(() => {
        initScrollAnimations();
    }, 100);

    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
      `;

            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation
    if (!document.querySelector('#ripple-animation')) {
        const style = document.createElement('style');
        style.id = 'ripple-animation';
        style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(2);
          opacity: 0;
        }
      }
    `;
        document.head.appendChild(style);
    }
});

// === LOAD SAVED COLORS ===
// === LOAD SAVED COLORS ===
function loadSavedColors() {
    const primaryColor = localStorage.getItem('primaryColor');
    const secondaryColor = localStorage.getItem('secondaryColor');
    const accentColor = localStorage.getItem('accentColor');

    if (primaryColor) {
        document.documentElement.style.setProperty('--bs-primary', primaryColor);
        // Also update the custom property if needed, though usually vars cascade
    }

    if (secondaryColor) {
        document.documentElement.style.setProperty('--bs-secondary', secondaryColor);
    }

    if (accentColor) {
        document.documentElement.style.setProperty('--bs-info', accentColor);
    }
}

// === THEME MANAGEMENT ===
function setTheme(theme) {
    const html = document.documentElement;
    const body = document.body;

    // Handle Auto
    if (theme === 'auto') {
        localStorage.setItem('theme', 'auto');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
        return;
    }

    // Save preference
    localStorage.setItem('theme', theme);
    applyTheme(theme);
}

function applyTheme(theme) {
    const html = document.documentElement;
    const body = document.body;

    if (theme === 'light') {
        html.setAttribute('data-bs-theme', 'light');
        // Handle admin panel specific classes if they exist
        if (body.classList.contains('bg-dark-custom')) {
            body.classList.remove('bg-dark-custom');
            body.classList.add('bg-light');
        }
    } else {
        html.setAttribute('data-bs-theme', 'dark');
        // Handle admin panel specific classes
        if (body.classList.contains('bg-light')) {
            body.classList.remove('bg-light');
            body.classList.add('bg-dark-custom');
        } else if (!body.classList.contains('bg-dark-custom') && (window.location.pathname.includes('/admin/') || document.querySelector('.admin-container'))) {
            // Add it if we are in admin and don't have it (initial load state)
            body.classList.add('bg-dark-custom');
        }
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    } else {
        applyTheme(savedTheme);
    }
}


// === EXPORT FOR USE IN OTHER FILES ===
window.portfolioMarketplace = {
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotal,
    showNotification,
    openModal,
    closeModal,
    filterProjects,
    validateForm,
    formatCurrency,
    copyToClipboard,
    debounce,
    showLoading,
    hideLoading,
    setTheme,
    applyTheme,
    state
};

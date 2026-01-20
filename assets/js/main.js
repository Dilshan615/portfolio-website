/**
 * Portfolio Marketplace - Main JavaScript
 * Consolidates: shop.js, admin.js, and inline scripts
 */

// === PROJECT DATA ===
const DEFAULT_PROJECTS = [
    {
        id: 1,
        title: "E-Commerce Platform",
        description: "Full-featured online store with payment integration, inventory management, and admin dashboard",
        price: 299,
        image: "assets/img/project-1.jpg",
        category: "web",
        tech: ["PHP", "MySQL", "Bootstrap", "JavaScript"],
        features: ["Payment Integration", "Admin Panel", "Responsive Design", "SEO Optimized"],
        demoUrl: "#",
        downloadUrl: "#",
        status: "active"
    },
    {
        id: 2,
        title: "Task Management App",
        description: "React-based task manager with drag-and-drop, team collaboration, and real-time updates",
        price: 199,
        image: "assets/img/project-2.jpg",
        category: "app",
        tech: ["React", "Firebase", "Node.js", "Tailwind"],
        features: ["Drag & Drop", "Real-time Sync", "Team Chat", "Desktop Notifications"],
        demoUrl: "#",
        downloadUrl: "#",
        status: "active"
    },
    {
        id: 3,
        title: "Portfolio Template",
        description: "Modern, high-performance portfolio template for developers and designers",
        price: 99,
        image: "assets/img/project-1.jpg",
        category: "template",
        tech: ["HTML", "CSS", "JavaScript", "GSAP"],
        features: ["Smooth Animations", "Dark Mode", "Contact Form", "Mobile Responsive"],
        demoUrl: "#",
        downloadUrl: "#",
        status: "active"
    },
    {
        id: 4,
        title: "Social Media Dashboard",
        description: "Comprehensive analytics dashboard for social media management",
        price: 249,
        image: "assets/img/project-2.jpg",
        category: "dashboard",
        tech: ["Vue.js", "Chart.js", "Express", "PostgreSQL"],
        features: ["Data Visualization", "Export Reports", "User Roles", "API Integration"],
        demoUrl: "#",
        downloadUrl: "#",
        status: "active"
    },
    {
        id: 5,
        title: "Fitness Tracker App",
        description: "Mobile-first fitness application with workout plans and progress tracking",
        price: 149,
        image: "assets/img/project-1.jpg",
        category: "app",
        tech: ["React Native", "MongoDB", "Express", "Node.js"],
        features: ["Workout Logs", "GPS Tracking", "Social Sharing", "Health App Sync"],
        demoUrl: "#",
        downloadUrl: "#",
        status: "active"
    },
    {
        id: 6,
        title: "Learning Management System",
        description: "Complete LMS platform for online courses and student management",
        price: 349,
        image: "assets/img/project-2.jpg",
        category: "web",
        tech: ["Next.js", "Prisma", "AWS", "Stripe"],
        features: ["Video Streaming", "Quiz System", "Certificates", "Student Dashboard"],
        demoUrl: "#",
        downloadUrl: "#",
        status: "active"
    }
];

// Load projects from localStorage or use defaults
let PROJECTS_DATA = JSON.parse(localStorage.getItem('products')) || DEFAULT_PROJECTS;

// Persist projects to localStorage if not already there
if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(PROJECTS_DATA));
}

// === GLOBAL STATE ===
const state = {
    cart: JSON.parse(localStorage.getItem('cart') || '[]'),
};

// === ADMIN PROJECT MANAGEMENT ===
function saveProject(projectData, isEdit = false) {
    if (isEdit) {
        const index = PROJECTS_DATA.findIndex(p => p.id === projectData.id);
        if (index !== -1) {
            PROJECTS_DATA[index] = { ...PROJECTS_DATA[index], ...projectData };
        }
    } else {
        const newProject = {
            ...projectData,
            id: PROJECTS_DATA.length > 0 ? Math.max(...PROJECTS_DATA.map(p => p.id)) + 1 : 1
        };
        PROJECTS_DATA.push(newProject);
    }
    localStorage.setItem('products', JSON.stringify(PROJECTS_DATA));
    showNotification(isEdit ? 'Project updated!' : 'Project added!', 'success');
}

function deleteProject(id) {
    PROJECTS_DATA = PROJECTS_DATA.filter(p => p.id !== id);
    localStorage.setItem('products', JSON.stringify(PROJECTS_DATA));
    showNotification('Project deleted!', 'success');
}

// === NOTIFICATION SYSTEM ===
function showNotification(message, type = 'primary') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✅' : 'ℹ️'}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    document.body.appendChild(notification);

    // Fade in
    setTimeout(() => notification.classList.add('show'), 10);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// === CART FUNCTIONS ===
function updateCartCount() {
    const counts = document.querySelectorAll('.cart-count');
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    counts.forEach(el => el.textContent = totalItems);
}

function addToCart(projectOrId) {
    let project;
    if (typeof projectOrId === 'object') {
        project = projectOrId;
    } else {
        project = PROJECTS_DATA.find(p => p.id === projectOrId);
    }

    if (!project) return;

    const existingItem = state.cart.find(item => item.id === project.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        state.cart.push({
            id: project.id,
            title: project.title,
            price: project.price,
            image: project.image,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(state.cart));
    updateCartCount();
    showNotification(`Added ${project.title} to cart!`, 'success');
}

// === RENDER PROJECTS ===
function renderProjects(projects, containerId, pathPrefix = '') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = projects.map(project => `
        <div class="card project-card" data-category="${project.category}">
            <div class="project-image">
                <img src="${pathPrefix}${project.image}" alt="${project.title}">
                <div class="project-category">${project.category.toUpperCase()}</div>
                <div class="project-overlay">
                    <button class="btn btn-primary" onclick="window.shopFunctions.addProjectToCart(${project.id})">
                        <span>🛒</span> Add to Cart
                    </button>
                </div>
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description.substring(0, 80)}...</p>
                <div class="project-tech">
                    ${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
                </div>
                <div class="project-footer">
                    <div class="project-price">$${project.price}</div>
                    <a href="${pathPrefix}products/project-1.html" class="btn btn-secondary btn-sm">View Details</a>
                </div>
            </div>
        </div>
    `).join('');
}

// === SUCCESS PAGE LOGIC ===
function initSuccessPage() {
    const orderContainer = document.getElementById('order-details');
    if (!orderContainer) return;

    // Simulate getting last order
    const lastOrder = {
        orderId: Math.random().toString(36).substr(2, 9).toUpperCase(),
        date: new Date().toISOString(),
        total: state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        items: state.cart.length > 0 ? state.cart : [PROJECTS_DATA[0]] // Mock if cart empty
    };

    orderContainer.innerHTML = `
        <div class="card text-center success-animation" style="padding: 3rem; margin-bottom: 2rem; border-color: var(--success-gradient);">
            <div style="font-size: 5rem; margin-bottom: 1.5rem;">🎉</div>
            <h1 style="margin-bottom: 1rem;">Order Successful!</h1>
            <p style="color: var(--text-secondary); margin-bottom: 2rem;">Thank you for your purchase. Your payment has been processed successfully.</p>
            
            <div style="display: inline-flex; gap: 2rem; padding: 1.5rem; background: rgba(67, 233, 123, 0.05); border-radius: var(--radius-lg); border: 1px solid rgba(67, 233, 123, 0.2);">
                <div style="text-align: left;">
                    <div style="color: var(--text-secondary); font-size: 0.875rem;">Order ID</div>
                    <div style="font-weight: 700;">#${lastOrder.orderId}</div>
                </div>
                <div style="text-align: left;">
                    <div style="color: var(--text-secondary); font-size: 0.875rem;">Date</div>
                    <div style="font-weight: 700;">${new Date(lastOrder.date).toLocaleDateString()}</div>
                </div>
            </div>
        </div>

        <div class="card" style="margin-bottom: 2rem;">
            <h3 style="margin-bottom: 1.5rem;">Purchased Items</h3>
            ${lastOrder.items.map(item => `
                <div style="display: flex; justify-content: space-between; padding: 1rem 0; border-bottom: 1px solid var(--border-color);">
                    <span>${item.title}</span>
                    <span style="font-weight: 700;">$${item.price.toFixed(2)}</span>
                </div>
            `).join('')}
            <div style="display: flex; justify-content: space-between; padding: 1.5rem 0; font-size: 1.25rem; font-weight: 700;">
                <span>Total Paid</span>
                <span style="background: var(--success-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">$${lastOrder.total.toFixed(2)}</span>
            </div>
        </div>

        <div class="card">
            <h3 style="margin-bottom: 1rem;">Download Your Projects</h3>
            <p style="margin-bottom: 1.5rem; color: var(--text-secondary);">Your download links are ready. You can also access them anytime from your email.</p>
            ${lastOrder.items.map(item => `
                <button class="btn btn-primary" style="width: 100%; margin-bottom: 1rem;" onclick="window.shopFunctions.downloadProject(${item.id})">
                    <span>📥</span> Download ${item.title}
                </button>
            `).join('')}
        </div>

        <div style="text-align: center; margin-top: 2rem;">
            <a href="shop.html" class="btn btn-secondary">Continue Shopping</a>
        </div>
    `;

    createConfetti();
}

function createConfetti() {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#43e97b', '#38f9d7'];
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 5000);
        }, i * 30);
    }
}

function downloadProject(id) {
    showNotification('Download started!', 'success');
}

// === SHOP LOGIC ===
function initShop() {
    renderProjects(PROJECTS_DATA, 'projects-grid');

    const searchInput = document.getElementById('search-projects');
    const categoryFilter = document.getElementById('filter-category');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterProjects(e.target.value, categoryFilter ? categoryFilter.value : 'all');
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            filterProjects(searchInput ? searchInput.value : '', e.target.value);
        });
    }
}

function filterProjects(searchTerm, category) {
    const projects = PROJECTS_DATA.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             project.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = category === 'all' || project.category === category;
        return matchesSearch && matchesCategory;
    });

    renderProjects(projects, 'projects-grid');
    updateProjectCount();
}

function updateProjectCount() {
    const countEl = document.getElementById('project-count');
    const noResults = document.getElementById('no-results');
    const projectsGrid = document.getElementById('projects-grid');
    
    if (projectsGrid) {
        const visibleProjects = projectsGrid.children.length;
        if (countEl) countEl.textContent = visibleProjects;
        if (noResults) noResults.style.display = visibleProjects === 0 ? 'block' : 'none';
    }
}

// === CHECKOUT LOGIC ===
function initCheckout() {
    renderCartItems();
    updateCartSummary();

    // Payment method toggle logic
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', (e) => {
            const allDetails = document.querySelectorAll('.payment-details');
            allDetails.forEach(d => d.style.display = 'none');
            
            const selectedDetails = document.getElementById(`${e.target.value}-details`);
            if (selectedDetails) {
                selectedDetails.style.display = 'block';
            }
        });
    });

    // Form submission
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // In a real app, this would process the payment
            showNotification('Order placed successfully! Redirecting...', 'success');
            localStorage.removeItem('cart');
            setTimeout(() => {
                window.location.href = 'success.html';
            }, 2000);
        });
    }
}

function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    if (state.cart.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🛒</div>
                <h3>Your cart is empty</h3>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">Browse our projects and find something amazing!</p>
                <a href="shop.html" class="btn btn-primary">Go to Shop</a>
            </div>
        `;
        return;
    }

    container.innerHTML = state.cart.map((item, index) => `
        <div class="card" style="padding: 1rem; margin-bottom: 1rem;">
            <div style="display: flex; gap: 1rem; align-items: center;">
                <img src="${item.image}" alt="${item.title}" style="width: 80px; height: 80px; object-fit: cover; border-radius: var(--radius-md);">
                <div style="flex: 1;">
                    <h4 style="margin: 0;">${item.title}</h4>
                    <div style="color: var(--text-secondary); font-size: 0.875rem;">Quantity: ${item.quantity}</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: 700; color: var(--text-primary);">$${(item.price * item.quantity).toFixed(2)}</div>
                    <button class="btn btn-sm" style="color: #ff4d4d; padding: 0.25rem 0;" onclick="window.shopFunctions.removeCartItem(${index})">Remove</button>
                </div>
            </div>
        </div>
    `).join('');
}

function removeCartItem(index) {
    state.cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(state.cart));
    renderCartItems();
    updateCartSummary();
    updateCartCount();
}

function updateCartSummary() {
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;
}

// === FOOTER COMPONENT ===
function renderFooter() {
    const footerElement = document.querySelector('footer.footer');
    if (!footerElement) return;

    // Create a container if it doesn't exist to prevent double rendering
    if (footerElement.id === 'global-footer-rendered') return;
    
    footerElement.id = 'global-footer-rendered';
    footerElement.innerHTML = `
        <div class="footer-content">
            <div class="footer-section">
                <h3>Portfolio Market</h3>
                <p style="color: var(--text-secondary); margin-bottom: 1rem;">Premium web projects and templates for developers and businesses.</p>
                <div style="display: flex; gap: 1rem; font-size: 1.5rem;">
                    <a href="#" style="transition: transform 0.2s;">🐦</a>
                    <a href="#" style="transition: transform 0.2s;">💼</a>
                    <a href="#" style="transition: transform 0.2s;">📘</a>
                    <a href="#" style="transition: transform 0.2s;">📷</a>
                </div>
            </div>

            <div class="footer-section">
                <h3>Quick Links</h3>
                <ul class="footer-links">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="shop.html">Shop</a></li>
                    <li><a href="index.html#features">Features</a></li>
                    <li><a href="index.html#about">About</a></li>
                </ul>
            </div>

            <div class="footer-section">
                <h3>Categories</h3>
                <ul class="footer-links">
                    <li><a href="shop.html?category=web">Web Applications</a></li>
                    <li><a href="shop.html?category=app">Mobile Apps</a></li>
                    <li><a href="shop.html?category=dashboard">Dashboards</a></li>
                    <li><a href="shop.html?category=template">Templates</a></li>
                </ul>
            </div>

            <div class="footer-section">
                <h3>Contact Us</h3>
                <ul class="footer-links">
                    <li><a href="faq.html">FAQ</a></li>
                    <li><a href="admin/index.html">Admin Login</a></li>
                </ul>
            </div>
        </div>

        <div class="footer-bottom">
            <p>&copy; 2026 Portfolio Marketplace. All rights reserved. Built with ❤️ by Dilshan.</p>
        </div>
    `;
}

// === ADMIN AUTH ===
function checkAuth() {
    const adminUser = localStorage.getItem('adminUser');
    const path = window.location.pathname;
    const isLoginPage = path.includes('admin/index.html') || path.endsWith('/admin/') || path.endsWith('/admin');
    
    if (!adminUser && !isLoginPage && path.includes('/admin/')) {
        window.location.href = '../admin/index.html';
        return null;
    }
    return adminUser ? JSON.parse(adminUser) : null;
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('adminUser');
        window.location.href = '../index.html';
    }
}

function toggleSidebar() {
    const sidebar = document.querySelector('.admin-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (sidebar) sidebar.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
}

function initAdminTableSearch(inputId, tableBodyId) {
    const input = document.getElementById(inputId);
    const tbody = document.getElementById(tableBodyId);
    if (!input || !tbody) return;

    input.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        Array.from(tbody.rows).forEach(row => {
            row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
        });
    });
}

// === THEME & COLORS ===
function setTheme(theme) {
    if (theme === 'auto') {
        const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
        theme = darkQuery.matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
}

function applyPersistedColors() {
    const primary = localStorage.getItem('primaryColor');
    const secondary = localStorage.getItem('secondaryColor');
    const accent = localStorage.getItem('accentColor');

    if (primary) document.documentElement.style.setProperty('--bs-primary', primary);
    if (secondary) document.documentElement.style.setProperty('--bs-secondary', secondary);
    if (accent) document.documentElement.style.setProperty('--bs-info', accent);
}

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
    // Global initializations
    updateCartCount();
    renderFooter();
    applyPersistedColors();
    
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    checkAuth();

    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }

    // Homepage logic
    const featuredContainer = document.getElementById('featured-projects');
    if (featuredContainer) {
        const featuredProjects = PROJECTS_DATA.slice(0, 3);
        renderProjects(featuredProjects, 'featured-projects');
    }

    // Shop logic
    if (document.getElementById('projects-grid')) {
        initShop();
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        if (category) {
            const categoryFilter = document.getElementById('filter-category');
            if (categoryFilter) {
                categoryFilter.value = category;
                filterProjects('', category);
            }
        }
    }

    // Checkout logic
    if (document.getElementById('cart-items-container')) {
        initCheckout();
    }

    // Success Page logic
    if (document.getElementById('order-details')) {
        initSuccessPage();
    }
});

// Expose globals for backward compatibility/inline scripts
window.toggleSidebar = toggleSidebar;
window.logout = logout;
window.checkAuth = checkAuth;
window.setTheme = setTheme;

// === EXPORT SHOP FUNCTIONS ===
window.shopFunctions = {
    addProjectToCart: addToCart,
    initShop,
    initCheckout,
    removeCartItem,
    PROJECTS_DATA,
    saveProject,
    deleteProject
};

window.portfolioMarketplace = {
    updateCartCount,
    showNotification,
    filterProjects,
    initAdminTableSearch,
    addToCart
};

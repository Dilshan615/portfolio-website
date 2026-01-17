// ========================================
// SHOP & CHECKOUT LOGIC
// ========================================

// === SAMPLE PROJECTS DATA ===
const PROJECTS_DATA = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "Full-featured online store with payment integration, inventory management, and admin dashboard",
    price: 299,
    image: "assets/img/project-1.jpg",
    category: "web",
    tech: ["React", "Node.js", "MongoDB", "Stripe"],
    features: ["Payment Integration", "Admin Panel", "Responsive Design", "SEO Optimized"],
    demoUrl: "#",
    downloadUrl: "#"
  },
  {
    id: 2,
    title: "Portfolio Website Template",
    description: "Modern, animated portfolio template perfect for showcasing your work and skills",
    price: 99,
    image: "assets/img/project-2.jpg",
    category: "web",
    tech: ["HTML", "CSS", "JavaScript", "GSAP"],
    features: ["Smooth Animations", "Dark Mode", "Contact Form", "Blog Section"],
    demoUrl: "#",
    downloadUrl: "#"
  },
  {
    id: 3,
    title: "Task Management App",
    description: "Collaborative task manager with real-time updates, team features, and analytics",
    price: 199,
    image: "assets/img/project-3.jpg",
    category: "app",
    tech: ["Vue.js", "Firebase", "Vuex", "Chart.js"],
    features: ["Real-time Sync", "Team Collaboration", "Analytics Dashboard", "Mobile Responsive"],
    demoUrl: "#",
    downloadUrl: "#"
  },
  {
    id: 4,
    title: "Social Media Dashboard",
    description: "Analytics dashboard for tracking social media metrics across multiple platforms",
    price: 249,
    image: "assets/img/project-4.jpg",
    category: "dashboard",
    tech: ["React", "D3.js", "Express", "PostgreSQL"],
    features: ["Multi-platform Support", "Custom Reports", "Data Visualization", "API Integration"],
    demoUrl: "#",
    downloadUrl: "#"
  },
  {
    id: 5,
    title: "Restaurant Booking System",
    description: "Complete reservation system with table management, customer notifications, and reporting",
    price: 349,
    image: "assets/img/project-5.jpg",
    category: "web",
    tech: ["Laravel", "MySQL", "Vue.js", "Twilio"],
    features: ["Table Management", "SMS Notifications", "Customer Database", "Booking Calendar"],
    demoUrl: "#",
    downloadUrl: "#"
  },
  {
    id: 6,
    title: "Fitness Tracker Mobile App",
    description: "Cross-platform fitness app with workout tracking, nutrition logging, and progress charts",
    price: 279,
    image: "assets/img/project-6.jpg",
    category: "app",
    tech: ["React Native", "Redux", "Node.js", "MongoDB"],
    features: ["Workout Plans", "Nutrition Tracking", "Progress Charts", "Social Features"],
    demoUrl: "#",
    downloadUrl: "#"
  }
];

// === RENDER PROJECTS ===
function renderProjects(projects = PROJECTS_DATA, containerId = 'projects-grid') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = projects.map(project => `
    <div class="project-card" data-category="${project.category}" data-project-id="${project.id}">
      <img src="${project.image}" alt="${project.title}" class="project-image" onerror="this.src='assets/img/placeholder.jpg'">
      <div class="project-info">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        
        <div class="project-tech">
          ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
        
        <div class="project-meta">
          <span class="project-price">${formatCurrency(project.price)}</span>
          <button class="btn btn-sm btn-secondary" onclick="viewProjectDetails(${project.id})">
            Details
          </button>
        </div>
        
        <div class="project-actions" style="flex-direction: column;">
          <button class="btn btn-primary" onclick="addProjectToCart(${project.id})" style="width: 100%;">
            <span>🛒</span> Add to Cart
          </button>
          <a href="${project.demoUrl}" class="btn btn-secondary" target="_blank" style="width: 100%;">
            <span>👁️</span> Live Demo
          </a>
        </div>
      </div>
    </div>
  `).join('');

  // Re-initialize scroll animations for new elements
  if (window.portfolioMarketplace) {
    setTimeout(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      }, { threshold: 0.1 });

      container.querySelectorAll('.project-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
      });
    }, 100);
  }
}

// === ADD PROJECT TO CART ===
function addProjectToCart(projectId) {
  const project = PROJECTS_DATA.find(p => p.id === projectId);
  if (!project) return;

  if (window.portfolioMarketplace) {
    window.portfolioMarketplace.addToCart(project);
  }
}

// === VIEW PROJECT DETAILS ===
function viewProjectDetails(projectId) {
  const project = PROJECTS_DATA.find(p => p.id === projectId);
  if (!project) return;

  // Create or update modal
  let modal = document.getElementById('project-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'project-modal';
    modal.className = 'modal';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-content" style="max-width: 800px;">
      <button class="modal-close" onclick="portfolioMarketplace.closeModal('project-modal')">×</button>
      
      <img src="${project.image}" alt="${project.title}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 12px; margin-bottom: 1.5rem;" onerror="this.src='assets/img/placeholder.jpg'">
      
      <h2 style="margin-bottom: 1rem;">${project.title}</h2>
      <p style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 1.1rem;">${project.description}</p>
      
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
        ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
      </div>
      
      <h3 style="margin-bottom: 1rem; font-size: 1.25rem;">Key Features</h3>
      <ul style="list-style: none; margin-bottom: 1.5rem;">
        ${project.features.map(feature => `
          <li style="padding: 0.5rem 0; color: var(--text-secondary); display: flex; align-items: center; gap: 0.5rem;">
            <span style="color: #43e97b; font-size: 1.2rem;">✓</span> ${feature}
          </li>
        `).join('')}
      </ul>
      
      <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1.5rem; border-top: 1px solid var(--border-color);">
        <span style="font-size: 2rem; font-weight: 700; background: var(--accent-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
          ${formatCurrency(project.price)}
        </span>
        <div style="display: flex; gap: 1rem;">
          <a href="${project.demoUrl}" class="btn btn-secondary" target="_blank">
            <span>👁️</span> View Demo
          </a>
          <button class="btn btn-primary" onclick="addProjectToCart(${project.id}); portfolioMarketplace.closeModal('project-modal');">
            <span>🛒</span> Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;

  if (window.portfolioMarketplace) {
    window.portfolioMarketplace.openModal('project-modal');
  }
}

// === RENDER CART ITEMS ===
function renderCartItems() {
  const container = document.getElementById('cart-items');
  if (!container) return;

  const cart = window.portfolioMarketplace?.state.cart || [];

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
        <div style="font-size: 4rem; margin-bottom: 1rem;">🛒</div>
        <h3>Your cart is empty</h3>
        <p style="margin-bottom: 1.5rem;">Add some amazing projects to get started!</p>
        <a href="shop.html" class="btn btn-primary">Browse Projects</a>
      </div>
    `;
    updateCartSummary();
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item" style="display: flex; gap: 1.5rem; padding: 1.5rem; background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 1rem;">
      <img src="${item.image}" alt="${item.title}" style="width: 120px; height: 120px; object-fit: cover; border-radius: var(--radius-sm);" onerror="this.src='assets/img/placeholder.jpg'">
      
      <div style="flex: 1;">
        <h3 style="margin-bottom: 0.5rem; font-size: 1.25rem;">${item.title}</h3>
        <p style="color: var(--text-secondary); margin-bottom: 1rem;">Digital Download</p>
        <div style="display: flex; align-items: center; gap: 1rem;">
          <span style="font-size: 1.5rem; font-weight: 700; background: var(--accent-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
            ${formatCurrency(item.price)}
          </span>
        </div>
      </div>
      
      <button class="btn btn-danger btn-sm" onclick="removeCartItem(${item.id})" style="height: fit-content;">
        Remove
      </button>
    </div>
  `).join('');

  updateCartSummary();
}

// === UPDATE CART SUMMARY ===
function updateCartSummary() {
  const subtotalEl = document.getElementById('cart-subtotal');
  const taxEl = document.getElementById('cart-tax');
  const totalEl = document.getElementById('cart-total');

  if (!subtotalEl || !totalEl) return;

  const subtotal = window.portfolioMarketplace?.getCartTotal() || 0;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
  if (taxEl) taxEl.textContent = formatCurrency(tax);
  if (totalEl) totalEl.textContent = formatCurrency(total);
}

// === REMOVE CART ITEM ===
function removeCartItem(projectId) {
  if (window.portfolioMarketplace) {
    window.portfolioMarketplace.removeFromCart(projectId);
    renderCartItems();
  }
}

// === PROCESS CHECKOUT ===
function processCheckout(event) {
  event.preventDefault();

  if (!window.portfolioMarketplace?.validateForm('checkout-form')) {
    return;
  }

  const formData = new FormData(event.target);
  const orderData = {
    customer: {
      name: formData.get('name'),
      email: formData.get('email'),
      address: formData.get('address'),
      city: formData.get('city'),
      zip: formData.get('zip'),
      country: formData.get('country')
    },
    payment: {
      method: formData.get('payment-method'),
      cardNumber: formData.get('card-number'),
      cardName: formData.get('card-name')
    },
    items: window.portfolioMarketplace.state.cart,
    total: window.portfolioMarketplace.getCartTotal(),
    orderDate: new Date().toISOString(),
    orderId: 'ORD-' + Date.now()
  };

  // Show loading
  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<span class="loading">Processing...</span>';
  submitBtn.disabled = true;

  // Simulate payment processing
  setTimeout(() => {
    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('lastOrder', JSON.stringify(orderData));

    // Clear cart
    window.portfolioMarketplace.clearCart();

    // Redirect to success page
    window.location.href = 'success.html';
  }, 2000);
}

// === INITIALIZE SHOP PAGE ===
function initShop() {
  renderProjects();

  // Search functionality
  const searchInput = document.getElementById('search-projects');
  if (searchInput) {
    searchInput.addEventListener('input', window.portfolioMarketplace.debounce((e) => {
      const category = document.getElementById('filter-category')?.value || 'all';
      window.portfolioMarketplace.filterProjects(e.target.value, category);
    }, 300));
  }

  // Category filter
  const categoryFilter = document.getElementById('filter-category');
  if (categoryFilter) {
    categoryFilter.addEventListener('change', (e) => {
      const searchTerm = document.getElementById('search-projects')?.value || '';
      window.portfolioMarketplace.filterProjects(searchTerm, e.target.value);
    });
  }
}

// === INITIALIZE CHECKOUT PAGE ===
function initCheckout() {
  renderCartItems();

  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', processCheckout);
  }

  // Payment method toggle
  const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
  paymentMethods.forEach(method => {
    method.addEventListener('change', (e) => {
      document.querySelectorAll('.payment-details').forEach(el => {
        el.style.display = 'none';
      });
      const selectedDetails = document.getElementById(e.target.value + '-details');
      if (selectedDetails) {
        selectedDetails.style.display = 'block';
      }
    });
  });
}

// === INITIALIZE SUCCESS PAGE ===
function initSuccessPage() {
  const lastOrder = JSON.parse(localStorage.getItem('lastOrder') || 'null');

  if (!lastOrder) {
    window.location.href = 'shop.html';
    return;
  }

  const orderDetails = document.getElementById('order-details');
  if (orderDetails) {
    orderDetails.innerHTML = `
      <div style="text-align: center; margin-bottom: 2rem;">
        <div style="font-size: 5rem; margin-bottom: 1rem;">✓</div>
        <h1 style="margin-bottom: 1rem;">Order Successful!</h1>
        <p style="font-size: 1.25rem; color: var(--text-secondary);">Thank you for your purchase, ${lastOrder.customer.name}!</p>
      </div>

      <div class="card" style="margin-bottom: 2rem;">
        <h3 style="margin-bottom: 1rem;">Order Details</h3>
        <p><strong>Order ID:</strong> ${lastOrder.orderId}</p>
        <p><strong>Date:</strong> ${new Date(lastOrder.orderDate).toLocaleDateString()}</p>
        <p><strong>Email:</strong> ${lastOrder.customer.email}</p>
      </div>

      <div class="card" style="margin-bottom: 2rem;">
        <h3 style="margin-bottom: 1rem;">Purchased Items</h3>
        ${lastOrder.items.map(item => `
          <div style="display: flex; justify-content: space-between; padding: 1rem 0; border-bottom: 1px solid var(--border-color);">
            <span>${item.title}</span>
            <span style="font-weight: 700;">${formatCurrency(item.price)}</span>
          </div>
        `).join('')}
        <div style="display: flex; justify-content: space-between; padding: 1rem 0; font-size: 1.25rem; font-weight: 700;">
          <span>Total</span>
          <span style="background: var(--accent-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
            ${formatCurrency(lastOrder.total)}
          </span>
        </div>
      </div>

      <div class="card">
        <h3 style="margin-bottom: 1rem;">Download Your Projects</h3>
        <p style="margin-bottom: 1.5rem; color: var(--text-secondary);">Your download links are ready. You can also access them anytime from your email.</p>
        ${lastOrder.items.map(item => `
          <button class="btn btn-primary" style="width: 100%; margin-bottom: 1rem;" onclick="downloadProject(${item.id})">
            <span>⬇️</span> Download ${item.title}
          </button>
        `).join('')}
      </div>

      <div style="text-align: center; margin-top: 2rem;">
        <a href="shop.html" class="btn btn-secondary">Continue Shopping</a>
      </div>
    `;
  }
}

// === DOWNLOAD PROJECT ===
function downloadProject(projectId) {
  window.portfolioMarketplace.showNotification('Download started!', 'success');
  // In a real application, this would trigger an actual download
  console.log('Downloading project:', projectId);
}

// === FORMAT CURRENCY ===
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

// === EXPORT FUNCTIONS ===
window.shopFunctions = {
  renderProjects,
  addProjectToCart,
  viewProjectDetails,
  renderCartItems,
  removeCartItem,
  processCheckout,
  initShop,
  initCheckout,
  initSuccessPage,
  downloadProject,
  PROJECTS_DATA
};

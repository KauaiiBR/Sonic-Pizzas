// Sonic Pizzas - Client Local Storage Synchronized Catalog Database (Pure JS)

// Initial default catalog to populate LocalStorage if empty
const DEFAULT_PIZZA_FLAVORS = [
  {
    id: 'calabresa',
    name: 'Calabresa Clássica',
    description: 'Molho de tomate artesanal, muçarela de alta qualidade, calabresa fatiada selecionada, cebola fresca e orégano.',
    prices: { Brotinho: 28.00, Média: 42.00, Grande: 56.00, Gigante: 68.00 },
    category: 'salgada',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60',
    popular: true
  },
  {
    id: 'frango-catupiry',
    name: 'Frango com Catupiry',
    description: 'Peito de frango desfiado temperado com ervas finas, coberto com muçarela e o legítimo requeijão Catupiry.',
    prices: { Brotinho: 32.00, Média: 48.00, Grande: 62.00, Gigante: 76.00 },
    category: 'salgada',
    image: 'https://images.unsplash.com/photo-1594009487141-c52f2ef4576b?w=500&auto=format&fit=crop&q=60',
    popular: true
  },
  {
    id: 'margherita',
    name: 'Margherita Du Chef',
    description: 'Molho de tomate fresco, fatias de muçarela especial, rodelas de tomate cereja maduro, manjericão fresco e azeite extravirgem.',
    prices: { Brotinho: 30.00, Média: 45.00, Grande: 58.00, Gigante: 70.00 },
    category: 'salgada',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'portuguesa',
    name: 'Portuguesa Tradicional',
    description: 'Presunto cozido magro, muçarela, ovos cozidos, cebola fatiada, ervilhas frescas, azeitonas pretas chilenas e orégano.',
    prices: { Brotinho: 34.00, Média: 50.00, Grande: 65.00, Gigante: 78.00 },
    category: 'salgada',
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'quatro-queijos',
    name: 'Quatro Queijos Nobres',
    description: 'Combinação perfeita de muçarela, requeijão cremoso, provolone defumado e o marcante queijo gorgonzola.',
    prices: { Brotinho: 35.00, Média: 52.00, Grande: 68.00, Gigante: 82.00 },
    category: 'salgada',
    image: 'https://images.unsplash.com/photo-1518047601542-79f18c655718?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'sonic-turbo',
    name: 'Sonic Turbo Especial',
    description: 'A pizza mais rápida da casa! Muito pepperoni crocante, bacon em cubos defumado, cebola roxa, cheddar cremoso e barbecue.',
    prices: { Brotinho: 38.00, Média: 55.00, Grande: 74.00, Gigante: 88.00 },
    category: 'especial',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60',
    popular: true
  },
  {
    id: 'tails-double-queijo',
    name: 'Tails Double Cheddar',
    description: 'Dupla camada de muçarela, batata frita ondulada por cima, bacon crocante em cubos e uma generosa calda de cheddar.',
    prices: { Brotinho: 36.00, Média: 54.00, Grande: 70.00, Gigante: 85.00 },
    category: 'especial',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'chocolate-morango',
    name: 'Sensação de Chocolate',
    description: 'Base de chocolate ao leite nestlé cremoso, coberto com fatias frescas de morango e raspas de chocolate branco.',
    prices: { Brotinho: 32.00, Média: 48.00, Grande: 64.00, Gigante: 76.00 },
    category: 'doce',
    image: 'https://images.unsplash.com/photo-1617303211158-b615d862f1a6?w=500&auto=format&fit=crop&q=60',
    popular: true
  },
  {
    id: 'romeu-julieta',
    name: 'Romeu & Julieta',
    description: 'A clássica e amada combinação de muçarela fatiada com fatias generosas de goiabada cascão cremosa quente.',
    prices: { Brotinho: 30.00, Média: 45.00, Grande: 58.00, Gigante: 70.00 },
    category: 'doce',
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&auto=format&fit=crop&q=60'
  }
];

const DEFAULT_DRINKS = [
  {
    id: 'coca-cola-lata',
    name: 'Coca-Cola Lata 350ml',
    price: 6.50,
    category: 'bebida',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'coca-cola-2l',
    name: 'Coca-Cola 2 Litros',
    price: 13.00,
    category: 'bebida',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'guarana-lata',
    name: 'Guaraná Antarctica Lata 350ml',
    price: 6.00,
    category: 'bebida',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'suco-laranja',
    name: 'Suco de Laranja Natural 500ml',
    price: 9.50,
    category: 'bebida',
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'agua-mineral',
    name: 'Água Mineral sem Gás 500ml',
    price: 4.50,
    category: 'bebida',
    image: 'https://images.unsplash.com/photo-1608885898957-a599fb15ec36?w=500&auto=format&fit=crop&q=60'
  }
];

// In-Memory Database Helper functions (Local-first)
function getLocalPizzas() {
  let data = localStorage.getItem('sonic_pizzas_menu_pizzas');
  if (!data) {
    localStorage.setItem('sonic_pizzas_menu_pizzas', JSON.stringify(DEFAULT_PIZZA_FLAVORS));
    return DEFAULT_PIZZA_FLAVORS;
  }
  return JSON.parse(data);
}

function getLocalDrinks() {
  let data = localStorage.getItem('sonic_pizzas_menu_drinks');
  if (!data) {
    localStorage.setItem('sonic_pizzas_menu_drinks', JSON.stringify(DEFAULT_DRINKS));
    return DEFAULT_DRINKS;
  }
  return JSON.parse(data);
}

function getLocalOrders() {
  let data = localStorage.getItem('sonic_pizzas_orders');
  if (!data) {
    // Generate initial default orders
    const initialOrders = [
      {
        id: 'SNC-8271',
        tableNumber: '4',
        customerName: 'Rodrigo Silva',
        status: 'preparando',
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        items: [
          {
            id: 'item-1',
            type: 'pizza',
            name: 'Calabresa Clássica',
            size: 'Grande',
            quantity: 1,
            unitPrice: 56.00,
            totalPrice: 56.00,
            notes: 'Sem cebola, por favor.'
          },
          {
            id: 'item-2',
            type: 'bebida',
            name: 'Coca-Cola 2 Litros',
            quantity: 1,
            unitPrice: 13.00,
            totalPrice: 13.00
          }
        ],
        total: 69.00
      }
    ];
    localStorage.setItem('sonic_pizzas_orders', JSON.stringify(initialOrders));
    return initialOrders;
  }
  return JSON.parse(data);
}

function saveLocalOrder(order) {
  const currentOrders = getLocalOrders();
  currentOrders.unshift(order);
  localStorage.setItem('sonic_pizzas_orders', JSON.stringify(currentOrders));
  return order;
}

// State management
let state = {
  pizzas: [],
  drinks: [],
  selectedCategory: 'salgada',
  cart: [],
  tableNumber: '',
  customerName: '',
  activeOrderId: localStorage.getItem('activeOrderId') || null,
  activeOrder: null,
  
  // Customization modal temporary states
  selectedProduct: null,
  selectedSize: 'Grande', // Brotinho, Média, Grande, Gigante
  isHalfHalf: false,
  flavor1Id: null,
  flavor2Id: null,
  qty: 1
};

// Category config
const CATEGORIES = [
  { id: 'salgada', label: '🍕 Pizzas Salgadas' },
  { id: 'especial', label: '🚀 Pizzas Especiais' },
  { id: 'doce', label: '🍫 Pizzas Doces' },
  { id: 'bebida', label: '🥤 Bebidas' }
];

// Poll timer reference
let trackerPollInterval = null;

// Initialize when DOM loaded
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  // Set copyright year
  document.getElementById('year-placeholder').textContent = new Date().getFullYear();
  
  // Check existing session
  const savedTable = localStorage.getItem('tableNumber');
  const savedName = localStorage.getItem('customerName');
  
  if (savedTable) {
    state.tableNumber = savedTable;
    state.customerName = savedName || '';
    
    // Hide login modal, show content
    document.getElementById('login-modal').classList.add('hidden');
    document.getElementById('app-content').classList.remove('hidden');
    
    // Populate header & footer details
    updateMesaHeader();
    
    // Fetch menu and load app
    fetchMenu();
    renderCategories();
    renderProducts();
    updateCartUI();
    
    // If there is an active order ID, check and start tracking
    if (state.activeOrderId) {
      startOrderTracking(state.activeOrderId);
    }
  } else {
    // Show login modal
    document.getElementById('login-modal').classList.remove('hidden');
    document.getElementById('app-content').classList.add('hidden');
  }
  
  // Setup event listeners
  setupEventListeners();
  
  // Monitor localStorage updates from cashier in other tabs
  window.addEventListener('storage', (e) => {
    if (e.key === 'sonic_pizzas_menu_pizzas' || e.key === 'sonic_pizzas_menu_drinks') {
      fetchMenu();
      renderCategories();
      renderProducts();
    }
    if (e.key === 'sonic_pizzas_orders' && state.activeOrderId) {
      pollActiveOrder(state.activeOrderId);
    }
  });
}

function setupEventListeners() {
  // Login form submit
  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const tableVal = document.getElementById('table-input').value.trim();
    const nameVal = document.getElementById('name-input').value.trim();
    
    if (tableVal) {
      state.tableNumber = tableVal;
      state.customerName = nameVal;
      
      localStorage.setItem('tableNumber', tableVal);
      localStorage.setItem('customerName', nameVal);
      
      document.getElementById('login-modal').classList.add('hidden');
      document.getElementById('app-content').classList.remove('hidden');
      
      updateMesaHeader();
      
      fetchMenu();
      renderCategories();
      renderProducts();
      updateCartUI();
    }
  });

  // Customize modal quantity adjusters
  document.getElementById('qty-minus').addEventListener('click', () => {
    if (state.qty > 1) {
      state.qty--;
      updateModalQtyDisplay();
    }
  });
  
  document.getElementById('qty-plus').addEventListener('click', () => {
    state.qty++;
    updateModalQtyDisplay();
  });
  
  // Half & Half checkbox change
  document.getElementById('half-half-checkbox').addEventListener('change', (e) => {
    state.isHalfHalf = e.target.checked;
    
    const sabor2Container = document.getElementById('sabor2-container');
    const sabor1Label = document.getElementById('sabor1-label');
    
    if (state.isHalfHalf) {
      sabor2Container.classList.remove('hidden');
      sabor1Label.textContent = 'Escolha o Primeiro Sabor (Metade)';
    } else {
      sabor2Container.classList.add('hidden');
      sabor1Label.textContent = 'Escolha o Sabor';
    }
    
    updateModalPriceCalc();
  });
  
  // Modal sabor Select dropdowns change
  document.getElementById('sabor1-select').addEventListener('change', (e) => {
    state.flavor1Id = e.target.value;
    updateModalPriceCalc();
  });
  
  document.getElementById('sabor2-select').addEventListener('change', (e) => {
    state.flavor2Id = e.target.value;
    updateModalPriceCalc();
  });
  
  // Add to cart button
  document.getElementById('add-to-cart-btn').addEventListener('click', () => {
    addItemToCart();
  });
  
  // Close customize modal
  document.getElementById('close-modal-btn').addEventListener('click', () => {
    document.getElementById('custom-modal').classList.add('hidden');
  });
  
  // Close tracker overlay
  document.getElementById('close-tracker-btn').addEventListener('click', () => {
    document.getElementById('tracker-overlay').classList.add('hidden');
  });
  
  // Track button header click (re-opens tracker overlay)
  document.getElementById('track-order-btn').addEventListener('click', () => {
    if (state.activeOrderId) {
      document.getElementById('tracker-overlay').classList.remove('hidden');
    }
  });
  
  // New order button tracker click
  document.getElementById('tracker-new-order-btn').addEventListener('click', () => {
    stopOrderTracking();
    state.activeOrderId = null;
    state.activeOrder = null;
    localStorage.removeItem('activeOrderId');
    document.getElementById('track-order-btn').classList.add('hidden');
    document.getElementById('tracker-overlay').classList.add('hidden');
  });
  
  // Cart submit button click
  document.getElementById('submit-order-btn').addEventListener('click', () => {
    submitOrder();
  });
  
  // Mobile cart drawer toggling
  document.getElementById('mobile-cart-trigger').addEventListener('click', () => {
    document.getElementById('cart-sidebar').classList.remove('translate-x-full');
  });
  
  document.getElementById('close-cart-btn').addEventListener('click', () => {
    document.getElementById('cart-sidebar').classList.add('translate-x-full');
  });
}

function updateMesaHeader() {
  const mesaText = `Mesa ${state.tableNumber.padStart(2, '0')}`;
  document.getElementById('mesa-indicator').textContent = mesaText;
  document.getElementById('footer-table-desc').textContent = `Terminal Identificado: MESA-${state.tableNumber.padStart(2, '0')}-QR`;
  
  // Set customer name into the cart customer field as default
  if (state.customerName) {
    document.getElementById('cart-customer-name').value = state.customerName;
  }
}

// Load products menu from local storage database
function fetchMenu() {
  state.pizzas = getLocalPizzas();
  state.drinks = getLocalDrinks();
}

// Render dynamic categories listing
function renderCategories() {
  const sidebarList = document.getElementById('category-sidebar-list');
  const mobileTabs = document.querySelector('.overflow-x-auto');
  
  sidebarList.innerHTML = '';
  mobileTabs.innerHTML = '';
  
  CATEGORIES.forEach(cat => {
    const isActive = state.selectedCategory === cat.id;
    
    // Sidebar button (Desktop)
    const sideBtn = document.createElement('button');
    sideBtn.className = `flex items-center justify-between w-full p-3.5 rounded-xl font-bold transition-all text-sm cursor-pointer ${
      isActive 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
        : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
    }`;
    
    // Calculate category item counts
    let count = 0;
    if (cat.id === 'bebida') {
      count = state.drinks.length;
    } else {
      count = state.pizzas.filter(p => p.category === cat.id).length;
    }
    
    sideBtn.innerHTML = `
      <span>${cat.label}</span>
      <span class="text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-blue-500/50 text-white' : 'bg-slate-100 text-slate-500 font-bold'}">${count}</span>
    `;
    sideBtn.onclick = () => {
      state.selectedCategory = cat.id;
      renderCategories();
      renderProducts();
    };
    sidebarList.appendChild(sideBtn);
    
    // Mobile Tab (Horizontal scroll)
    const tabBtn = document.createElement('button');
    tabBtn.className = `px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
      isActive 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'bg-slate-50 text-slate-600 border border-slate-200/80 hover:bg-slate-100'
    }`;
    tabBtn.textContent = cat.label;
    tabBtn.onclick = () => {
      state.selectedCategory = cat.id;
      renderCategories();
      renderProducts();
    };
    mobileTabs.appendChild(tabBtn);
  });
  
  // Re-run Lucide Icons rendering on added buttons
  lucide.createIcons();
}

// Render product cards inside grid
function renderProducts() {
  const grid = document.getElementById('product-grid');
  grid.innerHTML = '';
  
  let list = [];
  if (state.selectedCategory === 'bebida') {
    list = state.drinks;
  } else {
    list = state.pizzas.filter(p => p.category === state.selectedCategory);
  }
  
  if (list.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-16 text-center text-slate-400">
        <i data-lucide="info" class="w-10 h-10 mx-auto stroke-1.5 mb-2 text-slate-300"></i>
        <p class="font-bold text-sm">Nenhum item disponível nesta categoria</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }
  
  list.forEach(item => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col group hover:shadow-xl transition-all cursor-pointer animate-fade-in';
    
    // Build price text
    let priceText = '';
    if (item.category === 'bebida') {
      priceText = `R$ ${item.price.toFixed(2)}`;
    } else {
      // Find lowest pizza size price (Brotinho)
      priceText = `A partir de R$ ${item.prices.Brotinho.toFixed(2)}`;
    }
    
    // Popular tag
    const popularTag = item.popular 
      ? '<span class="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-black uppercase px-2.5 py-1 rounded shadow-md">MAIS VENDIDA</span>' 
      : '';
      
    card.innerHTML = `
      <div class="h-44 relative overflow-hidden bg-slate-100">
        <img 
          src="${item.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60'}" 
          alt="${item.name}" 
          referrerPolicy="no-referrer"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        ${popularTag}
        <span class="absolute bottom-3 right-3 bg-white/95 text-slate-950 font-display font-bold text-[11px] px-2.5 py-1 rounded-lg backdrop-blur-xs shadow-sm">
          ${priceText}
        </span>
      </div>
      <div class="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 class="text-base font-black text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">${item.name}</h3>
          <p class="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">${item.description || 'Ingredientes selecionados e massa artesanal fresca.'}</p>
        </div>
        <div class="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
          <span class="text-xs font-bold text-slate-400">Ver opções</span>
          <button class="bg-blue-600 group-hover:bg-blue-700 text-white w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all group-active:scale-95">
            <i data-lucide="plus" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    `;
    
    card.onclick = () => {
      openCustomizationModal(item);
    };
    
    grid.appendChild(card);
  });
  
  lucide.createIcons();
}

// Open Customize Modal
function openCustomizationModal(product) {
  state.selectedProduct = product;
  state.qty = 1;
  state.isHalfHalf = false;
  
  const modal = document.getElementById('custom-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalProdName = document.getElementById('modal-product-name');
  const modalProdDesc = document.getElementById('modal-product-desc');
  const modalImage = document.getElementById('modal-product-image');
  
  modalTitle.textContent = product.category === 'bebida' ? 'Adicionar Bebida' : 'Customizar Pizza';
  modalProdName.textContent = product.name;
  modalProdDesc.textContent = product.description || '';
  modalImage.src = product.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60';
  
  // Reset notes
  document.getElementById('item-notes-input').value = '';
  
  const sizeSection = document.getElementById('pizza-size-section');
  const halfHalfSection = document.getElementById('half-half-section');
  const flavorsSection = document.getElementById('flavors-selection-section');
  
  if (product.category === 'bebida') {
    // Drink options
    sizeSection.classList.add('hidden');
    halfHalfSection.classList.add('hidden');
    flavorsSection.classList.add('hidden');
    
    state.selectedSize = 'Unico';
  } else {
    // Pizza options
    sizeSection.classList.remove('hidden');
    halfHalfSection.classList.remove('hidden');
    flavorsSection.classList.remove('hidden');
    
    // Default size is Grande
    state.selectedSize = 'Grande';
    state.flavor1Id = product.id;
    state.flavor2Id = product.id;
    
    // Render size buttons
    renderSizeOptions(product);
    
    // Uncheck and reset half & half toggle
    const checkbox = document.getElementById('half-half-checkbox');
    checkbox.checked = false;
    document.getElementById('sabor2-container').classList.add('hidden');
    document.getElementById('sabor1-label').textContent = 'Escolha o Sabor';
    
    // Populate dropdown selects (only other pizzas in same category)
    populateSaborSelects(product.category);
  }
  
  updateModalQtyDisplay();
  updateModalPriceCalc();
  
  // Show modal
  modal.classList.remove('hidden');
}

// Render size options buttons
function renderSizeOptions(pizza) {
  const container = document.getElementById('size-options-grid');
  container.innerHTML = '';
  
  const sizes = ['Brotinho', 'Média', 'Grande', 'Gigante'];
  sizes.forEach(sz => {
    const isSelected = state.selectedSize === sz;
    const price = pizza.prices[sz];
    
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `p-3 rounded-xl border font-bold text-center flex flex-col justify-center items-center transition-all cursor-pointer ${
      isSelected 
        ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-600/10' 
        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
    }`;
    btn.innerHTML = `
      <span class="text-xs font-black uppercase tracking-wider">${sz}</span>
      <span class="text-[11px] text-slate-400 mt-1 font-semibold">R$ ${price.toFixed(2)}</span>
    `;
    
    btn.onclick = () => {
      state.selectedSize = sz;
      renderSizeOptions(pizza);
      
      // Update half-half eligibility (Only Grande and Gigante allow half-half)
      const halfHalfSection = document.getElementById('half-half-section');
      if (sz === 'Grande' || sz === 'Gigante') {
        halfHalfSection.classList.remove('hidden');
      } else {
        halfHalfSection.classList.add('hidden');
        
        // Turn off half half if active
        state.isHalfHalf = false;
        document.getElementById('half-half-checkbox').checked = false;
        document.getElementById('sabor2-container').classList.add('hidden');
        document.getElementById('sabor1-label').textContent = 'Escolha o Sabor';
      }
      
      updateModalPriceCalc();
    };
    
    container.appendChild(btn);
  });
}

// Populate sabor selector dropdowns
function populateSaborSelects(category) {
  const s1 = document.getElementById('sabor1-select');
  const s2 = document.getElementById('sabor2-select');
  
  s1.innerHTML = '';
  s2.innerHTML = '';
  
  // Filter pizzas in same category
  const filtered = state.pizzas.filter(p => p.category === category);
  
  filtered.forEach(p => {
    const opt1 = document.createElement('option');
    opt1.value = p.id;
    opt1.textContent = `${p.name} - R$ ${p.prices[state.selectedSize].toFixed(2)}`;
    if (p.id === state.selectedProduct.id) opt1.selected = true;
    s1.appendChild(opt1);
    
    const opt2 = document.createElement('option');
    opt2.value = p.id;
    opt2.textContent = `${p.name} - R$ ${p.prices[state.selectedSize].toFixed(2)}`;
    if (p.id === state.selectedProduct.id) opt2.selected = true;
    s2.appendChild(opt2);
  });
}

// Dynamic modal price updating
function updateModalPriceCalc() {
  if (!state.selectedProduct) return;
  
  let unitPrice = 0;
  if (state.selectedProduct.category === 'bebida') {
    unitPrice = state.selectedProduct.price;
  } else {
    // Pizza
    const p1 = state.pizzas.find(p => p.id === state.flavor1Id);
    const p2 = state.pizzas.find(p => p.id === state.flavor2Id);
    
    if (state.isHalfHalf && p1 && p2) {
      const price1 = p1.prices[state.selectedSize];
      const price2 = p2.prices[state.selectedSize];
      unitPrice = (price1 + price2) / 2; // Average arithmetic price
    } else if (p1) {
      unitPrice = p1.prices[state.selectedSize];
    }
  }
  
  const totalPrice = unitPrice * state.qty;
  document.getElementById('modal-price-calc').textContent = `R$ ${totalPrice.toFixed(2)}`;
}

// Update modal quantity display
function updateModalQtyDisplay() {
  document.getElementById('qty-value').textContent = state.qty;
  updateModalPriceCalc();
}

// Add item to cart array
function addItemToCart() {
  if (!state.selectedProduct) return;
  
  const p = state.selectedProduct;
  const noteVal = document.getElementById('item-notes-input').value.trim();
  
  let cartItem = {
    id: `item-${Math.random().toString(36).substring(2, 9)}`,
    type: p.category === 'bebida' ? 'bebida' : 'pizza',
    name: '',
    quantity: state.qty,
    unitPrice: 0,
    totalPrice: 0,
    notes: noteVal
  };
  
  if (p.category === 'bebida') {
    cartItem.name = p.name;
    cartItem.unitPrice = p.price;
    cartItem.totalPrice = p.price * state.qty;
    cartItem.flavor1 = p; // preserve structure
  } else {
    // Pizza
    const p1 = state.pizzas.find(fl => fl.id === state.flavor1Id);
    const p2 = state.pizzas.find(fl => fl.id === state.flavor2Id);
    
    cartItem.size = state.selectedSize;
    cartItem.flavor1 = p1;
    
    if (state.isHalfHalf && p1 && p2 && p1.id !== p2.id) {
      cartItem.name = `Meio ${p1.name} / Meio ${p2.name}`;
      cartItem.flavor2 = p2;
      cartItem.unitPrice = (p1.prices[state.selectedSize] + p2.prices[state.selectedSize]) / 2;
    } else {
      cartItem.name = p1 ? p1.name : p.name;
      cartItem.unitPrice = p1 ? p1.prices[state.selectedSize] : p.prices[state.selectedSize];
    }
    
    cartItem.totalPrice = cartItem.unitPrice * state.qty;
  }
  
  // Check if identical item is already in cart to merge quantities
  const existingIndex = state.cart.findIndex(c => {
    const sameType = c.type === cartItem.type;
    const sameName = c.name === cartItem.name;
    const sameSize = c.size === cartItem.size;
    const sameFlavor1 = c.flavor1?.id === cartItem.flavor1?.id;
    const sameFlavor2 = c.flavor2?.id === cartItem.flavor2?.id;
    const sameNotes = c.notes === cartItem.notes;
    return sameType && sameName && sameSize && sameFlavor1 && sameFlavor2 && sameNotes;
  });
  
  if (existingIndex !== -1) {
    state.cart[existingIndex].quantity += cartItem.quantity;
    state.cart[existingIndex].totalPrice = state.cart[existingIndex].quantity * state.cart[existingIndex].unitPrice;
  } else {
    state.cart.push(cartItem);
  }
  
  // Close modal and update cart UI
  document.getElementById('custom-modal').classList.add('hidden');
  updateCartUI();
  
  // Slide cart open on desktop/mobile for confirmation feedback
  document.getElementById('cart-sidebar').classList.remove('translate-x-full');
}

// Update Cart side drawer view
function updateCartUI() {
  const listContainer = document.getElementById('cart-items-list');
  const countIndicator = document.getElementById('cart-count');
  const badgeCount = document.getElementById('mobile-cart-badge');
  const subtotalText = document.getElementById('cart-subtotal');
  const serviceText = document.getElementById('cart-service');
  const totalText = document.getElementById('cart-total');
  const submitBtn = document.getElementById('submit-order-btn');
  
  listContainer.innerHTML = '';
  
  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  countIndicator.textContent = `(${String(totalItems).padStart(2, '0')})`;
  badgeCount.textContent = totalItems;
  
  if (state.cart.length === 0) {
    listContainer.innerHTML = `
      <div class="h-full flex flex-col items-center justify-center text-slate-400 py-12 text-center">
        <i data-lucide="shopping-bag" class="w-12 h-12 stroke-1.5 mb-3 text-slate-300"></i>
        <p class="text-sm font-bold">Seu carrinho está vazio</p>
        <p class="text-xs text-slate-400 mt-1">Toque em um item para começar</p>
      </div>
    `;
    subtotalText.textContent = 'R$ 0,00';
    serviceText.textContent = 'R$ 0,00';
    totalText.textContent = 'R$ 0,00';
    submitBtn.disabled = true;
    
    lucide.createIcons();
    return;
  }
  
  // Calculate pricing
  const subtotal = state.cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const serviceFee = subtotal * 0.10;
  const grandTotal = subtotal + serviceFee;
  
  subtotalText.textContent = `R$ ${subtotal.toFixed(2)}`;
  serviceText.textContent = `R$ ${serviceFee.toFixed(2)}`;
  totalText.textContent = `R$ ${grandTotal.toFixed(2)}`;
  submitBtn.disabled = false;
  
  // Render cart rows
  state.cart.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'flex gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-150 animate-fade-in relative group/row';
    
    let subtitle = '';
    let notesText = item.notes ? `<p class="text-[10px] text-amber-600 font-medium italic mt-1">Nota: "${item.notes}"</p>` : '';
    
    if (item.type === 'pizza') {
      subtitle = `Tamanho ${item.size}`;
    } else {
      subtitle = 'Gelada';
    }
    
    row.innerHTML = `
      <div class="flex-1">
        <p class="text-xs font-black text-slate-800 leading-tight">${item.quantity}x ${item.name}</p>
        <p class="text-[10px] text-slate-400 font-bold mt-0.5">${subtitle}</p>
        ${notesText}
        <div class="flex items-center gap-2 mt-2">
          <button class="cart-row-dec w-6 h-6 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-500 font-black flex items-center justify-center text-xs active:scale-95 cursor-pointer">-</button>
          <span class="text-xs font-bold text-slate-700 w-4 text-center">${item.quantity}</span>
          <button class="cart-row-inc w-6 h-6 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-500 font-black flex items-center justify-center text-xs active:scale-95 cursor-pointer">+</button>
        </div>
      </div>
      <div class="flex flex-col items-end justify-between">
        <p class="text-xs font-black text-slate-800">R$ ${item.totalPrice.toFixed(2)}</p>
        <button class="cart-row-remove p-1 text-slate-300 hover:text-red-500 transition-colors cursor-pointer mt-2" title="Remover item">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
    `;
    
    // Wire row controllers
    row.querySelector('.cart-row-dec').onclick = () => {
      if (item.quantity > 1) {
        item.quantity--;
        item.totalPrice = item.quantity * item.unitPrice;
      } else {
        state.cart.splice(index, 1);
      }
      updateCartUI();
    };
    
    row.querySelector('.cart-row-inc').onclick = () => {
      item.quantity++;
      item.totalPrice = item.quantity * item.unitPrice;
      updateCartUI();
    };
    
    row.querySelector('.cart-row-remove').onclick = () => {
      state.cart.splice(index, 1);
      updateCartUI();
    };
    
    listContainer.appendChild(row);
  });
  
  lucide.createIcons();
}

// Submit Order to Local Database in localStorage
function submitOrder() {
  if (state.cart.length === 0) return;
  
  const submitBtn = document.getElementById('submit-order-btn');
  const initialText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i data-lucide="loader" class="w-4 h-4 animate-spin"></i><span>Enviando...</span>';
  lucide.createIcons();
  
  const customerNameInput = document.getElementById('cart-customer-name').value.trim();
  const orderNotesInput = document.getElementById('cart-notes').value.trim();
  
  const total = state.cart.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const serviceFee = total * 0.10;
  const finalTotal = total + serviceFee;

  const newOrder = {
    id: `SNC-${Math.floor(1000 + Math.random() * 9000)}`,
    tableNumber: String(state.tableNumber),
    customerName: customerNameInput || state.customerName || 'Cliente',
    items: state.cart.map(item => ({
      id: item.id,
      type: item.type,
      name: item.name,
      size: item.size || 'Unico',
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      notes: item.notes || ''
    })),
    status: 'pendente',
    createdAt: new Date().toISOString(),
    total: finalTotal,
    notes: orderNotesInput || ''
  };
  
  setTimeout(() => {
    // Save to LocalStorage DB
    saveLocalOrder(newOrder);
    
    state.cart = [];
    document.getElementById('cart-notes').value = '';
    
    // Save active order ID
    state.activeOrderId = newOrder.id;
    localStorage.setItem('activeOrderId', newOrder.id);
    
    updateCartUI();
    
    // Start tracking
    startOrderTracking(newOrder.id);
    
    // Open tracking overlay
    document.getElementById('tracker-overlay').classList.remove('hidden');
    
    // Close mobile drawer if open
    document.getElementById('cart-sidebar').classList.add('translate-x-full');

    submitBtn.innerHTML = initialText;
    submitBtn.disabled = false;
    lucide.createIcons();
  }, 800);
}

// Start tracking loop
function startOrderTracking(orderId) {
  // Show "Acompanhar" header button
  document.getElementById('track-order-btn').classList.remove('hidden');
  
  // Clear any existing poll
  if (trackerPollInterval) clearInterval(trackerPollInterval);
  
  // Immediate poll
  pollActiveOrder(orderId);
  
  // Poll local storage every 3 seconds for fast response
  trackerPollInterval = setInterval(() => {
    pollActiveOrder(orderId);
  }, 3000);
}

function stopOrderTracking() {
  if (trackerPollInterval) {
    clearInterval(trackerPollInterval);
    trackerPollInterval = null;
  }
}

// Load active order status from local database in localStorage
function pollActiveOrder(orderId) {
  const currentOrders = getLocalOrders();
  const activeOrder = currentOrders.find(o => o.id === orderId);
  
  if (activeOrder) {
    state.activeOrder = activeOrder;
    updateTrackerUI(activeOrder);
  }
}

// Update Tracker visual components
function updateTrackerUI(order) {
  document.getElementById('track-order-id').textContent = order.id;
  document.getElementById('track-table-num').textContent = `Mesa ${order.tableNumber.padStart(2, '0')}`;
  
  const bar = document.getElementById('tracker-progress-bar');
  const pStep = document.getElementById('step-pendente');
  const prepStep = document.getElementById('step-preparando');
  const readyStep = document.getElementById('step-pronto');
  const delStep = document.getElementById('step-entregue');
  
  const statusTitle = document.getElementById('tracker-status-title');
  const statusMsg = document.getElementById('tracker-status-msg');
  const iconBox = document.querySelector('#tracker-status-box div i');
  
  // Reset step classes
  const steps = [pStep, prepStep, readyStep, delStep];
  steps.forEach(s => {
    s.className = 'w-8 h-8 rounded-full bg-slate-100 border border-slate-200 shadow flex items-center justify-center text-slate-500 font-bold text-xs transition-all duration-300';
  });
  
  let percentage = 0;
  
  if (order.status === 'pendente') {
    percentage = 0;
    pStep.className = 'w-8 h-8 rounded-full bg-amber-500 text-white font-black text-xs border-2 border-white ring-4 ring-amber-500/20 shadow-md flex items-center justify-center';
    
    statusTitle.textContent = 'Pedido Recebido!';
    statusMsg.textContent = 'Seu pedido foi registrado e está na fila para a cozinha.';
    iconBox.setAttribute('data-lucide', 'clipboard-list');
  } 
  else if (order.status === 'preparando') {
    percentage = 33;
    pStep.className = prepStep.className = 'w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs border-2 border-white ring-4 ring-blue-500/20 shadow-md flex items-center justify-center';
    
    statusTitle.textContent = 'Na Cozinha!';
    statusMsg.textContent = 'O chef já está preparando a sua pizza no forno a lenha!';
    iconBox.setAttribute('data-lucide', 'chef-hat');
  } 
  else if (order.status === 'pronto') {
    percentage = 66;
    pStep.className = prepStep.className = readyStep.className = 'w-8 h-8 rounded-full bg-purple-600 text-white font-black text-xs border-2 border-white ring-4 ring-purple-500/20 shadow-md flex items-center justify-center';
    
    statusTitle.textContent = 'Pronto para Servir!';
    statusMsg.textContent = 'Sua pizza saiu do forno! O garçom está levando até a sua mesa.';
    iconBox.setAttribute('data-lucide', 'bell-ring');
  } 
  else if (order.status === 'entregue' || order.status === 'pago') {
    percentage = 100;
    steps.forEach(s => {
      s.className = 'w-8 h-8 rounded-full bg-green-600 text-white font-black text-xs border-2 border-white ring-4 ring-green-500/20 shadow-md flex items-center justify-center';
    });
    
    statusTitle.textContent = 'Pedido Entregue!';
    statusMsg.textContent = 'Bom apetite! Se precisar de algo mais, basta adicionar novos itens.';
    iconBox.setAttribute('data-lucide', 'check-check');
  } 
  else if (order.status === 'cancelado') {
    percentage = 0;
    statusTitle.textContent = 'Pedido Cancelado';
    statusMsg.textContent = 'Este pedido foi cancelado pelo caixa da pizzaria. Entre em contato com a gerência.';
    iconBox.setAttribute('data-lucide', 'ban');
  }
  
  bar.style.width = `${percentage}%`;
  
  // Update tracking item summary rows
  const itemsContainer = document.getElementById('tracker-items-list');
  itemsContainer.innerHTML = '';
  
  order.items.forEach(item => {
    const row = document.createElement('div');
    row.className = 'py-3 flex justify-between text-xs font-semibold text-slate-700 border-b border-slate-50';
    
    let sub = item.size && item.size !== 'Unico' ? ` (${item.size})` : '';
    let itemNotes = item.notes ? `<p class="text-[10px] text-slate-400 font-medium italic mt-0.5">"${item.notes}"</p>` : '';
    
    row.innerHTML = `
      <div>
        <p class="font-black text-slate-800">${item.quantity}x ${item.name}${sub}</p>
        ${itemNotes}
      </div>
      <p class="font-black text-slate-900">R$ ${item.totalPrice.toFixed(2)}</p>
    `;
    itemsContainer.appendChild(row);
  });
  
  lucide.createIcons();
}

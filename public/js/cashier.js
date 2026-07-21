// Sonic Pizzas - Cashier Panel App Logic (Pure JS - Local-first)

// State management
let cashierState = {
  orders: [],
  pizzas: [],
  drinks: [],
  stats: {
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    popularFlavors: []
  },
  
  activeTab: 'orders', // orders, stats, menu
  ordersFilter: 'all', // all, pendente, preparando, pronto, entregue, pago
  menuTypeFilter: 'pizzas', // pizzas, drinks
  
  pin: '' // Temporary PIN input
};

// Poll timer reference
let cashierPollInterval = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initCashier();
});

function initCashier() {
  // Check if session already authorized
  const isAuth = sessionStorage.getItem('cashierAuth') === 'true';
  
  if (isAuth) {
    document.getElementById('auth-panel').classList.add('hidden');
    document.getElementById('cashier-content').classList.remove('hidden');
    startCashierDashboard();
  } else {
    document.getElementById('auth-panel').classList.remove('hidden');
    document.getElementById('cashier-content').classList.add('hidden');
    setupPinKeypad();
  }
  
  setupGlobalEvents();
  
  // Real-time clock in cashier header
  setInterval(() => {
    const clk = document.getElementById('current-time-placeholder');
    if (clk) {
      clk.textContent = new Date().toLocaleTimeString('pt-BR');
    }
  }, 1000);

  // Monitor localStorage updates from customer in other tabs
  window.addEventListener('storage', (e) => {
    if (e.key === 'sonic_pizzas_orders' || e.key === 'sonic_pizzas_menu_pizzas' || e.key === 'sonic_pizzas_menu_drinks') {
      refreshAllDashboardData();
    }
  });
}

// ---------------------------------------------
// 1. PIN PASSWORD LOCK LOGIC
// ---------------------------------------------
function setupPinKeypad() {
  const keys = document.querySelectorAll('.keypad-btn');
  const clearBtn = document.getElementById('keypad-clear');
  const okBtn = document.getElementById('keypad-ok');
  
  keys.forEach(btn => {
    btn.onclick = () => {
      if (cashierState.pin.length < 4) {
        cashierState.pin += btn.textContent.trim();
        updatePinDots();
        
        // Auto-submit on 4th digit
        if (cashierState.pin.length === 4) {
          setTimeout(verifyPin, 150);
        }
      }
    };
  });
  
  clearBtn.onclick = () => {
    cashierState.pin = '';
    updatePinDots();
    hidePinError();
  };
  
  okBtn.onclick = () => {
    verifyPin();
  };
}

function updatePinDots() {
  const dots = [
    document.getElementById('pin-dot-1'),
    document.getElementById('pin-dot-2'),
    document.getElementById('pin-dot-3'),
    document.getElementById('pin-dot-4')
  ];
  
  dots.forEach((dot, index) => {
    if (index < cashierState.pin.length) {
      dot.className = 'w-3.5 h-3.5 rounded-full bg-blue-600 border border-blue-600 transition-all scale-110';
    } else {
      dot.className = 'w-3.5 h-3.5 rounded-full border border-slate-700 bg-transparent transition-all';
    }
  });
}

function verifyPin() {
  if (cashierState.pin === '1234') {
    // Correct PIN!
    sessionStorage.setItem('cashierAuth', 'true');
    document.getElementById('auth-panel').classList.add('hidden');
    document.getElementById('cashier-content').classList.remove('hidden');
    hidePinError();
    startCashierDashboard();
  } else {
    // Incorrect
    showPinError();
    cashierState.pin = '';
    updatePinDots();
  }
}

function showPinError() {
  const err = document.getElementById('error-msg');
  err.textContent = 'PIN Incorreto! Digite 1234.';
  err.className = 'h-5 text-xs text-red-500 font-bold text-center transition-all opacity-100';
}

// Hide Pin error
function hidePinError() {
  const err = document.getElementById('error-msg');
  err.className = 'h-5 text-xs text-red-500 font-bold text-center transition-all opacity-0';
}

// ---------------------------------------------
// 2. DASHBOARD LIFECYCLE & POLLING
// ---------------------------------------------
function startCashierDashboard() {
  // Initial draw
  refreshAllDashboardData();
  
  // Set real-time refresh polling (every 3 seconds)
  if (cashierPollInterval) clearInterval(cashierPollInterval);
  cashierPollInterval = setInterval(() => {
    refreshAllDashboardData();
  }, 3000);
}

function refreshAllDashboardData() {
  fetchOrders();
  fetchStats();
  fetchMenu();
  renderActiveView();
}

function fetchOrders() {
  let data = localStorage.getItem('sonic_pizzas_orders');
  if (!data) {
    cashierState.orders = [];
  } else {
    cashierState.orders = JSON.parse(data);
  }
}

function fetchStats() {
  const list = cashierState.orders;
  const totalOrders = list.length;
  const pendingOrders = list.filter(o => o.status === 'pendente' || o.status === 'preparando').length;
  const totalRevenue = list.filter(o => o.status === 'pago').reduce((sum, o) => sum + o.total, 0);

  // Compute sold flavor tallies
  const flavorCounts = {};
  list.forEach(o => {
    if (o.status !== 'cancelado') {
      o.items.forEach(item => {
        if (item.type === 'pizza') {
          const names = item.name.split(' / ');
          names.forEach(n => {
            const rawName = n.replace(/^Meio /, '');
            flavorCounts[rawName] = (flavorCounts[rawName] || 0) + (item.quantity * (names.length > 1 ? 0.5 : 1));
          });
        }
      });
    }
  });

  const popularFlavors = Object.entries(flavorCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  cashierState.stats = {
    totalOrders,
    pendingOrders,
    totalRevenue,
    popularFlavors
  };
}

function fetchMenu() {
  let pizzasData = localStorage.getItem('sonic_pizzas_menu_pizzas');
  let drinksData = localStorage.getItem('sonic_pizzas_menu_drinks');
  
  cashierState.pizzas = pizzasData ? JSON.parse(pizzasData) : [];
  cashierState.drinks = drinksData ? JSON.parse(drinksData) : [];
}

function renderActiveView() {
  if (cashierState.activeTab === 'orders') {
    renderOrdersTab();
  } else if (cashierState.activeTab === 'stats') {
    renderStatsTab();
  } else if (cashierState.activeTab === 'menu') {
    renderMenuTab();
  }
}

// ---------------------------------------------
// 3. TABS RENDERERS
// ---------------------------------------------

// A. ORDERS QUEUE TAB
function renderOrdersTab() {
  const grid = document.getElementById('orders-list-grid');
  grid.innerHTML = '';
  
  // Filter list
  let list = cashierState.orders;
  if (cashierState.ordersFilter !== 'all') {
    list = cashierState.orders.filter(o => o.status === cashierState.ordersFilter);
  }
  
  document.getElementById('orders-count-indicator').textContent = `Mostrando ${list.length} pedido(s)`;
  
  if (list.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-16 text-center text-slate-500">
        <i data-lucide="package-open" class="w-12 h-12 mx-auto stroke-1 text-slate-600 mb-3"></i>
        <p class="font-bold text-sm">Fila limpa! Nenhum pedido encontrado neste filtro.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }
  
  list.forEach(order => {
    const card = document.createElement('div');
    card.className = 'bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between shadow-lg hover:border-slate-700 transition-all animate-fade-in';
    
    // Status badges styling
    let statusBadge = '';
    let actionButtons = '';
    
    if (order.status === 'pendente') {
      statusBadge = '<span class="bg-amber-950/50 text-amber-400 border border-amber-900/40 text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider">Pendente</span>';
      actionButtons = `
        <button class="action-next flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-xs uppercase cursor-pointer transition-all">Iniciar Cozinha</button>
        <button class="action-cancel bg-slate-800 hover:bg-red-950/50 hover:text-red-400 border border-slate-700 hover:border-red-900/30 text-slate-400 font-bold p-2 rounded-xl text-xs uppercase cursor-pointer transition-all" title="Cancelar Pedido"><i data-lucide="ban" class="w-4 h-4"></i></button>
      `;
    } 
    else if (order.status === 'preparando') {
      statusBadge = '<span class="bg-blue-950/60 text-blue-400 border border-blue-900/40 text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider animate-pulse">Cozinhando</span>';
      actionButtons = `
        <button class="action-next flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-xl text-xs uppercase cursor-pointer transition-all">Pronto para Garçom</button>
        <button class="action-cancel bg-slate-800 hover:bg-red-950/50 hover:text-red-400 border border-slate-700 hover:border-red-900/30 text-slate-400 font-bold p-2 rounded-xl text-xs uppercase cursor-pointer transition-all" title="Cancelar Pedido"><i data-lucide="ban" class="w-4 h-4"></i></button>
      `;
    } 
    else if (order.status === 'pronto') {
      statusBadge = '<span class="bg-purple-950/50 text-purple-400 border border-purple-900/40 text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider">Pronto</span>';
      actionButtons = `
        <button class="action-next flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-xl text-xs uppercase cursor-pointer transition-all">Confirmar Entrega</button>
      `;
    } 
    else if (order.status === 'entregue') {
      statusBadge = '<span class="bg-green-950/50 text-green-400 border border-green-900/40 text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider">Entregue</span>';
      actionButtons = `
        <button class="action-next flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs uppercase cursor-pointer transition-all">Fechar Conta (Pago)</button>
      `;
    } 
    else if (order.status === 'pago') {
      statusBadge = '<span class="bg-emerald-950/50 text-emerald-400 border border-emerald-900/40 text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider">Pago</span>';
      actionButtons = `<p class="text-[10px] text-slate-500 font-bold text-center w-full uppercase py-1">Conta encerrada & arquivada</p>`;
    } 
    else if (order.status === 'cancelado') {
      statusBadge = '<span class="bg-red-950/50 text-red-400 border border-red-900/40 text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider">Cancelado</span>';
      actionButtons = `<p class="text-[10px] text-red-500/50 font-bold text-center w-full uppercase py-1">Pedido desativado</p>`;
    }
    
    // Items content
    let itemsRows = '';
    order.items.forEach(item => {
      let flavorSub = item.size && item.size !== 'Unico' ? ` <span class="text-[10px] text-slate-500">(${item.size})</span>` : '';
      let notes = item.notes ? `<p class="text-[10px] text-amber-500 font-medium italic pl-4 mt-0.5">"${item.notes}"</p>` : '';
      
      itemsRows += `
        <div class="py-1.5 border-b border-slate-800/40 last:border-0">
          <p class="text-xs text-slate-300 font-bold"><span class="text-blue-400 font-black">${item.quantity}x</span> ${item.name}${flavorSub}</p>
          ${notes}
        </div>
      `;
    });
    
    // General order notes block
    let generalNotes = order.notes 
      ? `<div class="mt-3 p-2 bg-amber-950/10 border border-amber-900/20 text-amber-500/80 rounded-lg text-[10px] font-semibold leading-relaxed">OBS: "${order.notes}"</div>` 
      : '';
      
    // Format timestamp
    const date = new Date(order.createdAt);
    const timeText = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    
    card.innerHTML = `
      <div>
        <!-- Card Header Info -->
        <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div>
            <span class="text-[10px] text-slate-500 font-black tracking-widest uppercase block">MESA ${order.tableNumber.padStart(2, '0')}</span>
            <h4 class="text-xs text-slate-400 font-bold truncate max-w-[150px] mt-0.5">${order.customerName}</h4>
          </div>
          <div class="text-right">
            <span class="text-[10px] font-mono text-slate-500 font-bold block">${order.id}</span>
            <span class="text-[10px] text-slate-500 font-semibold block mt-0.5">${timeText}</span>
          </div>
        </div>
        
        <!-- Status Indicator line -->
        <div class="mb-3 flex justify-between items-center bg-slate-950/40 px-3 py-1.5 rounded-xl border border-slate-800/40">
          <span class="text-[10px] text-slate-500 font-bold">Status:</span>
          ${statusBadge}
        </div>
        
        <!-- Order Items queue list -->
        <div class="bg-slate-950/20 p-3 rounded-2xl border border-slate-850/60 max-h-40 overflow-y-auto">
          ${itemsRows}
        </div>
        ${generalNotes}
      </div>
      
      <!-- Footer actions -->
      <div class="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
        <div class="flex flex-col">
          <span class="text-[10px] text-slate-500 font-bold uppercase leading-none">TOTAL</span>
          <span class="text-sm font-black text-white mt-1">R$ ${order.total.toFixed(2)}</span>
        </div>
        <div class="flex items-center gap-1.5 flex-1 justify-end">
          ${actionButtons}
          
          <!-- Delete absolute trash can for clean archiving -->
          <button class="action-delete p-2 bg-slate-950 hover:bg-red-950 hover:text-red-400 rounded-xl border border-slate-800/80 hover:border-red-900/30 text-slate-600 transition-colors cursor-pointer" title="Zerar / Excluir definitivamente">
            <i data-lucide="trash" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    `;
    
    // Wire Order card triggers
    const nextBtn = card.querySelector('.action-next');
    if (nextBtn) {
      nextBtn.onclick = () => {
        let nextStatus = '';
        if (order.status === 'pendente') nextStatus = 'preparando';
        else if (order.status === 'preparando') nextStatus = 'pronto';
        else if (order.status === 'pronto') nextStatus = 'entregue';
        else if (order.status === 'entregue') nextStatus = 'pago';
        
        if (nextStatus) {
          updateOrderStatus(order.id, nextStatus);
        }
      };
    }
    
    const cancelBtn = card.querySelector('.action-cancel');
    if (cancelBtn) {
      cancelBtn.onclick = () => {
        if (confirm('Tem certeza que deseja CANCELAR este pedido?')) {
          updateOrderStatus(order.id, 'cancelado');
        }
      };
    }
    
    card.querySelector('.action-delete').onclick = () => {
      if (confirm(`Deseja EXCLUIR permanentemente o pedido ${order.id}?`)) {
        deleteOrder(order.id);
      }
    };
    
    grid.appendChild(card);
  });
  
  lucide.createIcons();
}

// B. ANALYTICS / STATS TAB
function renderStatsTab() {
  document.getElementById('stat-total-orders').textContent = cashierState.stats.totalOrders;
  document.getElementById('stat-pending-orders').textContent = cashierState.stats.pendingOrders;
  document.getElementById('stat-revenue').textContent = `R$ ${cashierState.stats.totalRevenue.toFixed(2)}`;
  
  const chart = document.getElementById('popular-flavors-chart');
  chart.innerHTML = '';
  
  const list = cashierState.stats.popularFlavors || [];
  
  if (list.length === 0) {
    chart.innerHTML = `
      <p class="text-xs text-slate-500 py-8 text-center font-semibold">Nenhum pedido de pizza concluído ou pago para computar estatísticas de vendas.</p>
    `;
    return;
  }
  
  // Find max count to scale widths proportional
  const maxCount = Math.max(...list.map(f => f.count));
  
  list.forEach(flavor => {
    const percentWidth = maxCount > 0 ? (flavor.count / maxCount) * 100 : 0;
    
    const row = document.createElement('div');
    row.className = 'space-y-1.5 animate-fade-in';
    row.innerHTML = `
      <div class="flex justify-between items-center text-xs font-bold text-slate-300">
        <span>${flavor.name}</span>
        <span class="text-slate-500">${flavor.count} un. vendidos</span>
      </div>
      <div class="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
        <div class="h-full bg-blue-600 rounded-full" style="width: ${percentWidth}%"></div>
      </div>
    `;
    chart.appendChild(row);
  });
}

// C. CARDAPIO MANAGER TAB
function renderMenuTab() {
  const container = document.getElementById('menu-items-table');
  container.innerHTML = '';
  
  let list = [];
  if (cashierState.menuTypeFilter === 'pizzas') {
    list = cashierState.pizzas;
  } else {
    list = cashierState.drinks;
  }
  
  if (list.length === 0) {
    container.innerHTML = `
      <p class="text-xs text-slate-500 py-8 text-center font-bold">Nenhum item cadastrado nesta categoria de cardápio.</p>
    `;
    return;
  }
  
  list.forEach(item => {
    const card = document.createElement('div');
    card.className = 'bg-slate-900 border border-slate-800 rounded-2xl p-4 flex gap-4 items-center justify-between shadow hover:border-slate-700 transition-all animate-fade-in';
    
    let priceSub = '';
    if (cashierState.menuTypeFilter === 'pizzas') {
      priceSub = `Brotinho: R$ ${item.prices.Brotinho.toFixed(0)} | Média: R$ ${item.prices.Média.toFixed(0)} | Grande: R$ ${item.prices.Grande.toFixed(0)} | Gigante: R$ ${item.prices.Gigante.toFixed(0)}`;
    } else {
      priceSub = `Preço Único: R$ ${item.price.toFixed(2)}`;
    }
    
    const catLabel = item.category ? `<span class="text-[9px] bg-slate-800 text-slate-400 font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">${item.category}</span>` : '';
    const tagPopular = item.popular ? `<span class="text-[9px] bg-red-950 text-red-400 font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-red-900/20">MAIS VENDIDO</span>` : '';
    
    card.innerHTML = `
      <div class="flex gap-4 items-center overflow-hidden">
        <img 
          src="${item.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60'}" 
          alt="${item.name}" 
          class="w-14 h-14 object-cover rounded-xl border border-slate-800 shrink-0"
        />
        <div class="min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <h4 class="font-bold text-white text-sm truncate max-w-[200px] sm:max-w-xs leading-none">${item.name}</h4>
            ${catLabel}
            ${tagPopular}
          </div>
          <p class="text-xs font-semibold text-slate-500 mt-1.5 leading-none">${priceSub}</p>
        </div>
      </div>
      
      <button class="edit-menu-item-btn px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-750 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1">
        <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
        <span>Editar</span>
      </button>
    `;
    
    card.querySelector('.edit-menu-item-btn').onclick = () => {
      openMenuItemModal(item, cashierState.menuTypeFilter === 'pizzas' ? 'pizza' : 'drink');
    };
    
    container.appendChild(card);
  });
  
  lucide.createIcons();
}

// ---------------------------------------------
// 4. LOCAL DATABASE MUTATION METHODS
// ---------------------------------------------
function updateOrderStatus(orderId, status) {
  const currentOrders = cashierState.orders;
  const idx = currentOrders.findIndex(o => o.id === orderId);
  if (idx !== -1) {
    currentOrders[idx].status = status;
    localStorage.setItem('sonic_pizzas_orders', JSON.stringify(currentOrders));
    refreshAllDashboardData();
  }
}

function deleteOrder(orderId) {
  const currentOrders = cashierState.orders;
  const idx = currentOrders.findIndex(o => o.id === orderId);
  if (idx !== -1) {
    currentOrders.splice(idx, 1);
    localStorage.setItem('sonic_pizzas_orders', JSON.stringify(currentOrders));
    refreshAllDashboardData();
  }
}

// ---------------------------------------------
// 5. GLOBAL TAB & CONTROL ACTIONS
// ---------------------------------------------
function setupGlobalEvents() {
  // Navigation Tabs listeners
  const btnOrders = document.getElementById('tab-btn-orders');
  const btnStats = document.getElementById('tab-btn-stats');
  const btnMenu = document.getElementById('tab-btn-menu');
  
  const vOrders = document.getElementById('view-orders');
  const vStats = document.getElementById('view-stats');
  const vMenu = document.getElementById('view-menu');
  
  const tabBtns = [btnOrders, btnStats, btnMenu];
  const tabViews = [vOrders, vStats, vMenu];
  
  function switchTab(targetId, targetBtn) {
    tabBtns.forEach(b => {
      b.className = 'tab-btn px-4 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer';
    });
    targetBtn.className = 'tab-btn px-4 py-2 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer';
    
    tabViews.forEach(v => v.classList.add('hidden'));
    document.getElementById(targetId).classList.remove('hidden');
    
    cashierState.activeTab = targetId.replace('view-', '');
    renderActiveView();
  }
  
  btnOrders.onclick = () => switchTab('view-orders', btnOrders);
  btnStats.onclick = () => switchTab('view-stats', btnStats);
  btnMenu.onclick = () => switchTab('view-menu', btnMenu);
  
  // Order Status Queue filters
  const filterBtns = document.querySelectorAll('#order-filters-container button');
  filterBtns.forEach(btn => {
    btn.onclick = () => {
      filterBtns.forEach(b => {
        b.className = 'filter-btn px-3 py-1.5 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 rounded-lg text-xs font-bold transition-all cursor-pointer';
      });
      btn.className = 'filter-btn px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold transition-all cursor-pointer';
      cashierState.ordersFilter = btn.getAttribute('data-filter');
      renderOrdersTab();
    };
  });
  
  // Menu Category manager subtabs
  const menuSubtabs = document.querySelectorAll('#menu-type-filters button');
  menuSubtabs.forEach(btn => {
    btn.onclick = () => {
      menuSubtabs.forEach(b => {
        b.className = 'menu-type-btn px-4 py-2 bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg text-xs font-bold transition-all cursor-pointer';
      });
      btn.className = 'menu-type-btn px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold transition-all cursor-pointer';
      cashierState.menuTypeFilter = btn.getAttribute('data-type');
      renderMenuTab();
    };
  });
  
  // Reset Menu click
  document.getElementById('reset-menu-btn').onclick = () => {
    if (confirm('Atenção: Isso irá resetar todos os produtos do cardápio e preços de volta para as configurações iniciais do Sonic Pizzas. Continuar?')) {
      localStorage.removeItem('sonic_pizzas_menu_pizzas');
      localStorage.removeItem('sonic_pizzas_menu_drinks');
      alert('Cardápio restaurado com sucesso para os valores padrão!');
      refreshAllDashboardData();
    }
  };
  
  // Clear orders click
  document.getElementById('clear-orders-btn').onclick = () => {
    if (confirm('Atenção: Isso irá EXCLUIR TODOS os pedidos registrados no painel do caixa e zerar as estatísticas. Deseja prosseguir?')) {
      localStorage.setItem('sonic_pizzas_orders', JSON.stringify([]));
      alert('Painel de pedidos zerado com sucesso!');
      refreshAllDashboardData();
    }
  };
  
  // Logout action
  document.getElementById('logout-btn').onclick = () => {
    if (confirm('Deseja realmente sair do painel do caixa?')) {
      sessionStorage.removeItem('cashierAuth');
      if (cashierPollInterval) clearInterval(cashierPollInterval);
      window.location.reload();
    }
  };
  
  // ---------------------------------------------
  // 6. MENU ITEM ADD/EDIT MODAL FORMS
  // ---------------------------------------------
  const menuModal = document.getElementById('menu-item-modal');
  const closeMenuModalBtn = document.getElementById('close-menu-modal-btn');
  const itemForm = document.getElementById('menu-item-form');
  
  closeMenuModalBtn.onclick = () => {
    menuModal.classList.add('hidden');
  };
  
  // Add product button click
  document.getElementById('add-menu-item-btn').onclick = () => {
    openMenuItemModal(null, cashierState.menuTypeFilter === 'pizzas' ? 'pizza' : 'drink');
  };
  
  // Submit add/edit item
  itemForm.onsubmit = (e) => {
    e.preventDefault();
    
    const itemId = document.getElementById('form-item-id').value;
    const itemType = document.getElementById('form-item-type').value;
    const nameVal = document.getElementById('form-item-name').value.trim();
    const descVal = document.getElementById('form-item-desc').value.trim();
    const imageVal = document.getElementById('form-item-image').value.trim();
    
    let targetId = itemId || nameVal.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    let payload = {
      id: targetId,
      name: nameVal,
      image: imageVal || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60'
    };
    
    if (itemType === 'pizza') {
      payload.description = descVal;
      payload.category = document.getElementById('form-item-category').value;
      payload.popular = document.getElementById('form-item-popular').checked;
      
      payload.prices = {
        Brotinho: parseFloat(document.getElementById('price-brotinho').value) || 0,
        Média: parseFloat(document.getElementById('price-media').value) || 0,
        Grande: parseFloat(document.getElementById('price-grande').value) || 0,
        Gigante: parseFloat(document.getElementById('price-gigante').value) || 0
      };

      let list = cashierState.pizzas;
      const idx = list.findIndex(p => p.id === targetId);
      if (idx !== -1) {
        list[idx] = payload;
      } else {
        list.push(payload);
      }
      localStorage.setItem('sonic_pizzas_menu_pizzas', JSON.stringify(list));
    } else {
      payload.price = parseFloat(document.getElementById('price-drink').value) || 0;
      payload.category = 'bebida';

      let list = cashierState.drinks;
      const idx = list.findIndex(d => d.id === targetId);
      if (idx !== -1) {
        list[idx] = payload;
      } else {
        list.push(payload);
      }
      localStorage.setItem('sonic_pizzas_menu_drinks', JSON.stringify(list));
    }
    
    menuModal.classList.add('hidden');
    refreshAllDashboardData();
  };
}

function openMenuItemModal(item, type) {
  const modal = document.getElementById('menu-item-modal');
  const title = document.getElementById('menu-modal-title');
  const typeInput = document.getElementById('form-item-type');
  const idInput = document.getElementById('form-item-id');
  
  typeInput.value = type;
  
  const descField = document.getElementById('form-field-desc');
  const catField = document.getElementById('form-field-category');
  const popularField = document.getElementById('form-field-popular');
  const pizzaPricesField = document.getElementById('form-pizza-prices');
  const drinkPriceField = document.getElementById('form-drink-price');
  
  // Clear inputs
  document.getElementById('form-item-name').value = '';
  document.getElementById('form-item-desc').value = '';
  document.getElementById('form-item-image').value = '';
  document.getElementById('form-item-popular').checked = false;
  
  document.getElementById('price-brotinho').value = '';
  document.getElementById('price-media').value = '';
  document.getElementById('price-grande').value = '';
  document.getElementById('price-gigante').value = '';
  document.getElementById('price-drink').value = '';
  
  if (type === 'pizza') {
    title.textContent = item ? 'Editar Pizza' : 'Adicionar Nova Pizza';
    
    descField.classList.remove('hidden');
    catField.classList.remove('hidden');
    popularField.classList.remove('hidden');
    pizzaPricesField.classList.remove('hidden');
    drinkPriceField.classList.add('hidden');
    
    if (item) {
      idInput.value = item.id;
      document.getElementById('form-item-name').value = item.name;
      document.getElementById('form-item-desc').value = item.description || '';
      document.getElementById('form-item-image').value = item.image || '';
      document.getElementById('form-item-category').value = item.category || 'salgada';
      document.getElementById('form-item-popular').checked = !!item.popular;
      
      document.getElementById('price-brotinho').value = item.prices.Brotinho;
      document.getElementById('price-media').value = item.prices.Média;
      document.getElementById('price-grande').value = item.prices.Grande;
      document.getElementById('price-gigante').value = item.prices.Gigante;
    } else {
      idInput.value = '';
    }
  } else {
    title.textContent = item ? 'Editar Bebida' : 'Adicionar Nova Bebida';
    
    descField.classList.add('hidden');
    catField.classList.add('hidden');
    popularField.classList.add('hidden');
    pizzaPricesField.classList.add('hidden');
    drinkPriceField.classList.remove('hidden');
    
    if (item) {
      idInput.value = item.id;
      document.getElementById('form-item-name').value = item.name;
      document.getElementById('form-item-image').value = item.image || '';
      document.getElementById('price-drink').value = item.price;
    } else {
      idInput.value = '';
    }
  }
  
  modal.classList.remove('hidden');
}

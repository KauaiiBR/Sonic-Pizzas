import express from 'express';
import path from 'path';

// Initial Menu Catalog Defaults (Restorable)
const INITIAL_PIZZA_FLAVORS = [
  {
    id: 'calabresa',
    name: 'Calabresa Classica',
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

const INITIAL_DRINKS = [
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

// App initialization
const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database State
let menuPizzas = [...INITIAL_PIZZA_FLAVORS];
let menuDrinks = [...INITIAL_DRINKS];
let orders = [
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
        name: 'Calabresa Classica',
        size: 'Grande',
        flavor1: INITIAL_PIZZA_FLAVORS[0],
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
  },
  {
    id: 'SNC-3910',
    tableNumber: '2',
    customerName: 'Maria Antônia',
    status: 'pendente',
    createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    items: [
      {
        id: 'item-3',
        type: 'pizza',
        name: 'Meio Margherita Du Chef / Meio Quatro Queijos Nobres',
        size: 'Gigante',
        flavor1: INITIAL_PIZZA_FLAVORS[2],
        flavor2: INITIAL_PIZZA_FLAVORS[4],
        quantity: 1,
        unitPrice: 76.00,
        totalPrice: 76.00
      },
      {
        id: 'item-4',
        type: 'bebida',
        name: 'Suco de Laranja Natural 500ml',
        quantity: 2,
        unitPrice: 9.50,
        totalPrice: 19.00,
        notes: 'Sem gelo'
      }
    ],
    total: 95.00
  }
];

// ---------------------------------------------
// REST API BACKEND ROUTES
// ---------------------------------------------

// API: Get entire menu
app.get('/api/menu', (req, res) => {
  res.json({ pizzas: menuPizzas, drinks: menuDrinks });
});

// API: Add/Edit Pizza
app.post('/api/menu/pizzas', (req, res) => {
  const pizza = req.body;
  if (!pizza.id) {
    pizza.id = pizza.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  const idx = menuPizzas.findIndex(p => p.id === pizza.id);
  if (idx !== -1) {
    menuPizzas[idx] = pizza;
  } else {
    menuPizzas.push(pizza);
  }
  res.json({ success: true, pizzas: menuPizzas });
});

// API: Add/Edit Drink
app.post('/api/menu/drinks', (req, res) => {
  const drink = req.body;
  if (!drink.id) {
    drink.id = drink.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  const idx = menuDrinks.findIndex(d => d.id === drink.id);
  if (idx !== -1) {
    menuDrinks[idx] = drink;
  } else {
    menuDrinks.push(drink);
  }
  res.json({ success: true, drinks: menuDrinks });
});

// API: Reset Menu Defaults
app.post('/api/menu/reset', (req, res) => {
  menuPizzas = [...INITIAL_PIZZA_FLAVORS];
  menuDrinks = [...INITIAL_DRINKS];
  res.json({ success: true, pizzas: menuPizzas, drinks: menuDrinks });
});

// API: Get all orders
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// API: Place new customer order
app.post('/api/orders', (req, res) => {
  try {
    const { tableNumber, customerName, items, notes } = req.body;

    if (!tableNumber || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Dados de pedido inválidos.' });
    }

    const total = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    const serviceFee = total * 0.10;
    const finalTotal = total + serviceFee;

    const newOrder = {
      id: `SNC-${Math.floor(1000 + Math.random() * 9000)}`,
      tableNumber: String(tableNumber),
      customerName: customerName || 'Cliente',
      items,
      status: 'pendente',
      createdAt: new Date().toISOString(),
      total: finalTotal,
      notes: notes || ''
    };

    orders.unshift(newOrder); // Prepend to top
    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao registrar pedido.' });
  }
});

// API: Update order status
app.patch('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pendente', 'preparando', 'pronto', 'entregue', 'pago', 'cancelado'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Status inválido.' });
  }

  const order = orders.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ error: 'Pedido não encontrado.' });
  }

  order.status = status;
  res.json({ success: true, order });
});

// API: Delete order
app.delete('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const idx = orders.findIndex(o => o.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Pedido não encontrado.' });
  }
  orders.splice(idx, 1);
  res.json({ success: true });
});

// API: Reset / Clear active orders queue
app.post('/api/orders/clear-all', (req, res) => {
  orders = [];
  res.json({ success: true, orders });
});

// API: Calculate stats summaries
app.get('/api/stats', (req, res) => {
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pendente' || o.status === 'preparando').length;
  const totalRevenue = orders.filter(o => o.status === 'pago').reduce((sum, o) => sum + o.total, 0);

  // Compute sold flavor tallies
  const flavorCounts = {};
  orders.forEach(o => {
    // Only count completed/paid/active orders (skip cancelled)
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

  res.json({
    totalOrders,
    pendingOrders,
    totalRevenue,
    popularFlavors
  });
});

// ---------------------------------------------
// STATIC FILE SERVING WITH ROUTE SHORTCUTS
// ---------------------------------------------

// Direct mappings for cashier routes (Isolation from clients)
app.get('/caixa', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'cashier.html'));
});

app.get('/cashier', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'cashier.html'));
});

// Serve standard client files from public folder
app.use(express.static(path.join(process.cwd(), 'public')));

// Catch all remaining client-side routing to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// Start listening
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Sonic Pizzas] Pure JS Server active on http://0.0.0.0:${PORT}`);
});

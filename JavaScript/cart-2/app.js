// Estado global del carrito guardado en memoria y sincronizado con localStorage.
const state = {
  cart: [],
  products: [
    {
      id: 'p1',
      name: 'Auriculares inalámbricos',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1511376777868-611b54f68947?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'p2',
      name: 'Laptop portátil',
      price: 1199.0,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'p3',
      name: 'Mochila de viaje',
      price: 54.5,
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'p4',
      name: 'Smartwatch deportivo',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=600&q=80',
    },
  ],
};

// Referencias al DOM que se actualizan cuando cambia el estado.
const productListElement = document.getElementById('productList');
const cartItemsElement = document.getElementById('cartItems');
const cartCountElement = document.getElementById('cartCount');
const cartSubtotalElement = document.getElementById('cartSubtotal');
const cartTotalElement = document.getElementById('cartTotal');
const clearCartButton = document.getElementById('clearCartButton');

// Carga el carrito desde localStorage y valida su formato.
function loadCart() {
  try {
    const savedCart = localStorage.getItem('shoppingCart');
    if (!savedCart) return;

    const parsed = JSON.parse(savedCart);
    if (!Array.isArray(parsed)) return;

    state.cart = parsed.map((item) => ({
      id: String(item.id),
      name: String(item.name),
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
      image: String(item.image),
    }));
  } catch (error) {
    console.warn('No se pudo cargar el carrito desde localStorage:', error);
    state.cart = [];
  }
}

// Guarda el carrito actual en localStorage.
function saveCart() {
  try {
    localStorage.setItem('shoppingCart', JSON.stringify(state.cart));
  } catch (error) {
    console.warn('No se pudo guardar el carrito en localStorage:', error);
  }
}

// Calcula el subtotal, formato de moneda US dollar.
function calculateTotal() {
  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return {
    subtotal,
    total: subtotal,
  };
}

// Agrega un producto al carrito o aumenta su cantidad si ya existe.
function addToCart(productId) {
  const product = state.products.find((item) => item.id === productId);
  if (!product) return;

  const existingItem = state.cart.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }

  saveCart();
  renderCart();
}

// Elimina un producto del carrito por su id.
function removeFromCart(productId) {
  state.cart = state.cart.filter((item) => item.id !== productId);
  saveCart();
  renderCart();
}

// Ajusta la cantidad de un artículo en el carrito sin permitir valores negativos.
function updateQuantity(productId, change) {
  const item = state.cart.find((product) => product.id === productId);
  if (!item) return;

  const nextQuantity = item.quantity + change;
  if (nextQuantity <= 0) {
    return;
  }

  item.quantity = nextQuantity;
  saveCart();
  renderCart();
}

// Crea el DOM para la lista de productos.
function renderProducts() {
  productListElement.innerHTML = '';

  state.products.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'card';

    const image = document.createElement('img');
    image.src = product.image;
    image.alt = product.name;
    image.className = 'card__image';

    const content = document.createElement('div');
    content.className = 'card__content';

    const title = document.createElement('h3');
    title.className = 'card__title';
    title.textContent = product.name;

    const price = document.createElement('p');
    price.className = 'card__price';
    price.textContent = `$${product.price.toFixed(2)}`;

    const button = document.createElement('button');
    button.className = 'button';
    button.type = 'button';
    button.textContent = 'Agregar al carrito';
    button.addEventListener('click', () => addToCart(product.id));

    content.append(title, price, button);
    card.append(image, content);
    productListElement.appendChild(card);
  });
}

// Renderiza el carrito con sus elementos y controles.
function renderCart() {
  cartItemsElement.innerHTML = '';

  if (state.cart.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'El carrito está vacío.';
    emptyMessage.style.color = 'var(--muted)';
    cartItemsElement.appendChild(emptyMessage);
  } else {
    state.cart.forEach((item) => {
      const listItem = document.createElement('li');
      listItem.className = 'cart-item';

      const image = document.createElement('img');
      image.className = 'cart-item__image';
      image.src = item.image;
      image.alt = item.name;

      const details = document.createElement('div');
      details.className = 'cart-item__details';

      const name = document.createElement('h3');
      name.className = 'cart-item__name';
      name.textContent = item.name;

      const info = document.createElement('p');
      info.className = 'cart-item__info';
      info.textContent = `Precio unitario: $${item.price.toFixed(2)}`;

      const quantityControl = document.createElement('div');
      quantityControl.className = 'quantity-control';

      const decrease = document.createElement('button');
      decrease.type = 'button';
      decrease.textContent = '-';
      decrease.addEventListener('click', () => updateQuantity(item.id, -1));

      const quantityLabel = document.createElement('span');
      quantityLabel.textContent = item.quantity;

      const increase = document.createElement('button');
      increase.type = 'button';
      increase.textContent = '+';
      increase.addEventListener('click', () => updateQuantity(item.id, 1));

      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.className = 'button secondary';
      removeButton.textContent = 'Eliminar';
      removeButton.addEventListener('click', () => removeFromCart(item.id));

      const lineTotal = document.createElement('p');
      lineTotal.className = 'cart-item__info';
      lineTotal.textContent = `Subtotal: $${(item.price * item.quantity).toFixed(2)}`;

      quantityControl.append(decrease, quantityLabel, increase);
      details.append(name, info, quantityControl, lineTotal, removeButton);
      listItem.append(image, details);
      cartItemsElement.appendChild(listItem);
    });
  }

  const totals = calculateTotal();
  cartCountElement.textContent = String(state.cart.reduce((count, item) => count + item.quantity, 0));
  cartSubtotalElement.textContent = `$${totals.subtotal.toFixed(2)}`;
  cartTotalElement.textContent = `$${totals.total.toFixed(2)}`;
}

// Configura eventos globales como limpiar el carrito.
function attachEvents() {
  clearCartButton.addEventListener('click', () => {
    state.cart = [];
    saveCart();
    renderCart();
  });
}

// Inicializa la aplicación: carga datos, renderiza y asocia eventos.
function init() {
  loadCart();
  renderProducts();
  renderCart();
  attachEvents();
}

init();

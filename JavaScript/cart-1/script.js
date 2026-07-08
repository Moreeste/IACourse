const productList = document.getElementById('productList');
const cartItemsElement = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
const addProductForm = document.getElementById('addProductForm');
const clearCartButton = document.getElementById('clearCart');

const products = [
  { id: 'p1', name: 'Camiseta', price: 19.99 },
  { id: 'p2', name: 'Pantalones', price: 39.95 },
  { id: 'p3', name: 'Zapatos', price: 59.99 },
  { id: 'p4', name: 'Gorra', price: 14.5 }
];

const STORAGE_KEY = 'shoppingCart';
let cart = loadCart();

function formatCurrency(value) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
}

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function loadCart() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

function renderProducts() {
  productList.innerHTML = '';
  products.forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-details">
        <strong>${product.name}</strong>
        <span class="product-price">${formatCurrency(product.price)}</span>
      </div>
      <button class="button" type="button" data-id="${product.id}">Agregar</button>
    `;
    const button = card.querySelector('button');
    button.addEventListener('click', () => addToCart(product));
    productList.appendChild(card);
  });
}

function addToCart(product, quantity = 1) {
  const index = cart.findIndex(item => item.name === product.name && item.price === product.price);
  if (index >= 0) {
    cart[index].quantity += quantity;
  } else {
    cart.push({ id: product.id || Date.now().toString(), name: product.name, price: product.price, quantity });
  }
  saveCart();
  renderCart();
}

function removeFromCart(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  saveCart();
  renderCart();
}

function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}

function calculateTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderCart() {
  cartItemsElement.innerHTML = '';

  if (cart.length === 0) {
    cartItemsElement.innerHTML = '<p>El carrito está vacío.</p>';
  } else {
    cart.forEach(item => {
      const cartItem = document.createElement('article');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <div class="item-details">
          <strong>${item.name}</strong>
          <span class="item-quantity">Cantidad: ${item.quantity}</span>
          <span class="item-price">Precio unidad: ${formatCurrency(item.price)}</span>
        </div>
        <div>
          <span class="item-price">Subtotal: ${formatCurrency(item.price * item.quantity)}</span>
          <button class="button-secondary" type="button" data-id="${item.id}">Eliminar</button>
        </div>
      `;
      const removeButton = cartItem.querySelector('button');
      removeButton.addEventListener('click', () => removeFromCart(item.id));
      cartItemsElement.appendChild(cartItem);
    });
  }

  cartTotalElement.textContent = formatCurrency(calculateTotal());
}

addProductForm.addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('productName').value.trim();
  const price = parseFloat(document.getElementById('productPrice').value);
  const quantity = parseInt(document.getElementById('productQuantity').value, 10);

  if (!name || Number.isNaN(price) || price <= 0 || Number.isNaN(quantity) || quantity < 1) {
    return;
  }

  addToCart({ name, price }, quantity);
  addProductForm.reset();
  document.getElementById('productQuantity').value = '1';
});

clearCartButton.addEventListener('click', clearCart);

renderProducts();
renderCart();

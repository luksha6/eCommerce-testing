import { getCart, clearCart } from '../services/cartService.js';
import { fetchProductsForCart } from '../services/productService.js';
import { TEXT } from '../constants/text.js';
import { renderError } from '../services/uiService.js';

export async function CheckoutFragment() {
  const cart = getCart();

  if (!cart || cart.length === 0) {
    renderCheckoutContent(TEXT.checkoutTitle, TEXT.checkoutEmpty, false);
    return;
  }

  try {
    const products = await fetchProductsForCart(cart);
    if (!products || products.length === 0) {
      renderCheckoutContent(TEXT.checkoutTitle, TEXT.checkoutEmpty, false);
      return;
    }

    const { subtotal, tax, grandTotal } = calculateTotals(products, cart);
    const cartHtml = createCartTable(products, cart);
    renderCheckoutContent(
      TEXT.checkoutTitle,
      cartHtml,
      true,
      subtotal,
      tax,
      grandTotal
    );
    addCheckoutEventListener();
  } catch (error) {
    document.getElementById('app').innerHTML = renderError(TEXT.checkoutError);
  }
}

function calculateTotals(products, cart) {
  let subtotal = 0,
    tax = 0;

  products.forEach((product) => {
    const cartItem = cart.find((item) => item.id == product.id);
    const itemTotal = (product.price || 0) * (cartItem.quantity || 0);
    subtotal += itemTotal;
    tax +=
      product.category === 'jewelery' ? itemTotal * 0.25 : itemTotal * 0.15;
  });

  return { subtotal, tax, grandTotal: subtotal + tax };
}

function createCartTable(products, cart) {
  return products
    .map((product) => {
      const cartItem = cart.find((item) => item.id == product.id);
      const itemTotal = (product.price * cartItem.quantity).toFixed(2);
      return `
      <tr>
        <td>${product.title}</td>
        <td>$${product.price.toFixed(2)}</td>
        <td>${cartItem.quantity}</td>
        <td>$${itemTotal}</td>
      </tr>
    `;
    })
    .join('');
}

function renderCheckoutContent(
  title,
  content,
  showForm = false,
  subtotal = 0,
  tax = 0,
  grandTotal = 0
) {
  const summaryHtml = showForm
    ? `
    <div class="order-summary">
      <p>${TEXT.subtotal}: $${subtotal.toFixed(2)}</p>
      <p>${TEXT.tax}: $${tax.toFixed(2)}</p>
      <p><strong>${TEXT.grandTotal}: $${grandTotal.toFixed(2)}</strong></p>
    </div>
    <form id="checkout-form" class="checkout-form">
      <input type="text" id="name" placeholder="${
        TEXT.placeholderName
      }" required />
      <input type="email" id="email" placeholder="${
        TEXT.placeholderEmail
      }" required />
      <input type="text" id="address" placeholder="${
        TEXT.placeholderAddress
      }" required />
      <button type="submit" id="final-checkout">${TEXT.checkoutButton}</button>
    </form>
  `
    : '';

  document.getElementById('app').innerHTML = `
    <h1>${title}</h1>
    <div class="checkout-container">
      <table class="checkout-table">
        <thead><tr><th>${TEXT.productColumn}</th><th>${TEXT.priceColumn}</th><th>${TEXT.quantityColumn}</th><th>${TEXT.totalColumn}</th></tr></thead>
        <tbody>${content}</tbody>
      </table>
      ${summaryHtml}
    </div>
  `;
}

function addCheckoutEventListener() {
  document.getElementById('checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;

    if (name && email && address) {
      clearCart();
      window.location.href = `/thankyou?name=${encodeURIComponent(
        name
      )}&address=${encodeURIComponent(address)}`;
    } else {
      alert(TEXT.cartUpdateError);
    }
  });
}

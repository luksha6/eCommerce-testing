import { getCartCount } from './cartService.js';

export function updateCartCount() {
  const cartCount = getCartCount();
  const cartLink = document.getElementById('cart-link');
  cartLink.innerHTML = `Cart (${cartCount})`;
}

export function renderError(message) {
  return `
    <div class="error">
      <p>${message}</p>
    </div>
  `;
}

export function showLoadingBar(isLoading) {
  const loadingBar = document.getElementById('loading-bar');

  if (isLoading) {
    loadingBar.style.display = 'flex';
  } else {
    loadingBar.style.display = 'none';
  }
}

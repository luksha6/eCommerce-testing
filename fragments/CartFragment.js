import { getCart, modifyQuantity } from '../services/cartService.js';
import { fetchProductsForCart } from '../services/productService.js';
import { TEXT } from '../constants/text.js';
import { updateCartCount, renderError } from '../services/uiService.js';

export async function CartFragment() {
  try {
    const cart = getCart();
    updateCartCount();

    if (!cart || cart.length === 0) {
      renderCartContent(TEXT.cartEmptyMessage, false);
      return;
    }

    const products = await fetchProductsForCart(cart);
    if (!products || products.length === 0) {
      renderCartContent(TEXT.cartEmptyMessage, false);
      return;
    }

    const cartHtml = createCartTable(products, cart);
    renderCartContent(cartHtml, true);
    addCartEventListeners();
  } catch (error) {
    document.getElementById('app').innerHTML = renderError(TEXT.checkoutError);
    console.error('Error in CartFragment:', error);
  }
}

function createCartTable(products, cart) {
  const groupedProducts = groupProductsByCategory(products, cart);
  return Object.entries(groupedProducts)
    .map(
      ([category, items]) => `
      <h2 class="cart-category">${category}</h2>
      <table class="cart-table">
        <thead>
          <tr>
            <th>${TEXT.productColumn}</th>
            <th>${TEXT.imageColumn}</th>
            <th>${TEXT.priceColumn}</th>
            <th>${TEXT.quantityColumn}</th>
            <th>${TEXT.totalColumn}</th>
            <th>${TEXT.actionsColumn}</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(({ product, cartItem }) => {
              const itemTotal = (product.price * cartItem.quantity).toFixed(2);
              return `
              <tr>
                <td>${product.title}</td>
                <td><img src="${product.image}" alt="${
                product.title
              }" class="cart-product-image" /></td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${cartItem.quantity}</td>
                <td>$${itemTotal}</td>
                <td>
                  <button data-id="${
                    product.id
                  }" class="increase" data-quantity="${
                cartItem.quantity
              }">+</button>
                  <button data-id="${product.id}" class="decrease">-</button>
                </td>
              </tr>`;
            })
            .join('')}
        </tbody>
      </table>
    `
    )
    .join('');
}

function groupProductsByCategory(products, cart) {
  return products.reduce((grouped, product) => {
    const cartItem = cart.find((item) => item.id == product.id);
    const category = product.category || TEXT.unknownCategory;

    if (!grouped[category]) {
      grouped[category] = [];
    }

    grouped[category].push({ product, cartItem });
    return grouped;
  }, {});
}

function renderCartContent(content, showCheckoutButton) {
  document.getElementById('app').innerHTML = `
    <h1>${TEXT.cartTitle}</h1>
    <div class="cart-container">
      ${content}
      ${
        showCheckoutButton
          ? `<button id="checkout">${TEXT.checkoutButton}</button>`
          : ''
      }
    </div>
  `;
}

function addCartEventListeners() {
  document.querySelectorAll('.increase').forEach((button) => {
    button.addEventListener('click', (e) => {
      const quantity = parseInt(e.target.getAttribute('data-quantity'));
      if (quantity < 5) {
        modifyQuantity(e.target.getAttribute('data-id'), 1);
        CartFragment();
      } else {
        alert(TEXT.limitExceededMessage);
      }
    });
  });

  document.querySelectorAll('.decrease').forEach((button) => {
    button.addEventListener('click', (e) => {
      modifyQuantity(e.target.getAttribute('data-id'), -1);
      CartFragment();
    });
  });

  const checkoutButton = document.getElementById('checkout');
  if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
      const cart = getCart();
      if (cart.length > 0) {
        window.location.href = '/checkout';
      } else {
        alert(TEXT.cartEmptyMessage);
      }
    });
  }
}

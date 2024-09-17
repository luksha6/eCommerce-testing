import { addToCart, getCartCount } from '../services/cartService.js';
import { fetchProducts } from '../services/productService.js';
import { TEXT } from '../constants/text.js';
import { updateCartCount } from '../services/uiService.js';

export function ProductListFragment() {
  return `
    <div class="sorting">
      <label for="sort">${TEXT.sortByPriceLabel}</label>
      <select id="sort">
        <option value="asc">${TEXT.lowToHigh}</option>
        <option value="desc">${TEXT.highToLow}</option>
      </select>
    </div>
    <div id="product-list" class="product-grid"></div>
    <button id="continue" style="display: none;">${TEXT.continueToCartButton}</button>
  `;
}

export async function fetchProductsFragment(sortOrder = 'asc') {
  const products = await fetchProducts(sortOrder);
  displayProductsFragment(products);
}

function displayProductsFragment(products) {
  const productList = document.getElementById('product-list');

  productList.innerHTML = products
    .map((product) => {
      const title = product.title || TEXT.unknownProduct;
      const category = product.category || TEXT.unknownCategory;
      const price = product.price
        ? `$${product.price.toFixed(2)}`
        : TEXT.unknownPrice;
      const image = product.image || TEXT.placeholderImage;

      return `
      <div class="product-card">
        <img src="${image}" alt="${title}" />
        <h2>${title}</h2>
        <p>${TEXT.categoryLabel}: ${category}</p>
        <p>${TEXT.priceLabel}: ${price}</p>
        <button data-id="${product.id}" class="add-to-cart">${TEXT.addToCartButton}</button>
      </div>
    `;
    })
    .join('');

  document.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', (e) => {
      const productId = e.target.getAttribute('data-id');
      addToCart(productId);
      updateCartCount();
    });
  });
}

document.addEventListener('change', (e) => {
  if (e.target.id === 'sort') {
    const sortOrder = e.target.value;
    fetchProductsFragment(sortOrder);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
});

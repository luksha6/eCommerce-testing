import { showLoadingBar } from './uiService.js';

const API_URL = 'https://fakestoreapi.com/products';

export async function fetchProducts(sortOrder = 'asc') {
  showLoadingBar(true);

  const response = await fetch(API_URL);
  const products = await response.json();
  products.sort((a, b) =>
    sortOrder === 'desc' ? b.price - a.price : a.price - b.price
  );

  showLoadingBar(false);
  return products;
}

export async function fetchProductsForCart(cart) {
  showLoadingBar(true);

  const products = await Promise.all(
    cart.map(async (item) => {
      const response = await fetch(`${API_URL}/${item.id}`);
      return await response.json();
    })
  );

  showLoadingBar(false);
  return products;
}

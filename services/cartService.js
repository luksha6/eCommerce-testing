import storageService from './storageService.js';
import { TEXT } from '../constants/text.js';

const CART_KEY = 'cart';

export function getCart() {
  return storageService.get(CART_KEY);
}

export function addToCart(productId) {
  let cart = getCart();
  const productIndex = cart.findIndex((p) => p.id === productId);

  if (productIndex > -1) {
    if (cart[productIndex].quantity < 5) {
      cart[productIndex].quantity += 1;
    } else {
      alert(TEXT.limitExceededMessage);
    }
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  storageService.set(CART_KEY, cart);
}

export function modifyQuantity(productId, amount) {
  let cart = getCart();
  const itemIndex = cart.findIndex((p) => p.id == productId);

  if (itemIndex > -1) {
    cart[itemIndex].quantity += amount;

    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }

    storageService.set(CART_KEY, cart);
  }
}

export function getCartCount() {
  const cart = getCart();
  return cart.reduce((acc, item) => acc + item.quantity, 0);
}

export function clearCart() {
  storageService.remove(CART_KEY);
}

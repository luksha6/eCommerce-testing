import {
  ProductListFragment,
  fetchProductsFragment
} from '../fragments/ProductListFragment.js';
import { CartFragment } from '../fragments/CartFragment.js';
import { CheckoutFragment } from '../fragments/CheckoutFragment.js';
import { ThankYouFragment } from '../fragments/ThankYouFragment.js';

const errorHTML = 'Something went wrong. Please try again later!';

const renderWithData = async (fragment, containerId = 'app') => {
  try {
    const data = await fragment();
    if (data) {
      document.getElementById(containerId).innerHTML = data;
    }
  } catch {
    document.getElementById(containerId).innerHTML = errorHTML;
  }
};

const routes = {
  '/': () => {
    document.getElementById('app').innerHTML = ProductListFragment();
    fetchProductsFragment();
  },
  '/cart': () => renderWithData(CartFragment),
  '/checkout': () => renderWithData(CheckoutFragment),
  '/thankyou': () => {
    document.getElementById('app').innerHTML = ThankYouFragment();
  }
};

const router = () => {
  const path = window.location.pathname;
  const renderFragment = routes[path] || routes['/'];
  renderFragment();
};

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (e) => {
    if (e.target.matches('[data-link]')) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });
  router();
});

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

window.addEventListener('popstate', router);

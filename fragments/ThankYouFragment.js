import { TEXT } from '../constants/text.js';

export function ThankYouFragment() {
  const params = new URLSearchParams(window.location.search);
  const name = params.get('name');
  const address = params.get('address');

  if (!name) {
    return `<p>${TEXT.checkoutError}</p>`;
  }

  return `
    <h1>${TEXT.thankYouTitle}</h1>
    <div class="thank-you-fragment">
      <p>${TEXT.thankYouMessage}, <b>${name}</b>!</p>
      <p>${TEXT.thankYouShipping} <b>${address}</b>.</p>
    </div>
  `;
}

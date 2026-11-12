import { loadCSS } from '../../scripts/aem.js';
import decorateQuote from '../../shared/scripts/quote.js';

/**
 * Decorates the quote block using the locally adopted shared release.
 * @param {Element} block The block element.
 */
export default async function decorate(block) {
  await loadCSS(new URL('../../shared/styles/quote.css', import.meta.url).href);
  decorateQuote(block);
}

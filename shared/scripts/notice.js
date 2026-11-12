/**
 * Decorates the notice block.
 * @param {Element} block The block element.
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const content = document.createElement('aside');
  content.className = 'notice-content';

  cells.forEach((cell) => content.append(...cell.childNodes));
  block.replaceChildren(content);
}
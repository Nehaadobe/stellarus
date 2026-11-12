/**
 * Decorates a quotation followed by optional attribution rows.
 * @param {Element} block The authored quote block.
 */
export default function decorate(block) {
  const [quotation, ...attributions] = [...block.querySelectorAll(':scope > div > div')];
  const figure = document.createElement('figure');
  figure.className = 'quote-figure';

  if (quotation) {
    const blockquote = document.createElement('blockquote');
    blockquote.className = 'quote-quotation';
    const source = attributions.map((cell) => cell.querySelector('a[href]')).find(Boolean);
    if (source) blockquote.cite = source.href;
    blockquote.append(...quotation.childNodes);
    figure.append(blockquote);
  }

  if (attributions.length) {
    const caption = document.createElement('figcaption');
    caption.className = 'quote-attribution';
    attributions.forEach((cell) => caption.append(...cell.childNodes));
    figure.append(caption);
  }

  block.replaceChildren(figure);
}

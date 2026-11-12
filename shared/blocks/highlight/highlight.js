export default function decorate(block) {
  const content = document.createElement('div');
  content.className = 'highlight-content';
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    content.append(...cell.childNodes);
  });
  block.replaceChildren(content);
}

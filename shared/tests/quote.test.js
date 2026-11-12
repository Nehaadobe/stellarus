import { decorateBlock } from '../../scripts/aem.js';
import { loadBlock, loadSection, loadSections } from '../../scripts/block-loader.js';

async function runTests() {
  const results = document.getElementById('results');
  try {
    const blocks = [...document.querySelectorAll('.quote, .columns, .notice')];
    const strong = document.querySelector('#full strong');
    const link = document.querySelector('#full a');
    const noticeLink = document.querySelector('#notice a');
    blocks.forEach(decorateBlock);
    const section = document.querySelector('.section');
    let callbackCount = 0;
    await Promise.all([
      loadSection(section, () => { callbackCount += 1; }),
      loadSection(section),
    ]);
    await loadSections(document.querySelector('main'));

    const full = document.getElementById('full');
    const single = document.getElementById('single');
    const empty = document.getElementById('empty');
    const colorProbe = document.createElement('span');
    colorProbe.style.backgroundColor = 'var(--light-color)';
    document.body.append(colorProbe);
    const expectedNoticeColor = getComputedStyle(colorProbe).backgroundColor;
    colorProbe.remove();
    const checks = [
      ['figure structure', full.querySelector(':scope > figure > blockquote')],
      ['rich text identity', full.querySelector('blockquote strong') === strong],
      ['link identity', full.querySelector('figcaption a') === link],
      ['quotation source', full.querySelector('blockquote').cite === link.href],
      ['extra attribution row', full.querySelector('figcaption').textContent.includes('Read the employee story')],
      ['optional attribution', !single.querySelector('figcaption')],
      ['optional source', !single.querySelector('blockquote').hasAttribute('cite')],
      ['empty block', empty.querySelector('figure') && !empty.querySelector('blockquote, figcaption')],
      ['shared CSS', getComputedStyle(full.querySelector('figure')).marginTop === '0px'],
      ['all blocks loaded', blocks.every((block) => block.dataset.blockStatus === 'loaded')],
      ['local block fallback', document.getElementById('local').classList.contains('columns-2-cols')],
      ['section callback once', callbackCount === 1],
      ['all sections loaded', [...document.querySelectorAll('.section')].every((el) => el.dataset.sectionStatus === 'loaded')],
      ['shared stylesheet once', document.querySelectorAll('link[href$="/shared/blocks/quote/quote.css"]').length === 1],
      ['notice structure', document.querySelector('#notice > aside.notice-content')],
      ['notice link identity', document.querySelector('#notice > aside a') === noticeLink],
      ['empty notice', document.querySelector('#notice-empty > aside')?.childNodes.length === 0],
      ['notice shared CSS', getComputedStyle(document.querySelector('#notice > aside')).backgroundColor
        === expectedNoticeColor],
      ['shared quote update', getComputedStyle(full.querySelector('figcaption')).fontStyle === 'italic'],
    ];
    const originalFigure = full.firstElementChild;
    await Promise.all([loadBlock(full), loadBlock(full)]);
    checks.push(['loaded block is not decorated again', full.firstElementChild === originalFigure]);
    const failed = checks.filter(([, passed]) => !passed).map(([name]) => name);
    if (failed.length) throw new Error(`Failed: ${failed.join(', ')}`);
    results.dataset.status = 'passed';
    results.textContent = `${checks.length} checks passed.`;
  } catch (error) {
    results.dataset.status = 'failed';
    results.textContent = error.message;
    throw error;
  }
}

runTests();

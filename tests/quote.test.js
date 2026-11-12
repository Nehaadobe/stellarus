import { decorateBlock, loadBlock } from '../../scripts/aem.js';

async function runTests() {
  const results = document.getElementById('results');
  try {
    const blocks = [...document.querySelectorAll('.quote')];
    const strong = document.querySelector('#full strong');
    const link = document.querySelector('#full a');
    await Promise.all(blocks.map(async (block) => {
      decorateBlock(block);
      await loadBlock(block);
    }));

    const full = document.getElementById('full');
    const single = document.getElementById('single');
    const empty = document.getElementById('empty');
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
    ];
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

import createBlockLoader from '../shared/scripts/block-loader.js';

// Keep site-specific implementations and optional theme styles outside the subtree.
export const { loadBlock, loadSection, loadSections } = createBlockLoader({
  localBlocks: [],
  styles: {
    quote: new URL('../blocks/quote/quote.css', import.meta.url).href,
  },
});

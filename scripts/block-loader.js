import { loadBlock as loadLocalBlock, loadCSS, sampleRUM } from '../../scripts/aem.js';
import sharedBlocks from './block-registry.js';

/**
 * Creates a site loader with optional local implementations and theme styles.
 * @param {Object} options Site-owned overrides.
 * @returns {Object} Block and section loading functions.
 */
export default function createBlockLoader({ localBlocks = [], styles = {} } = {}) {
  const sharedNames = new Set(sharedBlocks);
  const localNames = new Set(localBlocks);
  const pendingBlocks = new WeakMap();
  const pendingSections = new WeakMap();
  const stylesheets = new Map();

  function loadStylesheet(url) {
    if (!stylesheets.has(url)) stylesheets.set(url, loadCSS(url));
    return stylesheets.get(url);
  }

  async function loadBlock(block) {
    const { blockName, blockStatus } = block.dataset;
    if (blockStatus === 'loaded') return block;
    if (!sharedNames.has(blockName) || localNames.has(blockName)) {
      return loadLocalBlock(block);
    }
    if (pendingBlocks.has(block)) return pendingBlocks.get(block);

    block.dataset.blockStatus = 'loading';
    const pending = (async () => {
      try {
        const directory = new URL(`../blocks/${blockName}/`, import.meta.url);
        const [, module] = await Promise.all([
          loadStylesheet(new URL(`${blockName}.css`, directory).href),
          import(new URL(`${blockName}.js`, directory).href),
        ]);
        if (styles[blockName]) await loadStylesheet(styles[blockName]);
        if (typeof module.default !== 'function') {
          throw new Error(`Shared block "${blockName}" has no default decorator`);
        }
        await module.default(block);
        block.dataset.blockStatus = 'loaded';
        return block;
      } catch (error) {
        block.dataset.blockStatus = 'failed';
        // eslint-disable-next-line no-console
        console.error(`Failed to load shared block "${blockName}"`, error);
        throw error;
      }
    })();
    pendingBlocks.set(block, pending);
    return pending;
  }

  async function loadSection(section, loadCallback) {
    if (section.dataset.sectionStatus === 'loaded') return;
    if (pendingSections.has(section)) {
      await pendingSections.get(section);
      return;
    }
    section.dataset.sectionStatus = 'loading';
    const pending = (async () => {
      try {
        const blocks = [...section.querySelectorAll('div.block')];
        const failures = [];
        for (let i = 0; i < blocks.length; i += 1) {
          try {
            // eslint-disable-next-line no-await-in-loop
            await loadBlock(blocks[i]);
          } catch (error) {
            failures.push(error);
          }
        }
        if (loadCallback) await loadCallback(section);
        if (failures.length) throw new Error(`${failures.length} shared block(s) failed to load`);
        section.dataset.sectionStatus = 'loaded';
      } catch (error) {
        section.dataset.sectionStatus = 'failed';
        throw error;
      } finally {
        section.style.display = null;
      }
    })();
    pendingSections.set(section, pending);
    await pending;
  }

  async function loadSections(element) {
    const sections = [...element.querySelectorAll('div.section')];
    for (let i = 0; i < sections.length; i += 1) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await loadSection(sections[i]);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to load section', error);
      }
      if (i === 0 && sampleRUM.enhance) sampleRUM.enhance();
    }
  }

  return { loadBlock, loadSection, loadSections };
}

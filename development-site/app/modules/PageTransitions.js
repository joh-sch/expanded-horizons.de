import Swup from 'swup';
import SwupGiaPlugin from '@swup/gia-plugin';
import { initLazyLoad, refreshLazyLoad } from './LazyLoad.js';

let swupInstance = null;

const syncBodyPage = () => {
  const swupContainer = document.querySelector('#swup');
  const pageId = swupContainer?.dataset.pageId;

  if (pageId) document.body.dataset.page = pageId;
};

export default function initPageTransitions(components = {}) {
  if (swupInstance) return swupInstance;
  if (!document.querySelector('#swup')) return null;

  swupInstance = new Swup({
    containers: ['#swup'],
    plugins: [new SwupGiaPlugin({ components, firstLoad: true })],
  });

  syncBodyPage();
  initLazyLoad();

  swupInstance.hooks.on('content:replace', () => {
    syncBodyPage();
    refreshLazyLoad();
  });

  return swupInstance;
}

import Swup from 'swup';
import SwupGiaPlugin from '@swup/gia-plugin';
import loadComponents from 'gia/loadComponents';
import eventbus from 'gia/eventbus';
import { initLazyLoad, refreshLazyLoad } from './LazyLoad.js';

let swupInstance = null;

const syncBodyPage = () => {
  const swupContainer = document.querySelector('#swup');
  const pageId = swupContainer?.dataset.pageId;
  const language = swupContainer?.dataset.language;

  if (pageId) document.body.dataset.page = pageId;
  if (language) {
    document.documentElement.lang = language;
    document.title = swupContainer.dataset.pageTitle || document.title;
    eventbus.emit('language:change', {
      language,
      urls: {
        de: swupContainer.dataset.languageUrlDe,
        en: swupContainer.dataset.languageUrlEn,
      },
    });
  }
};

export default function initPageTransitions(components = {}) {
  if (swupInstance) return swupInstance;
  if (!document.querySelector('#swup')) return null;

  loadComponents(components, document.body);

  swupInstance = new Swup({
    containers: ['#swup'],
    plugins: [new SwupGiaPlugin({ components, firstLoad: false })],
  });

  eventbus.on('language:navigate', ({ url }) => {
    if (url) swupInstance.navigate(url);
  });

  syncBodyPage();
  initLazyLoad();

  swupInstance.hooks.on('content:replace', () => {
    syncBodyPage();
    refreshLazyLoad();
  });

  return swupInstance;
}

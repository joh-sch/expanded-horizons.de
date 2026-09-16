import config from 'gia/config';
import initPageTransitions from './modules/PageTransitions.js';

import IntroBar from '../site/snippets/intro-bar/js/intro-bar.js';
import InfoPanel from '../site/snippets/info-panel/js/info-panel.js';
import TypoBg from '../site/snippets/typo-bg/js/typo-bg.js';
// create-comp inserts new imports here

const components = {
    'IntroBar': IntroBar,
    'InfoPanel': InfoPanel,
    'TypoBg': TypoBg,
  // create-comp inserts new registrations here
};

config.set('log', false);

document.addEventListener('DOMContentLoaded', () => {
  initPageTransitions(components);
});

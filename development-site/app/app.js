import config from 'gia/config';
import initPageTransitions from './modules/PageTransitions.js';

// create-comp inserts new imports here

const components = {
  // create-comp inserts new registrations here
};

config.set('log', false);

document.addEventListener('DOMContentLoaded', () => {
  initPageTransitions(components);
});

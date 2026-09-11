import LazyLoad from 'vanilla-lazyload';

let instance = null;

export function initLazyLoad() {
  if (instance) return instance;

  instance = new LazyLoad({
    elements_selector: '.lazy',
    thresholds: '300px',
    class_loading: 'is-loading',
    class_loaded: 'is-loaded',
    class_error: 'is-error',
    unobserve_completed: true,
  });

  return instance;
}

export function refreshLazyLoad() {
  instance?.update();
}

////// Lib. //////
//////////////////

import Component from "gia/Component";

///// Util. //////
//////////////////

function get_mousePos(e) {
  return { x: e.clientX, y: e.clientY };
}

function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

// Comp. class ///
//////////////////

export default class TypoBg_v2 extends Component {
  /////////// Constructor ////////////
  ////////////////////////////////////

  constructor(el, options) {
    super(el);

    this.ref = {
      letters: [],
    };

    this.options = {
      minWidth: 50, // 'wdth' floor for letters far from the cursor
      maxWidth: 150, // 'wdth' of the letter closest to the cursor
      radiusFactor: 3, // influence radius = average letter width * radiusFactor
      ease: 0.18, // per-frame lerp factor toward the target width (0-1)
      ...options,
    };

    this.letters = []; // { el, baseVar, baseWidth, centerX, currentWidth }
    this.radius = 0;
    this.mouseX = null;
    this.rafId = null;

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleResize = this.measure.bind(this);
    this.tick = this.tick.bind(this);
  }

  ////////////// Mount ///////////////
  ////////////////////////////////////

  mount() {
    this.init();
  }

  ///////////// Unmount //////////////
  ////////////////////////////////////

  unmount() {
    window.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseleave", this.handleMouseLeave);
    window.removeEventListener("resize", this.handleResize);

    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  ////////////// Init. ///////////////
  ////////////////////////////////////

  /// Base init. ///
  //////////////////

  init() {
    this.measure();

    // Positions can shift once the variable font finishes loading.
    document.fonts?.ready?.then(() => this.measure());

    window.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("mouseleave", this.handleMouseLeave);
    window.addEventListener("resize", this.handleResize);

    this.rafId = requestAnimationFrame(this.tick);
  }

  // Geometry ///////
  ///////////////////

  measure() {
    this.letters = this.ref.letters.map((el) => {
      const rect = el.getBoundingClientRect();
      const baseVar = el.style.getPropertyValue("--var");
      const baseWidth = this.readWidth(baseVar) ?? this.options.maxWidth;
      const existing = this.letters.find((letter) => letter.el === el);

      return {
        el,
        baseVar,
        baseWidth,
        width: rect.width,
        centerX: rect.left + rect.width / 2,
        currentWidth: existing?.currentWidth ?? baseWidth,
      };
    });

    const avgWidth = this.letters.reduce((sum, letter) => sum + letter.width, 0) / (this.letters.length || 1);

    this.radius = avgWidth * this.options.radiusFactor;
  }

  readWidth(varString) {
    const match = varString?.match(/'wdth'\s*([-\d.]+)/);

    return match ? parseFloat(match[1]) : null;
  }

  // Event hdls. ///
  //////////////////

  handleMouseMove(e) {
    this.mouseX = get_mousePos(e).x;
  }

  handleMouseLeave() {
    this.mouseX = null;
  }

  /////////////// Loop ///////////////
  ////////////////////////////////////

  tick() {
    const { minWidth, maxWidth, ease } = this.options;

    this.letters.forEach((letter) => {
      let target = letter.baseWidth;

      if (this.mouseX !== null && this.radius > 0) {
        // Inverted parabola: 1 at the cursor, falling to 0 at `radius`.
        const distance = Math.abs(this.mouseX - letter.centerX);
        const t = clamp01(1 - (distance / this.radius) ** 2);

        target = minWidth + t * (maxWidth - minWidth);
      }

      letter.currentWidth += (target - letter.currentWidth) * ease;
      letter.el.style.setProperty(
        "--var",
        letter.baseVar.replace(/'wdth'\s*[-\d.]+/, `'wdth' ${letter.currentWidth.toFixed(1)}`)
      );
    });

    this.rafId = requestAnimationFrame(this.tick);
  }
}

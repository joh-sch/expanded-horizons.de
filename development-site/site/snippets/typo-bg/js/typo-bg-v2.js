////// Lib. //////
//////////////////

import Component from "gia/Component";
import eventbus from "gia/eventbus";

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
      minWidth: 50, // 'wdth' floor for letters far from the mapped cursor position
      maxWidth: 150, // 'wdth' of the letter under the mapped cursor position
      radiusFactor: 2, // influence radius = average letter spacing * radiusFactor
      ease: 0.18, // per-frame lerp factor toward the target width (0-1)
      ...options,
    };

    this.letters = []; // { el, baseVar, baseWidth, centerX, currentWidth, rowMinX, rowMaxX, radius }
    this.mouseX = null;
    this.rafId = null;
    this.isFrozen = false;

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
    eventbus.off("infoPanel:change", this.handleInfoPanelChange);

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

    this.setState({ enabled: true });
    this.init_eventbus();
  }

  /// Ev.b. init. ///
  //////////////////

  init_eventbus() {
    this.handleInfoPanelChange = this.handleInfoPanelChange.bind(this);
    eventbus.on("infoPanel:change", this.handleInfoPanelChange);
  }

  // Geometry ///////
  ///////////////////

  // Letters are grouped per row (shared parent element) so the mouse's
  // fractional position across the viewport maps onto that row's own
  // first-to-last letter span, independently of where the row sits on screen.
  measure() {
    const previous = this.letters;

    const letters = this.ref.letters.map((el) => {
      const rect = el.getBoundingClientRect();
      const baseVar = el.style.getPropertyValue("--var");
      const baseWidth = this.readWidth(baseVar) ?? this.options.maxWidth;
      const existing = previous.find((letter) => letter.el === el);

      return {
        el,
        baseVar,
        baseWidth,
        centerX: rect.left + rect.width / 2,
        currentWidth: existing?.currentWidth ?? baseWidth,
        row: el.parentElement,
      };
    });

    const rows = new Map();

    letters.forEach((letter) => {
      if (!rows.has(letter.row)) rows.set(letter.row, []);
      rows.get(letter.row).push(letter);
    });

    rows.forEach((rowLetters) => {
      const centers = rowLetters.map((letter) => letter.centerX).sort((a, b) => a - b);
      const rowMinX = centers[0];
      const rowMaxX = centers[centers.length - 1];

      let spacingTotal = 0;
      let spacingCount = 0;

      for (let i = 1; i < centers.length; i++) {
        const gap = centers[i] - centers[i - 1];

        if (gap > 0) {
          spacingTotal += gap;
          spacingCount += 1;
        }
      }

      const avgSpacing = spacingCount > 0 ? spacingTotal / spacingCount : 0;
      const radius = avgSpacing * this.options.radiusFactor;

      rowLetters.forEach((letter) => {
        letter.rowMinX = rowMinX;
        letter.rowMaxX = rowMaxX;
        letter.radius = radius;
      });
    });

    this.letters = letters;
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

  handleInfoPanelChange(event) {
    this.isFrozen = event.open;
  }

  /////////////// Loop ///////////////
  ////////////////////////////////////

  tick() {
    const { minWidth, maxWidth, ease } = this.options;
    const viewportWidth = window.innerWidth || 1;

    this.letters.forEach((letter) => {
      if (this.isFrozen) return; // hold the current --var values as-is

      let target = letter.baseWidth;

      if (this.mouseX !== null && letter.radius > 0) {
        // Map the mouse's position across the whole viewport onto this row's
        // own letter span, then fall off (inverted parabola) around that point.
        const fraction = clamp01(this.mouseX / viewportWidth);
        const mappedX = letter.rowMinX + fraction * (letter.rowMaxX - letter.rowMinX);
        const distance = Math.abs(mappedX - letter.centerX);
        const t = clamp01(1 - (distance / letter.radius) ** 2);

        target = minWidth + t * (maxWidth - minWidth);
      }

      letter.currentWidth += (target - letter.currentWidth) * ease;
      letter.el.style.setProperty("--var", letter.baseVar.replace(/'wdth'\s*[-\d.]+/, `'wdth' ${letter.currentWidth.toFixed(1)}`));
    });

    this.rafId = requestAnimationFrame(this.tick);
  }

  // State mgmt. //
  ////////////////////////////////////////////////

  stateChange(change) {
    console.log(change);
  }
}

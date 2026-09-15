////// Lib. //////
//////////////////

import Component from "gia/Component";
import eventbus from "gia/eventbus";
import { gsap } from "gsap";

///// Assets /////
//////////////////

// Default log styles

const defaultLogStyles = {
  default: "#6682d6",
  action: "#c7d0ff",
  event: "#97a5ce",
  warning: "#ffaf00",
  error: "#ff3232",
  success: "#00c853",
};

// Comp. class ///
//////////////////

export default class InfoPanel extends Component {
  /////////// Constructor ////////////
  ////////////////////////////////////

  constructor(el, options) {
    super(el);

    //// DOM references ////
    ////////////////////////

    this.ref = {
      backdrop: null,
      panel: null,
    };

    /////// Options ////////
    ////////////////////////

    this.options = {
      name: "InfoPanel",
      peekHeight: 56,
      ...options,
      logs: false,
      logStyles: defaultLogStyles,
    };

    // Custom event hdls. //
    ////////////////////////

    this.handleToggle = this.handleToggle.bind(this);
    this.handleBackdropClick = this.handleBackdropClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleResize = this.updateTopOffset.bind(this);
  }

  ////////////// Mount ///////////////
  ////////////////////////////////////

  mount() {
    if (this.options.logs) console.warn("Mounting:", this.options.name);
    this.init();
  }

  ///////////// Unmount //////////////
  ////////////////////////////////////

  unmount() {
    if (this.options.logs) console.warn("Unmounting:", this.options.name);

    // Eventbus listener de-registration //
    eventbus.off("infoPanel:toggle", this.handleToggle);

    // Global listener de-registration //
    document.removeEventListener("keydown", this.handleKeydown);
    window.removeEventListener("resize", this.handleResize);
  }

  ////////////// Init. ///////////////
  ////////////////////////////////////

  init() {
    this.updateTopOffset();
    gsap.set(this.ref.panel, { y: this.getClosedY() });

    this.ref.backdrop.addEventListener("click", this.handleBackdropClick);
    eventbus.on("infoPanel:toggle", this.handleToggle);
    document.addEventListener("keydown", this.handleKeydown);
    window.addEventListener("resize", this.handleResize);
  }

  // Helpers ///////
  //////////////////

  getClosedY() {
    return Math.max(this.ref.panel.offsetHeight - this.options.peekHeight, 0);
  }

  updateTopOffset() {
    const bar = document.getElementById("intro-bar");
    if (!bar) return;

    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const gap = rootFontSize * 2; // 2rem below the top bar
    const offset = bar.getBoundingClientRect().bottom + gap;

    this.ref.panel.style.setProperty("--panel-top-offset", `${offset}px`);
  }

  // Event hdls. ///
  //////////////////

  handleToggle() {
    this.setState({ open: !this.state.open });
  }

  handleBackdropClick() {
    this.setState({ open: false });
  }

  handleKeydown(event) {
    if (event.key === "Escape" && this.state.open) this.setState({ open: false });
  }

  /////////// State mgmt. ////////////
  ////////////////////////////////////

  stateChange(changes) {
    if (this.options.logs) console.log("State change:", changes);

    if ("open" in changes) {
      const open = changes.open;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      gsap.to(this.ref.panel, {
        y: open ? 0 : this.getClosedY(),
        duration: reduceMotion ? 0 : 0.5,
        ease: "power3.out",
      });

      this.ref.backdrop.classList.toggle("pointer-events-auto", open);
      this.ref.backdrop.classList.toggle("pointer-events-none", !open);

      this.ref.backdrop.setAttribute("aria-hidden", String(!open));
      this.ref.panel.setAttribute("aria-hidden", String(!open));

      eventbus.emit("infoPanel:change", { open });
    }
  }
}


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
      content: null,
    };

    /////// Options ////////
    ////////////////////////

    this.options = {
      name: "InfoPanel",
      peekHeight: 56,
      hoverLift: 16,
      ...options,
      logs: false,
      logStyles: defaultLogStyles,
    };

    this.isClosing = false;

    // Custom event hdls. //
    ////////////////////////

    this.handleToggle = this.handleToggle.bind(this);
    this.handlePeekHover = this.handlePeekHover.bind(this);
    this.handleBackdropClick = this.handleBackdropClick.bind(this);
    this.handlePanelClick = this.handlePanelClick.bind(this);
    this.handlePanelPointerEnter = this.handlePanelPointerEnter.bind(this);
    this.handlePanelPointerLeave = this.handlePanelPointerLeave.bind(this);
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
    eventbus.off("infoPanel:peek-hover", this.handlePeekHover);

    // Global listener de-registration //
    document.removeEventListener("keydown", this.handleKeydown);
    window.removeEventListener("resize", this.handleResize);
  }

  ////////////// Init. ///////////////
  ////////////////////////////////////

  init() {
    this.updateTopOffset();
    this.ref.panel.style.position = "fixed";
    this.ref.panel.style.bottom = "0";
    gsap.set(this.ref.panel, { y: this.getClosedY() });

    this.ref.backdrop.addEventListener("click", this.handleBackdropClick);
    this.ref.panel.addEventListener("click", this.handlePanelClick);
    this.ref.panel.addEventListener("pointerenter", this.handlePanelPointerEnter);
    this.ref.panel.addEventListener("pointerleave", this.handlePanelPointerLeave);
    eventbus.on("infoPanel:toggle", this.handleToggle);
    eventbus.on("infoPanel:peek-hover", this.handlePeekHover);
    document.addEventListener("keydown", this.handleKeydown);
    window.addEventListener("resize", this.handleResize);
  }

  // Helpers ///////
  //////////////////

  getClosedY() {
    return Math.max(this.ref.panel.offsetHeight - this.options.peekHeight, 0);
  }

  getOpenTop() {
    const bar = document.getElementById("intro-bar");
    const barBottom = bar?.getBoundingClientRect().bottom || 0;
    const minimumTop = barBottom + 16;

    return Math.max(minimumTop, window.innerHeight - this.ref.panel.offsetHeight);
  }

  getOffsetParentTop() {
    const offsetParent = this.ref.panel.offsetParent;

    return offsetParent ? offsetParent.getBoundingClientRect().top + window.scrollY : 0;
  }

  setOpenPosition() {
    const top = this.getOpenTop();

    this.ref.panel.style.position = "fixed";
    this.ref.panel.style.top = `${top}px`;
    this.ref.panel.style.bottom = "auto";

    return top;
  }

  movePanelIntoDocumentFlow(top) {
    const absoluteTop = window.scrollY + top - this.getOffsetParentTop();

    this.ref.panel.style.position = "absolute";
    this.ref.panel.style.top = `${absoluteTop}px`;
    this.ref.panel.style.bottom = "auto";
    this.element.style.minHeight = `${absoluteTop + this.ref.panel.offsetHeight}px`;
  }

  resetPanelToViewport() {
    const rect = this.ref.panel.getBoundingClientRect();
    const closedY = this.getClosedY();
    const viewportBottomTop = window.innerHeight - this.ref.panel.offsetHeight;

    this.ref.panel.style.position = "fixed";
    this.ref.panel.style.top = "auto";
    this.ref.panel.style.bottom = "0";
    gsap.set(this.ref.panel, { y: rect.top - viewportBottomTop });

    return closedY;
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

  handlePeekHover(event) {
    if (this.state.open || this.isClosing) return;

    gsap.to(this.ref.panel, {
      y: event.hovering ? this.getClosedY() - this.options.hoverLift : this.getClosedY(),
      duration: 0.2,
      ease: "power2.out",
    });
  }

  handleBackdropClick() {
    this.setState({ open: false });
  }

  handlePanelClick() {
    if (!this.state.open) this.setState({ open: true });
  }

  handlePanelPointerEnter() {
    this.handlePeekHover({ hovering: true });
  }

  handlePanelPointerLeave() {
    this.handlePeekHover({ hovering: false });
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

      this.isClosing = !open;

      if (open) {
        const openTop = this.setOpenPosition();

        gsap.set(this.ref.panel, { y: this.getClosedY() });
        gsap.to(this.ref.panel, {
          y: 0,
          duration: reduceMotion ? 0 : 0.5,
          ease: "power3.out",
          onComplete: () => this.movePanelIntoDocumentFlow(openTop),
        });
      } else {
        const closedY = this.resetPanelToViewport();

        gsap.to(this.ref.panel, {
          y: closedY,
          duration: reduceMotion ? 0 : 0.5,
          ease: "power3.out",
          onComplete: () => {
            this.isClosing = false;
            this.element.style.minHeight = "";
          },
        });
      }

      this.ref.backdrop.classList.toggle("pointer-events-auto", open);
      this.ref.backdrop.classList.toggle("pointer-events-none", !open);

      this.ref.backdrop.setAttribute("aria-hidden", String(!open));
      this.ref.panel.setAttribute("aria-hidden", String(!open));
      this.ref.content.classList.toggle("opacity-0", !open);
      this.ref.content.classList.toggle("opacity-100", open);

      eventbus.emit("infoPanel:change", { open });
    }
  }
}


////// Lib. //////
//////////////////

import Component from "gia/Component";
import eventbus from "gia/eventbus";

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

export default class IntroBar extends Component {
  /////////// Constructor ////////////
  ////////////////////////////////////

  constructor(el, options) {
    super(el);

    //// DOM references ////
    ////////////////////////

    this.ref = {
      toggleBtn: null,
      dots: null,
      closeLabel: null,
      langToggleBtn: null,
      langHighlight: null,
      langDe: null,
      langEn: null,
    };

    /////// Options ////////
    ////////////////////////

    this.options = {
      name: "IntroBar",
      ...options,
      logs: false,
      logStyles: defaultLogStyles,
    };

    this.toggleHoverSuppressed = false;

    // Custom event hdls. //
    ////////////////////////

    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.handleTogglePointerEnter = this.handleTogglePointerEnter.bind(this);
    this.handleTogglePointerLeave = this.handleTogglePointerLeave.bind(this);
    this.handlePanelChange = this.handlePanelChange.bind(this);
    this.handleLangToggleClick = this.handleLangToggleClick.bind(this);
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
    eventbus.off("infoPanel:change", this.handlePanelChange);
  }

  ////////////// Init. ///////////////
  ////////////////////////////////////

  init() {
    this.ref.toggleBtn.addEventListener("click", this.handleToggleClick);
    this.ref.toggleBtn.addEventListener("pointerenter", this.handleTogglePointerEnter);
    this.ref.toggleBtn.addEventListener("pointerleave", this.handleTogglePointerLeave);
    this.ref.langToggleBtn.addEventListener("click", this.handleLangToggleClick);
    eventbus.on("infoPanel:change", this.handlePanelChange);

    this.setState({ lang: "de" });
  }

  // Event hdls. ///
  //////////////////

  handleToggleClick() {
    if (this.state.open) {
      this.toggleHoverSuppressed = true;
      eventbus.emit("infoPanel:peek-hover", { hovering: false });
    }

    eventbus.emit("infoPanel:toggle");
  }

  handleTogglePointerEnter() {
    if (!this.toggleHoverSuppressed) {
      eventbus.emit("infoPanel:peek-hover", { hovering: true });
    }
  }

  handleTogglePointerLeave() {
    this.toggleHoverSuppressed = false;
    eventbus.emit("infoPanel:peek-hover", { hovering: false });
  }

  handlePanelChange(event) {
    this.setState({ open: event.open });
  }

  handleLangToggleClick() {
    this.setState({ lang: this.state.lang === "de" ? "en" : "de" });
  }

  /////////// State mgmt. ////////////
  ////////////////////////////////////

  stateChange(changes) {
    if (this.options.logs) console.log("State change:", changes);

    if ("open" in changes) {
      const open = changes.open;

      this.ref.toggleBtn.setAttribute("aria-expanded", String(open));
      this.ref.dots.classList.toggle("hidden", open);
      this.ref.closeLabel.classList.toggle("hidden", !open);
    }

    if ("lang" in changes) {
      const isEn = changes.lang === "en";

      this.ref.langToggleBtn.setAttribute("aria-pressed", String(isEn));
      this.ref.langHighlight.classList.toggle("translate-x-full", isEn);
      this.ref.langHighlight.classList.toggle("translate-x-0", !isEn);
      this.ref.langDe.classList.toggle("text-accent", !isEn);
      this.ref.langEn.classList.toggle("text-accent", isEn);
    }
  }
}


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
    };

    /////// Options ////////
    ////////////////////////

    this.options = {
      name: "IntroBar",
      ...options,
      logs: false,
      logStyles: defaultLogStyles,
    };

    // Custom event hdls. //
    ////////////////////////

    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.handlePanelChange = this.handlePanelChange.bind(this);
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
    eventbus.on("infoPanel:change", this.handlePanelChange);
  }

  // Event hdls. ///
  //////////////////

  handleToggleClick() {
    eventbus.emit("infoPanel:toggle");
  }

  handlePanelChange(event) {
    this.setState({ open: event.open });
  }

  /////////// State mgmt. ////////////
  ////////////////////////////////////

  stateChange(changes) {
    if (this.options.logs) console.log("State change:", changes);
    if ("open" in changes) this.ref.toggleBtn.setAttribute("aria-expanded", String(changes.open));
  }
}


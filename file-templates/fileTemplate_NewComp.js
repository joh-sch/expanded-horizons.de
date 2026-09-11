////// Lib. //////
//////////////////

import Component from "gia/Component";
// import eventbus from "gia/eventbus"; // NOT NEEDED ATM

///// Util. //////
//////////////////

// ...

///// Init. //////
//////////////////

// import { get_viewportState } from "../../../assets/js/init/init_viewportState";

///// Hdls. //////
//////////////////

// import ebh_window_resize from "./eventbusHandlers/ebh_window_resize.js";

// import stChH_mode from "./stateChangeHandlers/stChH_mode.js";

///// Assets /////
//////////////////

// Options with case-sensitive keys that are not to be
// automatically extracted from the options arg. but be
// assigned to an option key manually to preserve its case
// (Kirby CMS converts all fields/option keys to lowercase)
// (see constructor).

const manualOptionKeys = ["optionkey"];

//  Default values for manually extracted options
//  (see constructor, in case specific option has not been provided
//  in comp. config.).

const defaultOptions = {
  optionkey: { foo: "bar" },
};

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

export default class NewComp extends Component {
  /////////// Constructor ////////////
  ////////////////////////////////////

  constructor(el, options) {
    super(el);

    //// DOM references ////
    ////////////////////////

    this.ref = {
      someRef: [],
    };

    /////// Options ////////
    ////////////////////////

    // Get options not to be manually extracted from the options arg...
    const autoOptions = {};
    for (const key in options) if (!manualOptionKeys.includes(key)) autoOptions[key] = options[key];

    this.options = {
      name: "NewComp",
      // optionKey: options.optionkey,
      ...autoOptions,
      logs: false,
      logStyles: defaultLogStyles,
    };

    ////// Init. f() ///////
    ////////////////////////

    // this.init_breakpoints = init_breakpoints.bind(this); // DEPREC

    /////// Modules ////////
    ////////////////////////

    this.modules = {
      // ...
    };

    ///////// API //////////
    ////////////////////////

    this.api = {
      // ...
    };

    // Eventbus listeners //
    ////////////////////////

    // this.ebl_window_resize = ebh_window_resize.bind(this); // NOT NEEDED ATM

    /// State.-ch. list. ///
    ////////////////////////

    // this.stChL_mode = stChH_mode.bind(this); // NOT NEEDED ATM

    // Custom event hdls. //
    ////////////////////////

    // Note: To be passed to parent class

    // ...

    /// Pre-mount init. ////
    ////////////////////////

    // ...
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
    // eventbus.off("window_resize", this.ebl_window_resize); // NOT NEEDED ATM

    // API call de-registration //
    // ...
  }

  ////////////// Init. ///////////////
  ////////////////////////////////////

  /// Base init. ///
  //////////////////

  init() {
    // this.setState({ mode: "init" }); // NOT NEEDED ATM
    // this.init_states(); // NOT NEEDED ATM
    // this.init_breakpoints(); // DEPREC
    // this.init_eventbus(); // NOT NEEDED ATM
    // this.setState({ mode: "ready" }); // NOT NEEDED ATM
  }

  // States init. //
  //////////////////

  // NOT NEEDED ATM //
  // init_states() {
  //   this.logger("init", ["states"], "action", { eventName: "init_states", inline: true });
  //   this.setState({ features: { mouse: window.matchMedia("(pointer:fine)").matches } });
  // }

  // Events init. //
  //////////////////

  // NOT NEEDED ATM //
  // init_events() {
  //   // Listener registration //
  //   // ...

  //   // ...
  // }

  // Eventb. init. //
  ///////////////////

  // NOT NEEDED ATM //
  // init_eventbus() {
  //   this.logger("init", ["eventbus"], "action", { eventName: "init_eventbus", inline: true });

  //   // Listener registration //
  //   eventbus.on("window_resize", this.ebl_window_resize);

  //   // API call registration //
  //   // ...
  // }

  /////////// State mgmt. ////////////
  ////////////////////////////////////

  stateChange(changes) {
    if (this.options.logs) console.log("State change:", changes);
    // if ("mode" in CHANGES) this.stChL_mode(CHANGES);
  }
}

////// Doc. //////
//////////////////

// ...

////// Lib. //////
//////////////////

// ...

///// Utils. /////
//////////////////

// ...

// Event hdls. ///
//////////////////

// ...

///// Assets /////
//////////////////

const msgs = {
  start: ["init. some feature"],
  end: ["init. some feature", "init. success"],
};

// Method def. ///
//////////////////

export default function init_someFeature() {
  ///// Setup //////
  //////////////////

  // const el_comp = this.element;
  const { logs } = this.options;
  if (logs) console.log(msgs.start[0]);

  ///// Action /////
  //////////////////

  // ...

  //// Conclude ////
  //////////////////

  if (logs) console.log(msgs.end[0], "→", msgs.end[1]);
}

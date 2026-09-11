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

const logArgs = { eventName: "api.get_foo", inline: true, disabled: false };
const msgs = {
  start: ["COMPONENT", "API", "get_foo"],
  end: ["COMPONENT", "API", "get_foo", "API call complete"],
};

// Method def. ///
//////////////////

export default function get_foo() {
  ///// Setup //////
  //////////////////

  const { logs } = this.options;
  if (logs) console.log(msgs.start[0], msgs.start[1], msgs.start[2]);

  ///// Action /////
  //////////////////

  // ...

  //// Conclude ////
  //////////////////

  if (logs) console.log(msgs.end[0], msgs.end[1], msgs.end[2], msgs.end[3]);
}

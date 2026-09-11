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

const msgs = {};

//// Hdl. f() ////
//////////////////

export default function ebh_eventbusCall(ARGS) {
  ///// Setup //////
  //////////////////

  const { REF } = this.ref;
  const { _name } = ARGS;
  const { logs } = this.options;
  if (logs) console.log(msgs.change(change)[0]);

  ///// ACTION /////
  //////////////////

  console.log(ARGS);
}

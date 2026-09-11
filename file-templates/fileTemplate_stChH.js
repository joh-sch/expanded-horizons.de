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
  change: (CHANGE) => [`change: ${CHANGE}`],
};

//// Hdl def. ////
//////////////////

export default function stChH_stateChange(CHANGES) {
  ///// Setup //////
  //////////////////

  const { change } = CHANGES;
  const { logs } = this.options;
  if (logs) console.log(msgs.change(change)[0]);

  // Change exe. ///
  //////////////////

  // [action]...

  //// Conclude ////
  //////////////////

  // ...
}

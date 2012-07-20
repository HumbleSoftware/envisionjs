/**
 * The Envision namespace.
 * @namespace
 */
var envision = {

  // Globals
  _ : Flotr._,        // Underscore.js, functional microlib
  bean : Flotr.bean,  // Bean, events
  bonzo : bonzo,      // Bonzo, dom

  // Utility
  noConflict : (function (root) {
    var previous = root.envision;
    return function () {
      root.envision = previous;
      return this;
    };
  })(this)
};

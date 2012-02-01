/**
 * Child Class
 *
 * Defines a visualization child.
 *
 * Options:
 *  height - Integer
 *  width - Integer
 *  flotr - A set of flotr options
 */
(function () { 

var

  V = humblevis,

  CN_CHILD = 'humble-vis-child',

  T_CHILD = '<div class="' + CN_CHILD + '"></div>';

function Child (options) {

  options = options || {};

  var
    name = options.name,
    node = bonzo.create(T_CHILD)[0];

  if (name) bonzo(node).addClass(name);

  this.options = options;
  this.node = node;
}

Child.prototype = {

  render : function (element) {

    var
      node = this.node,
      options = this.options;

    element = element || options.element;

    if (!element) throw 'No element to render within.';

    this._setDimension('width');
    this._setDimension('height');
    this.container = element;
    bonzo(element).append(this.node);
  },

  _setDimension : function (attribute) {
    var
      node = this.node,
      options = this.options;
    if (options[attribute]) {
      bonzo(node).css(attribute, options[attribute]);
    } else {
      options[attribute]= parseInt(bonzo(node).css(attribute), 10);
    }
  }
};

V.Child = Child;

})();

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

  T_CHILD       = '<div class="' + CN_CHILD + '"></div>';

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


    if (options.width) {
      bonzo(this.node).css({width : options.width});
    } else {
      options.width = parseInt(bonzo(this.node).css('width'), 10);
    }

    if (options.height) {
      bonzo(this.node).css({height : options.height});
    } else {
      options.height = parseInt(bonzo(this.node).css('height'), 10);
    }

    this.container = element;
    bonzo(element).append(this.node);

  },
};

V.Child = Child;

})();

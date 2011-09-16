(function () { 
/**
 * Options:
 *
 * element - element housing visualization
 *
 */

var
  CN_FIRST  = 'humble-vis-first',
  CN_LAST   = 'humble-vis-last',

  TEMPLATE  = '<div class="humble-vis-visualization"></div>';

function Visualization (options) {
  this.options = options || {};
  this.children = [];
  this.container = null;
  this.rendered = false;
}

Visualization.prototype = {

  render : function (element) {

    var o = this.options;

    element = element || o.element;
    if (!element) throw 'No element to render within.';

    this.container = bonzo.create(TEMPLATE);
    bonzo(element).append(this.container);

    _.each(this.children, function (child) {
      child.render(this.container);
    }, this);
    this._updateClasses();

    this.rendered = true;
  },

  add : function (child) {
    this.children.push(child);
    if (this.rendered) {
      child.render(this.container);
      this._updateClasses();
    }
    return child;
  },

  remove : function (child) {
    var
      children  = this.children,
      index     = this.indexOf(child);
    if (index !== -1) {
      children.splice(index, 1);
      bonzo(child.node).remove();
      this._updateClasses();
      return true;
    }
  },

  setPosition : function (child, newIndex) {
    var
      children  = this.children;
    if (newIndex >= 0 && newIndex < children.length && this.remove(child)) {
      this.children.splice(newIndex, 0, child);
      if (newIndex === 0)
        bonzo(this.container).prepend(child.node);
      else
        bonzo(child.node).insertAfter(children[newIndex-1].node);
      this._updateClasses();
      return true;
    }
  },

  indexOf : function (child) {
    return _.indexOf(this.children, child);
  },

  getChild : function (index) {
    var children = this.children;
    if (index < children.length) return children[index];
  },

  isFirst : function (child) {
    return (this.indexOf(child) === 0 ? true : false);
  },

  isLast : function (child) {
    return (this.indexOf(child) === this.children.length - 1 ? true : false);
  },

  _updateClasses : function () {

    var
      children  = this.children,
      first     = 0,
      last      = children.length -1,
      node;

    _.each(children, function (child, index) {
      node = bonzo(child.node);

      if (index === first)
        node.addClass(CN_FIRST);
      else
        node.removeClass(CN_FIRST);

      if (index === last)
        node.addClass(CN_LAST);
      else
        node.removeClass(CN_LAST);
    });
  }
};

Humble.Vis.Visualization = Visualization;

})();

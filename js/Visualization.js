(function () { 
/**
 * Options:
 *
 * element - element housing visualization
 *
 */

var
  TEMPLATE = '<div class="humble-vis-visualization"></div>';

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

    this.rendered = true;
  },

  add : function (child) {
    this.children.push(child);
    if (this.rendered) child.render(this.container);
    return child;
  },

  remove : function (child) {
    var
      children  = this.children,
      index     = this.indexOf(child);
    if (index !== -1) {
      children.splice(index, 1);
      bonzo(child.node).remove();
      return true;
    }
  },

  setPosition : function (child, newIndex) {
    var
      children  = this.children;
    if (newIndex >= 0 && newIndex < children.length && this.remove(child)) {
      this.children.splice(newIndex, 0, [child]);
      if (newIndex === 0)
        bonzo(this.container).prepend(child.node);
      else
        bonzo(child.node).insertAfter(children[newIndex-1].node);
      return true;
    }
  },

  indexOf : function (child) {
    return _.indexOf(this.children, child);
  }

};

Humble.Vis.Visualization = Visualization;

})();

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
      children = this.children,
      index = _.indexOf(children, child);
    if (index) {
      children.splice(index, 1);
      bonzo(child.node).remove();
    }
  }

};

Humble.Vis.Visualization = Visualization;

})();

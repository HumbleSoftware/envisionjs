(function () { 
/**
 * Options:
 *
 * element - element housing visualization
 *
 */

var D = Flotr.DOM;

function Visualization (options) {
  this.options = options || {};
  this.children = [];
  this.container = null;
  this.rendered = false;
}

Visualization.prototype = {

  render : function (element) {

    var o = this.options;

    if (!o.element) o.element = element;
    element = o.element;

    if (!element) throw 'No element to render within.'

    this.container = D.node('<div class="humble-vis-visualization"></div>');
    D.insert(element, this.container);

    _.each(this.children, function (child) {
      child.render(this.container);
    }, this);

    this.rendered = true;
  },

  add : function (child) {
    this.children.push(child);
    if (this.rendered) child.render(this.container);
    return child;
  }
};

Humble.Vis.Visualization = Visualization;

})();

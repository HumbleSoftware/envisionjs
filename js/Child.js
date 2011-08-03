/**
 * Child Class
 *
 * Defines a visualization child.
 *
 * Options:
 *  height
 *  width
 *  flotr - A set of flotr options
 *
 */
(function () { 

var D = Flotr.DOM,
  flotrDefaultOptions = {
    grid : {
      outlineWidth : 0,
      labelMargin : 0
    },
    lines : {
      lineWidth : 1
    },
    xaxis : {
      margin : false,
      showLabels  : false
    },
    yaxis : {
      margin : false,
      showLabels  : false
    },
    shadowSize : false
};

function Child(options) {
  this.options = options || {};
  this.container = null;
  this.flotr = null;
  this._flotrDefaultOptions();
}

Child.prototype = {

  getFlotr : function () { return this.flotr; },
  getData : function () { return this.options.data; },

  render : function (element) {

    var o = this.options;

    if (!element) throw 'No element to render within.';
    if (!o.width) throw 'No width.';
    if (!o.height) throw 'No height.';

    this.container = D.node('<div class="humble-vis-child"></div>');
    D.insert(element, this.container);
    D.setStyles(this.container, {width : o.width, height : o.height});

    this.draw(o.data, o.flotr);
  },

  draw : function (data, flotr) {

    var o = this.options,
        data = data || o.data,
        container = this.container;

    if (flotr) {
      this._flotrDefaultOptions(flotr);
      _.extend(o.flotr, flotr);
    }
    flotr = o.flotr;
    o.data = data;

    if (!flotr) throw 'No graph submitted.'

    this.flotr = Flotr.draw(container, [data], flotr);
  },

  _flotrDefaultOptions : function (options) {

    var o = options || this.options.flotr,
      defaults = flotrDefaultOptions,
      i;

    for (i in defaults) {
      if (_.isUndefined(o[i])) {
        o[i] = defaults[i];
      } else {
        _.defaults(o[i], defaults[i]);
      }
    }
  }
};

Humble.Vis.Child = Child;

})();

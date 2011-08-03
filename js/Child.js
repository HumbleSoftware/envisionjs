(function () { 
/**
 * Options:
 *
 * flotr - A set of flotr options
 *
 */

var D = Flotr.DOM,
  flotrDefaultOptions = {
    grid : {
      outlineWidth : 0,
      labelMargin : 0
    },
    xaxis : {
      margin : false,
      showLabels  : false
    },
    yaxis : {
      margin : false,
      showLabels  : false
    }
};

function Child(options) {
  this.options = options || {};
  this.container = null;
  this._flotrDefaultOptions();
}

Child.prototype = {

  render : function (element) {

    var o = this.options;

    if (!element) throw 'No element to render within.';
    if (!o.width) throw 'No width.';
    if (!o.height) throw 'No height.';

    this.container = D.node('<div class="humble-vis-child"></div>');
    D.insert(element, this.container);
    D.setStyles(this.container, {width : o.width, height : o.height});

    this._flotrRender();
  },

  _flotrRender : function () {

    var o = this.options,
        flotr = o.flotr,
        container = this.container;

    if (!flotr) throw 'No graph submitted.'

    this.flotr = Flotr.draw(container, [o.data], flotr);
  },

  _flotrDefaultOptions : function () {
    var o = this.options;
    _.extend(o.flotr, flotrDefaultOptions);
    console.log(o.flotr, flotrDefaultOptions);
  }
};

Humble.Vis.Child = Child;

})();

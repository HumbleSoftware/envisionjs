/**
 * Child Class
 *
 * Defines a visualization child.
 *
 * Options:
 *  height - Integer
 *  width - Integer
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
    bars : {
      show        : false,
      barWidth    : .5,
      fill        : true,
      lineWidth   : 2,
      fillOpacity : 1
    },
    lines : {
      lineWidth   : 1
    },
    xaxis : {
      margin      : false,
      noTicks     : 0,
      showLabels  : false
    },
    yaxis : {
      margin      : false,
      noTicks     : 0,
      showLabels  : false
    },
    shadowSize    : false
};

function Child(options) {
  this.options = options || {};
  this.container = D.node('<div class="humble-vis-child"></div>');
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

    D.insert(element, this.container);
    D.setStyles(this.container, {width : o.width+'px', height : o.height+'px'});

    this.draw(o.data, o.flotr);
  },

  draw : function (data, flotr) {

    var o = this.options,
      flotr = _.clone(flotr),
      data = data || o.data,
      container = this.container;

    if (flotr) {
      _.extend(o.flotr, flotr);
      this._flotrDefaultOptions(flotr);
    }
    flotr = o.flotr;
    o.data = data;

    data = this._processData();

    if (!flotr) throw 'No graph submitted.'

    this.flotr = Flotr.draw(container, [data], flotr);
  },

  _processData : function () {

    var o = this.options.flotr,
      fData = [],
      data = this.getData(),
      length = data.length,
      min = o.xaxis.min,
      max = o.xaxis.max;

    // Bound Data
    if (min && max) {
      for (i = 0; i < length; i++) {
        if (data[i][0] >= min) break;
      }
      if (i > 0) i--;
      for (i; i < length; i++) {
        fData.push(data[i]);
        if (data[i][0] > max) break;
      }
    } else {
      fData = data;
    }

    data = fData;
    fData = [];
    length = data.length;

    // Subsample Data
    // TODO simple subsampling, fine for homogeneous data.  Implement complex strategies.
    var width = this.options.width,
      unit;

    if (length > width * 3) {
      unit = Math.round(length / width);
      for(i = 0; i < width*3-1; i++) {
        if (i*unit >= length)
          break;
        fData.push(data[i*unit]);
      }
      fData.push(data[length-1]);
    } else {
      fData = data;
    }

    return fData;
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

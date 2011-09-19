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

var

  CN_CHILD = 'humble-vis-child',

  T_CHILD       = '<div class="' + CN_CHILD + '"></div>',
  T_CONTAINER   = '<div class="' + CN_CHILD + '-container"></div>',

  flotrDefaultOptions = {
    grid : {
      outlineWidth : 0,
      labelMargin : 0,
      horizontalLines : false,
      verticalLines : false
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
      showLabels  : false
    },
    yaxis : {
      margin      : false,
      showLabels  : false
    },
    shadowSize    : false
};

function Child(options) {

  this.options    = options || {};
  this.container  = bonzo.create(T_CONTAINER)[0];
  this.node       = bonzo.create(T_CHILD);

  if (options.name) bonzo(this.node).addClass(options.name);
  bonzo(this.node).append(this.container);

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

    bonzo(element).append(this.node);
    bonzo(this.container).css({width : o.width, height : o.height});

    this.draw(o.data, o.flotr);
  },

  draw : function (data, flotr) {

    var o = this.options,
      flotr = _.clone(flotr),
      data = data || o.data,
      fData = [],
      container = this.container;

    if (flotr) {
      _.extend(o.flotr, flotr);
      this._flotrDefaultOptions(flotr);
    }
    flotr = o.flotr;
    o.data = data;

    data = this._getDataArray(data);
    if (!o.skipPreprocess) {
      _.each(data, function (d, index) {
        fData[index] = this._processData(d);
      }, this);
    }

    if (!flotr) throw 'No graph submitted.'

    this.flotr = Flotr.draw(container, fData, flotr);
  },

  getNode : function () {
    return this.node;
  },

  _getDataArray : function (data) {
    return (data[0] && data[0][0] && _.isArray(data[0][0])) ?
      data : [data];
  },

  _processData : function (data) {

    var o = this.options.flotr,
      fData = [],
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

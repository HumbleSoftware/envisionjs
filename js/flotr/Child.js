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
  DEFAULTS = V.flotr.defaultOptions;

function Child (options) {
  this.options = options || {};
  this.flotr = null;
  this._flotrDefaultOptions();
}

Child.prototype = {

  draw : function (data, flotr, node) {

    var
      o           = this.options,
      fData       = [];

    data = data || o.data;

    if (flotr) {
      flotr = Flotr.clone(flotr);
      _.extend(o.flotr, flotr);
      this._flotrDefaultOptions(flotr);
    }
    flotr = o.flotr;
    o.data = data;
    min = flotr.xaxis.min;
    max = flotr.xaxis.max;

    data = this._getDataArray(data);
    if (o.skipPreprocess) {
      fData = data;
    } else {
      _.each(data, function (d, index) {
        // TODO flotr
        /*
        if (!_.isArray(d) && !_.isFunction(d)) {
          fData[index] = _.clone(d);
          fData[index] = this._processData(d.data);
        } else {
        */
          fData[index] = this._processData(d);
        //}
      }, this);
    }

    fData = fData[0];
    var
      flotrData = [],
      x = fData.x,
      y = fData.y,
      i;
    for (i = 0; i < fData.length; i++) {
      flotrData.push([x[i], y[i]]);
    }

    if (!flotr) throw 'No graph submitted.';

    this.flotr = Flotr.draw(node, [flotrData], flotr);
  },

  _processData : function (data) {

    var
      options     = this.options,
      process     = options.processData,
      resolution  = options.width,
      axis        = options.flotr.xaxis,
      min         = axis.min,
      max         = axis.max,
      datum       = new V.Preprocessor(data);

    if (_.isFunction(data)) {
      return data(min, max, resolution);
    } else if (process) {
      process.apply(this, [{
        datum : datum,
        min : min,
        max : max,
        resolution : resolution
      }]);
    } else {
      datum
        .bound(min, max)
        .subsampleMinMax(resolution);
    }

    return datum.data;
  },

  _getDataArray : function (data) {

    if (data[0] && (!_.isArray(data[0]) || (data[0][0] && _.isArray(data[0][0]))))
      return data;
    else
      return [data];
  },

  _flotrDefaultOptions : function (options) {

    var o = options || this.options.flotr,
      i;

    for (i in DEFAULTS) {
      if (DEFAULTS.hasOwnProperty(i)) {
        if (_.isUndefined(o[i])) {
          o[i] = DEFAULTS[i];
        } else {
          _.defaults(o[i], DEFAULTS[i]);
        }
      }
    }
  }
};

V.flotr.Child = Child;

})();

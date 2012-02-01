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

  DEFAULTS = V.flotr.defaultOptions;

function Child (options) {

  this.options    = options || {};
  this.node  = bonzo.create(T_CHILD)[0];

  if (options.name) bonzo(this.node).addClass(options.name);

  this.flotr = null;
  this._flotrDefaultOptions();
}

Child.prototype = {

  getFlotr : function () { return this.flotr; },
  getData : function () { return this.options.data; },

  render : function (element) {

    var o = this.options;

    if (!element) throw 'No element to render within.';

    this.container = element;
    bonzo(element).append(this.node);

    if (o.width) {
      bonzo(this.node).css({width : o.width});
    } else {
      o.width = parseInt(bonzo(this.node).css('width'), 10);
    }

    if (o.height) {
      bonzo(this.node).css({height : o.height});
    } else {
      o.height = parseInt(bonzo(this.node).css('height'), 10);
    }

    this.draw(o.data, o.flotr);
  },

  draw : function (data, flotr) {

    var
      o           = this.options,
      fData       = [],
      container   = this.node;

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
        if (!_.isArray(d) && !_.isFunction(d)) {
          fData[index] = _.clone(d);
          fData[index] = this._processData(d.data);
        } else {
          fData[index] = this._processData(d);
        }
      }, this);
    }

    if (!flotr) throw 'No graph submitted.';

    this.flotr = Flotr.draw(container, fData, flotr);
  },

  // TODO remove?
  getNode : function () {
    return this.node;
  },

  _processData : function (data) {

    var
      options     = this.options,
      process     = options.processData,
      resolution  = options.width,
      axis        = options.flotr.xaxis,
      min         = axis.min,
      max         = axis.max,
      datum       = new V.Data(data);

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

V.Child = Child;

})();

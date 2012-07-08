// Preprocessor Class
(function () {

/**
 * @summary Data preprocessor.
 *
 * @description Data can be preprocessed before it is rendered by an adapter.
 *
 * This has several important performance considerations.  If data will be 
 * rendered repeatedly or on slower browsers, it will be faster after being
 * optimized.
 *
 * First, data outside the boundaries does not need to be rendered.  Second,
 * the resolution of the data only needs to be at most the number of pixels
 * in the width of the visualization.
 *
 * Performing these optimizations will limit memory overhead, important
 * for garbage collection and performance on old browsers, as well as drawing
 * overhead, important for mobile devices, old browsers and large data sets.
 *
 * @param {Array} [data]  The data for processing.
 *
 * @memberof envision
 * @class
 */
function Preprocessor (options) {

  options = options || {};

  /**
   * Returns data.
   */
  this.getData = function () {

    if (this.bounded) bound(this);

    return this.processing;
  };

  this.reset = function () {
    this.processing = this.data;
    return this;
  };

  /**
   * Set the data object.
   */
  this.setData = function (data) {
    var
      i, length;
    if (!_.isArray(data)) throw new Error('Array expected.');
    if (data.length < 2) throw new Error('Data must contain at least two dimensions.');
    length = data[0].length;
    for (i = data.length; i--;) {
      if (!_.isArray(data[i])) throw new Error('Data dimensions must be arrays.');
      if (data[i].length !== length) throw new Error('Data dimensions must contain the same number of points.');
    }

    this.processing = data;
    this.data = data;

    return this;
  };

  if (options.data) this.setData(options.data);
}

function getStartIndex (data, min) {
  var
    i = _.sortedIndex(data, min);

  // Include point outside range when not exact match
  if (data[i] > min && i > 0) i--;

  return i;
}

function getEndIndex (data, max) {
  return _.sortedIndex(data, max);
}

function bound (that) {

  delete that.bounded;

  var
    data    = that.processing,
    length  = that.length(),
    x       = data[0],
    y       = data[1],
    min     = that.min || 0,
    max     = that.max || length,
    start   = getStartIndex(x, min),
    end     = getEndIndex(x, max);

  that.processing = [
    x.slice(start, end + 1),
    y.slice(start, end + 1)
  ];

  that.start = start;
  that.end = end;
}

Preprocessor.prototype = {

  /**
   * Returns the length of the data set.
   *
   * @return {Number} Length of the data set.
   */
  length : function () {
    return this.getData()[0].length;
  },

  /**
   * Bounds the data set at within a range.
   *
   * @param {Number} min
   * @param {Number} max
   */
  bound : function (min, max) {

    if (!_.isNumber(min) || !_.isNumber(max)) return this;

    this.min = min;
    this.max = max;
    this.bounded = true;

    return this;
  },

  /**
   * Subsample data using MinMax.
   *
   * MinMax will display the extrema of the subsample intervals.  This is
   * slower than regular interval subsampling but necessary for data that 
   * is very non-homogenous.
   *
   * @param {Number} resolution
   */
  subsampleMinMax : function (resolution) {

    var bounded = this.bounded;
    delete this.bounded;

    var
      data    = this.processing,
      length  = this.length(),
      x       = data[0],
      y       = data[1],
      start   = bounded ? getStartIndex(x, this.min) : 0,
      end     = bounded ? getEndIndex(x, this.max) : length - 1,
      count   = (resolution - 2) / 2,
      newX    = [],
      newY    = [],
      min     = Number.MAX_VALUE,
      max     = -Number.MAX_VALUE,
      minI    = 1,
      maxI    = 1,
      unit    = (end - start)/ count,
      position, datum, i, j;

    if (end - start + 1 > resolution) {

      newX.push(x[start]);
      newY.push(y[start]);

      position = start + unit;

      for (i = start; i < end; i++) {

        if (i === Math.round(position)) {

          position += unit;

          j = Math.min(maxI, minI);
          newX.push(x[j]);
          newY.push(y[j]);

          j = Math.max(maxI, minI);
          newX.push(x[j]);
          newY.push(y[j]);

          minI = i;
          min = y[minI];
          maxI = i;
          max = y[maxI];

        } else {
          if (y[i] > max) {
            max = y[i];
            maxI = i;
          }

          if (y[i] < min) {
            min = y[i];
            minI = i;
          }
        }
      }

      if (i < position) {
        newX.push(x[minI]);
        newY.push(min);
        newX.push(x[maxI]);
        newY.push(max);
      }

      // Last
      newX.push(x[end]);
      newY.push(y[end]);

      this.processing = [newX, newY];
      this.start = start;
      this.end = end;
    } else {
      this.bounded = bounded;
    }

    return this;
  },

  /**
   * Subsample data at a regular interval for resolution.
   *
   * This is the fastest subsampling and good for monotonic data and fairly
   * homogenous data (not a lot of up and down).
   *
   * @param {Number} resolution
   */
  subsample : function (resolution) {

    var bounded = this.bounded;
    delete this.bounded;

    var
      data    = this.processing,
      length  = this.length(),
      x       = data[0],
      y       = data[1],
      start   = bounded ? getStartIndex(x, this.min) : 0,
      end     = bounded ? getEndIndex(x, this.max) : length - 1,
      unit    = (end - start + 1) / resolution,
      newX    = [],
      newY    = [],
      i, index;

    if (end - start + 1 > resolution) {

      // First
      newX.push(x[start]);
      newY.push(y[start]);

      for (i = 1; i < resolution; i++) {
        if (i * unit >= end - unit) break;
        index = Math.round(i * unit) + start;
        newX.push(x[index]);
        newY.push(y[index]);
      }

      // Last
      newX.push(x[end]);
      newY.push(y[end]);

      this.processing = [newX, newY];
      this.start = start;
      this.end = end;
    } else {
      this.bounded = bounded;
    }

    return this;
  },

  interpolate : function (resolution) {

    var bounded = this.bounded;
    delete this.bounded;

    var
      data = this.processing,
      length = this.length(),
      x = data[0],
      y = data[1],
      start = bounded ? getStartIndex(x, this.min) : 0,
      end = bounded ? getEndIndex(x, this.max) : length - 1,
      unit = (x[end] - x[start]) / resolution,
      newX = [],
      newY = [],
      i, j, delta;

    newX.push(x[start]);
    newY.push(y[start]);
    if (end - start + 1 < resolution) {
      for (i = start; i < end; i++) {
        delta = x[i + 1] - x[i];
        newX.push(x[i]);
        newY.push(y[i]);
        for (j = x[i + 0] + unit; j < x[i + 1]; j += unit) {
          newX.push(j);
          newY.push(cubicHermiteSpline(
            j,
            x[i - 1],
            y[i - 1],
            x[i + 0],
            y[i + 0],
            x[i + 1],
            y[i + 1],
            x[i + 2],
            y[i + 2]
          ));
        }
      }

      this.processing = [newX, newY];
      this.start = start;
      this.end = end;
    }

    return this;
  }
};

function cubicHermiteSpline (x, tk0, pk0, tk1, pk1, tk2, pk2, tk3, pk3) {

  var
    t = (x - tk1) / (tk2 - tk1),
    t1 = 1 - t,
    h00 = (1 + 2 * t) * t1 * t1,
    h10 = t * t1 * t1,
    h01 = t * t * (3 - 2 * t),
    h11 = t * t * (t - 1),
    mk = (pk2 - pk1) / (2 * (tk2 - tk1)) + (typeof pk0 === 'undefined' ? 0 : (pk1 - pk0) / (2 * (tk1 - tk0))),
    mk1 = (typeof pk3 === 'undefined' ? 0 : (pk3 - pk2) / (2 * (tk3 - tk2))) + (pk2 - pk1) / (2 * (tk2 - tk1)),
    px = h00 * pk1 + h10 * (tk2 - tk1) * mk + h01 * pk2 + h11 * (tk2 - tk1) * mk1;

  return px;
}

envision.Preprocessor = Preprocessor;

}());

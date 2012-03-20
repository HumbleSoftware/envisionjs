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

  var
    data;

  /**
   * Returns data.
   */
  this.getData = function () {
    if (this.bounded) bound(this);
    return data;
  }

  /**
   * Set the data object.
   */
  this.setData = function (newData) {
    var
      i, length;
    if (!_.isArray(newData)) throw new Error('Array expected.');
    if (newData.length < 2) throw new Error('Data must contain at least two dimensions.');
    length = newData[0].length;
    for (i = newData.length; i--;) {
      if (!_.isArray(newData[i])) throw new Error('Data dimensions must be arrays.');
      if (newData[i].length !== length) throw new Error('Data dimensions must contain the same number of points.');
    }

    data = newData;

    return this;
  }

  if (options.data) this.setData(options.data);
}

function getStartIndex (data, min) {

  var
    length = data.length,
    i;

  for (i = 0; i < length; i++) {
    if (data[i] >= min) break;
  }

  // Include point outside range when not exact match
  if (data[i] > min && i > 0) i--;

  return i;
}

function getEndIndex (data, max) {

  var
    i;

  for (i = data.length; i--;) {
    if (data[i] <= max) break;
  }

  // Include point outside range when not exact match
  if (data[i] < max && i > 0) i++;

  return i;
}

function bound (that) {

  delete that.bounded;

  var
    data    = that.getData(),
    length  = that.length(),
    x       = data[0],
    y       = data[1],
    min     = that.min || 0,
    max     = that.max || that.length(),
    start   = getStartIndex(x, min),
    end     = getEndIndex(x, max);

  that.setData([
    x.slice(start, end + 1),
    y.slice(start, end + 1)
  ]);
};

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
      data    = this.getData(),
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
      position, min, max, datum, i, j;

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

      this.setData([newX, newY]);
    } else {
      this.bounded = true;
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
      data    = this.getData(),
      length  = this.length(),
      x       = data[0],
      y       = data[1],
      start   = bounded ? getStartIndex(x, this.min) : 0,
      end     = bounded ? getEndIndex(x, this.max) : length - 1,
      unit    = (end - start + 1) / resolution,
      newX    = [],
      newY    = [],
      i, index;

    if (length > resolution) {

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

      this.setData([newX, newY]);
    }

    return this;
  }
};

envision.Preprocessor = Preprocessor;

}());

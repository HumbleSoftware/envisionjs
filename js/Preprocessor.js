(function () {

function Preprocessor (options) {

  options = options || {};

  var
    data;

  this.getData = function () {
    if (this.bounded === false) bound(this);
    return data;
  }

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

  return i;
}

function getEndIndex (data, max) {

  var
    i;

  for (i = data.length; i--;) {
    if (data[i] <= max) break;
  }

  return i;
}

function bound (that, data) {

  delete that.bounded;

  var
    data    = that.getData(),
    length  = that.length(),
    min     = that.min,
    max     = that.max,
    x       = data[0],
    y       = data[1],
    index   = getStartIndex(x, min),
    i       = index ? index : index - 1;

  for (i; i < length; i++) {
    if (x[i] > max) break;
  }

  that.setData([
    x.slice(index, i),
    y.slice(index, i)
  ]);

  return that;
};

Preprocessor.prototype = {

  length : function () {
    return this.getData()[0].length;
  },

  bound : function (min, max) {

    if (!_.isNumber(min) || !_.isNumber(max)) return this;

    this.min = min;
    this.max = max;
    this.bounded = false;
  },

  /**
   * Sample using min and max.
   */
  subsampleMinMax : function (resolution) {

    var
      data    = this.getData(),
      length  = this.length(),
      count   = (resolution - 2) / 2,
      x       = data[0],
      y       = data[1],
      newX    = [],
      newY    = [],
      min     = Number.MAX_VALUE,
      max     = -Number.MAX_VALUE,
      minI    = 1,
      maxI    = 1,
      unit    = Math.floor(length / count),
      position, min, max, datum, i, j;

    if (length > resolution) {

      newX.push(x[0]);
      newY.push(y[0]);

      position = unit;

      for (i = 1; i < length - 1; i++) {

        if (i === position) {

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
      newX.push(x[length-1]);
      newY.push(y[length-1]);

      this.setData([newX, newY]);
    }

    return this;
  },

  subsample : function (resolution) {

    var
      data    = this.getData(),
      length  = this.length(),
      unit    = length / resolution,
      x       = data[0],
      y       = data[1],
      newX    = [],
      newY    = [],
      i, index;

    if (length > resolution) {

      // First
      newX.push(x[0]);
      newY.push(y[0]);

      for (i = 1; i < resolution; i++) {
        if (i * unit >= length - unit)
          break;
        index = Math.round(i * unit);
        newX.push(x[index]);
        newY.push(y[index]);
      }

      // Last
      newX.push(x[length-1]);
      newY.push(y[length-1]);

      this.setData([newX, newY]);
    }

    return this;
  }
};

humblevis.Preprocessor = Preprocessor;

}());

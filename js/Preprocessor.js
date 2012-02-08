(function () {

function Preprocessor (options) {

  options = options || {};

  var
    data;

  this.getData = function () {
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

Preprocessor.prototype = {

  length : function () {
    return this.getData()[0].length;
  },

  bound : function (min, max) {

    if (!_.isNumber(min) || !_.isNumber(max)) return this;

    var
      data    = this.getData(),
      length  = this.length(),
      x       = data[0],
      y       = data[1],
      i, index;

    for (i = 0; i < length; i++) {
      if (x[i] >= min) break;
    }

    index = i;
    if (i > 0) i--;

    for (i; i < length; i++) {
      if (x[i] > max) break;
    }

    this.setData([
      x.slice(index, i),
      y.slice(index, i)
    ]);

    return this;
  },

  /**
   * Sample using min and max.
   */
  subsampleMinMax : function (resolution) {

    var
      data    = this.data,
      length  = data.length,
      _length = length - 1,
      newData = [],
      unit    = resolution / length,
      index   = Math.round(unit * 1),
      iMin    = 1,
      iMax    = 1,
      min, max, datum, i, j;

    if (length > resolution) {
      newData.push(data[0]);
      for (i = 1; i < _length; i++) {
        j = Math.round(unit * i);

        // New index
        if (j !== index) {
          if (iMax === iMin) {
            newData.push(data[iMin]);
          } else {
            newData.push(data[Math.min(iMin, iMax)], data[Math.max(iMin, iMax)]);
          }
          iMin = iMax = i;
          min = max = data[i][1];
          index = j;
        }

        // Old index
        else {
          datum = data[i][1];
          if (datum < min) {
            iMin = i;
            min = datum;
          }
          if (datum > max) {
            iMax = i;
            max = datum;
          }
        }
      }
      newData.push(data[length-1]);
      this.data = newData;
    }

    return this;
  },

  subsample : function (resolution) {

    var
      data    = this.data,
      x       = data.x,
      y       = data.y,
      length  = data.length,
      newX    = [],
      newY    = [],
      newData = {
        x : newX,
        y : newY
      },
      unit    = length / resolution,
      i;

    if (length > resolution) {
      newX.push(x[0]);
      newY.push(y[0]);
      for (i = 1; i < resolution; i++) {
        if (i * unit >= length)
          break;
        newX.push(x[Math.round(i*unit)]);
        newY.push(y[Math.round(i*unit)]);
      }
      newX.push(x[length-1]);
      newY.push(y[length-1]);
      this.data = newData;
    }

    newData.length = newX.length;

    return this;
  }
};

humblevis.Preprocessor = Preprocessor;

}());

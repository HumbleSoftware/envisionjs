(function () {

function Data (data) {
  this.data = data;
}

Data.prototype = {

  bound : function (min, max) {

    if (!_.isNumber(min) || !_.isNumber(max)) return this;

    var
      data    = this.data,
      length  = data.length,
      x       = data.x,
      y       = data.y,
      newData = {},
      i, index;

    for (i = 0; i < length; i++) {
      if (x[i] >= min) break;
    }

    if (i > 0) i--;
    index = i;

    for (i; i < length; i++) {
      if (x[i] > max) break;
    }

    // Slices
    newData.x = x.slice(index, i);
    newData.y = y.slice(index, i);
    newData.length = newData.x.length;

    this.data = newData;

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

humblevis.Data = Data;

}());

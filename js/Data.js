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
      newData = [],
      i;

    for (i = 0; i < length; i++) {
      if (data[i][0] >= min) break;
    }

    if (i > 0) i--;

    for (i; i < length; i++) {
      newData.push(data[i]);
      if (data[i][0] > max) break;
    }

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
      length  = data.length,
      newData = [],
      unit    = length / resolution,
      i;

    if (length > resolution) {
      newData.push(data[0]);
      for (i = 1; i < resolution; i++) {
        if (i * unit >= length)
          break;
        newData.push(data[Math.round(i*unit)]);
      }
      newData.push(data[length-1]);
      this.data = newData;
    }

    return this;
  }
}

Humble.Vis.Data = Data;

}());

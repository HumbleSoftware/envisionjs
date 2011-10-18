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

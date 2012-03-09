function example () {

  var
    V = envision,
    container = document.getElementById('demo'),
    options, vis;

  options = {
    container : container,
    data : {
      price : financeData.price,
      volume : financeData.volume,
      summary : financeData.price
    },
    trackFormatter : function (o) {

      var
        data = financeData,
        index = o.index,
        value;

      value = data.summaryTicks[index].date + ': $' + data.price[1][index] + ", Vol: " + data.volume[1][index];

      return value;
    },
    xTickFormatter : function (index) {
      var date = new Date(financeData.summaryTicks[index].date);
      return date.getFullYear() + '';
    },
    // An initial selection
    selection : {
      data : {
        x : {
          min : 100,
          max : 200
        }
      }
    }
  };

  vis = new envision.templates.Finance(options);
}

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
    }
  };

  vis = new envision.templates.Finance(options);
}

function example () {

  var
    container = document.getElementById('demo'),
    options;

  options = {
    container : container,
    data : {
      detail : financeData.price,
      summary : financeData.price
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

  new envision.templates.TimeSeries(options);
}

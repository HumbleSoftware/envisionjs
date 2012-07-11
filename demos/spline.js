function example () {

  var
    hash = window.location.hash,
    container = document.getElementById('demo'),
    count = 13,
    periods = 3,
    period = 2 * Math.PI * periods / count,
    x = [],
    y = [],
    d = { data : [x, y] },
    a = [],
    b = [],
    spline = [a, b],
    data = [d, spline],
    detail = {},
    summary = {
      config : {
        yaxis : {
          min : -1.5,
          max : 1.5
        }
      }
    },
    PI = Math.PI,
    options;

  // Data Generation
  for (i = 0; i < count; i++) {
    x.push(i/10);
    y.push(Math.sin(i * period));
  }

  // Interpolate
  function interpolate (x, xk, xk1, pk, pk1, xk0, pk0, xk2, pk2) {

    var
      c = 0.10,
      tk = (x - xk) / (xk1 - xk),
      t = tk,
      t1 = 1 - t,
      h00 = (1 + 2 * t) * t1 * t1,
      h10 = t * t1 * t1,
      h01 = t * t * (3 - 2 * t),
      h11 = t * t * (t - 1),
      mk = (1 - c) * (pk1 - pk0) / (xk1 - xk0),
      mk1 = (1 - c) * (pk2 - pk) / (xk2 - xk),
      px = h00 * pk + h10 * (xk1 - xk) * mk + h01 * pk1 + h11 * (xk1 - xk) * mk1;

    return px;
  }

  for (i = 1; i < x.length - 2; i++) {

    var
      xk0 = x[i - 1],
      xk  = x[i],
      xk1 = x[i + 1],
      xk2 = x[i + 2],
      pk0 = y[i - 1],
      pk  = y[i],
      pk1 = y[i + 1],
      pk2 = y[i + 2],
      at, bt;

    a.push(xk);
    b.push(pk);

    for (var j = 1; j < 9; j++) {
      at = xk + (xk1 - xk)  * j / 10;
      a.push(at);
      b.push(interpolate(at, xk, xk1, pk, pk1, xk0, pk0, xk2, pk2));
    }
  }

  detail.processData = function (o) {
    o.preprocessor
      .interpolate(o.resolution);
  };

  // Options
  options = {
    container : container,
    data : {
      detail : data,
      summary : data
    },
    defaults : {
      detail : detail,
      summary : summary
    }
  };

  // TimeSeries template:
  million = new envision.templates.TimeSeries(options);
}

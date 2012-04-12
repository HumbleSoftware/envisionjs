function example () {

  var
    hash = window.location.hash,
    container = document.getElementById('demo'),
    count = 1e6,
    periods = 3,
    period = 2 * Math.PI * periods / count,
    amplitude = (hash ? .15 : .0015),
    x = [],
    y = [],
    data = [x, y],
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
    options,
    million;

  // Data Generation
  for (i = 0; i < count; i++) {
    x.push(i/10000);
    y.push(Math.sin(i * period) + amplitude * Math.sin(i * period * 1000));
  }

  // Subsampling Demos
  if (hash !== '#minmax') {

    // Fixed-interval subsampling:
    detail.processData = summary.processData = function (o) {
      o.preprocessor
        .bound(o.min, o.max)
        .subsample(o.resolution);
    }
  } else {

    // Min-max subsampling:
    detail.processData = summary.processData = function (o) {
      o.preprocessor
        .bound(o.min, o.max)
        .subsampleMinMax(o.resolution);
    }
  }

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

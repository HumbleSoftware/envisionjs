function example () {

  var
    hash = window.location.hash,
    container = document.getElementById('demo'),
    amplitude = (hash ? .05 : .0015),
    x = [],
    y = [],
    data = [x, y],
    detail = {
      flotr : {}
    },
    summary = {},
    options,
    million;

  // Data Generation
  for (i = 0; i < 1e6; i++) {
    x.push(i/10000);
    y.push(Math.sin(i/50000) + amplitude * Math.sin(i/25));
  }

  // Subsampling Demos
  if (hash !== '#minmax') {

    // Fixed-interval subsampling:
    detail.processData = summary.processData = function (o) {
      o.preprocessor
        .bound(o.min, o.max)
        .subsample(1000);
    }
  } else {

    // Min-max subsampling:
    detail.processData = summary.processData = function (o) {
      o.preprocessor
        .bound(o.min, o.max)
        .subsampleMinMax(o.resolution * 1.5);
    }
  }

  // Options
  options = {
    container : container,
    data : {
      detail : data,
      summary : data
    },
    selection : {
      data : {
        x : {
          min : 9,
          max : 20 
        }
      }
    },
    defaults : {
      detail : detail,
      summary : summary
    }
  };

  // TimeSeries template:
  million = new envision.templates.TimeSeries(options);

  // Animate
  offset = 0;
  function updateSelection () {

    offset += 0.2;

    million.summary.trigger(million.summary, 'select', {
      data : {
        x : {
          min : 9,
          max : 20 - offset
        }
      }
    });

    if (20 - offset - 9 > 1) {
      setTimeout(updateSelection, 50);
    }
  }

  updateSelection();
}

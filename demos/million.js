function example () {

  var
    container = document.getElementById('demo'),
    E = Flotr.EventAdapter,
    x = [],
    y = [],
    data = [x, y],
    hash = window.location.hash,
    amplitude = (hash ? .05 : .0015),
    summary = {
      data : data,
      flotr : {
        yaxis : {
          autoscale : true,
          autoscaleMargin : 1
        }
      }
    },
    zoom = {
      data : [ data ]
    },
    million;

  for (i = 0; i < 1e6; i++) {
    x.push(i/10000);
    y.push(Math.sin(i/50000) + amplitude * Math.sin(i/50));
  }

  if (hash !== '#minmax') {
    // Fixed-interval subsampling:
    zoom.processData = summary.processData = function (o) {
      o.preprocessor
        .bound(o.min, o.max)
        .subsample(o.resolution);
    }
  } else {
    zoom.processData = summary.processData = function (o) {
      o.preprocessor
        .bound(o.min, o.max)
        .subsampleMinMax(o.resolution * 1.5);
    }
  }

  // Zoom template:
  million = new humblevis.templates.Zoom({
    container : container,
    summary : summary,
    zoom : zoom
  });
}

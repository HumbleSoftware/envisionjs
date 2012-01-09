function example () {

  var
    container = document.getElementById('demo'),
    E = Flotr.EventAdapter,
    data = [],
    hash = window.location.hash,
    amplitude = (hash ? .05 : .001),
    summary = {
      data : data
    },
    zoom = {
      data : data
    },
    million;

  for (i = 0; i < 1e6; i++) {
    data.push([i/10000, .2*Math.sin(i/10000) + i/100000 + amplitude * Math.sin(i/50)]);
  }

  if (hash !== '#minmax') {
    // Fixed-interval subsampling:
    zoom.processData = summary.processData = function (o) {
      o.datum
        .bound(o.min, o.max)
        .subsample(o.resolution);
    }
  }

  // Zoom template:
  million = new humblevis.templates.Zoom({
    container : container,
    summary : summary,
    zoom : zoom
  });
}

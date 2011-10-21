function example () {

  var
    container = document.getElementById('demo'),
    H = Humble.Vis,
    E = Flotr.EventAdapter,
    data = [],
    hash = window.location.hash,
    amplitude = (hash ? .05 : .001),

    mainOptions = {
      height  : 200,
      width   : 600,
      data    : data,
      flotr   : {}
    },

    summaryOptions = {
      height  : 200,
      width   : 600,
      data    : data,
      flotr   : {
        handles : { show : true },
        selection : { mode : 'x'}
      }
    },

    vis, main, summary, interaction, i;

  for (i = 0; i < 1e6; i++) {
    data.push([i/10000, .2*Math.sin(i/10000) + i/100000 + amplitude * Math.sin(i/50)]);
  }

  if (hash !== '#minmax') {
    mainOptions.processData = summaryOptions.processData = function (o) {

      var
        datum = o.datum;

      datum
        .bound(o.min, o.max)
        .subsample(o.resolution);
    }
  }

  vis = new H.Visualization();
  main = new H.Child(mainOptions);
  summary = new H.Child(summaryOptions);
  interaction = new H.Interaction({leader : summary});

  vis.add(main);
  vis.add(summary);
  vis.render(container);
  interaction.add(H.Action.Selection);
  interaction.follow(main);
}

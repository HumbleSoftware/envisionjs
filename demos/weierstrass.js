function example () {

  var E = Flotr.EventAdapter,
    container = document.getElementById('demo'),
    a = 2, // Weierstrass a 
    count = 600,
    min = -1,
    max = 1,
    data,
    i, k, x, y, t;

  function weierstrass (min, max, count) {

    var
      data = [],
      step = (max - min) / count,
      x = min,
      i, j;

    for (i = 0; i <= count; i++, x += step) {
      y = 0;
      for (j = 1; j < 100; j++) {
        t = Math.PI * Math.pow(j, a);
        y += Math.sin(t * x) / t; 
      }
      data.push([x, y]);
    }

    return data;
  }

  data = weierstrass(min, max, count);

  var H = Humble.Vis,
    mainOptions = {},
    summaryOptions = {},
    v, main, summary, interaction;

  // Config
  mainOptions.height = 260;
  mainOptions.width = 600;
  mainOptions.data  = data;
  mainOptions.flotr = {};

  summaryOptions.height = 140;
  summaryOptions.width = 600;
  summaryOptions.data  = data;
  summaryOptions.flotr = {
    handles : {
      show : true
    },
    selection : {
      mode : 'x'
    }
  };

  v = new H.Visualization,
  main = new H.Child(mainOptions),
  summary = new H.Child(summaryOptions),

  v.add(main);
  v.add(summary);
  v.render(document.getElementById('demo'));

  interaction = new H.Interaction({leader : summary});
  interaction.add(H.Action.Selection);
  interaction.follow(main);
}

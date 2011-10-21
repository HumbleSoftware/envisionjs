function example () {

  // Weierstrass Function Constructor
  function weierstrass () {

    var
      a = 2, // Weierstrass a 
      i, k, x, y, t;

    function data (min, max, resolution) {

      var
        d     = [],
        step  = (max - min) / resolution,
        x     = min,
        i, j;

      for (i = 0; i <= resolution; i++, x += step) {
        y = 0;
        for (j = 1; j < 100; j++) {
          t = Math.PI * Math.pow(j, a);
          y += Math.sin(t * x) / t; 
        }
        d.push([x, y]);
      }

      return d;
    }

    return data;
  }

  var
    container       = document.getElementById('demo'),
    H               = Humble.Vis,
    mainOptions     = {
      height  : 200,
      width   : 600,
      data    : weierstrass(),
      flotr   : {
        xaxis : {
          min : -1,
          max : 1
        }
      }
    },
    summaryOptions  = {
      height  : 200,
      width   : 600,
      data    : weierstrass(),
      flotr : {
        handles : {
          show : true
        },
        selection : {
          mode : 'x'
        },
        xaxis : {
          min : -1,
          max : 1
        }
      }
    },
    v, main, summary, interaction;

  // Visualization
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

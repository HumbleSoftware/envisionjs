function example () {

  var
    progress = document.getElementById('progress'),
    container = document.getElementById('demo'),
    hash = window.location.hash,
    H = Humble.Vis;

  if (hash === '#generator') {

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
          it,
          i, j;

        if (max - min < .05) {
          it = 250;
        } else if (max - min < .5) {
          it = 125;
        } else {
          it = 50;
        }

        for (i = 0; i <= resolution; i++, x += step) {
          y = 0;
          for (j = 1; j < it; j++) {
            t = Math.PI * Math.pow(j, a);
            y += Math.sin(t * x) / t; 
          }
          d.push([x, y]);
        }

        progress.innerHTML = "100";

        return d;
      }

      return data;
    }

    var
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

  } else {

    var
      count = 1e6,
      data = [],
      a = 2, // Weierstrass a 
      step = count / 100,
      i = 0,
      j = 0,
      iMax = count / step,
      jMax = step * (i + 1),
      k, x, y, t;

    console.time('data generation');
    weierstrassStep(i, jMax);

    function weierstrassStep (i, jMax) {
      progress.innerHTML = i;
      for (j = step * i; j < jMax; j++) {
        x = -1 + j * 2 / count;
        y = 0;
        for (k = 1; k < 200; k++) {
          t = Math.PI * Math.pow(k, a);
          y += Math.sin(t * x) / t; 
        }
        data.push([x, y]);
      }
      if (i == iMax - 1) {
        console.timeEnd('data generation');
        progress.innerHTML = 100;
        letsWomp();
      } else {
        i = i+1;
        jMax = step * (i + 1);
        setTimeout(_.bind(weierstrassStep, null, i, jMax), 2);
      }
    }

    // womp womp womp
    function letsWomp () {

      var
        mainOptions = {},
        summaryOptions = {},
        v, main, summary, interaction;

      // Config
      mainOptions.height = 200;
      mainOptions.width = 600;
      mainOptions.data  = data;
      mainOptions.flotr = {};

      summaryOptions.height = 200;
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
  }


}

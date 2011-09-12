function example () {

  var E = Flotr.EventAdapter,
    count = 1e6,
    data = [],
    progress = document.getElementById('progress'),
    container = document.getElementById('demo'),
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
      for (k = 1; k < 100; k++) {
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
}

function example () {

  var container = document.getElementById('demo'),
    H = Humble.Vis,
    E = Flotr.EventAdapter,
    data = [],

    mainOptions = {
      height  : 260,
      width   : 600,
      data    : data,
      flotr   : {}
    },

    summaryOptions = {
      height  : 140,
      width   : 600,
      data    : data,
      flotr   : {
        handles : { show : true },
        selection : { mode : 'x'}
      }
    },

    vis, main, summary, interaction, i;

  console.time('data generation');
  for (i = 0; i < 1e6; i++) {
    data.push([i/10000, .2*Math.sin(i/10000) + i/100000 + .05*Math.sin(i/50)]);
    /*
    data.push(i/10000);
    data.push(.2*Math.sin(i/10000) + i/100000 + .05*Math.sin(i/50));
    */
  }
  console.timeEnd('data generation');

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

function example () {

  var container = document.getElementById('demo'),
    H = Humble.Vis,
    E = Flotr.EventAdapter,
    data = [],

    priceOptions = {
      height  : 240,
      width   : 600,
      data    : priceData,
      flotr   : {}
    },

    volumeOptions = {
      height  : 80,
      width   : 600,
      data    : volumeData,
      flotr   : {
        bars : { show : true }
      }
    },

    summaryOptions = {
      height  : 80,
      width   : 600,
      data    : priceData,
      flotr   : {
        handles   : { show : true },
        selection : { mode : 'x'}
      }
    },

    vis, price, volume, summary, interaction;

  vis = new H.Visualization();
  price = new H.Child(priceOptions);
  volume = new H.Child(volumeOptions);
  summary = new H.Child(summaryOptions);
  interaction = new H.Interaction({leader : summary});

  vis.add(price);
  vis.add(volume);
  vis.add(summary);
  vis.render(container);

  interaction.follow(price);
  interaction.follow(volume);
}

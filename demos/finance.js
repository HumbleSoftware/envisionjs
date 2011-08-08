function example () {

  var container = document.getElementById('demo'),
    H = Humble.Vis,
    E = Flotr.EventAdapter,
    data = [],

    priceOptions = {
      height  : 240,
      width   : 600,
      data    : priceData,
      flotr   : {
        yaxis : { 
          noTicks : 3,
          showLabels : true,
          min : 0,
          tickFormatter : function (n) {
            return (n == this.max ? false : '$'+n);
          }
        }
      }
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
        xaxis : {
          noTicks: 5,
          showLabels : true,
          tickFormatter : function (n) {
            return (parseInt(n) === 0 ? false : jsonData[n].date.split(' ')[2]);
          }
        },
        handles   : { show : true },
        selection : { mode : 'x'},
        grid : {
          verticalLines : false
        }
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

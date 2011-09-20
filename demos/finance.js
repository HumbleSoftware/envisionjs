function example () {

  // Configuraiton

  var container = document.getElementById('demo'),
    H = Humble.Vis,
    E = Flotr.EventAdapter,
    data = [],

    priceOptions = {
      name    : 'price',
      height  : 240,
      width   : 600,
      data    : priceData,
      flotr   : {
        lines : {
          fill : true,
          fillOpacity : .2
        },
        mouse : {
          track: true,
          trackY: false,
          sensibility: 1,
          trackDecimals: 4,
          trackFormatter: function (o) {
            var data = jsonData[o.nearest.x];
            return data.date + " Price: " + data.close + " Vol: " + data.volume;
          },
          position: 'ne'
        },
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
      name    : 'volume',
      height  : 80,
      width   : 600,
      data    : volumeData,
      flotr   : {
        bars : { show : true },
        mouse: {
          track: true,
          trackY: false,
          position: 'ne',
          trackDecimals: 0
        }
      }
    },

    summaryOptions = {
      name    : 'summary',
      height  : 80,
      width   : 600,
      data    : priceData,
      flotr   : {
        lines : {
          fill : true,
          fillOpacity : .2
        },
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

    vis, price, volume, summary, selection, hit;


  // Application

  vis = new H.Visualization();
  price = new H.Child(priceOptions);
  volume = new H.Child(volumeOptions);
  summary = new H.Child(summaryOptions);
  selection = new H.Interaction({leader : summary});
  hit = new H.Interaction();

  vis.add(price);
  vis.add(volume);
  vis.add(summary);
  vis.render(container);

  selection.add(H.Action.Selection);
  selection.follow(price);
  selection.follow(volume);

  hit.add(H.Action.Hit);
  hit.group([price, volume]);
}


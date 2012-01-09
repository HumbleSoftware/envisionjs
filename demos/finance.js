function example () {

  // Configuraiton
  var
    H = humblevis,
    E = Flotr.EventAdapter,

    container = document.getElementById('demo'),

    priceOptions = {
      name    : 'price',
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
            return jsonData[n].date.split(' ')[2];
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

  selection.add(H.action.selection);
  selection.follow(price);
  selection.follow(volume);

  hit.add(H.action.hit);
  hit.group([price, volume]);
}


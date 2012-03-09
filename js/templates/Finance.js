(function () {

var
  V = envision;

// Custom data processor
function processData (options) {

  var
    resolution = options.resolution;

  options.preprocessor
    .bound(options.min, options.max)
    .subsampleMinMax(resolution + Math.round(resolution / 3));
}

function getDefaults () {
  return {
    price : {
      name : 'envision-finance-price',
      flotr : {
        'lite-lines' : {
          lineWidth : 1,
          show : true,
          fill : true,
          fillOpacity : .2
        },
        mouse : {
          track: true,
          trackY: false,
          trackAll: true,
          sensibility: 1,
          trackDecimals: 4,
          /*
          trackFormatter: function (o) {
            var data = jsonData[o.nearest.x];
            return data.date + " Price: " + data.close + " Vol: " + data.volume;
          },
          */
          position: 'ne'
        },
        yaxis : { 
          autoscale : true,
          autoscaleMargin : 0.05,
          noTicks : 4,
          showLabels : true,
          min : 0,
          tickFormatter : function (n) {
            return '$' + n;
          }
        }
      },
      processData : processData
    },
    volume : {
      name : 'envision-finance-volume',
      flotr : {
        whiskers : {
          show : true,
          lineWidth : 2
        },
        mouse: {
          track: true,
          trackY: false,
          trackAll: true,
          position: 'ne',
          trackDecimals: 0
        }
      },
      processData : processData
    },
    summary : {
      name : 'envision-finance-summary',
      flotr : {
        'lite-lines' : {
          show : true,
          lineWidth : 1,
          fill : true,
          fillOpacity : .2,
          fillBorder : true
        },
        xaxis : {
          noTicks: 5,
          showLabels : true/*,
          tickFormatter : function (n) {
            return jsonData[n].date.split(' ')[2];
          }
          */
        },
        yaxis : {
          autoscale : true,
          autoscaleMargin : .1
        },
        handles : {
          show : true
        },
        selection : {
          mode : 'x'
        },
        grid : {
          verticalLines : false
        }
      }
    },
    connection : {
      name : 'envision-finance-connection',
      drawing : V.QuadraticDrawing
    }
  };
}

function Finance (options) {

  var
    data = options.data,
    defaults = getDefaults(),
    vis = new V.Visualization(),
    selection = new V.Interaction(),
    hit = new V.Interaction(),
    price, volume, connection, summary;

  defaults.price.data = data.price;
  defaults.volume.data = data.volume;
  defaults.summary.data = data.summary;

  price = new V.Child(defaults.price),
  volume = new V.Child(defaults.volume),
  connection = new V.Child(defaults.connection),
  summary = new V.Child(defaults.summary),

  // Render visualization
  vis
    .add(price)
    .add(volume)
    .add(connection)
    .add(summary)
    .render(options.container);

  // Define the selection zooming interaction
  selection
    .follower(price)
    .follower(volume)
    .follower(connection)
    .leader(summary)
    .add(V.action.selection);

  // Define the mouseover hit interaction
  hit
    .group([price, volume])
    .add(V.action.hit);

  // Optional initial selection
  if (options.selection) {
    summary.trigger(summary, 'select', options.selection);
  }

  // Members
  this.vis = vis;
  this.selection = selection;
  this.hit = hit;
}

V.templates.Finance = Finance;

})();

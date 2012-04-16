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
      config : {
        'lite-lines' : {
          lineWidth : 1,
          show : true,
          fill : true,
          fillOpacity : 0.2
        },
        mouse : {
          track: true,
          trackY: false,
          trackAll: true,
          sensibility: 1,
          trackDecimals: 4,
          position: 'ne'
        },
        yaxis : { 
          autoscale : true,
          autoscaleMargin : 0.05,
          noTicks : 4,
          showLabels : true,
          min : 0
        }
      },
      processData : processData
    },
    volume : {
      name : 'envision-finance-volume',
      config : {
        whiskers : {
          show : true,
          lineWidth : 2
        },
        mouse: {
          track: true,
          trackY: false,
          trackAll: true
        },
        yaxis : {
          autoscale : true,
          autoscaleMargin : 0.5 
        }
      },
      processData : processData
    },
    summary : {
      name : 'envision-finance-summary',
      config : {
        'lite-lines' : {
          show : true,
          lineWidth : 1,
          fill : true,
          fillOpacity : 0.2,
          fillBorder : true
        },
        xaxis : {
          noTicks: 5,
          showLabels : true
        },
        yaxis : {
          autoscale : true,
          autoscaleMargin : 0.1
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
      adapterConstructor : V.components.QuadraticDrawing
    }
  };
}

function Finance (options) {

  var
    data = options.data,
    defaults = getDefaults(),
    vis = new V.Visualization({name : 'envision-finance'}),
    selection = new V.Interaction(),
    hit = new V.Interaction(),
    price, volume, connection, summary;

  if (options.defaults) {
    defaults = Flotr.merge(options.defaults, defaults);
  }

  defaults.price.data = data.price;
  defaults.volume.data = data.volume;
  defaults.summary.data = data.summary;

  defaults.price.config.mouse.trackFormatter = options.trackFormatter || function (o) {

    var
      index = o.index,
      value;

    if (price.api.preprocessor) {
      index += price.api.preprocessor.start;
    }

    value = 'Price: $' + data.price[1][index] + ", Vol: " + data.volume[1][index];

    return value;
  };
  if (options.xTickFormatter) {
    defaults.summary.config.xaxis.tickFormatter = options.xTickFormatter;
  }
  defaults.price.config.yaxis.tickFormatter = options.yTickFormatter || function (n) {
    return '$' + n;
  };

  price = new V.Component(defaults.price);
  volume = new V.Component(defaults.volume);
  connection = new V.Component(defaults.connection);
  summary = new V.Component(defaults.summary);

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
    .add(V.actions.selection, options.selectionCallback ? { callback : options.selectionCallback } : null);

  // Define the mouseover hit interaction
  hit
    .group([price, volume])
    .add(V.actions.hit);

  // Optional initial selection
  if (options.selection) {
    summary.trigger('select', options.selection);
  }

  // Members
  this.vis = vis;
  this.selection = selection;
  this.hit = hit;
  this.price = price;
  this.volume = volume;
  this.summary = summary;
}

V.templates.Finance = Finance;

})();

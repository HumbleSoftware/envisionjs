// Envision.js
// (c) 2012 Carl Sutherland, Humble Software
// Distributed under the MIT License
// Source: http://www.github.com/HumbleSoftware/envisionjs
// Homepage: http://www.humblesoftware.com/envision

/**
 * Templates namespace.
 *
 * Templates are pre-built interactive visualizations fitting common
 * use-cases.  These include several components together with 
 * interactions and configuration for each.  They may have their own
 * custom configuration options as well.
 */
envision.templates = envision.templates || {};

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
      flotr : {
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
          autoscaleMargin : .5 
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
    defaults = Flotr.merge(defaults, options.defaults);
  }

  defaults.price.data = data.price;
  defaults.volume.data = data.volume;
  defaults.summary.data = data.summary;

  defaults.price.flotr.mouse.trackFormatter = options.trackFormatter || function (o) {

    var
      index = o.index,
      value = 'Price: $' + data.price[1][index] + ", Vol: " + data.volume[1][index],
      day;

    return value;
  };
  if (options.xTickFormatter) {
    defaults.summary.flotr.xaxis.tickFormatter = options.xTickFormatter;
  }
  defaults.price.flotr.yaxis.tickFormatter = options.yTickFormatter || function (n) {
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

(function () {

var
  V = envision;

function getDefaults () {
  return {
    detail : {
      name : 'envision-timeseries-detail',
      flotr : {

      }
    },
    summary : {
      name : 'envision-timeseries-summary',
      flotr : {
        handles : {
          show : true
        },
        selection : {
          mode : 'x'
        },
        yaxis : {
          autoscale : true,
          autoscaleMargin : 0.1
        }
      }
    },
    connection : {
      name : 'envision-timeseries-connection',
      adapterConstructor : V.components.QuadraticDrawing
    }
  };
}

function TimeSeries (options) {

  var
    data = options.data,
    defaults = getDefaults(),
    vis = new V.Visualization({name : 'envision-timeseries'}),
    selection = new V.Interaction(),
    detail, summary, connection;

  // Fill Defaults
  if (options.defaults) {
    defaults = Flotr.merge(defaults, options.defaults);
  }
  defaults.detail.data = data.detail;
  defaults.summary.data = data.summary;

  // Build Components
  detail = new V.Component(defaults.detail);
  connection = new V.Component(defaults.connection);
  summary = new V.Component(defaults.summary);

  // Render visualization
  vis
    .add(detail)
    .add(connection)
    .add(summary)
    .render(options.container);

  // Selection action
  selection
    .add(V.actions.selection)
    .follower(detail)
    .follower(connection)
    .leader(summary);

  // Optional initial selection
  if (options.selection) {
    summary.trigger('select', options.selection);
  }

  this.vis = vis;
  this.selection = selection;
  this.detail = detail;
  this.summary = summary;
};

V.templates.TimeSeries = TimeSeries;

})();

(function () {

var
  V = envision,
  Zoom;

function defaultsZoom () {
  return {
    name : 'zoom',
    flotr : {}
  };
}

function defaultsSummary () {
  return {
    name : 'summary',
    flotr : {
      handles : { show : true },
      selection : { mode : 'x'}
    }
  };
}

function getDefaults (options, defaults) {
  var o = _.defaults(options, defaults);
  o.flotr = _.defaults(o.flotr, defaults.flotr);
  return o;
}

Zoom = function (options) {

  var
    vis = new V.Visualization(),
    zoom = new V.Component(getDefaults(options.zoom || {}, defaultsZoom())),
    summary = new V.Component(getDefaults(options.summary || {}, defaultsSummary())),
    interaction = new V.Interaction({leader : summary});

  vis
    .add(zoom)
    .add(summary);

  interaction.add(V.actions.selection);
  interaction.follower(zoom);

  this.vis = vis;
  this.interaction = interaction;

  if (options.container) {
    this.render(options.container);
  }
};

Zoom.prototype = {
  render : function (container) {
    this.vis.render(container);
  }
};

V.templates.Zoom = Zoom;

})();

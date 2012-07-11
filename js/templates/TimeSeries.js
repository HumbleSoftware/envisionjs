(function () {

var
  V = envision;

function getDefaults () {
  return {
    detail : {
      name : 'envision-timeseries-detail',
      config : {
        'lite-lines' : {
            lineWidth : 1,
            show : true
        }
      }
    },
    summary : {
      name : 'envision-timeseries-summary',
      config : {
        'lite-lines' : {
            lineWidth : 1,
            show : true
        },
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
    defaults = Flotr.merge(options.defaults, defaults);
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
    .follower(detail)
    .follower(connection)
    .leader(summary)
    .add(V.actions.selection, options.selectionCallback ? { callback : options.selectionCallback } : null);

  // Optional initial selection
  if (options.selection) {
    summary.trigger('select', options.selection);
  }

  this.vis = vis;
  this.selection = selection;
  this.detail = detail;
  this.summary = summary;
}

V.templates.TimeSeries = TimeSeries;

})();

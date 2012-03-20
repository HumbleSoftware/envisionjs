(function () {

var
  V = envision,
  Zoom;

function defaultsZoom () {
  return {
    name : 'zoom'
  };
}

function defaultsSummary () {
  return {
    name : 'summary',
    config : {
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

(function () {

var
  V = Humble.Vis,
  Zoom;

function defaultsZoom () {
  return {
    flotr : {}
  };
}

function defaultsSummary () {
  return {
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
    zoom = new V.Child(getDefaults(options.zoom || {}, defaultsZoom())),
    summary = new V.Child(getDefaults(options.summary || {}, defaultsSummary())),
    interaction = new V.Interaction({leader : summary});

  vis.add(zoom);
  vis.add(summary);

  interaction.add(V.Action.Selection);
  interaction.follow(zoom);

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

Humble.Vis.templates.Zoom = Zoom;

})();

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

Zoom = function (options) {

  var
    vis = new V.Visualization(),
    zoom = new V.Child(_.extend(defaultsZoom(), options.zoom || {})),
    summary = new V.Child(_.extend(defaultsSummary(), options.summary || {})),
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

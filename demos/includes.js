yepnope([
  // Libs
  '../flotr2/lib/bean.js',
  '../flotr2/lib/underscore-min.js',
  {
  test : (navigator.appVersion.indexOf("MSIE") != -1  && parseFloat(navigator.appVersion.split("MSIE")[1]) < 9),
    // Load for IE < 9
    yep : [
      '../flotr2/lib/excanvas.js',
      '../flotr2/lib/base64.js'
    ]
  },
  '../flotr2/lib/canvas2image.js',
  '../flotr2/lib/canvastext.js',
  '../lib/bonzo/bonzo.min.js',

  // Flotr
  '../flotr2/js/Flotr.js',
  '../flotr2/js/DefaultOptions.js',
  '../flotr2/js/Color.js',
  '../flotr2/js/Date.js',
  '../flotr2/js/DOM.js',
  '../flotr2/js/EventAdapter.js',
  '../flotr2/js/Graph.js',
  '../flotr2/js/Axis.js',
  '../flotr2/js/Series.js',
  '../flotr2/js/Text.js',
  '../flotr2/js/types/lines.js',
  '../flotr2/js/types/bars.js',
  '../flotr2/js/types/points.js',
  '../flotr2/js/plugins/selection.js',
  '../flotr2/js/plugins/legend.js',
  '../flotr2/js/plugins/handles.js',
  '../flotr2/js/plugins/hit.js',
  '../flotr2/js/plugins/crosshair.js',
  '../flotr2/js/plugins/labels.js',
  '../flotr2/js/plugins/legend.js',
  '../flotr2/js/plugins/titles.js',
  '../flotr2/js/types/gantt.js',

  // Visualization
  '../js/Vis.js',
  '../js/Visualization.js',
  '../js/Interaction.js',
  '../js/Action.Selection.js',
  '../js/Action.Hit.js',
  '../js/Data.js',
  '../js/flotr/namespace.js',
  '../js/flotr/defaultOptions.js',
  '../js/flotr/Child.js',

  { complete : example }
]);

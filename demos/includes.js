yepnope([
  // Libs
  '../flotr2/lib/bean-min.js',
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

  // Flotr
  '../flotr2/js/Flotr.js',
  '../flotr2/js/Flotr.defaultOptions.js',
  '../flotr2/js/Flotr.Color.js',
  '../flotr2/js/Flotr.Date.js',
  '../flotr2/js/Flotr.DOM.js',
  '../flotr2/js/Flotr.EventAdapter.js',
  '../flotr2/js/Flotr.Graph.js',
  '../flotr2/js/types/lines.js',
  '../flotr2/js/types/bars.js',
  '../flotr2/js/types/points.js',
  '../flotr2/js/plugins/selection.js',
  '../flotr2/js/plugins/legend.js',
  '../flotr2/js/plugins/handles.js',

  // Visualization
  '../js/Vis.js',
  '../js/Visualization.js',
  '../js/Child.js',
  '../js/Interaction.js',

  { complete : example }
]);

window.FlashCanvasOptions = {
  swfPath: 'lib/FlashCanvas/bin/'
};
yepnope([

  'lib/jquery/jquery-1.7.1.min.js',

  // IE
  {
    test : (navigator.appVersion.indexOf("MSIE") != -1  && parseFloat(navigator.appVersion.split("MSIE")[1]) < 9),
    yep : [
      'lib/flotr2/lib/base64.js'
    ]
  },
  {
    test : (navigator.appVersion.indexOf("MSIE") != -1),
    yep : [
      'lib/FlashCanvas/bin/flashcanvas.js'
    ]
  },

  // Libs
  'flotr2.min.js',
  {
    test : ('ontouchstart' in window),
    nope : [
      'handles.js'
    ]
  },
  'lib/bonzo/bonzo.min.js',
  'envision.min.js',

  { complete : example }
]);

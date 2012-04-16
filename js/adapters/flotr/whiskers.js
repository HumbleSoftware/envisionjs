/** Bars **/
Flotr.addType('whiskers', {

  options: {
    show: false,           // => setting to true will show bars, false will hide
    lineWidth: 2,          // => in pixels
    barWidth: 1,           // => in units of the x axis
    fill: true,            // => true to fill the area from the line to the x axis, false for (transparent) no fill
    fillColor: null,       // => fill color
    fillOpacity: 0.4,      // => opacity of the fill color, set to 1 for a solid fill, 0 hides the fill
    horizontal: false,     // => horizontal bars (x and y inverted)
    stacked: false,        // => stacked bar charts
    centered: true         // => center the bars to their x axis value
  },

  stack : { 
    positive : [],
    negative : [],
    _positive : [], // Shadow
    _negative : []  // Shadow
  },

  draw : function (options) {
    var
      context = options.context;

    context.save();
    context.lineJoin = 'miter';
    context.lineCap = 'butt';
    context.lineWidth = options.lineWidth;
    context.strokeStyle = options.color;
    if (options.fill) context.fillStyle = options.fillStyle;
    
    this.plot(options);

    context.restore();
  },

  plot : function (options) {

    var
      data            = options.data,
      context         = options.context,
      shadowSize      = options.shadowSize,
      xScale          = options.xScale,
      yScale          = options.yScale,
      zero            = yScale(0),
      i, x;

    if (data.length < 1) return;

    context.translate(-options.lineWidth, 0);
    context.beginPath();
    for (i = 0; i < data.length; i++) {
      x = xScale(data[i][0]);
      context.moveTo(x, zero);
      context.lineTo(x, yScale(data[i][1]));
    }

    context.closePath();
    context.stroke();
  },

  drawHit : function (options) {

    var
      args            = options.args,
      context         = options.context,
      shadowSize      = options.shadowSize,
      xScale          = options.xScale,
      yScale          = options.yScale,
      zero            = yScale(0),
      x               = xScale(args.x),
      y               = yScale(args.y);

    context.save();
    context.translate(-options.lineWidth, 0);
    context.beginPath();
    context.moveTo(x, zero);
    context.lineTo(x, y);
    context.closePath();
    context.stroke();
    context.restore();
  },

  clearHit: function (options) {

    var
      args            = options.args,
      context         = options.context,
      shadowSize      = options.shadowSize,
      xScale          = options.xScale,
      yScale          = options.yScale,
      lineWidth       = options.lineWidth,
      zero            = yScale(0),
      x               = xScale(args.x),
      y               = yScale(args.y);

    context.save();
    context.clearRect(x - 2 * lineWidth, y - lineWidth, 4 * lineWidth, zero - y + lineWidth);
    context.restore();
  }
});

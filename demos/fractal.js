function example () {

  Flotr.addType('fractal', {
    options: {
      show: false // => setting to true will show lines, false will hide
    },
    /**
     * Draws lines series in the canvas element.
     * @param {Object} series - Series with options.lines.show = true.
     */
    draw : function (options) {

      var
        range     = options.data,
        context   = options.context,
        width     = options.width,
        height    = options.height,
        minRe     = range[0][0],
        maxRe     = range[1][0],
        minIm     = range[1][1],
        maxIm     = range[0][1],
        reFactor  = (maxRe - minRe) / (width - 1),
        imFactor  = (maxIm - minIm) / (height - 1),
        max       = 50,
        row, column, n, index,
        c_r, c_i, 
        z_r, z_i,
        z_r2, z_i2,
        inside;

      var
        image = context.getImageData(0, 0, width, height),
        data = image.data;

      for (row = 0; row < height; row++) {

        c_i = maxIm - row * imFactor;

        for (column = 0; column < width; column++) {

          c_r = minRe + column * reFactor;
          z_r = c_r;
          z_i = c_i;
          inside = true;

          for (n = 0; n < max; n++) {
            z_r2 = z_r * z_r;
            z_i2 = z_i * z_i;
            if (z_r2 + z_i2 > 4) {
              inside = false;
              break;
            }

            z_i = 2 * z_r * z_i + c_i;
            z_r = z_r2 - z_i2 + c_r;
          }

          index = row * width * 4 + column * 4;
          data[index + 3] = 255;
          var r;
          if (!inside) {
            data[index + 2] = Math.min(255, Math.round(Math.abs(255 * n / max)));
            if (n >= 25) {
              data[index] = 100 - (max - n) * 20;
              data[index + 1] = 100 - (max - n) * 20;
            }
          } else {
            data[index + 2] = 80;
          }
        }
      }

      context.putImageData(image, 0, 0);
    }
  });

  var
    container = document.getElementById('demo'),
    E = Flotr.EventAdapter,
    H = envision,
    fractalOptions = {
      data : [[-2, 1.2], [1, -1.2]],
      width : 598,
      height : 456,
      flotr : {
        fractal : {
          show : true
        },
        selection : {
          mode : 'xy'
        }
      }
    },
    vis, zoom, zoomConfig;

  vis = new H.Visualization();
  fractal = new H.Child(fractalOptions);
  zoom = new H.Interaction({leader : fractal});

  vis
    .add(fractal)
    .render(container);

  zoomConfig = {
    callback : function (o) {
      var
        xaxis = o.xaxis,
        yaxis = o.yaxis || {},
        xmin = xaxis.min || -2,
        xmax = xaxis.max || 1,
        ymin = yaxis.min || -1.2,
        ymax = yaxis.max || 1.2;
      fractal.draw([
        [xmin, ymax],
        [xmax, ymin]
      ]);
    }
  };

  zoom.add(H.actions.selection, zoomConfig);
}

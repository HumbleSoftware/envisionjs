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
        context   = options.context,
        width     = options.width,
        height    = options.height,
        minRe     = -2.0,
        maxRe     = 1.0,
        minIm     = -1.2,
        maxIm     = minIm + (maxRe - minRe) * height / width,
        reFactor  = (maxRe - minRe) / (width - 1),
        imFactor  = (maxIm - minIm) / (height - 1),
        max       = 30,
        i, j, k,
        c_r, c_i, 
        z_r, z_i,
        z_r2, z_i2,
        inside;

      context.beginPath();

      for (i = 0; i < height; ++i) {

        c_i = maxIm - i * imFactor;

        for (j = 0; j < width; ++j) {

          c_r = minRe + j * reFactor;
          z_r = c_r;
          z_i = c_i;
          inside = true;

          for (k = 0; k < max; k++) {
            z_r2 = z_r * z_r;
            z_i2 = z_i * z_i;
            if (z_r2 + z_i2 > 4) {
              inside = false;
              break;
            }

            z_i = 2 * z_r * z_i + c_i;
            z_r = z_r2 - z_i2 + c_r;
          }

          if (inside) {
            context.moveTo(j, i);
            context.lineTo(j+1, i+0);
          }
        }
      }

      context.closePath();
      context.stroke();
    }
  });

  var
    container = document.getElementById('demo'),
    E = Flotr.EventAdapter,
    summary = {
      data : [[-1, 1], [1, -1]],
      flotr : {
        fractal : {
          show : true
        }
      }
    },
    zoom = {
      data : [[-1, 1], [1, -1]],
      flotr : {
        fractal : {
          show : true
        }
      }
    },
    fractal;

  // Zoom template:
  fractal = new humblevis.templates.Zoom({
    container : container,
    summary : summary,
    zoom : zoom
  });
}

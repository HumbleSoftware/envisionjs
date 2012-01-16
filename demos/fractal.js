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
            if (n > 25) {
              data[index] = 155 - (max - n) * 30;
              data[index + 1] = 155 - (max - n) * 30;
            }
          } else {
            data[index + 2] = 120;
          }
        }
      }

      context.putImageData(image, 0, 0);
    }
  });

  var
    container = document.getElementById('demo'),
    E = Flotr.EventAdapter,
    summary = {
      data : [[-1, 1], [1, -1]],
      width : 598,
      height : 456,
      flotr : {
        fractal : {
          show : true
        }
      }
    },
    zoom = {
      data : [[-1, 1], [1, -1]],
      width : 598,
      height : 456,
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

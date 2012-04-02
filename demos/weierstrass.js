function example () {

  var
    progress = document.getElementById('progress'),
    container = document.getElementById('demo'),
    hash = window.location.hash;

  if (hash === '#generator') {

    // Weierstrass Function Constructor
    function weierstrass (min, max, resolution) {

      var
        a     = 2, // Weierstrass a 
        dataX = [],
        dataY = [],
        data  = [dataX, dataY],
        step  = (max - min) / resolution,
        x     = min,
        y     = 0,
        iterations, i, j;

      // Dynamic iterations based upon range
      if (max - min < .05) {
        iterations = 250;
      } else if (max - min < .5) {
        iterations = 125;
      } else {
        iterations = 50;
      }

      //console.time('weier');
      for (i = 0; i <= resolution; i++, x += step) {
        y = 0;
        for (j = 1; j < iterations; j++) {
          t = Math.PI * Math.pow(j, a);
          y += Math.sin(t * x) / t; 
        }
        dataX.push(x);
        dataY.push(y);
      }
      //console.timeEnd('weier');

      return data;
    }

    // Render Zoom template
    new envision.templates.TimeSeries({
      name : 'weierstrass',
      container : container,
      data : {
        detail : weierstrass,
        summary : weierstrass 
      },
      defaults : {
        detail : {
          config : {
            xaxis : {
              min : -1,
              max : 1
            }
          }
        },
        summary : {
          config : {
            yaxis : {
              autoscale : false,
              autoscaleMargin : 0
            },
            xaxis : {
              min : -1,
              max : 1
            }
          }
        }
      }
    });

    progress.innerHTML = "100";

  } else {

    var
      count = 1e6,
      dataX = [],
      dataY = [],
      data = [dataX, dataY],
      a = 2, // Weierstrass a 
      step = count / 100,
      i = 0,
      j = 0,
      iMax = count / step,
      jMax = step * (i + 1),
      k, x, y, t;

    //console.time('data generation');
    weierstrassStep(i, jMax);

    function weierstrassStep (i, jMax) {
      progress.innerHTML = i;
      for (j = step * i; j < jMax; j++) {
        x = -1 + j * 2 / count;
        y = 0;
        for (k = 1; k < 200; k++) {
          t = Math.PI * Math.pow(k, a);
          y += Math.sin(t * x) / t; 
        }
        dataX.push(x);
        dataY.push(y);
      }
      if (i == iMax - 1) {
        //console.timeEnd('data generation');
        progress.innerHTML = 100;
        letsWomp();
      } else {
        i = i+1;
        jMax = step * (i + 1);
        setTimeout(_.bind(weierstrassStep, null, i, jMax), 2);
      }
    }

    // womp womp womp
    function letsWomp () {
      // Render Zoom template
      new envision.templates.TimeSeries({
        name : 'weierstrass',
        container : container,
        data : {
          detail : data,
          summary : data
        },
        defaults : {
          summary : {
            config : {
              yaxis : {
                autoscale : false
              }
            }
          }
        }
      });
    }
  }
}

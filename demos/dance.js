function example () {

  var
    E = envision,
    FILE = 'dance/demo/lib/zircon_devils_spirit.ogg',
    container = document.getElementById('demo'),
    lineOptions = {
      data : [[],[]],
      config : {
        'lite-lines' : {
          show : true,
          fill : true
        },
        yaxis : {
          min : 0,
          max : 0.5
        }
      }
    },
    line = new E.Component(lineOptions),
    vis = new E.Visualization(),
    dance = new Dance(FILE);

  vis
    .add(line)
    .render(container);

  dance
    .play();

  var
    x = [],
    y = [],
    beatTime;
  dance.after(0, function () {

    dance.onBeat(5, 0.08, function () {

      var
        a = dance.audioAdapter.getSpectrum(),
        i;

      beatTime = +new Date();

      for (i = 0; i < a.length; i++) {
        x[i] = i;
        y[i] = a[i];
      }

      line.draw([x, y]);

    }, function () {

      var
        time = new Date() - beatTime;

      for (i = 0; i < y.length; i++) {
        y[i] *= .90;
      }

      line.draw([x, y], {});
    });
  });

  /*
  setTimeout(function () {

    setInterval(function () {
      console.time('test');
      var
        a = dance.audioAdapter.getSpectrum(),
        x = [],
        y = [],
        i;

      for (i = 0; i < a.length; i++) {
        x[i] = i;
        y[i] = a[i];
      }
      line.draw([x, y]);
      window.a = a;
      console.timeEnd('test');
    }, 60);

  }, 500);
  */
}

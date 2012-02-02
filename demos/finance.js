function example () {

  // Configuraiton
  var
    H = humblevis,

    container = document.getElementById('demo'),

    priceOptions = {
      name    : 'price',
      data    : priceData,
      flotr   : {
        lines : {
          fill : true,
          fillOpacity : .2
        },
        mouse : {
          track: true,
          trackY: false,
          sensibility: 1,
          trackDecimals: 4,
          trackFormatter: function (o) {
            var data = jsonData[o.nearest.x];
            return data.date + " Price: " + data.close + " Vol: " + data.volume;
          },
          position: 'ne'
        },
        yaxis : { 
          noTicks : 3,
          showLabels : true,
          min : 0,
          tickFormatter : function (n) {
            return (n == this.max ? false : '$'+n);
          }
        }
      }
    },

    volumeOptions = {
      name    : 'volume',
      data    : volumeData,
      flotr   : {
        bars : { show : true },
        mouse: {
          track: true,
          trackY: false,
          position: 'ne',
          trackDecimals: 0
        }
      }
    },

    summaryOptions = {
      name    : 'summary',
      data    : priceData,
      flotr   : {
        lines : {
          fill : true,
          fillOpacity : .2
        },
        xaxis : {
          noTicks: 5,
          showLabels : true,
          tickFormatter : function (n) {
            return jsonData[n].date.split(' ')[2];
            return (parseInt(n) === 0 ? false : jsonData[n].date.split(' ')[2]);
          }
        },
        yaxis : {
          autoscale : true,
          autoscaleMargin : .1
        },
        handles   : { show : true },
        selection : { mode : 'x'},
        grid : {
          verticalLines : false
        }
      }
    },

    connectionOptions = {
      name : 'connection'
    },

    vis, price, volume, summary, connection, selection, hit;


  // Application

  vis = new H.Visualization();
  price = new H.Child(priceOptions);
  volume = new H.Child(volumeOptions);
  summary = new H.Child(summaryOptions);
  connection = new H.Child(connectionOptions);
  selection = new H.Interaction({leader : summary});
  hit = new H.Interaction();

  connection.api = {
    height : null,
    width : null,
    rendered : false,
    render : function (node) {
      var
        canvas = bonzo.create('<canvas></canvas>')[0],
        offset = bonzo(node).offset();

      this.height = offset.height;
      this.width = offset.width;

      bonzo(canvas)
        .attr('height', offset.height)
        .attr('width', offset.width)
        .css({
          position : 'absolute',
          top : '0px',
          left : '0px'
        });

      node.appendChild(canvas);
      bonzo(node).css({
        position : 'relative'
      });

      this.context = canvas.getContext('2d');
      this.rendered = true;
    },

    draw : function (data, options, node) {

      if (!this.rendered) this.render(node);
      options = options || {};

      var
        context = this.context,
        height = this.height,
        width = this.width,
        min = options.min,
        max = options.max + 1;

      context.clearRect(0, 0, this.width, this.height);
      if (min || max) {
        context.save();
        context.strokeStyle = '#B6D9FF';
        context.fillOpacity = .5;
        context.fillStyle = 'rgba(182, 217, 255, .4)';
        context.beginPath();
        context.moveTo(min, height);
        context.quadraticCurveTo(min, height / 2, Math.max(min - height / 2, min / 2), height / 2);
        context.lineTo(Math.min(height / 2, min / 2), height / 2);
        context.quadraticCurveTo(0, height / 2, 0, 0);
        context.lineTo(width, 0);
        context.quadraticCurveTo(width, height / 2, Math.max(width - height / 2, width - (width - max) / 2), height / 2);
        context.lineTo(Math.min(max + height / 2, width - (width - max) / 2), height / 2);
        context.quadraticCurveTo(max, height / 2, max, height);
        context.stroke();
        context.closePath();
        context.fill();
        context.restore();
      }
    }
  }

  vis
    .add(price)
    .add(volume)
    .add(connection)
    .add(summary)
    .render(container);

  selection.add(H.action.selection);
  selection.follow(price);
  selection.follow(volume);
  selection.follow(connection);

  summary.api.flotr.selection.setSelection({ y1 : 0, y2 : 0, x1 : 50, x2 : 150});

  hit.add(H.action.hit);
  hit.group([price, volume]);
}


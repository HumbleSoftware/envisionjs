(function () {
  var QuadraticDrawing = {

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
        half = Math.round(height / 2) - .5,
        min = options.min + 1,
        max = options.max;

      context.clearRect(0, 0, width, height);
      if (min || max) {
        context.save();
        context.strokeStyle = '#B6D9FF';
        context.fillOpacity = .5;
        context.fillStyle = 'rgba(182, 217, 255, .4)';
        context.beginPath();

        // Left
        if (min === 1) {
          context.moveTo(0, height);
          context.lineTo(0, 0);
        } else {
          context.moveTo(min, height);
          context.quadraticCurveTo(min, half, Math.max(min - half, min / 2), half);
          context.lineTo(Math.min(half, min / 2), half);
          context.quadraticCurveTo(0, half, 0, 0);
        }

        // Top
        context.lineTo(width, 0);

        // Right
        if (max >= width - 1) {
          context.lineTo(max, height);
        } else {
          context.quadraticCurveTo(width, half, Math.max(width - half, width - (width - max) / 2), half);
          context.lineTo(Math.min(max + half, width - (width - max) / 2), half);
          context.quadraticCurveTo(max, half, max, height);
        }

        context.stroke();
        context.closePath();
        context.fill();
        context.restore();
      }
    },
    adapter : {
      trigger : function (child, name, options) {
        if (name === 'select') {
          this.select(child, options);
        }
      },
      select : function (child, options) {
        var
          x = options.x || {},
          min = x.min,
          max = x.max,
          api = child.api;

        child.draw(null, {
          min : min,
          max : max
        });
      }
    }
  };
  humblevis.QuadraticDrawing = QuadraticDrawing;
})();

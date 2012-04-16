(function () {

  function QuadraticDrawing (options) {
    this.options = options || {};
  }

  QuadraticDrawing.prototype = {

    height : null,
    width : null,
    rendered : false,

    render : function (node) {
      var
        canvas = document.createElement('canvas'),
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

      if (typeof FlashCanvas !== 'undefined') FlashCanvas.initElement(canvas);
      this.context = canvas.getContext('2d');
      this.rendered = true;
    },

    draw : function (data, options, node) {

      if (!this.rendered) this.render(node);

      var
        context = this.context,
        height = this.height,
        width = this.width,
        half = Math.round(height / 2) - 0.5,
        min, max;

      options = options || { min : width / 2, max : width / 2};

      min = options.min + 0.5;
      max = options.max + 0.5;

      context.clearRect(0, 0, width, height);
      if (min || max) {
        context.save();
        context.strokeStyle = this.options.strokeStyle || '#B6D9FF';
        context.fillStyle = this.options.fillStyle || 'rgba(182, 217, 255, .4)';
        context.beginPath();

        // Left
        if (min <= 1) {
          context.moveTo(0, height);
          context.lineTo(0, -0.5);
        } else {
          context.moveTo(min, height);
          context.quadraticCurveTo(min, half, Math.max(min - half, min / 2), half);
          context.lineTo(Math.min(half, min / 2), half);
          context.quadraticCurveTo(0, half, 0.5, -0.5);
        }

        // Top
        context.lineTo(width - 0.5, -0.5);

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
    trigger : function (component, name, options) {
      if (name === 'zoom') {
        this.zoom(component, options);
      } else if (name === 'reset') {
        this.reset(component);
      }
    },
    zoom : function (component, options) {
      var
        x = options.x || {},
        min = x.min,
        max = x.max,
        api = component.api;

      component.draw(null, {
        min : min,
        max : max
      });
    },
    reset : function (component) {
      component.draw(null, {
        min : component.width / 2,
        max : component.width / 2
      });
    }
  };
  envision.components.QuadraticDrawing = QuadraticDrawing;
})();

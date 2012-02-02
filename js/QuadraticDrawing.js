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
  };
  humblevis.QuadraticDrawing = QuadraticDrawing;
})();

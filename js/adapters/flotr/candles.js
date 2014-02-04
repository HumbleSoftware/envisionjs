Flotr.addType( 'candles', {
	options: {
		show: false,           // => setting to true will show candle sticks, false will hide
		lineWidth: 1,          // => in pixels
		wickLineWidth: 1,      // => in pixels
		candleWidth: 0.6,      // => in units of the x axis
		fill: true,            // => true to fill the area from the line to the x axis, false for (transparent) no fill
		upFillColor: '#00A8F0',// => up sticks fill color
		downFillColor: '#CB4B4B',// => down sticks fill color
		fillOpacity: 0.5,      // => opacity of the fill color, set to 1 for a solid fill, 0 hides the fill
		// TODO Test this barcharts option.
		barcharts: false       // => draw as barcharts (not standard bars but financial barcharts)
	},

	draw : function (options) {
		var context = options.context;

		context.save();
		context.lineJoin = 'miter';
		context.lineCap = 'butt';
		// @TODO linewidth not interpreted the right way.
		context.lineWidth = options.wickLineWidth || options.lineWidth;

		this.plot(options);

		context.restore();
	},

	plot : function (options) {
		var
			data          = options.data,
			context       = options.context,
			xScale        = options.xScale,
			yScale        = options.yScale,
			width         = options.candleWidth / 2,
			shadowSize    = options.shadowSize,
			lineWidth     = options.lineWidth,
			wickLineWidth = options.wickLineWidth,
			pixelOffset   = (wickLineWidth % 2) / 2,
			color,
			x, y,
			open, high, low, close,
			left, right, bottom, top, bottom2, top2,
			i;

		if (data.length < 1) return;

		for (i = 0; i < data.length; i++) {
			x = data[i][0];

			var candleIndex = data[i][0];
			var qb = options.quotes[candleIndex]; // Note : this assumes the candles are stored in options.quotes as JSON objects.
			open    = qb.o;
			high    = qb.h;
			low     = qb.l;
			close   = qb.c;
			left    = xScale(x - width);
			right   = xScale(x + width);
			bottom  = yScale(low);
			top     = yScale(high);
			bottom2 = yScale(Math.min(open, close));
			top2    = yScale(Math.max(open, close));

			/*
			// TODO skipping
			if(right < xa.min || left > xa.max || top < ya.min || bottom > ya.max)
				continue;
			 */

			color = options[open > close ? 'downFillColor' : 'upFillColor'];

			// Fill the candle.
			// TODO Test the barcharts option
			if (options.fill && !options.barcharts) {
				context.fillStyle = 'rgba(0,0,0,0.05)';
				context.fillRect(left + shadowSize, top2 + shadowSize, right - left, bottom2 - top2);
				context.save();
				context.globalAlpha = options.fillOpacity;
				context.fillStyle = color;
				context.fillRect(left, top2 + lineWidth, right - left, bottom2 - top2);
				context.restore();
			}

			// Draw candle outline/border, high, low.
			if (lineWidth || wickLineWidth) {
				x = Math.floor((left + right) / 2) + pixelOffset;

				context.strokeStyle = color;
				context.beginPath();

				// TODO Again with the bartcharts
				if (options.barcharts) {

				context.moveTo(x, Math.floor(top + width));
				context.lineTo(x, Math.floor(bottom + width));

				y = Math.floor(open + width) + 0.5;
				context.moveTo(Math.floor(left) + pixelOffset, y);
				context.lineTo(x, y);

				y = Math.floor(close + width) + 0.5;
				context.moveTo(Math.floor(right) + pixelOffset, y);
				context.lineTo(x, y);
				} else {
				context.strokeRect(left, top2 + lineWidth, right - left, bottom2 - top2);

				context.moveTo(x, Math.floor(top2 + lineWidth));
				context.lineTo(x, Math.floor(top + lineWidth));
				context.moveTo(x, Math.floor(bottom2 + lineWidth));
				context.lineTo(x, Math.floor(bottom + lineWidth));
				}

				context.closePath();
				context.stroke();
			}
		}
	},

	extendXRange: function (axis, data, options) {
		axis.max = Math.max( axis.datamax , axis.max ) + options.candleWidth / 2;
		axis.min = Math.min( axis.datamin, axis.min ) - options.candleWidth / 2;
	},

	extendYRange: function (axis, data, options) {
		var maxHigh = null, minLow = null;

		for (i = 0; i < data.length; i++) {
			var candleIndex = data[i][0];
			var qb = options.quotes[candleIndex]; // Note : this assumes the candles are stored in options.quotes as JSON objects.

			if( maxHigh === null || maxHigh < qb.h )
				maxHigh = qb.h;
			if( minLow === null || minLow < qb.l )
				minLow = qb.l;
		}

		if( maxHigh != null && minLow != null ){
			axis.max = Math.max( maxHigh, axis.max );
			axis.min = Math.min( minLow, axis.min );
		}
	}
} );
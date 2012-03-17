if (typeof(Humble) == 'undefined') {
    var Humble = {};
}

/**
 * HumbleBubble Flotr Charts
 *
 * @copyright Copyright (c) 2010 Humble Software Development
 * @license MIT License <http://www.opensource.org/licenses/mit-license.php>
 * @author Carl Sutherland
 * @version 1.0.0
 */
(function () { 

    var Bubble = function (options) {

        this.options = options;

        this.node       = $(options.node);
        this.data       = options.data;
        this.timeout    = null;
    }

    Bubble.prototype = {

        draw : function () {
            this._flotrDraw(this.data[0]);
            /*
            Event.observe(this.node, 'flotr:hit', function (e) {
            }.bind(this));
            */
        },

        animate : function () {

            var data = this.data,
                that = this,
                i    = 0, // Timeseries iterator
                j    = 0; // Animation iterator

            if (this.timeout) clearTimeout(this.timeout);

            if (this.options.animate) {

                var localDraw = function () {

                    var d = [];

                    // Series iteration
                    for (var k = 0; k < data[i].length; k++) {

                        var point;

                        point = that._midPoint(
                            data[i][k][0],
                            data[i+1][k][0],
                            j / 15
                        );

                        d.push([point]);
                    }

                    that._flotrDraw(d);

                    if (j < 15) {
                        j++;
                    } else {
                        j = 0;
                        i++;
                    }

                    if (i < data.length - 1) {
                        if (that.timeout) clearTimeout(that.timeout);
                        that.timeout = setTimeout(localDraw, 10);
                    }
                }

            } else {

                var localDraw = function () {

                    that._flotrDraw(data[i]);
                    i++;

                    if (i < data.length) {
                        if (that.timeout) clearTimeout(that.timeout);
                        that.timeout = setTimeout(localDraw, 50);
                    }
                }
            }

            localDraw();
        },

        _mid : function (a, b, ratio) {
            if (ratio === null || typeof (ratio) === 'undefined') ratio = .5;
            return (a + (b - a) * ratio);
        },

        _midPoint : function (a, b, ratio) {

            var point = [];

            for (var i = 0; i < a.length; i++) {
                point[i] = this._mid(a[i], b[i], ratio);
            }

            return point;
        },

        _flotrDraw : function (data) {

            Flotr.draw(
                this.node,
                data,
                {
                    shadowSize : false,
                    mouse   : { track: true, position: 'ne', trackDecimals: 0, fillOpacity : 0 },
                    bubbles : { show : true, baseRadius : .2, lineWidth : 1, fillOpacity : .7 },
                    grid    : { outlineWidth: 0, labelMargin: 0},
                    xaxis   : { min : 5, max : 11, ticks : null, noTicks : 10, tickFormatter : function () { return ''; } },
                    yaxis   : { min : 20, max : 80, ticks : null, noTicks : 10, tickFormatter : function () { return ''; } }
                }
            );
        }
    }

    Humble.Bubble = Bubble;

})();

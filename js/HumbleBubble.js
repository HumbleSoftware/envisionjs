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

        this.node       = $(options.node);
        this.data       = options.data;
        this.animate    = options.animate;
    }

    Bubble.prototype = {

        draw : function () {

            var data = this.data,
                that = this,
                i    = 0,
                timeout;

            var localDraw = function () {

                that._flotrDraw(data[i]);
                i++;

                if (i < data.length) {
                    if (timeout) clearTimeout(timeout);
                    timeout = setTimeout(localDraw, 100);
                }
            }

            localDraw();
        },

        _flotrDraw : function (data) {

            Flotr.draw(
                this.node,
                data,
                {
                    bubbles : { show : true, baseRadius : 5 },
                    grid: {outlineWidth: 0, labelMargin: 0},
                    xaxis   : { min : 0, max : 10, ticks : null, noTicks : 10, tickFormatter : function () { return ''; } },
                    yaxis   : { min : 0, max : 10, ticks : null, noTicks : 10, tickFormatter : function () { return ''; } }
                }
            );
        }
    }

    Humble.Bubble = Bubble;

})();

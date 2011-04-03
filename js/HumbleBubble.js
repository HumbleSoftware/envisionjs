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
Humble.Bubble = function () {this.init.apply(this, arguments)};
Humble.Bubble.prototype = {

    init : function (id) {

        this.id = id;

        var d1 = [],
            d2 = [],
            point;
            
        for (var i = 0; i < 10; i++) {
            point = [Math.ceil(Math.random()*10), Math.ceil(Math.random()*10), Math.ceil(Math.random()*10)];
            d1.push(point);
            point = [Math.ceil(Math.random()*10), Math.ceil(Math.random()*10), Math.ceil(Math.random()*10)];
            d2.push(point);
        }

        this.d1 = d1;
        this.d2 = d2;
    }, 
    
    draw : function () {

        var that = this,
            timeout = null,
            i = 1;

        var localDraw = function () {
            that.drawBubble.apply(that, [i]);
            i++;
            if (i < 100) {
                if (timeout) clearTimeout(timeout);
                timeout = setTimeout(localDraw, 25);
            }
        }

        localDraw();
    },

    drawBubble : function (i) {

        var d1 = this.d1,
            d2 = this.d2,
            d  = [];

        for (var j = 0; j < 10; j++) {

            var a = d1[j][0] + (d2[j][0] - d1[j][0]) * (1 - i/100),
                b = d1[j][1] + (d2[j][1] - d1[j][1]) * (1 - i/100),
                c = d1[j][2] + (d2[j][2] - d1[j][2]) * (1 - i/100),
                point;

            point = [a, b, c];

            d.push([point]);
        }

        Flotr.draw(
            $(this.id),
            d,
            {
                bubbles : { show : true, baseRadius : 5 },
                grid: {outlineWidth: 0, labelMargin: 0},
                xaxis   : { min : 0, max : 10, ticks : null, noTicks : 10, tickFormatter : function () { return ''; } },
                yaxis   : { min : 0, max : 10, ticks : null, noTicks : 10, tickFormatter : function () { return ''; } }
            }
        );
    }
};

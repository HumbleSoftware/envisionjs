(function () {

var selection = {

  events : {
    'flotr:select' : {
      handler : function (leader, selection) {
        var
          data = leader.getData(),
          mode = leader.options.flotr.selection.mode,
          o = {};

        if (mode.indexOf('x') !== -1) {
          o.xaxis = {
            min : selection.x1,
            max : selection.x2
          }
        }

        if (mode.indexOf('y') !== -1) {
          o.yaxis = {
            min : selection.y1,
            max : selection.y2
          }
        }

        return o;
      },
      callback : function (follower, options) {
        follower.draw(null, options);
      }
    },
    'flotr:click' : {
      handler : function () {
        var
          leader = this.leaders[0], // Hack
          min = leader.flotr.axes.x.min,
          max = leader.flotr.axes.x.max;
        return {
          xaxis : {
            min : min,
            max : max 
          }
        };
      },
      callback : function (follower, options) {
        follower.draw(null, options);
      }
    }
  }
};

humblevis.action = humblevis.action || {};
humblevis.action.selection = selection;

})();

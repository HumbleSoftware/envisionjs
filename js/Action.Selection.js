(function () {

var Selection = {

  events : {
    'flotr:select' : {
      handler : function (leader, selection) {
        var data = leader.getData(),
          x1 = selection.x1,
          x2 = selection.x2;

        return {
          xaxis : {
            min : x1,
            max : x2
          }
        };
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

Humble.Vis.Action = {};
Humble.Vis.Action.Selection = Selection;

})();

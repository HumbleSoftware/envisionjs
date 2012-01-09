(function () {

var Selection = {

  events : {
    'flotr:select' : function (leader, selection) {

      var data = leader.getData(),
        x1 = selection.x1,
        x2 = selection.x2,
        o;

      o = {
        xaxis : {
          min : x1,
          max : x2
        }
      };

      _.each(this.followers, function (follower) {
        follower.draw(null, o);
      }, this);

      return o;
    },
    'flotr:click' : function () {
      var
        leader = this.leaders[0], // Hack
        min = leader.flotr.axes.x.min,
        max = leader.flotr.axes.x.max,
        o = {
          xaxis : {
            min : min,
            max : max 
          }
        };

      _.each(this.followers, function (follower) {
        follower.draw(null, o);
      }, this);

      return o;
    }
  }
};

Humble.Vis.Action = {};
Humble.Vis.Action.Selection = Selection;

})();

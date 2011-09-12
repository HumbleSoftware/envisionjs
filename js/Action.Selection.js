(function () {

var Selection = {

  events : {
    'flotr:select' : 'zoom',
    'flotr:click' : 'reset'
  },

  zoom : function (leader, selection) {

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
  },

  reset : function () {

    var o = {
      xaxis : {
        min : null,
        max : null
      }
    };

    _.each(this.followers, function (follower) {
      follower.draw(null, o);
    }, this);
  }
};

Humble.Vis.Action = {};
Humble.Vis.Action.Selection = Selection;

})();

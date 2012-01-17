(function () {

var hit = {
  events : {
    'flotr:hit' : {
      handler : function (leader, hit) {
        return hit;
      },
      callback : function (follower, options) {
        var
          x = options.x,
          graph = follower.flotr,
          o;

        // TODO this is a hack; the hit plugin should expose an API to do this easily
        o = {
          x : x,
          y : 1,
          relX : graph.axes.x.d2p(x),
          relY : 1
        };
        graph.hit.hit(o);
      }
    },
    'mouseout' : {
      callback : function () {
        _.each(this.followers, function (follower) {
          follower.flotr.hit.clearHit();
        }, this);
      }
    }
  }
};

humblevis.action = humblevis.action || {};
humblevis.action.hit = hit;

})();

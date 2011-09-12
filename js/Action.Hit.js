(function () {


var Hit = {

  events : {
    'flotr:hit' : 'hit',
    'mouseout' : 'reset'
  },

  hit : function (leader, hit) {

    if (this._preventHit) return;
    this._preventHit = true;

    var index = hit.index,
      x = hit.x,
      offset, graph, o, xaxis, yaxis;

    _.each(this.followers, function (follower) {

      if (leader === follower) return;

      // TODO this is a shit hack; the hit plugin should expose an API to do this easily
      graph = follower.flotr;
      o = {
        relX : graph.axes.x.d2p(x),
        relY : 1
      };
      graph.hit.hit(o);
    }, this);

    this._preventHit = false;
  },

  reset : function () {
    _.each(this.followers, function (follower) {
      follower.flotr.hit.clearHit();
    }, this);
  }
};

Humble.Vis.Action.Hit = Hit;

})();

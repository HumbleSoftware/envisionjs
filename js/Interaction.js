/**
 * Interaction Class
 *
 * Defines an interaction between visualization children.
 *
 * Options:
 *  leader - Child or children to lead the interaction
 *  event - Event to interact with
 *
 *
 *
 */
(function () {


var E = Flotr.EventAdapter;


function Interaction(options) {
  this.options = options;
  this.followers = [];

  if (!options.leader) throw 'No leader.';

  this.leaders = (_.isArray(options.leader) ? options.leader : [options.leader]);

  _.each(this.leaders, function (leader) {
    E.observe(leader.container, 'flotr:select', _.bind(this._zoom, this, leader));
  }, this);
}


Interaction.prototype = {

  follow : function (child) {
    this.followers.push(child);
  },

  _zoom : function (leader, selection) {

    var data = leader.getData(),
      x1 = selection.x1,
      x2 = selection.x2,
      length = data.length,
      newData = [],
      o, i;

    o = {
      xaxis : {
        min : x1,
        max : x2
      }
    };

    for (i = 0; i < length; i++) {
      if (data[i][0] >= x1) break;
    }
    for (i--; i < length; i++) {
      if (data[i][0] > x2) break;
      newData.push(data[i]);
    }

    _.each(this.followers, function (follower) {
      follower.draw(newData, o);
    }, this);
  }

};

Humble.Vis.Interaction = Interaction;

})();

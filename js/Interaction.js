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
    E.observe(leader.container, 'flotr:click', _.bind(this._reset, this));
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

  _reset : function () {

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

Humble.Vis.Interaction = Interaction;

})();

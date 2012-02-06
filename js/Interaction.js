/**
 * Interaction Class
 *
 * Defines an interaction between visualization children.
 *
 * An interaction has leaders, followers, and actions.  Leaders fire events which
 * are reacted to by followers as defined by actions.
 *
 * Options:
 *  leader - Child or children to lead the interaction
 *  event - Event to interact with
 *
 */
(function () {

var H = humblevis;

function Interaction(options) {
  this.options = options = options || {};
  this.actions = [];
  this.actionOptions = [];
  this.followers = [];
  this.leaders = [];
  this.prevent = {};

  //this._initOptions();
  //if (!options.leader) throw 'No leader.';

  if (options.leader) {
    this.leader(options.leader);
  }

  //this.leaders = (_.isArray(options.leader) ? options.leader : [options.leader]);
}

Interaction.prototype = {

  getLeaders : function () {
    return this.leaders; 
  },

  getFollowers : function () {
    return this.followers; 
  },

  getActions : function () {
    return this.actions;
  },

  leader : function (child) {

    this.leaders.push(child);

    _.each(this.actions, function (action, i) {
      this._bindLeader(child, action, this.actionOptions[i]);
    }, this);
    return this;
  },

  follower : function (child) {
    this.followers.push(child);
    return this;
  },

  group : function (children) {
    if (!_.isArray(children)) children = [children];
    _.each(children, function (child) {
      this.leader(child);
      this.follower(child);
    }, this);
    return this;
  },

  add : function (action, options) {
    this.actions.push(action);
    this.actionOptions.push(options);
    _.each(this.leaders, function (leader) {
      this._bindLeader(leader, action, options);
    }, this);
    return this;
  },

  _bindLeader : function (leader, action, options) {
    _.each(action.events, function (e) {
      H.flotr.adapter.attach(leader, e, _.bind(function (leader, result) {

        if (this.prevent[name]) return;

        // Apply custom callback configured for this action
        if (options && options.callback) {
          options.callback.call(this, result);
        }

        this.prevent[name] = true; // Prevent recursions for this name
        try {
          _.each(this.followers, function (follower) {

            if (leader === follower) return; // Skip leader (recursion)

            H.flotr.adapter.trigger(follower, e, result);

          }, this);
        } catch (e) {
          this.prevent[name] = false;
          throw e;
        }
        this.prevent[name] = false;
      }, this));
    }, this);
  }
};

H.Interaction = Interaction;

})();

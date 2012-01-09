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

var E = Flotr.EventAdapter;

function Interaction(options) {
  this.options = options = options || {};
  this.actions = [];
  this.followers = [];
  this.leaders = [];
  this.prevent = {};

  //this._initOptions();
  //if (!options.leader) throw 'No leader.';

  if (options.leader) {
    this.lead(options.leader);
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

  lead : function (child) {

    this.leaders.push(child);

    _.each(this.actions, function (action) {
      this._bindLeader(child, action);
    }, this);
  },

  follow : function (child) {
    this.followers.push(child);
  },

  group : function (children) {
    if (!_.isArray(children)) children = [children];
    _.each(children, function (child) {
      this.lead(child);
      this.follow(child);
    }, this);
  },

  add : function (action, options) {
    this.actions.push(action);
    _.each(this.leaders, function (leader) {
      this._bindLeader(leader, action, options);
    }, this);
  },

  _bindLeader : function (leader, action, options) {
    _.each(action.events, function (methods, name) {
      E.observe(leader.container, name, _.bind(function () {

        if (this.prevent[name]) return;

        var
          args = [leader].concat(Array.prototype.slice.call(arguments)),
          result = null;

        if (methods.handler) {
          result = methods.handler.apply(this, args);
        }

        // Apply custom callback configured for this action
        if (options && options.callback) {
          options.callback.call(this, result);
        }

        this.prevent[name] = true; // Prevent recursions for this name
        try {
          _.each(this.followers, function (follower) {
            if (leader === follower) return; // Skip leader (recursion)
            methods.callback.apply(this, [follower, result]);
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

Humble.Vis.Interaction = Interaction;

})();

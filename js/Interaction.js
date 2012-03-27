// Interaction Class
(function () {

var H = envision;

/**
 * @summary Defines an interaction between components.
 *
 * @description  This class defines interactions in which actions are triggered
 * by leader components and reacted to by follower components.  These actions
 * are defined as configurable mappings of trigger events and event consumers.
 * It is up to the adapter to implement the triggers and consumers.
 *
 * A component may be both a leader and a follower.  A leader which is a 
 * follower will react to actions triggered by other leaders, but will safely
 * not react to its own.  This allows for groups of components to perform a
 * common action.
 *
 * Optionally, actions may be supplied with a callback executed before the 
 * action is consumed.  This allows for quick custom functionality to be added
 * and is how advanced data management (ie. live Ajax data) may be implemented.
 *
 * This class follow an observer mediator pattern.
 *
 * @param {envision.Component|Array} [leader]  Component(s) to lead the
 * interaction
 *
 * @memberof envision
 * @class
 */
function Interaction(options) {
  this.options = options = options || {};
  this.actions = [];
  this.actionOptions = [];
  this.followers = [];
  this.leaders = [];
  this.prevent = {};

  if (options.leader) {
    this.leader(options.leader);
  }
}

Interaction.prototype = {

  /**
   * Add a component as an interaction leader.
   *
   * @param {envision.Component} component
   */
  leader : function (component) {

    this.leaders.push(component);

    _.each(this.actions, function (action, i) {
      this._bindLeader(component, action, this.actionOptions[i]);
    }, this);
    return this;
  },

  /**
   * Add a component as an interaction leader.
   *
   * @param {envision.Component} component
   */
  follower : function (component) {
    this.followers.push(component);
    return this;
  },

  /**
   * Adds an array of components as both followers and leaders.
   *
   * @param {Array} components  An array of components
   */
  group : function (components) {
    if (!_.isArray(components)) components = [components];
    _.each(components, function (component) {
      this.leader(component);
      this.follower(component);
    }, this);
    return this;
  },

  /**
   * Adds an action to the interaction.
   *
   * The action may be optionally configured with the options argument.
   * Currently the accepts a callback member, invoked after an action
   * is triggered and before it is consumed by followers.
   *
   * @param {Object} action
   * @param {Object} [options]
   */
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

      var
        handler = e.handler || e,
        consumer = e.consumer || e;

      leader.attach(handler, _.bind(function (leader, result) {

        if (this.prevent[name]) return;

        // Apply custom callback configured for this action
        if (options && options.callback) {
          options.callback.call(this, result);
        }

        this.prevent[name] = true; // Prevent recursions for this name
        try {
          _.each(this.followers, function (follower) {

            if (leader === follower) return; // Skip leader (recursion)

            follower.trigger(consumer, result);

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

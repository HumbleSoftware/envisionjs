humblevis = {};

(function () {

function Data (data) {
  this.data = data;
}

Data.prototype = {

  bound : function (min, max) {

    if (!_.isNumber(min) || !_.isNumber(max)) return this;

    var
      data    = this.data,
      length  = data.length,
      newData = [],
      i;

    for (i = 0; i < length; i++) {
      if (data[i][0] >= min) break;
    }

    if (i > 0) i--;

    for (i; i < length; i++) {
      newData.push(data[i]);
      if (data[i][0] > max) break;
    }

    this.data = newData;

    return this;
  },
  /**
   * Sample using min and max.
   */
  subsampleMinMax : function (resolution) {

    var
      data    = this.data,
      length  = data.length,
      _length = length - 1,
      newData = [],
      unit    = resolution / length,
      index   = Math.round(unit * 1),
      iMin    = 1,
      iMax    = 1,
      min, max, datum, i, j;

    if (length > resolution) {
      newData.push(data[0]);
      for (i = 1; i < _length; i++) {
        j = Math.round(unit * i);

        // New index
        if (j !== index) {
          if (iMax === iMin) {
            newData.push(data[iMin]);
          } else {
            newData.push(data[Math.min(iMin, iMax)], data[Math.max(iMin, iMax)]);
          }
          iMin = iMax = i;
          min = max = data[i][1];
          index = j;
        }

        // Old index
        else {
          datum = data[i][1];
          if (datum < min) {
            iMin = i;
            min = datum;
          }
          if (datum > max) {
            iMax = i;
            max = datum;
          }
        }
      }
      newData.push(data[length-1]);
      this.data = newData;
    }

    return this;
  },

  subsample : function (resolution) {

    var
      data    = this.data,
      length  = data.length,
      newData = [],
      unit    = length / resolution,
      i;

    if (length > resolution) {
      newData.push(data[0]);
      for (i = 1; i < resolution; i++) {
        if (i * unit >= length)
          break;
        newData.push(data[Math.round(i*unit)]);
      }
      newData.push(data[length-1]);
      this.data = newData;
    }

    return this;
  }
};

humblevis.Data = Data;

}());

(function () { 
/**
 * Options:
 *
 * element - element housing visualization
 *
 */

var
  CN_FIRST  = 'humble-vis-first',
  CN_LAST   = 'humble-vis-last',

  TEMPLATE  = '<div class="humble-vis-visualization"></div>';

function Visualization (options) {
  this.options = options || {};
  this.children = [];
  this.container = null;
  this.rendered = false;
}

Visualization.prototype = {

  render : function (element) {

    var o = this.options;

    element = element || o.element;
    if (!element) throw 'No element to render within.';

    this.container = bonzo.create(TEMPLATE);
    bonzo(element).append(this.container);

    _.each(this.children, function (child) {
      child.render(this.container);
    }, this);
    this._updateClasses();

    this.rendered = true;
  },

  add : function (child) {
    this.children.push(child);
    if (this.rendered) {
      child.render(this.container);
      this._updateClasses();
    }
    return child;
  },

  remove : function (child) {
    var
      children  = this.children,
      index     = this.indexOf(child);
    if (index !== -1) {
      children.splice(index, 1);
      bonzo(child.node).remove();
      this._updateClasses();
      return true;
    }
  },

  setPosition : function (child, newIndex) {
    var
      children  = this.children;
    if (newIndex >= 0 && newIndex < children.length && this.remove(child)) {
      if (newIndex === children.length)
        bonzo(this.container).append(child.node);
      else
        this.container[0].insertBefore(child.node[0], children[newIndex].node[0]);
      children.splice(newIndex, 0, child);
      this._updateClasses();
      return true;
    }
  },

  indexOf : function (child) {
    return _.indexOf(this.children, child);
  },

  getChild : function (index) {
    var children = this.children;
    if (index < children.length) return children[index];
  },

  isFirst : function (child) {
    return (this.indexOf(child) === 0 ? true : false);
  },

  isLast : function (child) {
    return (this.indexOf(child) === this.children.length - 1 ? true : false);
  },

  _updateClasses : function () {

    var
      children  = this.children,
      first     = 0,
      last      = children.length -1,
      node;

    _.each(children, function (child, index) {
      node = bonzo(child.node);

      if (index === first)
        node.addClass(CN_FIRST);
      else
        node.removeClass(CN_FIRST);

      if (index === last)
        node.addClass(CN_LAST);
      else
        node.removeClass(CN_LAST);
    });
  }
};

humblevis.Visualization = Visualization;

})();

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

humblevis.Interaction = Interaction;

})();

(function () {

var selection = {

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

humblevis.action = humblevis.action || {};
humblevis.action.selection = selection;

})();

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

humblevis.templates = humblevis.templates || {};

humblevis.flotr = {};

/*
 * Flotr Default Options
 */

humblevis.flotr.defaultOptions = {
  grid : {
    outlineWidth : 0,
    labelMargin : 0,
    horizontalLines : false,
    verticalLines : false
  },
  bars : {
    show        : false,
    barWidth    : 0.5,
    fill        : true,
    lineWidth   : 2,
    fillOpacity : 1
  },
  lines : {
    lineWidth   : 1
  },
  xaxis : {
    margin      : false,
    tickDecimals: 0,
    showLabels  : false
  },
  yaxis : {
    margin      : false,
    showLabels  : false
  },
  shadowSize    : false
};

/**
 * Child Class
 *
 * Defines a visualization child.
 *
 * Options:
 *  height - Integer
 *  width - Integer
 *  flotr - A set of flotr options
 */
(function () { 

var

  V = humblevis,

  CN_CHILD = 'humble-vis-child',

  T_CHILD       = '<div class="' + CN_CHILD + '"></div>',
  T_CONTAINER   = '<div class="' + CN_CHILD + '-container"></div>',

  DEFAULTS = V.flotr.defaultOptions;

function Child(options) {

  this.options    = options || {};
  this.container  = bonzo.create(T_CONTAINER)[0];
  this.node       = bonzo.create(T_CHILD);

  if (options.name) bonzo(this.node).addClass(options.name);
  bonzo(this.node).append(this.container);

  this.flotr = null;
  this._flotrDefaultOptions();
}

Child.prototype = {

  getFlotr : function () { return this.flotr; },
  getData : function () { return this.options.data; },

  render : function (element) {

    var o = this.options;

    if (!element) throw 'No element to render within.';

    bonzo(element).append(this.node);

    if (o.width) {
      bonzo(this.container).css({width : o.width});
    } else {
      o.width = parseInt(bonzo(this.container).css('width'), 10);
    }

    if (o.height) {
      bonzo(this.container).css({height : o.height});
    } else {
      o.height = parseInt(bonzo(this.container).css('height'), 10);
    }

    this.draw(o.data, o.flotr);
  },

  draw : function (data, flotr) {

    var
      o           = this.options,
      fData       = [],
      container   = this.container;

    data = data || o.data;

    if (flotr) {
      flotr = Flotr.clone(flotr);
      _.extend(o.flotr, flotr);
      this._flotrDefaultOptions(flotr);
    }
    flotr = o.flotr;
    o.data = data;
    min = flotr.xaxis.min;
    max = flotr.xaxis.max;

    data = this._getDataArray(data);
    if (o.skipPreprocess) {
      fData = data;
    } else {
      _.each(data, function (d, index) {
        if (!_.isArray(d) && !_.isFunction(d)) {
          fData[index] = _.clone(d);
          fData[index] = this._processData(d.data);
        } else {
          fData[index] = this._processData(d);
        }
      }, this);
    }

    if (!flotr) throw 'No graph submitted.';

    this.flotr = Flotr.draw(container, fData, flotr);
  },

  getNode : function () {
    return this.node;
  },

  _processData : function (data) {

    var
      options     = this.options,
      process     = options.processData,
      resolution  = options.width,
      axis        = options.flotr.xaxis,
      min         = axis.min,
      max         = axis.max,
      datum       = new V.Data(data);

    if (_.isFunction(data)) {
      return data(min, max, resolution);
    } else if (process) {
      process.apply(this, [{
        datum : datum,
        min : min,
        max : max,
        resolution : resolution
      }]);
    } else {
      datum
        .bound(min, max)
        .subsampleMinMax(resolution);
    }

    return datum.data;
  },

  _getDataArray : function (data) {

    if (data[0] && (!_.isArray(data[0]) || (data[0][0] && _.isArray(data[0][0]))))
      return data;
    else
      return [data];
  },

  _flotrDefaultOptions : function (options) {

    var o = options || this.options.flotr,
      i;

    for (i in DEFAULTS) {
      if (DEFAULTS.hasOwnProperty(i)) {
        if (_.isUndefined(o[i])) {
          o[i] = DEFAULTS[i];
        } else {
          _.defaults(o[i], DEFAULTS[i]);
        }
      }
    }
  }
};

V.Child = Child;

})();

(function () {

var
  V = humblevis,
  Zoom;

function defaultsZoom () {
  return {
    flotr : {}
  };
}

function defaultsSummary () {
  return {
    flotr : {
      handles : { show : true },
      selection : { mode : 'x'}
    }
  };
}

function getDefaults (options, defaults) {
  var o = _.defaults(options, defaults);
  o.flotr = _.defaults(o.flotr, defaults.flotr);
  return o;
}

Zoom = function (options) {

  var
    vis = new V.Visualization(),
    zoom = new V.Child(getDefaults(options.zoom || {}, defaultsZoom())),
    summary = new V.Child(getDefaults(options.summary || {}, defaultsSummary())),
    interaction = new V.Interaction({leader : summary});

  vis.add(zoom);
  vis.add(summary);

  interaction.add(V.action.selection);
  interaction.follow(zoom);

  this.vis = vis;
  this.interaction = interaction;

  if (options.container) {
    this.render(options.container);
  }
};

Zoom.prototype = {
  render : function (container) {
    this.vis.render(container);
  }
};

V.templates.Zoom = Zoom;

})();

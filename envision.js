envision = {};

(function () { 
/**
 * Options:
 *
 * element - element housing visualization
 *
 */

var
  CN_FIRST  = 'envision-first',
  CN_LAST   = 'envision-last',

  T_VISUALIZATION   = '<div class="envision-visualization"></div>';
  T_CHILD_CONTAINER = '<div class="envision-child-container"></div>';

function Visualization (options) {
  this.options = options || {};
  this.children = [];
  this.node = null;
  this.rendered = false;
}

Visualization.prototype = {

  render : function (element) {

    var o = this.options;

    element = element || o.element;
    if (!element) throw 'No element to render within.';

    this.node = bonzo.create(T_VISUALIZATION)[0];
    this.container = element;
    bonzo(element).append(this.node);

    _.each(this.children, function (child) {
      this._renderChild(child);
    }, this);
    this._updateClasses();

    this.rendered = true;

    return this;
  },

  add : function (child) {
    this.children.push(child);
    if (this.rendered) {
      this._renderChild(child);
      this._updateClasses();
    }
    return this;
  },

  remove : function (child) {
    var
      children  = this.children,
      index     = this.indexOf(child);
    if (index !== -1) {
      children.splice(index, 1);
      bonzo(child.container).remove();
      this._updateClasses();
    }
    return this;
  },

  setPosition : function (child, newIndex) {
    var
      children  = this.children;
    if (newIndex >= 0 && newIndex < children.length && this.remove(child)) {
      if (this.rendered) {
        if (newIndex === children.length)
          this.node.appendChild(child.container);
        else
          this.node.insertBefore(child.container, children[newIndex].container);
      }
      children.splice(newIndex, 0, child);
      this._updateClasses();
    }
    return this;
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

  _renderChild : function (child) {
    var
      childContainer = bonzo.create(T_CHILD_CONTAINER)[0];

    bonzo(this.node).append(childContainer);
    child.render(childContainer);
  },

  _updateClasses : function () {

    var
      children  = this.children,
      first     = 0,
      last      = children.length -1,
      node;

    _.each(children, function (child, index) {
      node = bonzo(child.container);

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

envision.Visualization = Visualization;

})();

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

  V = envision,

  CN_CHILD = 'envision-child',

  T_CHILD = '<div class="' + CN_CHILD + '"></div>';

function Child (options) {

  options = options || {};

  var
    node = bonzo.create(T_CHILD)[0];

  bonzo(node).addClass(options.name || '');

  this.options = options;
  this.node = node;

  if (options.flotr) {
    this.api = new V.flotr.Child(options);
  } else if (options.drawing) {
    this.api = options.drawing;
  }
}

Child.prototype = {

  render : function (element) {

    var
      node = this.node,
      options = this.options;

    element = element || options.element;

    if (!element) throw 'No element to render within.';

    bonzo(element)
      .addClass(options.name || '')
      .append(this.node);
    this._setDimension('width');
    this._setDimension('height');
    this.container = element;

    this.draw(options.data, options.flotr);
  },

  draw : function (data, flotr) {
    if (this.api) {
      this.api.draw(data, flotr, this.node);
    }
  },

  getData : function () {
    return this.data;
  },

  trigger : function () {
    this.api.trigger.apply(this.api, arguments);
  },

  attach : function () {
    this.api.attach.apply(this.api, arguments);
  },

  detach : function () {
    this.api.detach.apply(this.api, arguments);
  },

  _setDimension : function (attribute) {
    var
      node = this.node,
      options = this.options;
    if (options[attribute]) {
      bonzo(node).css(attribute, options[attribute]);
    } else {
      options[attribute] = parseInt(bonzo(node).css(attribute), 10);
    }
    this[attribute] = options[attribute];
  }
};

V.Child = Child;

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

var H = envision;

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

      var
        handler = e.handler || e,
        consumer = e.consumer || e;

      leader.attach(leader, handler, _.bind(function (leader, result) {

        if (this.prevent[name]) return;

        // Apply custom callback configured for this action
        if (options && options.callback) {
          options.callback.call(this, result);
        }

        this.prevent[name] = true; // Prevent recursions for this name
        try {
          _.each(this.followers, function (follower) {

            if (leader === follower) return; // Skip leader (recursion)

            follower.trigger(follower, consumer, result);

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

(function () {

var selection = {
  events : [
    {
      handler : 'select',
      consumer : 'zoom'
    },
    'click'
  ]
};

envision.action = envision.action || {};
envision.action.selection = selection;

})();

(function () {

var hit = {
  events : [
    'hit',
    'mouseout'
  ]
};

envision.action = envision.action || {};
envision.action.hit = hit;

})();

(function () {

function Preprocessor (options) {

  options = options || {};

  var
    data;

  this.getData = function () {
    if (this.bounded) bound(this);
    return data;
  }

  this.setData = function (newData) {
    var
      i, length;
    if (!_.isArray(newData)) throw new Error('Array expected.');
    if (newData.length < 2) throw new Error('Data must contain at least two dimensions.');
    length = newData[0].length;
    for (i = newData.length; i--;) {
      if (!_.isArray(newData[i])) throw new Error('Data dimensions must be arrays.');
      if (newData[i].length !== length) throw new Error('Data dimensions must contain the same number of points.');
    }

    data = newData;

    return this;
  }

  if (options.data) this.setData(options.data);
}

function getStartIndex (data, min) {

  var
    length = data.length,
    i;

  for (i = 0; i < length; i++) {
    if (data[i] >= min) break;
  }

  // Include point outside range when not exact match
  if (data[i] > min && i > 0) i--;

  return i;
}

function getEndIndex (data, max) {

  var
    i;

  for (i = data.length; i--;) {
    if (data[i] <= max) break;
  }

  // Include point outside range when not exact match
  if (data[i] < max && i > 0) i++;

  return i;
}

function bound (that) {

  delete that.bounded;

  var
    data    = that.getData(),
    length  = that.length(),
    x       = data[0],
    y       = data[1],
    min     = that.min || 0,
    max     = that.max || that.length(),
    start   = getStartIndex(x, min),
    end     = getEndIndex(x, max);

  that.setData([
    x.slice(start, end + 1),
    y.slice(start, end + 1)
  ]);
};

Preprocessor.prototype = {

  length : function () {
    return this.getData()[0].length;
  },

  bound : function (min, max) {

    if (!_.isNumber(min) || !_.isNumber(max)) return this;

    this.min = min;
    this.max = max;
    this.bounded = true;

    return this;
  },

  /**
   * Sample using min and max.
   */
  subsampleMinMax : function (resolution) {

    var bounded = this.bounded;
    delete this.bounded;

    var
      data    = this.getData(),
      length  = this.length(),
      x       = data[0],
      y       = data[1],
      start   = bounded ? getStartIndex(x, this.min) : 0,
      end     = bounded ? getEndIndex(x, this.max) : length - 1,
      count   = (resolution - 2) / 2,
      newX    = [],
      newY    = [],
      min     = Number.MAX_VALUE,
      max     = -Number.MAX_VALUE,
      minI    = 1,
      maxI    = 1,
      unit    = (end - start)/ count,
      position, min, max, datum, i, j;

    if (end - start + 1 > resolution) {

      newX.push(x[start]);
      newY.push(y[start]);

      position = start + unit;

      for (i = start; i < end; i++) {

        if (i === Math.round(position)) {

          position += unit;

          j = Math.min(maxI, minI);
          newX.push(x[j]);
          newY.push(y[j]);

          j = Math.max(maxI, minI);
          newX.push(x[j]);
          newY.push(y[j]);

          minI = i;
          min = y[minI];
          maxI = i;
          max = y[maxI];

        } else {
          if (y[i] > max) {
            max = y[i];
            maxI = i;
          }

          if (y[i] < min) {
            min = y[i];
            minI = i;
          }
        }
      }

      if (i < position) {
        newX.push(x[minI]);
        newY.push(min);
        newX.push(x[maxI]);
        newY.push(max);
      }

      // Last
      newX.push(x[end]);
      newY.push(y[end]);

      this.setData([newX, newY]);
    } else {
      this.bounded = true;
    }

    return this;
  },

  subsample : function (resolution) {

    var bounded = this.bounded;
    delete this.bounded;

    var
      data    = this.getData(),
      length  = this.length(),
      x       = data[0],
      y       = data[1],
      start   = bounded ? getStartIndex(x, this.min) : 0,
      end     = bounded ? getEndIndex(x, this.max) : length - 1,
      unit    = (end - start + 1) / resolution,
      newX    = [],
      newY    = [],
      i, index;

    if (length > resolution) {

      // First
      newX.push(x[start]);
      newY.push(y[start]);

      for (i = 1; i < resolution; i++) {
        if (i * unit >= end - unit) break;
        index = Math.round(i * unit) + start;
        newX.push(x[index]);
        newY.push(y[index]);
      }

      // Last
      newX.push(x[end]);
      newY.push(y[end]);

      this.setData([newX, newY]);
    }

    return this;
  }
};

envision.Preprocessor = Preprocessor;

}());

(function () {
  var QuadraticDrawing = {

    height : null,
    width : null,
    rendered : false,

    render : function (node) {
      var
        canvas = document.createElement('canvas'),//bonzo.create('<canvas></canvas>')[0],
        offset = bonzo(node).offset();

      this.height = offset.height;
      this.width = offset.width;

      bonzo(canvas)
        .attr('height', offset.height)
        .attr('width', offset.width)
        .css({
          position : 'absolute',
          top : '0px',
          left : '0px'
        });

      node.appendChild(canvas);
      bonzo(node).css({
        position : 'relative'
      });

      if (typeof FlashCanvas !== 'undefined') FlashCanvas.initElement(canvas);
      this.context = canvas.getContext('2d');
      this.rendered = true;
    },

    draw : function (data, options, node) {

      if (!this.rendered) this.render(node);

      var
        context = this.context,
        height = this.height,
        width = this.width,
        half = Math.round(height / 2) - .5,
        min, max;

      options = options || { min : width / 2, max : width / 2};

      min = options.min + 0.5;
      max = options.max + 0.5;

      context.clearRect(0, 0, width, height);
      if (min || max) {
        context.save();
        context.strokeStyle = '#B6D9FF';
        context.fillOpacity = .5;
        context.fillStyle = 'rgba(182, 217, 255, .4)';
        context.beginPath();

        // Left
        if (min <= 1) {
          context.moveTo(0, height);
          context.lineTo(0, -0.5);
        } else {
          context.moveTo(min, height);
          context.quadraticCurveTo(min, half, Math.max(min - half, min / 2), half);
          context.lineTo(Math.min(half, min / 2), half);
          context.quadraticCurveTo(0, half, 0, -0.5);
        }

        // Top
        context.lineTo(width, -0.5);

        // Right
        if (max >= width - 1) {
          context.lineTo(max, height);
        } else {
          context.quadraticCurveTo(width, half, Math.max(width - half, width - (width - max) / 2), half);
          context.lineTo(Math.min(max + half, width - (width - max) / 2), half);
          context.quadraticCurveTo(max, half, max, height);
        }

        context.stroke();
        context.closePath();
        context.fill();
        context.restore();
      }
    },
    trigger : function (child, name, options) {
      if (name === 'zoom') {
        this.zoom(child, options);
      } else if (name === 'click') {
        this.click(child);
      }
    },
    zoom : function (child, options) {
      var
        x = options.x || {},
        min = x.min,
        max = x.max,
        api = child.api;

      child.draw(null, {
        min : min,
        max : max
      });
    },
    click : function (child) {
      child.draw(null, {
        min : child.width / 2,
        max : child.width / 2
      });
    }
  };
  envision.QuadraticDrawing = QuadraticDrawing;
})();

envision.templates = envision.templates || {};

(function () {

var
  V = envision,
  Zoom;

function defaultsZoom () {
  return {
    name : 'zoom',
    flotr : {}
  };
}

function defaultsSummary () {
  return {
    name : 'summary',
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

  vis
    .add(zoom)
    .add(summary);

  interaction.add(V.action.selection);
  interaction.follower(zoom);

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

envision.flotr = {};

/*
 * Flotr Default Options
 */

envision.flotr.defaultOptions = {
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
    lineWidth   : 1,
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
  V = envision,
  E = Flotr.EventAdapter,
  DEFAULTS = V.flotr.defaultOptions;

function Child (options) {
  this.options = options || {};
  this.flotr = null;
  this._flotrDefaultOptions();
}

Child.prototype = {

  draw : function (data, flotr, node) {

    var
      o           = this.options,
      fData       = [];

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
      flotrData = data;
    } else {
      _.each(data, function (d, index) {
        // TODO flotr
        /*
        if (!_.isArray(d) && !_.isFunction(d)) {
          fData[index] = _.clone(d);
          fData[index] = this._processData(d.data);
        } else {
        */
          fData[index] = this._processData(d);
        //}
      }, this);

      fData = fData[0];
      var
        flotrData = [],
        x = fData[0],
        y = fData[1],
        i;
      for (i = 0; i < x.length; i++) {
        flotrData.push([x[i], y[i]]);
      }
      flotrData = [flotrData];
    }

    if (!flotr) throw 'No graph submitted.';

    this.flotr = Flotr.draw(node, flotrData, flotr);
  },

  _processData : function (data) {

    var
      options     = this.options,
      process     = options.processData,
      resolution  = options.width,
      axis        = options.flotr.xaxis,
      min         = axis.min,
      max         = axis.max,
      preprocessor;

    if (_.isFunction(data)) {
      return data(min, max, resolution);
    } else if (process) {
      preprocessor = new V.Preprocessor({data : data});
      process.apply(this, [{
        preprocessor : preprocessor,
        min : min,
        max : max,
        resolution : resolution
      }]);
    } else {
      preprocessor = new V.Preprocessor({data : data})
        .bound(min, max)
        .subsampleMinMax(resolution);
    }

    return preprocessor.getData();
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
  },

  attach : function (child, name, callback) {

    var
      event = this.events[name] || {},
      name = event.name || false,
      handler = event.handler || false;

    if (handler) {

      return E.observe(child.node, name, function () {

        var
          args = [child].concat(Array.prototype.slice.call(arguments)),
          result = handler.apply(this, args);

        return callback.apply(null, [child, result]);

      });
    } else {
      return false;
    }
  },

  detach : function (child, name, callback) {
    return E.stopObserve(child.node, name, handler);
  },

  trigger : function (child, name, options) {

    var
      event = this.events[name],
      consumer = event.consumer || false;

    return consumer ? consumer.apply(this, [child, options]) : false;
  },

  events : {

    hit : {
      name : 'flotr:hit',
      handler : function (child, hit) {

        var
          x = hit.x,
          y = hit.y,
          graph = child.api.flotr,
          options;

        // Normalized hit:
        options = {
          data : {
            index : hit.index,
            x : x,
            y : y
          },
          x : graph.axes.x.d2p(x),
          y : graph.axes.y.d2p(y)
        };

        return options;
      },
      consumer : function (child, hit) {

        var
          graph = child.api.flotr,
          o;

        // TODO this is a hack;
        // the hit plugin should expose an API to do this easily
        o = {
          x : hit.data.x,
          y : hit.data.y || 1,
          relX : hit.x,
          relY : hit.y || 1
        };

        graph.hit.hit(o);
      }
    },

    select : {
      name : 'flotr:selecting',
      handler : function (child, selection) {

        var
          mode = child.options.flotr.selection.mode,
          axes = child.api.flotr.axes,
          datax, datay, x, y, options;

        if (mode.indexOf('x') !== -1) {
          datax = {};
          datax.min = selection.x1;
          datax.max = selection.x2;
          x = {};
          x.min = axes.x.d2p(selection.x1);
          x.max = axes.x.d2p(selection.x2);
        }

        if (mode.indexOf('y') !== -1) {
          datay = {};
          datay.min = selection.y1;
          datay.max = selection.y2;
          y = {};
          y.min = axes.y.d2p(selection.y1);
          y.max = axes.y.d2p(selection.y2);
        }

        // Normalized selection:
        options = {
          data : {
            x : datax,
            y : datay
          },
          x : x,
          y : y
        }

        return options;
      },
      consumer : function (child, selection) {

        var
          graph = child.api.flotr,
          axes = graph.axes,
          data = selection.data || {},
          options = {},
          x = selection.x,
          y = selection.y;

        if (!x && data.x) {
          // Translate data to pixels
          x = data.x;
          options.x1 = axes.x.d2p(x.min);
          options.x2 = axes.x.d2p(x.max);
        } else if (x) {
          // Use pixels
          options.x1 = x.min;
          options.x2 = x.max;
        }

        if (!y && data.y) {
          // Translate data to pixels
          y = data.y;
          options.y1 = axes.y.d2p(y.min);
          options.y2 = axes.y.d2p(y.max);
        } else if (y) {
          // Use pixels
          options.y1 = y.min;
          options.y2 = y.max;
        }

        graph.selection.setSelection(options);
      }
    },

    zoom : {
      consumer : function (child, selection) {

        var
          x = selection.data.x,
          y = selection.data.y,
          options = {};

        if (x) {
          options.xaxis = {
            min : x.min,
            max : x.max
          };
        }

        if (y) {
          options.yaxis = {
            min : y.min,
            max : y.max
          };
        }

        child.draw(null, options);
      }
    },

    mouseout : {
      name : 'flotr:mouseout',
      handler : function (child) {
      },
      consumer : function (child) {
        child.api.flotr.hit.clearHit();
      }
    },

    click : {
      name : 'flotr:click',
      handler : function (child) {

        var
          min = child.api.flotr.axes.x.min,
          max = child.api.flotr.axes.x.max;

        return {
          data : {
            x : {
              min : min,
              max : max
            }
          },
          x : {
            min : child.api.flotr.axes.x.d2p(min),
            max : child.api.flotr.axes.x.d2p(max)
          }
        };
      },
      consumer : function (child, selection) {

        var
          x = selection.data.x,
          y = selection.data.y,
          options = {};

        if (x) {
          options.xaxis = {
            min : x.min,
            max : x.max
          };
        }

        if (y) {
          options.yaxis = {
            min : y.min,
            max : y.max
          };
        }

        child.draw(null, options);
      }
    }
  }
};

V.flotr.Child = Child;

})();

/** Lines **/
Flotr.addType('lite-lines', {
  options: {
    show: false,           // => setting to true will show lines, false will hide
    lineWidth: 2,          // => line width in pixels
    fill: false,           // => true to fill the area from the line to the x axis, false for (transparent) no fill
    fillBorder: false,     // => draw a border around the fill
    fillColor: null,       // => fill color
    fillOpacity: 0.4       // => opacity of the fill color, set to 1 for a solid fill, 0 hides the fill
  },

  /**
   * Draws lines series in the canvas element.
   * @param {Object} options
   */
  draw : function (options) {

    var
      context     = options.context,
      lineWidth   = options.lineWidth,
      shadowSize  = options.shadowSize,
      offset;

    context.save();
    context.lineCap = 'butt';
    context.lineWidth = lineWidth;
    context.strokeStyle = options.color;

    this.plot(options);

    context.restore();
  },

  plot : function (options) {

    var
      context   = options.context,
      xScale    = options.xScale,
      yScale    = options.yScale,
      data      = options.data, 
      length    = data.length - 1,
      x0        = xScale(data[0][0]),
      y0        = yScale(data[0][1]),
      zero      = yScale(0);
      
    if (length < 1) return;

    context.beginPath();
    context.moveTo(x0, y0);
    for (i = 0; i < length; ++i) {
      context.lineTo(
        xScale(data[i+1][0]),
        yScale(data[i+1][1])
      );
    }

    if (!options.fill || options.fill && !options.fillBorder) context.stroke();

    if (options.fill){
      x0 = xScale(data[0][0]);
      context.fillStyle = options.fillStyle;
      context.lineTo(xScale(data[length][0]), zero);
      context.lineTo(x0, zero);
      context.lineTo(x0, yScale(data[0][1]));
      context.fill();
      if (options.fillBorder) {
        context.stroke();
      }
    }
  }
});

/** Bars **/
Flotr.addType('whiskers', {

  options: {
    show: false,           // => setting to true will show bars, false will hide
    lineWidth: 2,          // => in pixels
    barWidth: 1,           // => in units of the x axis
    fill: true,            // => true to fill the area from the line to the x axis, false for (transparent) no fill
    fillColor: null,       // => fill color
    fillOpacity: 0.4,      // => opacity of the fill color, set to 1 for a solid fill, 0 hides the fill
    horizontal: false,     // => horizontal bars (x and y inverted)
    stacked: false,        // => stacked bar charts
    centered: true         // => center the bars to their x axis value
  },

  stack : { 
    positive : [],
    negative : [],
    _positive : [], // Shadow
    _negative : []  // Shadow
  },

  draw : function (options) {
    var
      context = options.context;

    context.save();
    context.lineJoin = 'miter';
    context.lineCap = 'butt';
    context.lineWidth = options.lineWidth;
    context.strokeStyle = options.color;
    if (options.fill) context.fillStyle = options.fillStyle;
    
    this.plot(options);

    context.restore();
  },

  plot : function (options) {

    var
      data            = options.data,
      context         = options.context,
      shadowSize      = options.shadowSize,
      xScale          = options.xScale,
      yScale          = options.yScale,
      zero            = yScale(0),
      i, x;

    if (data.length < 1) return;

    context.translate(-options.lineWidth, 0)
    context.beginPath();
    for (i = 0; i < data.length; i++) {
      x = xScale(data[i][0]);
      context.moveTo(x, zero);
      context.lineTo(x, yScale(data[i][1]));
    }

    context.closePath();
    context.stroke();
  },

  drawHit : function (options) {

    var
      args            = options.args,
      context         = options.context,
      shadowSize      = options.shadowSize,
      xScale          = options.xScale,
      yScale          = options.yScale,
      zero            = yScale(0),
      x               = xScale(args.x),
      y               = yScale(args.y);

    context.save();
    context.translate(-options.lineWidth, 0)
    context.beginPath();
    context.moveTo(x, zero);
    context.lineTo(x, y);
    context.closePath();
    context.stroke();
    context.restore();
  },

  clearHit: function (options) {

    var
      args            = options.args,
      context         = options.context,
      shadowSize      = options.shadowSize,
      xScale          = options.xScale,
      yScale          = options.yScale,
      lineWidth       = options.lineWidth,
      zero            = yScale(0),
      x               = xScale(args.x),
      y               = yScale(args.y);

    context.save();
    context.clearRect(x - 2 * lineWidth, y - lineWidth, 4 * lineWidth, zero - y + lineWidth);
    context.restore();
  }
});

/**
 * Flotr Adapter
 */
(function () { 

var
  V = envision,
  A = envision.adapters,
  E = Flotr.EventAdapter,
  DEFAULTS = A.defaultOptions;

function Child (options) {
  this.options = options || {};
  this.flotr = null;
  this._flotrDefaultOptions();
}

Child.prototype = {

  destroy : function () {
    this.flotr.destroy();
  },

  draw : function (data, flotr, node) {

    var
      options = this.options;

    data = this.getDataArray(data || options.data);

    if (flotr) {
      flotr = Flotr.merge(flotr, Flotr.clone(options));
    } else {
      flotr = options;
    }

    options.data = data;

    if (!flotr) throw 'No graph submitted.';

    this.flotr = Flotr.draw(node, data, flotr);
  },

  range : function (flotr) {
    var
      axis  = flotr.xaxis;
    return {
      min : axis.min,
      max : axis.max
    };
  },

  // Transform for Flotr
  transformData : function (data) {

    var
      length = data[0].length,
      dimension = data.length,
      transformed = [],
      point,
      i, j;

    for (i = 0; i < length; i++) {
      point = [];
      for (j = 0; j < dimension; j++) {
        point.push(data[j][i]);
      }
      transformed.push(point);
    }

    return transformed;
  },

  getDataArray : function (data) {

    if (
      data[0] && // Data exists and
      (
        !_.isArray(data[0]) || // data not an array
        !data[0].length || // data is an empty series
        (data[0][0] && _.isArray(data[0][0])) // data is a series
      )
    )
      return data;
    else
      return [data];
  },

  _flotrDefaultOptions : function (options) {

    var o = options || this.options,
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

  attach : function (component, name, callback) {

    var
      event = this.events[name] || {},
      handler = event.handler || false;

    name = event.name || false;

    if (handler) {

      return E.observe(component.node, name, function () {

        var
          args = [component].concat(Array.prototype.slice.call(arguments)),
          result = handler.apply(this, args);

        return callback.apply(null, [component, result]);

      });
    } else {
      return false;
    }
  },

  detach : function (component, name, callback) {
    return E.stopObserve(component.node, name, handler);
  },

  trigger : function (component, name, options) {

    var
      event = this.events[name],
      consumer = event.consumer || false;

    return consumer ? consumer.apply(this, [component, options]) : false;
  },

  events : {

    hit : {
      name : 'flotr:hit',
      handler : function (component, hit) {

        var
          x = hit.x,
          y = hit.y,
          graph = component.api.flotr,
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
      consumer : function (component, hit) {

        var
          graph = component.api.flotr,
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
      handler : selectHandler,
      consumer : function (component, selection) {

        var
          graph = component.api.flotr,
          axes = graph.axes,
          data = selection.data || {},
          options = {},
          x = selection.x,
          y = selection.y;

        if (!x && data.x) {
          // Translate data to pixels
          x = data.x;
          options.x1 = x.min;
          options.x2 = x.max;
        } else if (x) {
          // Use pixels
          options.x1 = axes.x.p2d(x.min);
          options.x2 = axes.x.p2d(x.max);
        }

        if (!y && data.y) {
          // Translate data to pixels
          y = data.y;
          options.y1 = y.min;
          options.y2 = y.max;
        } else if (y) {
          // Use pixels
          options.y1 = axes.y.d2p(y.min);
          options.y2 = axes.y.d2p(y.max);
        }

        graph.selection.setSelection(options);
      }
    },

    zoom : {
      name : 'flotr:select',
      handler : function (component, selection) {
        var options = selectHandler(component, selection);
        component.trigger('zoom', options);
        return options;
      },
      consumer : function (component, selection) {

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

        component.draw(null, options);
      }
    },

    mouseout : {
      name : 'flotr:mouseout',
      handler : function (component) {
      },
      consumer : function (component) {
        component.api.flotr.hit.clearHit();
      }
    },

    reset : {
      name : 'flotr:click',
      handler : function (component) {
        component.draw();
      },
      consumer : function (component) {
        component.draw();
      }
    },

    click : {
      name : 'flotr:click',
      handler : function (component) {

        var
          min = component.api.flotr.axes.x.min,
          max = component.api.flotr.axes.x.max;

        return {
          data : {
            x : {
              min : min,
              max : max
            }
          },
          x : {
            min : component.api.flotr.axes.x.d2p(min),
            max : component.api.flotr.axes.x.d2p(max)
          }
        };
      },
      consumer : function (component, selection) {

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

        component.draw(null, options);
      }
    }
  }
};

function selectHandler (component, selection) {

  var
    mode = component.options.config.selection.mode,
    axes = component.api.flotr.axes,
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
  };

  return options;
}

A.flotr.Child = Child;

})();

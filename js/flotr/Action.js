(function () {

var
  E = Flotr.EventAdapter,
  adapter;

adapter = {

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
      name : 'mouseout',
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

humblevis.flotr.adapter = adapter;

})();

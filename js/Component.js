// Component Class
(function () { 

var

  V = envision,

  CN_COMPONENT = 'envision-component',

  T_COMPONENT = '<div class="' + CN_COMPONENT + '"></div>';

/**
 * @summary Defines a visualization component.
 *
 * @description Components are the building blocks of a visualization, 
 * representing one typically graphical piece of the vis.  This class manages
 * the options, DOM and API construction for an adapter which handles the
 * actual drawing of the visualization piece.
 *
 * Adapters can take the form of an actual object, a constructor function
 * or a function returning an object.  Only one of these will be used.  If
 * none is submitted, the default adapter Flotr2 is used.
 *
 * @param {String} [name]  A name for the component.
 * @param {Element} [element]  A container element for the component.
 * @param {Number} [height]  An explicit component height.
 * @param {Number} [width]  An explicit component width.
 * @param {Array} [data]  An array of data.  Data may be formatted for 
 * envision or for the adapter itself, in which case skipPreprocess will
 * also need to be submitted.
 * @param {Boolean} [skipPreprocess]  Skip data preprocessing.  This is useful
 * when using the native data format for an adapter.
 * @param {Object} [adapter]  An adapter object.
 * @param {Function} [adapterConstructor]  An adapter constructor to be
 * instantiated by the component.
 * @param {Function} [adapterCallback]  An callback invoked by the component
 * returning an adapter.
 * @param {Object} [config]  Configuration for the adapter.
 *
 * @memberof envision
 * @class
 */
function Component (options) {

  options = options || {};

  var
    node = bonzo.create(T_COMPONENT)[0];

  this.options = options;
  this.node = node;

  // Instantiate Adapter
  if (options.adapter) {
    this.api = options.adapter;
  } else if (options.adapterConstructor) {
    this.api = new options.adapterConstructor(options.config);
  } else if (options.adapterCallback) {
    this.api = options.adapterCallback.call(null, options.config);
  } else if (options.config) {
    this.api = new V.adapters.flotr.Child(options.config || {});
  }

  // this.id = _.uniqueId(CN_COMPONENT);
  this.preprocessors = [];
}

Component.prototype = {

  /**
   * Render the component.
   *
   * If no element is submitted, the component will
   * render in the element configured in the constructor.
   *
   * @param {Element} [element]
   */
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

    this.draw(options.data, options.config);
  },

  /**
   * Draw the component.
   *
   * @param {Array} [data] Data for the adapter.
   * @param {Object} [options] Configuration object for the adapters draw method.
   */
  draw : function (data, config) {

    var
      api = this.api,
      options = this.options,
      preprocessors = this.preprocessors,
      clientData;

    clientData = data = data || options.data;
    config = config || options.config;

    if (!options.skipPreprocess && data) {

      clientData = [];

      _.each(api.getDataArray(data), function (d, index) {

        var
          preprocessor = preprocessors[index] || new V.Preprocessor(),
          isArray = _.isArray(d),
          isFunction = _.isFunction(d),
          unprocessed = isArray ? d : (isFunction ? d : d.data),
          processData = options.processData,
          range = api.range(config),
          min = range.min,
          max = range.max,
          resolution = this.node.clientWidth,
          dataArray = d,
          processed, objectData;

        // For object data
        if (!isFunction && !isArray) {
          dataArray = d.data;
          objectData = _.extend({}, d);
        }

        // Do data function preprocessing
        if (isFunction) {
          processed = data(min, max, resolution);
        } else {

          // Update if new data
          if (dataArray !== preprocessor.data) {
            preprocessor.setData(dataArray);
          } else {
            preprocessor.reset();
          }

          // Do custom callback preprocessing
          if (processData) {
            processData.apply(this, [{
              preprocessor : preprocessor,
              min : min,
              max : max,
              resolution : resolution
            }]);
            processed = preprocessor.getData();
          }
          // Default preprocessing
          else {
            processed = preprocessor
              .bound(min, max)
              .subsampleMinMax(resolution)
              .getData();
          }
        }

        // If present, transform the data for the API
        if (api.transformData) {
          processed = api.transformData(processed);
        }

        // Object Data
        if (objectData) {
          objectData.data = processed;
          clientData.push(objectData);
        }
        // Array Data
        else {
          clientData.push(processed);
        }
      }, this);
    }

    if (api) api.draw(clientData, config, this.node);
  },

  /**
   * Trigger an event on the component's API.
   *
   * Arguments are passed through to the API.
   */
  trigger : function () {
    this.api.trigger.apply(this.api, Array.prototype.concat.apply([this], arguments));
  },

  /**
   * Attach to an event on the component's API.
   *
   * Arguments are passed through to the API.
   */
  attach : function () {
    this.api.attach.apply(this.api, Array.prototype.concat.apply([this], arguments));
  },

  /**
   * Detach a listener from an event on the component's API.
   *
   * Arguments are passed through to the API.
   */
  detach : function () {
    this.api.detach.apply(this.api, Array.prototype.concat.apply([this], arguments));
  },

  /**
   * Destroy the component.
   *
   * Empties the container and calls the destroy method on the
   * component's API.
   */
  destroy : function () {
    if (this.api && this.api.destroy) this.api.destroy();
    bonzo(this.container).empty();
  },

  _setDimension : function (attribute) {
    var
      node = this.node,
      options = this.options;
    if (options[attribute]) {
      bonzo(node).css(attribute, options[attribute]);
    } else {
      //options[attribute] = parseInt(bonzo(node).css(attribute), 10);
      options[attribute] = node.clientWidth;
    }
    this[attribute] = options[attribute];
  }
};


V.Component = Component;

})();

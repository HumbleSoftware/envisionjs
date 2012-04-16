// Visualization Class
(function () { 

var
  CN_FIRST  = 'envision-first',
  CN_LAST   = 'envision-last',

  T_VISUALIZATION   = '<div class="envision-visualization"></div>';
  T_COMPONENT_CONTAINER = '<div class="envision-component-container"></div>';

/**
 * @summary Defines a visualization of componenents.
 *
 * @description This class manages the rendering of a visualization.
 * It provides convenience methods for adding, removing, and reordered
 * components dynamically as well as convenience methods for working
 * with a logical group of components.
 *
 * @param {String} [name]  A name for the visualization.
 * @param {Element} [element]  A container element for the visualization.
 *
 * @memberof envision
 * @class
 */
function Visualization (options) {
  this.options = options || {};
  this.components = [];
  this.node = null;
  this.rendered = false;
}

Visualization.prototype = {

  /**
   * Render the visualization.
   *
   * If no element is submitted, the visualization will
   * render in the element configured in the constructor.
   *
   * This method is chainable.
   *
   * @param {Element} [element]
   */
  render : function (element) {

    var options = this.options;

    element = element || options.element;
    if (!element) throw 'No element to render within.';

    this.node = bonzo.create(T_VISUALIZATION)[0];
    bonzo(this.node).addClass(options.name || '');
    this.container = element;
    bonzo(element).append(this.node);
    bonzo(element).data('envision', this);

    _.each(this.components, function (component) {
      this._renderComponent(component);
    }, this);
    this._updateClasses();

    this.rendered = true;

    return this;
  },

  /**
   * Add a component to the visualization.
   *
   * If the visualization has already been rendered,
   * it will render the new component.
   *
   * This method is chainable.
   *
   * @param {envision.Component} component
   */
  add : function (component) {
    this.components.push(component);
    if (this.rendered) {
      this._renderComponent(component);
      this._updateClasses();
    }
    return this;
  },

  /**
   * Remove a component from the visualization.
   *
   * This removes the components from the list of components in the
   * visualization and removes its container from the DOM.  It does not
   * destroy the component.
   *
   * This method is chainable.
   *
   * @returns {envision.Visualization} This visualization.
   */
  remove : function (component) {
    var
      components  = this.components,
      index = this.indexOf(component);
    if (index !== -1) {
      components.splice(index, 1);
      bonzo(component.container).remove();
      this._updateClasses();
    }
    return this;
  },

  /**
   * Reorders a component.
   *
   * This method is chainable.
   *
   * @param {envision.Component} component
   * @param {Number} newIndex
   */
  setPosition : function (component, newIndex) {
    var
      components  = this.components;
    if (newIndex >= 0 && newIndex < components.length && this.remove(component)) {
      if (this.rendered) {
        if (newIndex === components.length)
          this.node.appendChild(component.container);
        else
          this.node.insertBefore(component.container, components[newIndex].container);
      }
      components.splice(newIndex, 0, component);
      this._updateClasses();
    }
    return this;
  },

  /**
   * Gets the position of a component.
   *
   * @param {envision.Component} component
   */
  indexOf : function (component) {
    return _.indexOf(this.components, component);
  },

  /**
   * Gets the component at a position.
   *
   * @param {envision.Component} component
   * @returns {envision.Component}  The found component.
   */
  getComponent : function (index) {
    var components = this.components;
    if (index < components.length) return components[index];
  },

  /**
   * Gets whether or not the component is the first component
   * in the visualization.
   *
   * @param {envision.Component} component
   * @returns {Boolean}
   */
  isFirst : function (component) {
    return (this.indexOf(component) === 0 ? true : false);
  },

  /**
   * Gets whether or not the component is the last component
   * in the visualization.
   *
   * @param {envision.Component} component
   * @returns {Boolean}
   */
  isLast : function (component) {
    return (this.indexOf(component) === this.components.length - 1 ? true : false);
  },

  /**
   * Destroys the visualization.
   *
   * This empties the container and destroys all the components which are part
   * of the visualization.
   */
  destroy : function () {
    _.each(this.components, function (component) {
      component.destroy();
    });
    bonzo(this.container).empty();
  },

  _renderComponent : function (component) {
    var
      container = bonzo.create(T_COMPONENT_CONTAINER)[0];

    bonzo(this.node).append(container);
    component.render(container);
  },

  _updateClasses : function () {

    var
      components  = this.components,
      first     = 0,
      last      = components.length -1,
      node;

    _.each(components, function (component, index) {
      node = bonzo(component.container);

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

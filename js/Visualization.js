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
  T_COMPONENT_CONTAINER = '<div class="envision-component-container"></div>';

function Visualization (options) {
  this.options = options || {};
  this.components = [];
  this.node = null;
  this.rendered = false;
}

Visualization.prototype = {

  render : function (element) {

    var options = this.options;

    element = element || options.element;
    if (!element) throw 'No element to render within.';

    this.node = bonzo.create(T_VISUALIZATION)[0];
    bonzo(this.node).addClass(options.name || '')
    this.container = element;
    bonzo(element).append(this.node);

    _.each(this.components, function (component) {
      this._renderComponent(component);
    }, this);
    this._updateClasses();

    this.rendered = true;

    return this;
  },

  add : function (component) {
    this.components.push(component);
    if (this.rendered) {
      this._renderComponent(component);
      this._updateClasses();
    }
    return this;
  },

  remove : function (component) {
    var
      components  = this.components,
      index     = this.indexOf(component);
    if (index !== -1) {
      components.splice(index, 1);
      bonzo(component.container).remove();
      this._updateClasses();
    }
    return this;
  },

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

  indexOf : function (component) {
    return _.indexOf(this.components, component);
  },

  getComponent : function (index) {
    var components = this.components;
    if (index < components.length) return components[index];
  },

  isFirst : function (component) {
    return (this.indexOf(component) === 0 ? true : false);
  },

  isLast : function (component) {
    return (this.indexOf(component) === this.components.length - 1 ? true : false);
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

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

    var options = this.options;

    element = element || options.element;
    if (!element) throw 'No element to render within.';

    this.node = bonzo.create(T_VISUALIZATION)[0];
    bonzo(this.node).addClass(options.name || '')
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

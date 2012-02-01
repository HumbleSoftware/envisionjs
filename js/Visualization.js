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

  T_VISUALIZATION   = '<div class="humble-vis-visualization"></div>';
  T_CHILD_CONTAINER = '<div class="humble-vis-child-container"></div>';

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
  },

  add : function (child) {
    this.children.push(child);
    if (this.rendered) {
      this._renderChild(child);
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
      bonzo(child.element).remove();
      this._updateClasses();
      return true;
    }
  },

  setPosition : function (child, newIndex) {
    var
      children  = this.children;
    if (newIndex >= 0 && newIndex < children.length && this.remove(child)) {
      if (newIndex === children.length)
        bonzo(this.node).append(child.node);
      else
        this.node[0].insertBefore(child.node[0], children[newIndex].node[0]);
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

humblevis.Visualization = Visualization;

})();

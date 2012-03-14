function MockComponent () {}
MockComponent.prototype = {
  render : function (element) {
    this.container = element;
  },
  destroy : function () {}
};

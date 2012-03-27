function MockAdapter () {}
MockAdapter.prototype = {
  attach : function (component, name, callback) {
    bean.add.apply(bean, arguments);
  },
  detach : function () {},
  trigger : function () {
    bean.fire.apply(bean, arguments);
  },
  destroy : function () {}
};

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

humblevis.action = humblevis.action || {};
humblevis.action.selection = selection;

})();

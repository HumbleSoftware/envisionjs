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

envision.action = envision.action || {};
envision.action.selection = selection;

})();

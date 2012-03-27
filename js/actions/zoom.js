envision.actions.zoom =  {
  events : [
    // Zoom on the followers as selecting
    {
      handler : 'select',
      consumer : 'zoom'
    },
    // Zoom on the leader after mouseup
    'zoom',
    // Reset all on click
    'reset'
  ]
};

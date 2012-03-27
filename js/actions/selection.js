envision.actions.selection =  {
  events : [
    {
      handler : 'select',
      consumer : 'zoom'
    },
    // Reset on click, avoids re-drawing the leader.
    {
        handler : 'click',
        consumer : 'reset'
    }
  ]
};

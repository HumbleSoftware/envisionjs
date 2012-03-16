function example () {

  var
    container = document.getElementById('demo'),
    lines,
    linesOptions,
    points,
    pointsOptions,
    vis,
    selection;

  // Options for the points component
  pointsOptions = {
    height : 220,
    data : [[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],[0,1,2,3,4,5,6,7,8,9,10,9,8,7,6,5,4,3,2,1,0]],
    flotr : {
      colors : ['#ff00ff'],
      // Enable selection in Flotr, necessary for interaction
      selection : {
        mode : 'xy'
      },
      points : {
        radius : 1,
        show : true
      }
    }
  };

  // Options for the lines component
  linesOptions = {
    name : 'top',
    height : 220,
    data : [[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],[0,1,2,3,4,5,6,7,8,9,10,9,8,7,6,5,4,3,2,1,0]],
    flotr : {
      // Enable selection in Flotr, necessary for interaction
      selection : {
        mode : 'xy'
      }
    }
  };

  // Instantiate components
  lines = new envision.Component(linesOptions);
  points = new envision.Component(pointsOptions);

  // Instantiate new visualization
  vis = new envision.Visualization();

  // Add components to the visualization and render inside container
  vis
    .add(points)
    .add(lines)
    .render(container);

  // Instantiate new interaction
  selection = new envision.Interaction();

  // Create an interaction group from the two components.
  // All components of a group will lead and follow.
  selection.group([points, lines]);

  // Add the selection action.
  selection.add(envision.actions.zoom);

}

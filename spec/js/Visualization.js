describe('Visualization', function () {

  var
    H = humblevis;

  it('defines visualization', function () {
    expect(H.Visualization).toBeDefined();
  });

  it('creates a visualization', function () {
    var
      vis = new H.Visualization();
    expect(vis).toBeDefined();
  });

  /*
  it('renders', function () {
    var
      vis = new H.Visualization(),
      div = document.createElement('div');
    document.body.appendChild(div);
    vis.render(div);
    console.log(div);
  });
  */
});


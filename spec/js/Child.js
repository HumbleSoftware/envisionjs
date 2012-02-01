describe('Child', function () {

  var
    CN_CHILD = 'humble-vis-child',
    S_CHILD = '.' + CN_CHILD,
    H = humblevis;

  it('defines child', function () {
    expect(H.Child).toBeDefined();
  });

  it('creates a child', function () {
    var
      child = new H.Child();
    expect(child).toBeDefined();
  });

  describe('Render', function () {

    var
      div, $div;

    beforeEach(function () {
      div = document.createElement('div');
      $div = $(div);
      document.body.appendChild(div);
    });

    afterEach(function () {
      document.body.removeChild(div)
      div = null;
      $div = null;
    });

    it('renders', function () {
      var
        child = new H.Child();
      child.render(div);
      expect($div).toContain(S_CHILD);
    });

    it('renders inside a configured element', function () {
      var
        child = new H.Child({element : div});
      child.render();
      expect($div).toContain(S_CHILD);
    });
    it('assigns a name', function () {
      var
        child = new H.Child({name : 'test'});
      child.render(div);
      expect($div).toContain(S_CHILD + '.test');
    });

    it('assigns a height and width', function () {
      var
        height = 175,
        width = 250,
        child = new H.Child({height : height, width: width}),
        node;
      child.render(div);
      node = $div.find(S_CHILD);
      expect(node.width()).toBe(width);
      expect(node.height()).toBe(height);
    });
  });
});

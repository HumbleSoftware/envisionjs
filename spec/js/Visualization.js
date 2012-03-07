describe('Visualization', function () {

  var
    CN_FIRST          = 'humble-vis-first',
    CN_LAST           = 'humble-vis-last',
    CN_VISUALIZATION  = 'humble-vis-visualization',
    CN_CONTAINER      = 'humble-vis-child-container',

    S_FIRST           = '.' + CN_FIRST,
    S_LAST            = '.' + CN_LAST,
    S_VISUALIZATION   = '.' + CN_VISUALIZATION,
    S_CONTAINER       = '.' + CN_CONTAINER,

    H = envision;

  it('defines visualization', function () {
    expect(H.Visualization).toBeDefined();
  });

  it('creates a visualization', function () {
    var
      vis = new H.Visualization();
    expect(vis).toBeDefined();
  });

  it('has children member', function () {
    var
      vis = new H.Visualization();
    expect(vis.children).toBeDefined();
    expect(vis.children.length).toEqual(0);
  });

  it('adds a child', function () {
    var
      vis = new H.Visualization(),
      child = new MockChild();
    vis.add(child);
    expect(vis.children).toContain(child);
  });

  it('removes a child', function () {
    var
      vis = new H.Visualization(),
      child = new MockChild();
    vis.remove(child);
    expect(vis.children).not.toContain(child);
  });

  it('adds children', function () {
    var
      vis = new H.Visualization(),
      a = new MockChild(),
      b = new MockChild();

    vis.add(a);
    vis.add(b);

    expect(vis.children).toContain(a);
    expect(vis.children).toContain(b);
  });

  it('gets a childs index', function () {
    var
      vis = new H.Visualization(),
      a = new MockChild(),
      b = new MockChild();

    vis.add(a);
    vis.add(b);

    expect(vis.indexOf(a)).toBe(0);
    expect(vis.indexOf(b)).toBe(1);
  });

  it('reorders children', function () {
    var
      vis = new H.Visualization(),
      a = new MockChild(),
      b = new MockChild(),
      c = new MockChild();

    vis.add(a);
    vis.add(b);
    vis.add(c);

    vis.setPosition(c, 0);
    expect(vis.indexOf(c)).toBe(0);
    expect(vis.indexOf(a)).toBe(1);
    expect(vis.indexOf(b)).toBe(2);
  });

  it('fails to reorder when index out of bounds', function () {
    var
      vis = new H.Visualization(),
      a = new MockChild(),
      b = new MockChild(),
      c = new MockChild();

    vis.add(a);
    vis.add(b);
    vis.add(c);

    vis.setPosition(c, 3);
    expect(vis.indexOf(a)).toBe(0);
    expect(vis.indexOf(b)).toBe(1);
    expect(vis.indexOf(c)).toBe(2);
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
        vis = new H.Visualization();
      vis.render(div);
      expect($div).toContain(S_VISUALIZATION);
    });

    it('renders inside a configured element', function () {

      var
        vis = new H.Visualization({element : div});

      vis.render();
      expect($div).toContain(S_VISUALIZATION);
    });

    it('renders a child', function () {
      var
        vis = new H.Visualization(),
        child = new MockChild();

      vis.add(child);
      vis.render(div);

      expect($div).toContain(S_CONTAINER + S_FIRST + S_LAST);
    });

    it('renders children', function () {
      var
        vis = new H.Visualization(),
        a = new MockChild(),
        b = new MockChild(),
        c = new MockChild();

      vis.add(a);
      vis.add(b);
      vis.add(c);
      vis.render(div);

      expect($div.find(S_CONTAINER).size()).toBe(3);
      expect($div).toContain(S_CONTAINER + S_FIRST);
      expect($(a.container)).toBe(S_CONTAINER + S_FIRST);
      expect($(b.container)).not.toHaveClass(CN_FIRST);
      expect($(b.container)).not.toHaveClass(CN_LAST);
      expect($div).toContain(S_CONTAINER + S_LAST);
      expect($(c.container)).toBe(S_CONTAINER + S_LAST);
      expect($div.find(S_FIRST)).not.toBe($div.find(S_LAST));
    });

    it('adds new children rendering dynamically', function () {
      var
        vis = new H.Visualization(),
        a = new MockChild(),
        b = new MockChild();

      vis.render(div);
      vis.add(a);
      expect($div).toContain(S_CONTAINER + S_FIRST + S_LAST);

      vis.add(b);
      expect($div).toContain(S_CONTAINER + S_FIRST);
      expect($div).toContain(S_CONTAINER + S_LAST);
      expect($div.find(S_FIRST)).not.toBe($div.find(S_LAST));
    });

    it('removes a rendered child', function () {
      var
        vis = new H.Visualization(),
        child = new MockChild();

      vis.add(child);
      vis.render(div);
      vis.remove(child);

      expect($div).not.toContain(S_CONTAINER);
    });

    it('removes the first child', function () {
      var
        vis = new H.Visualization(),
        a = new MockChild(),
        b = new MockChild();

      vis.add(a);
      vis.add(b);
      vis.render(div);
      vis.remove(a);

      expect($div).toContain(S_CONTAINER + S_FIRST + S_LAST);
      expect($(b.container)).toBe(S_CONTAINER + S_FIRST + S_LAST);
      expect($(a.container)).not.toBe($(b.container));
    });

    it('removes the last child', function () {
      var
        vis = new H.Visualization(),
        a = new MockChild(),
        b = new MockChild();

      vis.add(a);
      vis.add(b);
      vis.render(div);
      vis.remove(b);

      expect($div).toContain(S_CONTAINER + S_FIRST + S_LAST);
      expect($(a.container)).toBe(S_CONTAINER + S_FIRST + S_LAST);
      expect($(a.container)).not.toBe($(b.container));
    });

    it('reorders rendered children', function () {
      var
        vis = new H.Visualization(),
        a = new MockChild(),
        b = new MockChild(),
        c = new MockChild();

      vis.add(a);
      vis.add(b);
      vis.add(c);
      vis.render(div);

      vis.setPosition(c, 0);

      expect($(c.container)).toHaveClass(CN_FIRST);
      expect($(a.container)).not.toHaveClass(CN_FIRST);
      expect($(a.container)).not.toHaveClass(CN_LAST);
      expect($(b.container)).toHaveClass(CN_LAST);

      vis.setPosition(c, 2);
      expect($(c.container)).toHaveClass(CN_LAST);
      expect($(c.container)).not.toHaveClass(CN_FIRST);
    });
  });

  describe('Chaining', function () {
    var
      vis, child;

    beforeEach(function () {
      vis = new H.Visualization();
      child = new MockChild();
    });
    afterEach(function () {
      vis = null;
      child = null;
    });

    it('chains add', function () {
      expect(vis.add(child)).toBe(vis);
    });

    it('chains remove', function () {
      expect(
        vis
          .add(child)
          .remove(child)
      ).toBe(vis);
    });

    it('chains setPosition', function () {
      expect(
        vis
          .add(child)
          .remove(child)
          .setPosition(child, 0)
      ).toBe(vis);
    });

    it('chains render', function () {
      var
        div = document.createElement('div');
      document.body.appendChild(div);
      expect(vis.render(div)).toBe(vis);
    });
  });
});


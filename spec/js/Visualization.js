describe('Visualization', function () {

  var
    CN_FIRST          = 'envision-first',
    CN_LAST           = 'envision-last',
    CN_VISUALIZATION  = 'envision-visualization',
    CN_CONTAINER      = 'envision-component-container',

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

  it('has components member', function () {
    var
      vis = new H.Visualization();
    expect(vis.components).toBeDefined();
    expect(vis.components.length).toEqual(0);
  });

  it('adds a component', function () {
    var
      vis = new H.Visualization(),
      component = new MockComponent();
    vis.add(component);
    expect(vis.components).toContain(component);
  });

  it('removes a component', function () {
    var
      vis = new H.Visualization(),
      component = new MockComponent();
    vis.remove(component);
    expect(vis.components).not.toContain(component);
  });

  it('adds components', function () {
    var
      vis = new H.Visualization(),
      a = new MockComponent(),
      b = new MockComponent();

    vis.add(a);
    vis.add(b);

    expect(vis.components).toContain(a);
    expect(vis.components).toContain(b);
  });

  it('gets a component\'s index', function () {
    var
      vis = new H.Visualization(),
      a = new MockComponent(),
      b = new MockComponent();

    vis.add(a);
    vis.add(b);

    expect(vis.indexOf(a)).toBe(0);
    expect(vis.indexOf(b)).toBe(1);
  });

  it('reorders components', function () {
    var
      vis = new H.Visualization(),
      a = new MockComponent(),
      b = new MockComponent(),
      c = new MockComponent();

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
      a = new MockComponent(),
      b = new MockComponent(),
      c = new MockComponent();

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

    it('sets envision data attribute', function () {
      var
        vis = new H.Visualization();
      vis.render(div);
      expect(bonzo(div).data('envision')).toBe(vis);
    });

    it('assigns a name', function () {
      var
        name = 'test',
        vis = new H.Visualization({name : name});
      vis.render(div);
      expect($div).toContain(S_VISUALIZATION + '.' + name);
    });

    it('renders a component', function () {
      var
        vis = new H.Visualization(),
        component = new MockComponent();

      vis.add(component);
      vis.render(div);

      expect($div).toContain(S_CONTAINER + S_FIRST + S_LAST);
    });

    it('renders components', function () {
      var
        vis = new H.Visualization(),
        a = new MockComponent(),
        b = new MockComponent(),
        c = new MockComponent();

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

    it('destroys', function () {
      var
        vis = new H.Visualization(),
        a = new MockComponent(),
        b = new MockComponent();

      spyOn(a, 'destroy');
      spyOn(b, 'destroy');

      vis.add(a);
      vis.add(b);
      vis.render(div);
      vis.destroy();

      expect(a.destroy).toHaveBeenCalled();
      expect(b.destroy).toHaveBeenCalled();
    });

    it('destroys components', function () {
      var
        vis = new H.Visualization();
      vis.render(div);
      vis.destroy();
      expect($div).not.toContain(S_VISUALIZATION);
    });

    it('adds new components rendering dynamically', function () {
      var
        vis = new H.Visualization(),
        a = new MockComponent(),
        b = new MockComponent();

      vis.render(div);
      vis.add(a);
      expect($div).toContain(S_CONTAINER + S_FIRST + S_LAST);

      vis.add(b);
      expect($div).toContain(S_CONTAINER + S_FIRST);
      expect($div).toContain(S_CONTAINER + S_LAST);
      expect($div.find(S_FIRST)).not.toBe($div.find(S_LAST));
    });

    it('removes a rendered component', function () {
      var
        vis = new H.Visualization(),
        component = new MockComponent();

      vis.add(component);
      vis.render(div);
      vis.remove(component);

      expect($div).not.toContain(S_CONTAINER);
    });

    it('removes the first component', function () {
      var
        vis = new H.Visualization(),
        a = new MockComponent(),
        b = new MockComponent();

      vis.add(a);
      vis.add(b);
      vis.render(div);
      vis.remove(a);

      expect($div).toContain(S_CONTAINER + S_FIRST + S_LAST);
      expect($(b.container)).toBe(S_CONTAINER + S_FIRST + S_LAST);
      expect($(a.container)).not.toBe($(b.container));
    });

    it('removes the last component', function () {
      var
        vis = new H.Visualization(),
        a = new MockComponent(),
        b = new MockComponent();

      vis.add(a);
      vis.add(b);
      vis.render(div);
      vis.remove(b);

      expect($div).toContain(S_CONTAINER + S_FIRST + S_LAST);
      expect($(a.container)).toBe(S_CONTAINER + S_FIRST + S_LAST);
      expect($(a.container)).not.toBe($(b.container));
    });

    it('reorders rendered components', function () {
      var
        vis = new H.Visualization(),
        a = new MockComponent(),
        b = new MockComponent(),
        c = new MockComponent();

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
      vis, component;

    beforeEach(function () {
      vis = new H.Visualization();
      component = new MockComponent();
    });
    afterEach(function () {
      vis = null;
      component = null;
    });

    it('chains add', function () {
      expect(vis.add(component)).toBe(vis);
    });

    it('chains remove', function () {
      expect(
        vis
          .add(component)
          .remove(component)
      ).toBe(vis);
    });

    it('chains setPosition', function () {
      expect(
        vis
          .add(component)
          .remove(component)
          .setPosition(component, 0)
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


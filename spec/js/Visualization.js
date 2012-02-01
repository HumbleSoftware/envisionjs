describe('Visualization', function () {

  var
    H = humblevis;

  function MockChild () {
    this.render = function (element) {
      this.container = element;
    }
  }

  function cleanup (div) {
    return function () {
      document.body.removeChild(div)
    };
  }

  it('defines visualization', function () {
    expect(H.Visualization).toBeDefined();
  });

  it('creates a visualization', function () {
    var
      vis = new H.Visualization();
    expect(vis).toBeDefined();
  });

  it('renders', function () {

    var
      vis = new H.Visualization(),
      div = document.createElement('div');

    document.body.appendChild(div);
    vis.render(div);
    expect($(div)).toContain('.humble-vis-visualization');

    this.after(cleanup(div));
  });

  it('renders inside a configured element', function () {

    var
      div = document.createElement('div'),
      vis = new H.Visualization({element : div});

    vis.render();
    expect($(div)).toContain('.humble-vis-visualization');
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
      c = new MockChild(),
      div = document.createElement('div'),
      $div = $(div);

    document.body.appendChild(div);
    vis.add(a);
    vis.add(b);
    vis.add(c);

    expect(vis.setPosition(c, 0)).toBe(true);
    expect(vis.indexOf(c)).toBe(0);
    expect(vis.indexOf(a)).toBe(1);
    expect(vis.indexOf(b)).toBe(2);
  });

  it('fails to reorder when index out of bounds', function () {
    var
      vis = new H.Visualization(),
      a = new MockChild(),
      b = new MockChild(),
      c = new MockChild(),
      div = document.createElement('div'),
      $div = $(div);

    document.body.appendChild(div);
    vis.add(a);
    vis.add(b);
    vis.add(c);

    expect(vis.setPosition(c, 3)).toBeFalsy();
    expect(vis.indexOf(a)).toBe(0);
    expect(vis.indexOf(b)).toBe(1);
    expect(vis.indexOf(c)).toBe(2);
  });

  it('removes a child', function () {
    var
      vis = new H.Visualization(),
      child = new MockChild();
    vis.remove(child);
    expect(vis.children).not.toContain(child);
  });

  it('renders a child', function () {
    var
      vis = new H.Visualization(),
      child = new MockChild(),
      div = document.createElement('div');

    document.body.appendChild(div);
    vis.add(child);
    vis.render(div);

    expect($(div)).toContain('.humble-vis-child-container.humble-vis-first.humble-vis-last');

    this.after(cleanup(div));
  });

  it('renders children', function () {
    var
      vis = new H.Visualization(),
      a = new MockChild(),
      b = new MockChild(),
      c = new MockChild(),
      div = document.createElement('div'),
      $div = $(div);

    document.body.appendChild(div);
    vis.add(a);
    vis.add(b);
    vis.add(c);
    vis.render(div);

    expect($div.find('.humble-vis-child-container').size()).toBe(3);
    expect($div).toContain('.humble-vis-child-container.humble-vis-first');
    expect($(a.container)).toBe('.humble-vis-child-container.humble-vis-first');
    expect($div).toContain('.humble-vis-child-container.humble-vis-last');
    expect($(b.container)).not.toHaveClass('humble-vis-first');
    expect($(b.container)).not.toHaveClass('humble-vis-last');
    expect($(c.container)).toBe('.humble-vis-child-container.humble-vis-last');
    expect($div.find('.humble-vis-first')).not.toBe($div.find('.humble-vis-last'));

    this.after(cleanup(div));
  });

  it('adds new children rendering dynamically', function () {
    var
      vis = new H.Visualization(),
      a = new MockChild(),
      b = new MockChild(),
      div = document.createElement('div'),
      $div = $(div);

    document.body.appendChild(div);
    vis.render(div);
    vis.add(a);
    expect($div).toContain('.humble-vis-child-container.humble-vis-first.humble-vis-last');

    vis.add(b);
    expect($div).toContain('.humble-vis-child-container.humble-vis-first');
    expect($div).toContain('.humble-vis-child-container.humble-vis-last');
    expect($div.find('.humble-vis-first')).not.toBe($div.find('.humble-vis-last'));

    this.after(cleanup(div));
  });

  it('removes a rendered child', function () {
    var
      vis = new H.Visualization(),
      child = new MockChild(),
      div = document.createElement('div');

    document.body.appendChild(div);
    vis.add(child);
    vis.render(div);
    vis.remove(child);

    expect($(div)).not.toContain('.humble-vis-child-container');

    this.after(cleanup(div));
  });

  it('removes the first child', function () {
    var
      vis = new H.Visualization(),
      a = new MockChild(),
      b = new MockChild(),
      div = document.createElement('div'),
      $div = $(div);

    document.body.appendChild(div);
    vis.add(a);
    vis.add(b);
    vis.render(div);
    vis.remove(a);

    expect($div).toContain('.humble-vis-child-container.humble-vis-first.humble-vis-last');
    expect($(b.container)).toBe('.humble-vis-child-container.humble-vis-first.humble-vis-last');
    expect($(a.container)).not.toBe($(b.container));

    this.after(cleanup(div));
  });

  it('removes the last child', function () {
    var
      vis = new H.Visualization(),
      a = new MockChild(),
      b = new MockChild(),
      div = document.createElement('div'),
      $div = $(div);

    document.body.appendChild(div);
    vis.add(a);
    vis.add(b);
    vis.render(div);
    vis.remove(b);

    expect($div).toContain('.humble-vis-child-container.humble-vis-first.humble-vis-last');
    expect($(a.container)).toBe('.humble-vis-child-container.humble-vis-first.humble-vis-last');
    expect($(a.container)).not.toBe($(b.container));

    this.after(cleanup(div));
  });

  it('reorders rendered children', function () {
    var
      vis = new H.Visualization(),
      a = new MockChild(),
      b = new MockChild(),
      c = new MockChild(),
      div = document.createElement('div'),
      $div = $(div);

    document.body.appendChild(div);
    vis.add(a);
    vis.add(b);
    vis.add(c);
    vis.render(div);

    vis.setPosition(c, 0);

    expect($(c.container)).toHaveClass('humble-vis-first');
    expect($(a.container)).not.toHaveClass('humble-vis-first');
    expect($(a.container)).not.toHaveClass('humble-vis-last');
    expect($(b.container)).toHaveClass('humble-vis-last');

    vis.setPosition(c, 2);
    expect($(c.container)).toHaveClass('humble-vis-last');
    expect($(c.container)).not.toHaveClass('humble-vis-first');

    this.after(cleanup(div));
  });
});


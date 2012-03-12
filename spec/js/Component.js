describe('Component', function () {

  var
    CN_COMPONENT = 'envision-component',
    S_COMPONENT = '.' + CN_COMPONENT,
    H = envision;

  it('defines component', function () {
    expect(H.Component).toBeDefined();
  });

  it('creates a component', function () {
    var
      component = new H.Component();
    expect(component).toBeDefined();
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
        component = new H.Component();
      component.render(div);
      expect($div).toContain(S_COMPONENT);
    });

    it('renders inside a configured element', function () {
      var
        component = new H.Component({element : div});
      component.render();
      expect($div).toContain(S_COMPONENT);
    });

    it('assigns a name', function () {
      var
        name = 'test',
        component = new H.Component({name : name});
      component.render(div);
      expect($div.attr('class')).toBe(name);
    });

    it('doesnt assign a name when name not present', function () {
      var
        component = new H.Component(),
        name  = 'basename';
      $div.addClass('basename');
      component.render(div);
      expect($div.attr('class')).toBe(name);
    });

    it('assigns a height and width', function () {
      var
        height = 175,
        width = 250,
        component = new H.Component({height : height, width: width}),
        node;
      component.render(div);
      node = $div.find(S_COMPONENT);
      expect(node.width()).toBe(width);
      expect(node.height()).toBe(height);
    });

    it('sets height and width dynamically', function () {
      var
        height = 175,
        width = 250,
        component = new H.Component({height : height, width: width});
      component.render(div);
      expect(component.width).toBeDefined();
      expect(component.height).toBeDefined();
    });
  });
});

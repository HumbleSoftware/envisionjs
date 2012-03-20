describe('Component', function () {

  var
    CN_COMPONENT = 'envision-component',
    S_COMPONENT = '.' + CN_COMPONENT,
    mocks = { MockAdapter : MockAdapter },
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

    it('destroys', function () {
      var
        component = new H.Component();
      component.render(div);
      component.destroy();
      expect($div).not.toContain(S_COMPONENT);
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

  describe('Adapter Integration', function () {

    it('takes a built adapter', function () {
      var
        component = new H.Component({adapter : new mocks.MockAdapter()});
      expect(component.api).toBeDefined();
    });

    it('takes an adapter constructor function', function () {
      var
        adapterOptions = { 'a' : 'b' },
        component;
      spyOn(mocks, 'MockAdapter').andCallThrough();
      component = new H.Component({
        adapterConstructor : mocks.MockAdapter,
        config : adapterOptions
      });
      expect(mocks.MockAdapter).toHaveBeenCalledWith(adapterOptions);
      expect(component.api).toBeDefined();
    });

    it('takes an adapter callback', function () {
      var
        api = new MockAdapter(),
        adapterOptions = { 'a' : 'b' },
        options, component;
      options = {
        adapterCallback : function () {
          return api;
        },
        config : adapterOptions
      }
      spyOn(options, 'adapterCallback').andCallThrough();
      component = new H.Component(options);
      expect(options.adapterCallback).toHaveBeenCalledWith(adapterOptions);
      expect(component.api).toBe(api);
    });

    it('attaches event listeners', function () {
      var
        options = {'a' : 'b'},
        adapter = new mocks.MockAdapter(),
        component = new H.Component({adapter : adapter});

      spyOn(adapter, 'attach');
      component.attach('select', options);
      expect(adapter.attach).toHaveBeenCalledWith(component, 'select', options);
    });

    it('detaches event listeners', function () {
      var
        adapter = new mocks.MockAdapter(),
        component = new H.Component({adapter : adapter});

      spyOn(adapter, 'detach');
      component.detach('select');
      expect(adapter.detach).toHaveBeenCalledWith(component, 'select');
    });

    it('trigers events', function () {
      var
        options = {'a' : 'b'},
        adapter = new mocks.MockAdapter(),
        component = new H.Component({adapter : adapter});

      spyOn(adapter, 'trigger');
      component.trigger('select', options);
      expect(adapter.trigger).toHaveBeenCalledWith(component, 'select', options);
    });

    it('destroys the adapter', function () {
      var
        adapter = new mocks.MockAdapter(),
        component = new H.Component({adapter : adapter});

      spyOn(adapter, 'destroy');
      component.destroy();
      expect(adapter.destroy).toHaveBeenCalled();
    });

  });

});

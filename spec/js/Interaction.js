describe('Interaction', function () {

  var
    H = envision;

  it('defines interaction', function () {
    expect(H.Interaction).toBeDefined();
  });

  it('creates an interaction', function () {
    expect(new H.Interaction()).toBeDefined();
  });

  it('makes a component a leader', function () {
    var
      interaction = new H.Interaction(),
      component = new MockComponent();
    interaction.leader(component);
    expect(interaction.leaders).toContain(component);
  });

  it('makes a component a follower', function () {
    var
      interaction = new H.Interaction(),
      component = new MockComponent();
    interaction.follower(component);
    expect(interaction.followers).toContain(component);
  });

  it('makes a group from one component', function () {
    var
      interaction = new H.Interaction(),
      component = new MockComponent();
    interaction.group(component);
    expect(interaction.leaders).toContain(component);
    expect(interaction.followers).toContain(component);
  });

  it('makes a group from multiple', function () {
    var
      interaction = new H.Interaction(),
      a = new MockComponent(),
      b = new MockComponent();
    interaction.group(a);
    interaction.group(b);
    expect(interaction.leaders).toContain(a);
    expect(interaction.leaders).toContain(b);
    expect(interaction.followers).toContain(a);
    expect(interaction.followers).toContain(b);
  });

  describe('Actions', function () {
    var
      interaction, action, a, b;

    beforeEach(function () {
      interaction = new H.Interaction();
      action = new MockAction();
      a = new H.Component({adapter : new MockAdapter()});
      b = new H.Component({adapter : new MockAdapter()});
    });

    it('adds an action', function () {
      interaction.add(action);
      expect(interaction.actions).toContain(action);
    });

    it('triggers an action on followers', function () {

      interaction.leader(a);
      interaction.follower(b);
      interaction.add(action);

      spyOn(b, 'trigger').andCallThrough();
      a.trigger('handle');

      expect(b.trigger).toHaveBeenCalled();
    });

    it('triggers an action on followers', function () {

      interaction.leader(a);
      interaction.follower(b);
      interaction.add(action);

      spyOn(a, 'trigger').andCallThrough();
      spyOn(b, 'trigger').andCallThrough();

      a.trigger('handleConsume');

      expect(b.trigger).toHaveBeenCalled();
      expect(a.trigger.callCount).toBe(1);
      expect(b.trigger.callCount).toBe(1);
    });

  });

  describe('Chaining', function () {
    var
      interaction, component;

    beforeEach(function () {
      interaction = new H.Interaction();
      component = new MockComponent();
    });
    afterEach(function () {
      interaction = null;
      component = null;
    });

    it('chains leader', function () {
      expect(interaction.leader(component)).toBe(interaction);
    });

    it('chains follower', function () {
      expect(interaction.follower(component)).toBe(interaction);
    });

    it('chains group', function () {
      expect(interaction.group(component)).toBe(interaction);
    });
  });

});

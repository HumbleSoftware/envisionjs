describe('Envision', function () {

  var
    E = envision;

  it('defines envision', function () {
    expect(E).toBeDefined();
  });

  describe('Dependencies', function () {

    it('has underscore.js', function () {
      expect(E._).toBeDefined();
    });

    it('has bean', function () {
      expect(E.bean).toBeDefined();
    });

    it('has bonzo', function () {
      expect(E.bonzo).toBeDefined();
    });

  });

  describe('Utility', function () {

    it('has a noConflict', function () {
      var root = (function () { return this; })(); // Not strict compatible?
      expect(root.envision).toBe(E);
      expect(E.noConflict).toBeDefined();
      expect(E.noConflict()).toBe(E);
      expect(root.envision).not.toBe(E);
    });

  });

});

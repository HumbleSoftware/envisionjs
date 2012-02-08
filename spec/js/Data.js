describe('Data', function () {
  var
    H = humblevis;

  it('defines data', function () {
    expect(H.Data).toBeDefined();
  });

  it('creates a data', function () {
    expect(new H.Data()).toBeDefined();
  });

});

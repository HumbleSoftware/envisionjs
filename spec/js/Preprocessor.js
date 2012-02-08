describe('Preprocessor', function () {
  var
    H = humblevis;

  it('defines preprocessor', function () {
    expect(H.Preprocessor).toBeDefined();
  });

  it('creates a preprocessor', function () {
    expect(new H.Preprocessor()).toBeDefined();
  });

  it('gets private data from options', function () {
    var
      data = [],
      options = { data : data },
      preprocessor = new H.Preprocessor(options);

    expect(preprocessor.getData()).toBe(data);
  });

  it('sets new private data', function () {
    var
      data = [],
      options = { data : [] },
      preprocessor = new H.Preprocessor(options);

    expect(preprocessor.getData()).not.toBe(data);
    preprocessor.setData(data);
    expect(preprocessor.getData()).toBe(data);
  });
});

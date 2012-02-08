describe('Data', function () {
  var
    H = humblevis;

  it('defines data', function () {
    expect(H.Data).toBeDefined();
  });

  it('creates a data', function () {
    expect(new H.Data()).toBeDefined();
  });

  it('gets private data from options', function () {
    var
      testData = [],
      options = { data : testData },
      data = new H.Data(options);

    expect(data.getData()).toBe(testData);
  });

  it('sets new private data', function () {
    var
      testData = [],
      options = { data : [] },
      data = new H.Data(options);

    data.setData(testData);
    expect(data.getData()).toBe(testData);
  });
});

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
      data = [[],[]],
      options = { data : data },
      preprocessor = new H.Preprocessor(options);

    expect(preprocessor.getData()).toBe(data);
  });

  it('sets new private data', function () {

    var
      data = [[],[]],
      options = { data : [[], []] },
      preprocessor = new H.Preprocessor(options);

    expect(preprocessor.getData()).not.toBe(data);
    preprocessor.setData(data);
    expect(preprocessor.getData()).toBe(data);
  });

  describe('Validation', function () {

    var
      preprocessor;

    beforeEach(function () {
      preprocessor = new H.Preprocessor();
    });
    afterEach(function () {
      preprocessor = null;
    });

    it('expects array data', function () {
      expect(function () { preprocessor.setData({}); })
        .toThrow(new Error("Array expected."));
    });

    it('expects at least two dimensions', function () {
      var
        e = new Error('Data must contain at least two dimensions.');
      expect(function () { preprocessor.setData([]); }).toThrow(e);
      expect(function () { preprocessor.setData([[]]); }).toThrow(e);
    });

    it('expects each dimension to be an array', function () {
      expect(function () { preprocessor.setData([[], {}]); })
        .toThrow(new Error('Data dimensions must be arrays.'));
    });

    it('expects each dimension to have the same number of points', function () {
      expect(function () { preprocessor.setData([[], [1]]); })
        .toThrow(new Error('Data dimensions must contain the same number of points.'));
    });

    it('validates options data', function () {
      var
        options = { data : {} };
      expect(function () { new H.Preprocessor(options); })
        .toThrow(new Error("Array expected."));
    });
  });
});

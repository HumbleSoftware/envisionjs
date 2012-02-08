describe('Preprocessor', function () {
  var
    H = humblevis,
    Preprocessor = H.Preprocessor;

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

  it('calculates length', function () {
    var
      preprocessor = new Preprocessor({data : [[], []]});
    expect(preprocessor.length()).toBe(0);
    preprocessor.setData([[0], [1]]);
    expect(preprocessor.length()).toBe(1);
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

  describe('Bounds', function () {

    var
      preprocessor;

    beforeEach(function () {
      var
        x = [],
        y = [],
        i;

      for (i = 0; i < 10; i++) {
        x.push(i);
        y.push(10 - 1 - i);
      }

      preprocessor = new Preprocessor({ data : [x, y] });
    });

    afterEach(function () {
      preprocessor = null;
    });

    it('bounds data', function () {
      preprocessor.bound(4, 6);
      expect(preprocessor.length()).toBe(3);
      expect(preprocessor.getData()).toEqual([
        [4, 5, 6],
        [5, 4, 3]
      ]);
    });

    it('makes empty data for bounds out of range', function () {
      preprocessor.bound(10, 12);
      expect(preprocessor.length()).toBe(0);
      expect(preprocessor.getData()).toEqual([[],[]]);
    });

    it('bounds from the beginning', function () {
      preprocessor.bound(0, 2);
      expect(preprocessor.length()).toBe(3);
      expect(preprocessor.getData()).toEqual([
        [0, 1, 2],
        [9, 8, 7]
      ]);
    });
  });
});

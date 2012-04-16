describe('Preprocessor', function () {
  var
    H = envision,
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
        data = [x, y],
        i;

      for (i = 0; i < 10; i++) {
        x.push(i);
        y.push(10 - 1 - i);
      }

      this.data = data;
      preprocessor = new Preprocessor({ data : data });
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

    it('resets data', function () {

      var
        data = preprocessor.getData(),
        bounded = preprocessor.bound(4, 6).getData();

      preprocessor.reset();

      expect(bounded).not.toBe(data);
      expect(preprocessor.getData()).toBe(data);
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

    it('includes points outside the range if match not exact', function () {
      preprocessor.bound(3.5, 6.5);
      expect(preprocessor.length()).toBe(5);
      expect(preprocessor.getData()).toEqual([
        [3, 4, 5, 6, 7],
        [6, 5, 4, 3, 2]
      ]);
    });

    it('skips bounding when boundary null / undefined', function () {
      preprocessor.bound(null, undefined);
      expect(preprocessor.length()).toBe(10);
      expect(preprocessor.getData()).toBe(this.data);
    });
  });

  describe('Subsample', function () {

    var
      length = 10,
      data, preprocessor;

    beforeEach(function () {
      var
        x = [],
        y = [],
        i;

      for (i = 0; i < length; i++) {
        x.push(i);
        y.push(10 - 1 - i);
      }

      data = [x, y];
      preprocessor = new Preprocessor({ data : data });
    });

    afterEach(function () {
      preprocessor = null;
    });

    it('subsamples data', function () {
      preprocessor.subsample(5);
      expect(preprocessor.length()).toBe(5);
      expect(preprocessor.getData()).toEqual([
        [0, 2, 4, 6, 9],
        [9, 7, 5, 3, 0]
      ]);
    });

    it('always includes endpoints', function () {
      var
        i, newData, newLength;
      for (i = 0; i < 10; i++) {

        preprocessor.setData(data);
        preprocessor.subsample(i);

        newData = preprocessor.getData();
        newLength = preprocessor.length();

        expect(newLength).toBeGreaterThan(1);
        expect(newData[0][0]).toBe(data[0][0]);
        expect(newData[1][0]).toBe(data[1][0]);
        expect(newData[0][newLength - 1]).toBe(data[0][length - 1]);
        expect(newData[1][newLength - 1]).toBe(data[1][length - 1]);
      }
    });

    it('length equals resolution when resolution 2 or greather', function () {
      var
        i;

      for (i = 2; i < length ; i++) {
        preprocessor.setData(data);
        preprocessor.subsample(i);
        expect(preprocessor.length()).toBe(i);
      }
    });

    it('does not subsample data not longer than resolution', function () {
      preprocessor.subsample(length);
      expect(preprocessor.length()).toBe(length);
      expect(preprocessor.getData()).toBe(data);
    });
  });

  describe('MinMaxSubsample', function () {
    var
      length = 100,
      data, preprocessor;

    beforeEach(function () {
      var
        x = [],
        y = [],
        i;

      for (i = 0; i < length; i++) {
        x.push(i);
        y.push(Math.sin(i/10));
      }

      data = [x, y];
      preprocessor = new Preprocessor({ data : data });
    });

    afterEach(function () {
      preprocessor = null;
    });

    it('subsamples data', function () {

      preprocessor.subsampleMinMax(10);

      var
        data = preprocessor.getData(),
        x = data[0],
        y = data[1];

      expect(Math.min.apply(Math, data[1])).toEqual(Math.min.apply(Math, y));
      expect(Math.max.apply(Math, data[1])).toEqual(Math.max.apply(Math, y));
    });
  });

  describe('Subsample Bounding', function () {

    var
      length = 10,
      strategies = ['subsample', 'subsampleMinMax'];
 
    beforeEach(function () {

      var
        x = [],
        y = [],
        data = [x, y],
        i;

      for (i = 0; i < length; i++) {
        x.push(i);
        y.push(10 - 1 - i);
      }

      this.data = data;
      this.preprocessor = new Preprocessor({ data : data });
    });

    it('subsamples and bounds', function () {

      // TODO implement strategies

      var
        preprocessor = this.preprocessor;

      preprocessor
        .bound(0, 7)
        .subsample(4);
      expect(preprocessor.length()).toBe(4);
      expect(preprocessor.getData()).toEqual([
        [0, 2, 4, 7],
        [9, 7, 5, 2]
      ]);
    });

    _.each(strategies, function (strategy) {

      it('skips ' + strategy + ' but bounds when res > bounded count', function () {

        var
          preprocessor = this.preprocessor;

        preprocessor
          .bound(0, 7)
          [strategy](9); // > 8 (bound length), < length

        expect(preprocessor.length()).toBe(8);
        expect(preprocessor.getData()).toEqual([
          [0, 1, 2, 3, 4, 5, 6, 7],
          [9, 8, 7, 6, 5, 4, 3, 2]
        ]);
      });

      it('skips bounding ' + strategy + ' when subsampling but not bounding', function () {

        var
          preprocessor = this.preprocessor;

        preprocessor[strategy](10);

        expect(preprocessor.length()).toBe(10);
        expect(preprocessor.getData()).toBe(this.data);
      });

    }, this);
  });

  describe('Chaining', function  () {

    var
      preprocessor;

    beforeEach(function () {
      preprocessor = new Preprocessor({
        data : [[],[]]
      });
    });

    it('chains setData', function () {
      expect(preprocessor.setData([[],[]])).toBe(preprocessor);
    });

    it('chains reset', function () {
      expect(preprocessor.reset()).toBe(preprocessor);
    });

    it('chains bound', function () {
      expect(preprocessor.bound(0, 1)).toBe(preprocessor);
    });

    it('chains subsample', function () {
      expect(preprocessor.subsample(10)).toBe(preprocessor);
    });

    it('chains subsampleMinMax', function () {
      expect(preprocessor.subsampleMinMax(0, 1)).toBe(preprocessor);
    });
  });
});

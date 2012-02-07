
var
  test = 1e5,
  data = {};

function test_points (data) {

  var
    i;

  data.test = [];

  for (i = 0; i < test; i++) {
    data.test.push([i, i]);
  }
}

function test_arrays (data) {

  var
    i;

  data.x = [];
  data.y = [];

  for (i = 0; i < test; i++) {
    data.x.push(i);
    data.y.push(i);
  }
}

//test_arrays(data);

console.log(window.data);

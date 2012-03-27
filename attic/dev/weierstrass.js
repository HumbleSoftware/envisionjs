// Generate Weierstrass Data

var count = 1e6,
  precision = 10000000,
  i = 0,
  a = 2, // Weierstrass a 
  x, y;

//console.time('weierstrass');
console.log('var weierdata = [');


for (i = 1; i < count; i++) {
  x = -1 + i * 2 / count;
  y = 0;
  for (var k = 1; k < 50; k++) {
    y += 

      Math.sin(Math.PI * Math.pow(k, a) * x) / 
      (Math.PI * Math.pow(k,a)); 
  }
  x = Math.round(x*precision)/precision;
  y = Math.round(y*precision)/precision;
  console.log('[%d, %d],', x, y);
}


// Unfolded final loop (no trailing comma);
i = count;
x = -1 + i * 2 / 1e2;
y = 0;
for (var k = 1; k < 50; k++) {
  y += Math.sin(Math.PI * Math.pow(k, a) * x) / (Math.PI * Math.pow(k,a)); 
}
x = Math.round(x*10000)/10000;
y = Math.round(y*10000)/10000;
console.log('[%d, %d]', x, y);

console.log(']');

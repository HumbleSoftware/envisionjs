//only supports 2D vectors... there is no error checking.
function FastVector(x,y){
	this.x = x;
	this.y = y;
};
FastVector.prototype = {
	add: function (B,internal) {
		var nx, ny;
		if(typeof(B)=='number'){
			nx = this.x+B;
			ny = this.y+B;
		}else{
			nx = this.x+B.x;
			ny = this.y+B.y;
		}
		return new FastVector(nx,ny);
	},
	add_: function(B) {
		if(typeof(B)=='number'){
			this.x+=B; this.y+=B;
		}else{
			this.x+=B.x; this.y+=B.y;
		}
		return this;
	},
	dot: function(B) {
		return ((this.x*B.x)+(this.y*B.y));
	},
	length: function() {
		return Math.sqrt((this.x*this.x)+(this.y*this.y));
	},
	multiply: function(B) {
		var nx, ny;
		if(typeof(B)=='number'){
			nx = this.x*B; ny = this.y*B;
		}else{ 
			nx = this.x*B.x; ny = this.y*B.y;
		}
		return new FastVector(nx,ny);
	},
	multiply_: function(B) {
		if(typeof(B)=='number'){
			this.x*=B; this.y*=B;
		}else{
			this.x*=B.x; this.y*=B.y;
		}
		return this;
	},
	squaredLength: function(args) {
		return (this.x*this.x)+(this.y*this.y);
	},
	sum: function(){
		return this.x+this.y;
	},
	subtract: function(B) {
		var nx, ny;
		if(typeof(B) == 'number'){
			nx = this.x-B; ny = this.y-B;
		}else{
			nx = this.x-B.x; ny = this.y-B.y;
		}
		return new FastVector(nx,ny);
	},
	subtract_: function(B) {
		if(typeof(B) == 'number'){
			this.x-=B; this.y-=B;
		}else{
			this.x-=B.x; this.y-=B.y;
		}
		return this;
	},
	toString: function() {
		return "["+this.x+","+this.y+"]";
	}
	
};


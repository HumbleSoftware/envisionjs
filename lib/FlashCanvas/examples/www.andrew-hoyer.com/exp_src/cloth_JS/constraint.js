
function Constraint(p1,p2,rl){
	this.p1 = p1;
	this.p2 = p2;
	this.rest_length = rl||p1.currentPosition().subtract(p2.currentPosition()).length();
	this.squared_rest_length = this.rest_length*this.rest_length;
}
Constraint.prototype = {
	draw: function() {
		//draw a line from p1 to p2
		canvas.line(this.p1.currentPosition(),this.p2.currentPosition());
	},
	satisfy: function() {
		var p1 = this.p1.currentPosition();
		var p2 = this.p2.currentPosition();
		var delta = p2.subtract(p1);
		
		var p1_im = this.p1.inv_mass;
		var p2_im = this.p2.inv_mass;
		
		/*
		var delta_len = 0.5*(this.rest_length+(delta.squaredLength()/this.rest_length));
		var diff = (delta_len-this.rest_length)/(delta_len*(p1_im+p2_im));
		*/
		var d = delta.squaredLength();
		var diff = (d-this.squared_rest_length)/((this.squared_rest_length+d)*(p1_im+p2_im));
		if(p1_im!=0){
			this.p1.setCurrentPos( p1.add(delta.multiply(p1_im*diff)) );
		}
		if(p2_im!=0){
			this.p2.setCurrentPos( p2.subtract(delta.multiply(p2_im*diff)) );
		}
	}
	
	
}
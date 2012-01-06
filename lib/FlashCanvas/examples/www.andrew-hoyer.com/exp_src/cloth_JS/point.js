
function Point(p,m,inv_m){
	this.curr = this.prev = p;
	this.mass = m;
	if(inv_m == 0){
		this.inv_mass = 0;
	}else{
		this.inv_mass = inv_m||1/m;
	}
	this.force = GRAVITY;
	this.RADIUS = 3;
}
Point.prototype = {
	setCurrentPos: function(p) {
		this.curr = p;
	},
	setPreviousPos: function(p) {
		this.prev = p;
	},
	currentPosition: function() {
		return this.curr;
	},
	previousPosition: function() {
		return this.prev;
	},
	move: function() {
		if(this.inv_mass!=0){
			//a = this.force.scale(this.mass);
			var new_pos = this.curr.multiply(DRAG_C_1).subtract(this.prev.multiply(DRAG_C_2)).add(GRAVITY_SCALED);
			new_pos.x = (new_pos.x<0)?0:((new_pos.x>1)?1:new_pos.x);
			new_pos.y = (new_pos.y<0)?0:((new_pos.y>1)?1:new_pos.y);
			this.prev = this.curr;
			this.curr = new_pos;
		}
	},
	
	
	draw: function() {
		//draw a circle at current point.
		canvas.circle(this.curr,this.RADIUS);
	},
	select: function() {
		canvas.circle(this.curr,this.RADIUS*2);
	}
	
};

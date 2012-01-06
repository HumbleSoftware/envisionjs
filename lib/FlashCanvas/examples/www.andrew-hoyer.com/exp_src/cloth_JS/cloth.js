

var PI = 3.1415;
var TWO_PI = PI*2;
var NUM_POINTS =10;

var X_OFFSET = 0.25;
var Y_OFFSET = 0.25;
var TOP_X=0.25;
var TOP_Y=0.2;

var POINT_MASS = 1.0;
var DRAG = 0.01;
var DRAG_C_1 = 2-DRAG;
var DRAG_C_2 = 1-DRAG;
var GRAVITY = new FastVector(0.0,0.5);
var DT = 0.05;
var GRAVITY_SCALED = GRAVITY.multiply(DT*DT);

/*global_vars*/
var canvas;
var cloth;
var timer = "";
var draw_constraints = false;
var draw_points = true;

function load(){
	clearInterval(timer);
	NUM_POINTS = document.getElementById('num_points').value;
	checkboxes();
	canvas = new Canvas('canvas');
	cloth = new Cloth();
	run();
	timer = setInterval(run, 35);
}

run = function(){
	canvas.clear();
	cloth.update();
}

function Cloth(){
	this.num_iterations = 2;
	
	this.points = new Array();
	this.constraints = new Array();
	
	var x_offset = X_OFFSET;
	var y_offset = Y_OFFSET;
	var x_step = ((1-2*X_OFFSET))/(NUM_POINTS-1);
	var y_step = ((1-2*Y_OFFSET))/(NUM_POINTS-1);
	
	var dist = x_step;
	
	for(var i=0, y=TOP_Y; i<NUM_POINTS; i++, y+=y_step){
		this.points[i] = new Array();
		for(var j=0, x=TOP_X; j<NUM_POINTS; j++, x+=x_step){
			var point = new Point(new FastVector(x,y),POINT_MASS);
			this.points[i][j] = point;
			
			//add a vertical constraint
			if(i>0){
				var c = new Constraint(this.points[i-1][j],this.points[i][j]);
				this.constraints.push(c);
			}
			//add a new horizontal constraints
			if(j>0){
				var c = new Constraint(this.points[i][j-1],this.points[i][j]);
				this.constraints.push(c);
			}
		}
	}
	//pin the top right and top left.
	this.points[0][0].inv_mass = 0;
	//this.points[NUM_POINTS-1][0].inv_mass = 0;
	this.points[0][NUM_POINTS-1].inv_mass = 0;
	
	
	this.num_constraints = this.constraints.length;
}
Cloth.prototype = {
	update: function() {
		//perform neccesary calcs:
		
		//move each point with a pull from gravity
		for(var i=0; i<NUM_POINTS; i++){
			for(var j=0; j<NUM_POINTS; j++){
				this.points[i][j].move();
			}
		}
		//make sure all the constraints are satisfied.
		for(var j=0; j<this.num_iterations; j++){
			for(var i=0; i<this.num_constraints; i++){
				this.constraints[i].satisfy();
			}
		}
		
		
		//draw the necessary components.
		if(draw_constraints){
			for(var i=0; i<this.num_constraints; i++){
				this.constraints[i].draw();
			}
		}
		if(draw_points){
			for(var i=0; i<NUM_POINTS; i++){
				for(var j=0; j<NUM_POINTS; j++){
					this.points[i][j].draw();
				}
			}
		}
	},
	getClosestPoint: function(pos) {
		min_dist = 1;
		min_point = null;
		for(i=0; i<NUM_POINTS; i++){
			for(j=0; j<NUM_POINTS; j++){
				var dist = pos.subtract(this.points[i][j].currentPosition()).length();
				if(dist<min_dist){
					min_dist = dist;
					min_point = this.points[i][j];
				}
			}
		}
		return min_point;
	}
};


var selected_point = null;
var key_pressed = false;
function getMouseCoords(event){
	event = event || window.event;
	var x = event.pageX || event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
	var y = event.pageY || event.clientY + (document.documentElement.scrollTop  || document.body.scrollTop);
	return new FastVector(x/canvas.width,y/canvas.height);
}
document.onmousedown = function(event){
	var pos = getMouseCoords(event);
	if(canvas.isInside(pos)){
		selected_point = cloth.getClosestPoint(pos);
		selected_point.setCurrentPos(pos);
		selected_point.setPreviousPos(pos);
		selected_point.inv_mass = 0;
		document.onmousemove = function(event){
			var pos = getMouseCoords(event);
			selected_point.setCurrentPos(pos);
			selected_point.setPreviousPos(pos);
			selected_point.inv_mass = 0;
		}
		document.onmouseup = function(event){
			if(!key_pressed){
				selected_point.inv_mass = 1/POINT_MASS;
			}
			document.onmousemove = function(event){}
		}
	}
	
}


document.onkeydown=function(event){
	event = event || window.event;
	if(event != null){
		
		if(event.keyCode == 71){
			//toggle gravity.
			if(GRAVITY.sum() == 0){
				//gravity is off so turn it back on:
				GRAVITY = new FastVector(0.0,0.5);
			}else{
				//gravity is on so turn it off:
				GRAVITY = new FastVector(0.0,0.0);
			}
			GRAVITY_SCALED = GRAVITY.multiply(DT*DT);
		}
		
		key_pressed = true;
	}else{
		key_pressed = false;
	}

}

document.onkeyup=function(event){
	key_pressed = false;
}

function checkboxes(){
	draw_constraints = document.getElementById('constraints').checked;
	draw_points = document.getElementById('points').checked;
}

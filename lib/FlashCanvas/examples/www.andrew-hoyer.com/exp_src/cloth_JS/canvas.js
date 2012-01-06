
function Canvas(id){
	this.canvas = document.getElementById(id);
	if (typeof FlashCanvas == "object") {
		FlashCanvas.initElement(this.canvas);
	}
	this.ctx = this.canvas.getContext('2d');
	this.width = this.canvas.width;
	this.height = this.canvas.height;
	this.fill_color = "#FFF";
	this.stroke_color = "#000";
}
Canvas.prototype={
	isInside: function(pos) {
		return (pos.x >= 0 && pos.x<=1 && pos.y>=0 && pos.y<=1);
	},
	
	clear: function(){
		this.ctx.clearRect(0, 0, this.width, this.height);
	},
	circle: function(p,r){
		x = p.x*this.width;
		y = p.y*this.height;
		//this.ctx.save();
		this.ctx.beginPath();
		this.ctx.strokeStyle = this.stroke_color;
		this.ctx.moveTo(x+r,y);
		this.ctx.arc(x,y,r,0,TWO_PI,false);
		this.ctx.fill();
		//this.ctx.restore();
	},
	line: function(x1,x2){
		//this.ctx.save();
		this.ctx.beginPath();
		this.ctx.strokeStyle = this.stroke_color;
		this.ctx.moveTo(x1.x*this.width,x1.y*this.height);
		this.ctx.lineTo(x2.x*this.width,x2.y*this.height);
		this.ctx.stroke();
		//this.ctx.restore();
	}
};

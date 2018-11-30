function Pipe(pipe_down,pipe_up,step,x){
	this.pipe_up=pipe_down;
	this.pipe_down=pipe_up;
	this.up_height=parseInt(Math.random()*150)+50;
	this.down_height=250-this.up_height;
	this.step=step;
	this.x=x;
	this.count=0;
}
Pipe.prototype.createPipe=function(x){
	return new Pipe(this.pipe_up,this.pipe_down,this.step,x);
}
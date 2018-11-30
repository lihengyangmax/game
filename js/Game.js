function Game(ctx,bird,pipe,land,moutain){
	this.ctx=ctx;
	this.bird=bird;
	this.pipeArr=[pipe];
	this.land=land;
	this.moutain=moutain;
	this.timer=null;
	this.iframe=0;
	this.init();
}
Game.prototype.init=function(){
	this.start();
	this.bindEvent();

}
Game.prototype.renderMoutain=function(){
	var img=this.moutain.img;
	this.moutain.x-=this.moutain.step;
	if(this.moutain.x<-img.width){
		this.moutain.x=0;
	}
	this.ctx.drawImage(img, this.moutain.x , this.moutain.y);
	this.ctx.drawImage(img, this.moutain.x + img.width + 1, this.moutain.y);
	this.ctx.drawImage(img, this.moutain.x + img.width * 2 + 2, this.moutain.y);
}
Game.prototype.renderLand=function(){
	var img=this.land.img;
	this.land.x -= this.land.step;
	if(this.land.x < -img.width) {
		this.land.x = 0;
	}
	this.ctx.drawImage(img, this.land.x, this.land.y);
	this.ctx.drawImage(img, this.land.x + img.width + 1, this.land.y);
	this.ctx.drawImage(img, this.land.x + img.width * 2 + 2, this.land.y);

}
Game.prototype.start=function(){
	var me=this;
	this.timer=setInterval(function(){
		me.iframe++;
		me.clear();
		me.renderMoutain();
		me.renderLand();
		me.bird.fallDown();
		if(!(me.iframe%60)){
			me.createPipe();
		}
		me.movePipe();
		me.renderPipe();
		me.clearPipe();
		if(!(me.iframe%10)){
			me.bird.fly();
		}
		// me.renderPipePoints();
		// me.renderBirdPoints();
		me.renderBird()
		me.checkBoom();
	},20);
}
Game.prototype.clear = function() {
	this.ctx.clearRect(0, 0, 360, 512);
}
Game.prototype.renderBird=function(){
	this.ctx.save();
	this.ctx.translate(this.bird.x,this.bird.y);
	var deg=this.bird.state==="D"?this.bird.speed*Math.PI/180:-this.bird.speed*Math.PI/180;
	this.ctx.rotate(deg);
	var img=this.bird.img;
	this.ctx.drawImage(img,-img.width/2,-img.height/2);
	this.ctx.restore();
}
Game.prototype.bindEvent=function(){
	var me=this;
	this.ctx.canvas.onclick=function(){
		me.bird.energy();
	}
}
Game.prototype.renderPipe=function(){
	var me=this;
	this.pipeArr.forEach(function(value,index){
		var up_img=value.pipe_up;
		var img_x=0;
		var img_y=up_img.height-value.up_height;
		var img_w = up_img.width;
		var img_h = value.up_height;
		var canvas_x = me.ctx.canvas.width - value.step * value.count;
		// 6 canvas上的矩形y 因为贴顶所以是0  
		var canvas_y = 0;
		// 7 canvas上的矩形宽
		var canvas_w = img_w;
		// 8 canvas上的矩形高
		var canvas_h = img_h;
		// 因为这里的this是window 所以没法用 
		me.ctx.drawImage(up_img, img_x, img_y, img_w, img_h, canvas_x, canvas_y, canvas_w, canvas_h);
		// 定义下管子的参数
		// 0 下管子的图片
		var down_img = value.pipe_down;
		// 1 图片上的矩形x
		var down_img_x = 0;
		// 2 图片上的矩形y
		var down_img_y = 0;
		// 3 图片上的矩形w
		var down_img_w = img_w;
		// 4 图片上的矩形h
		var down_img_h = 250 - img_h;
		// 5 canvas上的矩形x
		var down_canvas_x = me.ctx.canvas.width - value.step * value.count;
		// 6 canvas上的矩形y
		var down_canvas_y = img_h + 150;
		// 7 canvas上的矩形宽
		var down_canvas_w = img_w;
		// 8 canvas上的矩形高
		var down_canvas_h = 250 - img_h;
		me.ctx.drawImage(down_img, down_img_x, down_img_y, down_img_w, down_img_h, down_canvas_x, down_canvas_y, down_canvas_w, down_canvas_h);
	
	});
}
Game.prototype.movePipe = function() {
	this.pipeArr.forEach(function(value) {
		value.count++;
	})
}
Game.prototype.createPipe = function() {
	// 通过调用Pipe实例的方法得到新的pipe实例
	var pipe = this.pipeArr[0].createPipe(this.ctx.canvas.width);
	// 将新实例放到数组里
	this.pipeArr.push(pipe);
}
Game.prototype.clearPipe=function(){
	for(var i=0;i<this.pipeArr.length;i++){
		var pipe=this.pipeArr[i];
		if(pipe.x - pipe.step * pipe.count < - pipe.pipe_up.width) {
			// console.log("第" + i + "个管子 应该被移除了");
			// 移除
			this.pipeArr.splice(i, 1);
			return;
		}
	}
}
// Game.prototype.renderBirdPoints = function() {
// 	// 1 获取鸟的四个点
// 	var bird_A = {
// 		x: -this.bird.img.width / 2 + 4 + this.bird.x,
// 		y: -this.bird.img.height / 2 + 8 + this.bird.y
// 	} 
// 	var bird_B = {
// 		x: -this.bird.img.width / 2 + 4 +  this.bird.img.width - 9 + this.bird.x,
// 		y: -this.bird.img.height / 2 + 8 + this.bird.y
// 	}

// 	var bird_C = {
// 		x: -this.bird.img.width / 2 + 4 + this.bird.x,
// 		y: -this.bird.img.height / 2 + 8 + this.bird.img.height - 12 + this.bird.y
// 	}
// 	var bird_D = {
// 		x: -this.bird.img.width / 2 + 4 +  this.bird.img.width - 9 + this.bird.x,
// 		y: -this.bird.img.height / 2 + 8 + this.bird.img.height - 12 + this.bird.y
// 	}
// 	// 绘制到原始坐标系中
// 	this.ctx.beginPath();
// 	this.ctx.moveTo(bird_A.x, bird_A.y);
// 	this.ctx.lineTo(bird_B.x, bird_B.y);
// 	this.ctx.lineTo(bird_D.x, bird_D.y);
// 	this.ctx.lineTo(bird_C.x, bird_C.y);
// 	this.ctx.closePath();
// 	this.ctx.strokeStyle = "blue";
// 	this.ctx.stroke();

// }
// Game.prototype.renderPipePoints = function() {
// 	for(var i = 0; i < this.pipeArr.length; i++) {
// 		// 获取管子
// 		var pipe = this.pipeArr[i];
// 		// 上管子的A点
// 		var pipe_up_A = {
// 			x: this.ctx.canvas.width - pipe.step * pipe.count,
// 			y: 0
// 		}
// 		// 上管子的B点
// 		var pipe_up_B = {
// 			x: this.ctx.canvas.width - pipe.step * pipe.count + pipe.pipe_up.width,
// 			y: 0
// 		}
// 		// 上管子的C点
// 		var pipe_up_C = {
// 			x: this.ctx.canvas.width - pipe.step * pipe.count,
// 			y: pipe.up_height
// 		}
// 		// 上管子的D点
// 		var pipe_up_D = {
// 			x: this.ctx.canvas.width - pipe.step * pipe.count + pipe.pipe_up.width,
// 			y: pipe.up_height
// 		}
// 		this.ctx.beginPath();
// 		this.ctx.moveTo(pipe_up_A.x, pipe_up_A.y);
// 		this.ctx.lineTo(pipe_up_B.x, pipe_up_B.y);
// 		this.ctx.lineTo(pipe_up_D.x, pipe_up_D.y);
// 		this.ctx.lineTo(pipe_up_C.x, pipe_up_C.y);
// 		this.ctx.closePath();
// 		this.ctx.strokeStyle = "red";
// 		this.ctx.stroke();

// 		// 下管子的A点
// 		var pipe_down_A = {
// 			x: pipe_up_A.x,
// 			y: pipe_up_D.y + 150
// 		}
// 		// 下管子的B点
// 		var pipe_down_B = {
// 			x: pipe_up_B.x,
// 			y: pipe_down_A.y
// 		}
// 		// 下管子的C点
// 		var pipe_down_C = {
// 			x: pipe_down_A.x,
// 			y: 400
// 		}
// 		// 下管子的D点
// 		var pipe_down_D = {
// 			x: pipe_down_B.x, 
// 			y: 400
// 		}
// 		// this.ctx.beginPath();
// 		// this.ctx.moveTo(pipe_down_A.x, pipe_down_A.y);
// 		// this.ctx.lineTo(pipe_down_B.x, pipe_down_B.y);
// 		// this.ctx.lineTo(pipe_down_D.x, pipe_down_D.y);
// 		// this.ctx.lineTo(pipe_down_C.x, pipe_down_C.y);
// 		// this.ctx.closePath();
// 		// this.ctx.strokeStyle = "red";
// 		// this.ctx.stroke();
// 	}
// }
Game.prototype.checkBoom = function() {
	// 循环管子
	for(var i = 0; i < this.pipeArr.length; i++) {
		// 获取管子
		var pipe = this.pipeArr[i];
		// 上管子的A点
		var pipe_up_A = {
			x: this.ctx.canvas.width - pipe.step * pipe.count,
			y: 0
		}
		// 上管子的B点
		var pipe_up_B = {
			x: this.ctx.canvas.width - pipe.step * pipe.count + pipe.pipe_up.width,
			y: 0
		}
		// 上管子的C点
		var pipe_up_C = {
			x: this.ctx.canvas.width - pipe.step * pipe.count,
			y: pipe.up_height
		}
		// 上管子的D点
		var pipe_up_D = {
			x: this.ctx.canvas.width - pipe.step * pipe.count + pipe.pipe_up.width,
			y: pipe.up_height
		}
		// 下管子的A点
		var pipe_down_A = {
			x: pipe_up_A.x,
			y: pipe_up_D.y + 150
		}
		// 下管子的B点
		var pipe_down_B = {
			x: pipe_up_B.x,
			y: pipe_down_A.y
		}
		// 下管子的C点
		var pipe_down_C = {
			x: pipe_down_A.x,
			y: 400
		}
		// 下管子的D点
		var pipe_down_D = {
			x: pipe_down_B.x, 
			y: 400
		}
		// 鸟的四个点
		var bird_A = {
			x: -this.bird.img.width / 2 + 4 + this.bird.x,
			y: -this.bird.img.height / 2 + 8 + this.bird.y
		} 
		var bird_B = {
			x: -this.bird.img.width / 2 + 4 +  this.bird.img.width - 9 + this.bird.x,
			y: -this.bird.img.height / 2 + 8 + this.bird.y
		}

		var bird_C = {
			x: -this.bird.img.width / 2 + 4 + this.bird.x,
			y: -this.bird.img.height / 2 + 8 + this.bird.img.height - 12 + this.bird.y
		}
		var bird_D = {
			x: -this.bird.img.width / 2 + 4 +  this.bird.img.width - 9 + this.bird.x,
			y: -this.bird.img.height / 2 + 8 + this.bird.img.height - 12 + this.bird.y
		}

		// 检测是否与上管子碰撞到
		// 鸟的B点与管子的上管子C点进行比较
		if(bird_B.x >= pipe_up_C.x && bird_B.y <= pipe_up_C.y && bird_A.x <= pipe_up_D.x) {
			// 鸟挂掉
			// alert("gameover");
			// return;
			console.log("碰到上管子了")
			this.over();
			return;
		} 
		// 与下管子进行比较
		if(bird_B.x >= pipe_down_A.x && bird_D.y >= pipe_down_A.y && bird_C.x <= pipe_down_B.x) {
			console.log("碰到下管子了")
			this.over();
			return;
		}

	}
}
Game.prototype.over=function(){
	clearInterval(this.timer);
}
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = window.innerWidth;
const CANVAS_HEIGHT = canvas.height = window.innerHeight;

const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCanvasCtx = collisionCanvas.getContext('2d');
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;
//To avoid tainted Canvas issue.

let gameOver = false;
let score = 0;
ctx.font = '50px Impact'

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;
let ravens = [];

function drawScore(){
	ctx.fillStyle = 'black';
	ctx.fillText('Score: ' + score, 50,75)
	ctx.fillStyle = 'white';
	ctx.fillText('Score: ' + score, 55,85)
}
function drawGameOver(){
	ctx.textAlign = 'center';
	ctx.fillStyle = 'black';
	ctx.fillText('GAME OVER, your score is ' + score, canvas.width/2, canvas.height/2);
}
window.addEventListener('click',function(e){
	const detectPixelColor = collisionCanvasCtx.getImageData(e.x,e.y,1,1);
	//opacity/alpha value in css lies between 0 and 1. Here the object returned by getImageData will have opacity between 0 to 255.
	//Canvas is just the ravens and scores and the rest of area is transparent.
	console.log(detectPixelColor)
	const pc = detectPixelColor.data;
	ravens.forEach((object) => {
		if(object.randomColors[0] === pc[0] && object.randomColors[1] === pc[1] && object.randomColors[2] === pc[2]){
			object.markedForDeletion = true;
			score++;
			explosions.push(new Explosion(object.x, object.y, object.width));
		}
	})
})
class Raven {
	constructor(){
		this.sourceWidth = 271;
		this.sourceHeight = 194;
		this.sizeModifier = Math.random() *0.6 + 0.4;
		this.width = this.sourceWidth * this.sizeModifier;
		this.height = this.sourceHeight * this.sizeModifier;
		this.x = canvas.width;
		this.y = Math.random() * (canvas.height - this.height);
		this.directionX = Math.random() * 5 + 3;
		this.directionY = Math.random() * 5 -2.5;
		this.image = new Image();
		this.image.src = 'raven.png';
		this.frame = 0;
		this.markedForDeletion = false;
		this.timeSinceFlap = 0;
		this.flapInterval = Math.random() * 100 + 10;
		this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
		this.color = 'rgb(' + this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] + ')';
	}
	update(deltaTime){
		if(this.y < 0 || this.y > CANVAS_HEIGHT - this.height){
			this.directionY = this.directionY * -1;
		}
		this.x -= this.directionX;
		this.y += this.directionY;
		if(this.x < 0 - this.width) this.markedForDeletion = true;
		this.timeSinceFlap += deltaTime;
		if(this.timeSinceFlap>this.flapInterval){
			if(this.frame === 5) this.frame=0;
			else this.frame++;;
			this.timeSinceFlap = 0;
		}
		if(this.x < 0 -this.width) gameOver = true;
	}
	draw(){
		collisionCanvasCtx.fillStyle = this.color;
		collisionCanvasCtx.fillRect(this.x,this.y,this.width,this.height);
		ctx.drawImage(this.image,this.frame * this.sourceWidth, 0, this.sourceWidth, this.sourceHeight,this.x, this.y, this.width, this.height)
	}
}
let explosions = [];
class Explosion{
	constructor(x,y,size){
		this.image = new Image;
		this.image.src = 'boom.png';
		this.spriteWidth = 200;
		this.spriteHeight = 179;
		this.size = size;
		this.x = x;
		this.y = y;
		this.frame = 0;
		this.sound = new Audio();
		this.sound.src = 'Fire.wav';
		this.timeSinceLastFrame = 0;
		this.frameInterval = 200;
		this.markedForDeletion = false;
	}
	update(deltaTime){
		if(this.frame === 0) this.sound.play();
		this.timeSinceLastFrame += deltaTime;
		if(this.timeSinceLastFrame > this.frameInterval){
			this.frame++;
			this.timeSinceLastFrame = 0;
			if(this.frame>5) this.markedForDeletion = true;
		}
	}
	draw(){
		ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth,this.spriteHeight, this.x, this.y, this.size, this.size)
	}
}
function animate(timestamp){
	//to make sure that timed events are consistent and based on milliseconds rather than power of each computer and its ability to serve frames at certain speed.
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	collisionCanvasCtx.clearRect(0, 0, canvas.width, canvas.height);
	drawScore();
	let deltaTime = timestamp - lastTime;
	lastTime = timestamp;
	timeToNextRaven += deltaTime;
	if (timeToNextRaven > ravenInterval){
		ravens.push(new Raven());
		timeToNextRaven = 0;
		ravens.sort(function(a,b){
			return a.width - b.width;
		});
	}
	[...ravens, ...explosions].forEach((object) => object.update(deltaTime));
	[...ravens, ...explosions].forEach((object) => object.draw());
	ravens = ravens.filter(object => !object.markedForDeletion);
	explosions = explosions.filter(object => !object.markedForDeletion);
	
	//using splice to remove unused ravens will require to update index accordingly to make sure that its neighbours dont gets skipped.
	if(!gameOver)requestAnimationFrame(animate);
	else drawGameOver();
}
animate(0);
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 500;
const CANVAS_HEIGHT = canvas.height = 1000;
let horizontalAngle = 180;
let verticalAngle = 360;
const enemiesArray = [];
let gameFrame = 0;
let numberOfEnemies = 5;

const slider = document.getElementById('slider');
slider.value = numberOfEnemies;
const showNumberOfEnemies = document.getElementById('showNumberOfEnemies');
showNumberOfEnemies.textContent = numberOfEnemies;
slider.addEventListener('change', function(e){
	numberOfEnemies = e.target.value;
	showNumberOfEnemies.textContent = e.target.value;
	generateEnemies();
})

const checkboxes =  document.querySelectorAll('input[type="checkbox"]');
let jiggleFlag = document.getElementById('jiggleEnemy').checked;
let wavyFlag = document.getElementById('wavyFlyingEnemy').checked;
let circularFlag = document.getElementById('circluarPatrolEnemy').checked;
let linearFlag = document.getElementById('linearSawEnemy').checked;
checkboxes.forEach((checkbox) => {
	checkbox.addEventListener('change',function(e){
		if(e.target.name === 'jiggleEnemy'){
			jiggleFlag = e.target.checked;
		}
		if(e.target.name === 'wavyFlyingEnemy'){
			wavyFlag = e.target.checked;
		}
		if(e.target.name === 'circluarPatrolEnemy'){
			circularFlag = e.target.checked;
		}
		if(e.target.name === 'linearSawEnemy'){
			linearFlag = e.target.checked;
		}
		generateEnemies();
	})
})

const horizontal = document.getElementById('horizontal');
const vertical = document.getElementById('vertical');
horizontal.value = horizontalAngle;
vertical.value = verticalAngle;
const showHorizontalAngle = document.getElementById('showHorizontalAngle');
const showVerticalAngle = document.getElementById('showVerticalAngle');
showHorizontalAngle.textContent = horizontalAngle;
showVerticalAngle.textContent = verticalAngle;
const angles = document.querySelectorAll('.angle');
angles.forEach((angle) => {
	angle.addEventListener('change', function(e){
		if(e.target.name === 'horizontal'){
			horizontalAngle = e.target.value;
			showHorizontalAngle.textContent = horizontalAngle;
		}
		else if(e.target.name === 'vertical'){
			verticalAngle = e.target.value;
			showVerticalAngle.textContent = verticalAngle;
		}
		generateEnemies();
	})
})


function generateEnemies(){
	enemiesArray.splice(0,enemiesArray.length);
	for(let i = 0; i < numberOfEnemies; i++){
		if(jiggleFlag){
			enemiesArray.push(new Enemy1());			
		}
		if(wavyFlag){
			enemiesArray.push(new Enemy2());
		}
		if(circularFlag){
			enemiesArray.push(new Enemy3());		
		}
		if(linearFlag){
			enemiesArray.push(new Enemy4());	
		}
	}
}


	
class Enemy1{
	constructor(){
		this.image = new Image();
		this.image.src = "enemy1.png";
		//this.speed = Math.random() * 4 - 2;
		
		this.spriteWidth = 293;
		this.spriteHeight = 155;
		this.width = this.spriteWidth / 2.5;
		this.height = this.spriteHeight / 2.5;
		this.x = Math.random() * (canvas.width - this.width);
		this.y = Math.random() * (canvas.height - this.height);
		
		this.frame = 0;
		this.flapSpeed = Math.floor(Math.random() * 3 + 1)
	}
	update(){
		this.x += Math.random() * 15 - 7.5;
		this.y += Math.random() * 10 - 5;
		//Wiggle Movement logic
		
		if(gameFrame%this.flapSpeed === 0){
			this.frame > 4 ? this.frame =0 : this.frame++;
		}
	}
	draw(){
		//ctx.strokeRect(this.x, this.y, this.width, this.height);
		ctx.drawImage(this.image,this.frame * this.spriteWidth, 0,this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height);
	}
}

class Enemy2 extends Enemy1{
	constructor(){
		super(Enemy1);
		this.image.src = "enemy2.png";
		this.speed = Math.random() * 4 + 1;
		this.spriteWidth = 266;
		this.spriteHeight = 188;
		this.angle = Math.random() * 2;
		this.angleSpeed = Math.random() * 0.2;
		this.curve = Math.random() * 7;
	}
	update(){
		this.x -= this.speed;
		if (this.x + this.width < 0){
			this.x = canvas.width;
		}
		this.y +=  this.curve * Math.sin(this.angle);
		this.angle += this.angleSpeed;
		
		if(gameFrame%this.flapSpeed === 0){
			this.frame > 4 ? this.frame =0 : this.frame++;
		}
	}
}

class Enemy3 extends Enemy2{
	constructor(){
		super(Enemy2);
		this.image.src = "enemy3.png";
		this.spriteWidth = 218;
		this.spriteHeight = 177;
		this.angleSpeed = Math.random() * 2 + 0.1;
		//this.curve = Math.random() * 200 + 10;
	}
	update(){
		this.x = canvas.width/2 * Math.sin(this.angle * Math.PI/horizontalAngle) + (canvas.width/2 - this.width/2);
		this.y = canvas.height/2 * Math.cos(this.angle * Math.PI/verticalAngle) + (canvas.height/2 - this.height/2);
		//When the value dividing the Math.PI are equal in both we get circular motion.
		//Similarly, when x value is 90 and y value is 360 then we will get 4 horizontal cycle before we get one vertical cycle
		
		//this.curve is like the Amplitude of the sine waves.
		//To make sprites use all the available space, instead of this.curve use canvas.width/2
		this.angle += this.angleSpeed;
		
		if(gameFrame%this.flapSpeed === 0){
			this.frame > 4 ? this.frame =0 : this.frame++;
		}
	}
}

class Enemy4 extends Enemy1{
	constructor(){
		super(Enemy1)
		this.image.src = 'enemy4.png';
		this.spriteWidth = 213;
		this.spriteHeight = 213;
		this.newX = Math.random() * (canvas.width - this.width);
		this.newY = Math.random() * (canvas.height - this.height);
	}
	update(){
		if(gameFrame % 60 === 0){
			this.newX = Math.random() * (canvas.width - this.width);
			this.newY = Math.random() * (canvas.height - this.height);
		}
		let dx = this.x - this.newX;
		let dy = this.y - this.newY;
		this.x -= dx/20;
		this.y -= dy/20;
		//dividing by 20 makes them travel to new position. Without this they snap to new position.
		
		if(gameFrame%this.flapSpeed === 0){
			this.frame > 4 ? this.frame =0 : this.frame++;
		}
	}
	
}

function animate(){
	ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
	enemiesArray.forEach((enemy) => {
		enemy.update();
		enemy.draw();
	})
	gameFrame++;
	requestAnimationFrame(animate);
}
animate();
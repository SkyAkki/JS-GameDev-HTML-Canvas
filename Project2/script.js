const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 700;
let gameSpeed = 5;
//let gameFrame = 0;
//let x = 0;
//let x2 = 2400;

const backgroundLayer1 = new Image();
backgroundLayer1.src = 'layer-1.png'
const backgroundLayer2 = new Image();
backgroundLayer2.src = 'layer-2.png'
const backgroundLayer3 = new Image();
backgroundLayer3.src = 'layer-3.png'
const backgroundLayer4 = new Image();
backgroundLayer4.src = 'layer-4.png'
const backgroundLayer5 = new Image();
backgroundLayer5.src = 'layer-5.png'

window.addEventListener('load',function(){
	
	const slider = document.getElementById('slider');
	slider.value = gameSpeed;
	const showGameSpeed = document.getElementById('showGameSpeed');
	showGameSpeed.textContent = gameSpeed;
	slider.addEventListener('change', function(e){
	gameSpeed = e.target.value;
	showGameSpeed.textContent = e.target.value;
	})
	
	class Layer{
		constructor(image,speedModifier){
			this.x = 0;
			this.y = 0;
			this.width = 2400;
			this.height = 700;
			//this.x2 = this.width;
			this.image = image;
			this.speedModifier = speedModifier;
			this.speed = gameSpeed * this.speedModifier;
		}
		update(){
			this.speed = gameSpeed * this.speedModifier;
			
			if(this.x <= -this.width){
				this.x = 0;
			}
			this.x = Math.floor(this.x - this.speed);
			
			//this.x = gameFrame*this.speed % this.width;
			//replaces the above if statement with one line but causes choppines.
			
			/*
			if(this.x2 <= -this.width){
				this.x2 = this.width + this.x2 - this.speed;
			}
			this.x2 = Math.floor(this.x2 - this.speed);
			*/
			//removed since refactoring the code without using x2
			
		}
		draw(){
			ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
			ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
			//this.x + this.width works, since its placing the second image just after the first one and is there to fill the black space when first image scroll pasts the canvas window.
			
			//While the first method was placing the images at 2400, second method places the image at 0.
		}
	}

	const layer1 = new Layer(backgroundLayer1, 0.2);
	const layer2 = new Layer(backgroundLayer2, 0.4);
	const layer3 = new Layer(backgroundLayer3, 0.6);
	const layer4 = new Layer(backgroundLayer4, 0.8);
	const layer5 = new Layer(backgroundLayer5, 1);
	//All layers move at different speed but they are still relative to our global gameSpeed variable. So changing that variable will affect all layers proportionately.
	const gameObject = [layer1, layer2, layer3, layer4, layer5];

	function animate(){
		ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
		//ctx.drawImage(backgroundLayer4,x,0);
		//ctx.drawImage(backgroundLayer4,x2,0);
		
		//x -= gameSpeed;
		//This will cause the image to stop eventually, when it is rendered once and moved across suficiently.
		//We need the image to loop when its finished moving in canvas once.
		
		/*==========================================================================================================================*/
		/*
		if (x < -2400) x = 2400 +x2 - gameSpeed;
		//keeping x=0 will be snappy, so set it to 2400. Now the loop will run endlessly and with smoothness as well, but this x=2400 will cause a black background to move as well in the canvas.
		//The trick to use here is to drawImage the same image twice and always reset the one that has moved offscreen.
		else x-= gameSpeed;
		if(x2 < -2400) x2 = 2400 +x - gameSpeed;
		else x2 -= gameSpeed;
		//There is a gap between the two images. THis is partly because of gameSpeed because we reset x and x2 independently of each other So during the reset of first image i.e 'x' , it was reset while the other image kept moving.
		//So account for that by subtracting gameSpeed in the if condition.
		//Gap is smaller now.
		//The other factor is ImageWidth should be divisible by gameSpeed. Account for this by adding "x2 in x" and "x in x2", so that they check position of the other image before they reset, and they offset its new position based on the current position of the other image.
		*/
		/*==========================================================================================================================*/

		gameObject.forEach((e)=>{
			e.update();
			e.draw();
		})
		//gameFrame--;
		requestAnimationFrame(animate);
	}

	animate();
})


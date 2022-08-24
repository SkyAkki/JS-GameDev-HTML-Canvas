window.addEventListener('load', function(){
	const canvas = canvas1;
	const ctx = canvas.getContext('2d');
	canvas.width = 800;
	canvas.height = 720;
	let enemies = [];
	let score = 0;
	let gameOver = false;
	const fullScreenButtonJS = fullScreenButton;
	
	class InputHandler{
		constructor(){
			this.keys = [];
			this.touchY = '';
			this.touchThreshold = 30;
			window.addEventListener('keydown', e => {
				if(( e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') && (this.keys.indexOf(e.key) === -1)){
					this.keys.push(e.key);
					console.log(this.keys);
				}else if(gameOver && e.key==='Enter'){
					restart();
				}
			})
			window.addEventListener('keyup', e => {
				if(e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight'){
					this.keys.splice(this.keys.indexOf((e.key),1));
					console.log(this.keys);
				}
			})
			window.addEventListener('touchstart', e =>{
				this.touchY = e.changedTouches[0].pageY;
			});
			window.addEventListener('touchmove', e =>{
				const swipeDistance = e.changedTouches[0].pageY - this.touchY;
				if(swipeDistance < -this.touchThreshold && this.keys.indexOf('swipe up') === -1) this.keys.push('swipe up');
				else if(swipeDistance > this.touchThreshold && this.keys.indexOf('swipe down') === -1) {
					this.keys.push('swipe down');
					if(gameOver) restart();
				};
			});
			window.addEventListener('touchend', e =>{
				this.keys.splice(this.keys.indexOf('swipe up'),1);
				this.keys.splice(this.keys.indexOf('swipe down'),1);
			});
		}
	}
	class Player{
		constructor(gameWidth, gameHeight){
			this.gameHeight = gameHeight;
			this.gameWidth = gameWidth;
			this.width = 200;
			this.height = 200;
			this.x = 100;
			this.maxFrame = 8;	
			this.fps = 20;
			this.frameTimer = 0;
			this.frameInterval = 1000/this.fps;
			this.y = this.gameHeight - this.height;
			this.image = playerImage;
			this.frameX = 0;
			this.frameY = 0;
			this.speed = 0;
			this.vy = 0;
			this.weight = 1;
		}
		restart(){
			this.x = 100;
			this.y = this.gameHeight - this.height;
			this.maxFrame = 8;
			this.frameY = 0;
		}
		draw(context){
			context.strokeStyle = 'white';
			//context.strokeRect(this.x,this.y,this.width,this.height);
			context.beginPath();
			context.arc(this.x + this.width/2,this.y + this.height/2,this.width/2,0,Math.PI*2);
			context.stroke();
			context.drawImage(this.image,this.frameX * this.width, this.frameY * this.height,this.width, this.height,this.x,this.y,this.width,this.height)
		}
		update(input,deltaTime,enemies){
			//collision detection
			enemies.forEach(enemy => {
				const dx = (enemy.x + enemy.width/2) - (this.x + this.width/2);
				const dy = (enemy.y + enemy.height/2) - (this.y + this.height/2);
				//the offset is added here so that the hitbox is the white circle and not the blue circle
				const distance = Math.sqrt(dx*dx + dy*dy);
				if(distance < enemy.width/2 + this.width/2){
					gameOver = true;
				}
			})
			
			//sprite animation
			if(this.frameTimer > this.frameInterval){
				if (this.frameX >= this.maxFrame) this.frameX = 0;
				else this.frameX++;
				this.frameTimer = 0;
			}else{
				this.frameTimer += deltaTime;
			}
			
			if(input.keys.indexOf('ArrowRight')>-1){
				this.speed = 5;
			}else if(input.keys.indexOf('ArrowLeft')>-1){
				this.speed = -5;
			}else if((input.keys.indexOf('ArrowUp')>-1 || (input.keys.indexOf('swipe up')>-1)) && this.onGround()){
				this.vy = -30;
			}
			else{
				this.speed = 0;
			}
			//horizontal movement
			this.x+= this.speed;
			if(this.x < 0) this.x = 0;
			else if(this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;
			//vertical movement
			this.y += this.vy
			if(!this.onGround()){
				this.vy += this.weight;
				this.frameY = 1;
				this.maxFrame = 5;
			}else{
				this.vy = 0;
				this.frameY = 0;
				this.maxFrame = 8;
			}
			if(this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height;
		}
		onGround(){
			return this.y >= this.gameHeight - this.height;
		}
	}
	class Background{
		constructor(gameWidth,gameHeight){
			this.gameWidth = gameWidth;
			this.gameHeight = gameHeight;
			this.image = backgroundImage;
			this.x = 0;
			this.y = 0;
			this.width = 2400;
			this.height = 720;
			this.speed = 10;
		}
		restart(){
			this.x = 0;
		}
		draw(context){
			context.drawImage(this.image,this.x, this.y, this.width, this.height);
			context.drawImage(this.image,this.x + this.width -this.speed, this.y, this.width, this.height);
		}
		update(){
			this.x -= this.speed;
			if(this.x < 0 -this.width) this.x = 0;
		}		
	}
	class Enemy{
		constructor(gameWidth,gameHeight){
			this.gameWidth = gameWidth;
			this.gameHeight = gameHeight;
			this.width = 160;
			this.height = 119;
			this.x = this.gameWidth;
			this.y = this.gameHeight - this.height;
			this.image = enemyImage;
			this.frameX = 0;
			this.speed = 8;
			this.maxFrame = 5;
			this.fps = 20;
			this.frameTimer = 0;
			this.frameInterval = 1000/this.fps;
			this.markedForDeletion = false;
		}
		draw(context){
			context.strokeStyle = 'white';
			//context.strokeRect(this.x,this.y,this.width,this.height);
			context.beginPath();
			context.arc(this.x + this.width/2,this.y + this.height/2,this.width/2,0,Math.PI*2);
			context.stroke();
			context.drawImage(this.image,this.frameX*this.width, 0 , this.width, this.height,this.x,this.y,this.width,this.height);
		}
		update(deltaTime){
			if(this.frameTimer > this.frameInterval){
				if(this.frameX >= this.maxFrame) this.frameX = 0;
				else this.frameX++;
				this.frameTimer = 0;
			}else{
				this.frameTimer += deltaTime;
			}
			if(this.x < 0 - this.width){
				this.markedForDeletion = true;
				score++;
			}
			this.x-=this.speed;
		}
	}
	function handleEnemies(deltaTime){
		if(enemyTimer > enemyInterval + randomEnemyInterval){
			enemies.push(new Enemy(canvas.width,canvas.height));
			randomEnemyInterval = Math.random() * 1000 + 500;
			enemyTimer = 0;
		}else{
			enemyTimer += deltaTime;
		}
		enemies.forEach(enemy => {
			enemy.draw(ctx);
			enemy.update(deltaTime);
		})
		enemies = enemies.filter(enemy => !enemy.markedForDeletion);
	}
	function displayStatusText(context){
		context.textAlign = 'left'
		context.fillStyle = 'black';
		context.font = '40px Impact';
		context.fillText('Score: ' + score,20,50)
		if(gameOver){
			context.textAlign =  'center';
			context.fillStyle = 'black';
			context.fillText('GAME OVER, press ENTER or swipe down to restart',canvas.width/2,200);
			context.fillStyle = 'white';
			context.fillText('GAME OVER, press ENTER or swipe down to restart',canvas.width/2,204);
		}
	}
	function toggleFullScreen(){
		if(!document.fullScreenElement){
			canvas.requestFullscreen().catch(err => {
				alert(`Error, can't enable fullscreen mode: ${err.message}`)
			});
		}else{
			document.exitFullscreen();
		}
	}
	fullScreenButtonJS.addEventListener('click',toggleFullScreen);
	function restart(){
		player.restart();
		background.restart();
		enemies = [];
		score = 0;
		gameOver = false;
		animate(0);
	}
	const input = new InputHandler();
	const player = new Player(canvas.width,canvas.height);
	const background = new Background(canvas.width, canvas.height);
	const enemy1 = new Enemy(canvas.width,canvas.height);
	
	let lastTime = 0;
	let enemyTimer = 0;
	let enemyInterval = 1000;
	let randomEnemyInterval = Math.random() * 1000 + 500;
	
	function animate(timeStamp){
		let deltaTime = timeStamp - lastTime;
		lastTime = timeStamp;
		ctx.clearRect(0,0,canvas.width,canvas.height);
		background.draw(ctx);
		background.update();
		player.draw(ctx);
		player.update(input,deltaTime,enemies);
		handleEnemies(deltaTime);
		displayStatusText(ctx)
		if(!gameOver)requestAnimationFrame(animate);
	}
	animate(0);
})
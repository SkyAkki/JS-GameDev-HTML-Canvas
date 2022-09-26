import {Player} from './player.js';
import {InputHandler} from './input.js';
import {Background} from './background.js';
import {FlyingEnemy, GroundEnemy, ClimbingEnemy} from './enemies.js';
import {UI} from './UI.js';

window.addEventListener('load',function(){
    const canvas = canvas1;
    const ctx = canvas.getContext('2d');
    canvas.width = 900;
    canvas.height = 500;

    class Game{
        constructor(width,height){
            this.width = width;
            this.height = height;
            this.groundMargin = 80;
            this.speed = 0;
            this.maxSpeed = 3;

            this.debug = false;
            this.score = 0;
            this.particles = [];
            this.maxParticels = 50;

            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.ui = new UI(this);

            //Add Enemies
            this.enemies = []; 
            this.enemyTimer = 0;
            this.enemyInterval = 1000;

            this.player.currentState = this.player.states[0];
            this.player.currentState.enter(); //to activate the inital default state

            this.collisions = [];

            this.time = 0;
            this.maxTime = 10000;

            this.livesCount = 5;
        }
        update(deltaTime){
            this.time += deltaTime;
            if(this.time > this.maxTime) this.gameOver = true;

            this.background.update();
            this.player.update(this.input.keys, deltaTime);

            //Add Enemies
            if(this.enemyTimer > this.enemyInterval){
                this.addEnemy();
                this.enemyTimer = 0;
            }else{
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
                if(enemy.markedForDeletion){
                    this.enemies.splice(this.enemies.indexOf(enemy), 1);
                }
            })

            //Add Particle
            this.particles.forEach((particle,index) => {
                particle.update();
                if(particle.markedForDeletion) this.particles.splice(index,1);
            });
            if(this.particles.length > this.maxParticels){
                this.particles = this.particles.splice(0,this.maxParticels);
            }

            //handle collision sprites
            this.collisions.forEach((collision,index) => {
                collision.update(deltaTime);
                if(collision.markedForDeletion) this.collisions.splice(index,1);
            })
        }
        draw(context){
            this.background.draw(context); //calling it before drawing the player so that background is behind the player
            this.player.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            this.particles.forEach(particle => {
                particle.draw(context);
            });
            this.ui.draw(context);
            this.collisions.forEach(collision => {
                collision.draw(context);
            })
        }
        addEnemy(){
            if(this.speed > 0 && Math.random() > 0.5) this.enemies.push(new GroundEnemy(this));
            else if(this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
            this.enemies.push(new FlyingEnemy(this));
        }
    }

    const game = new Game(canvas.width, canvas.height);
    //Sprite Animation
    let lastTime = 0;

    function animate(timeStamp){
        //Sprite Animation : Since our spriteSheet is designed for low fps, we need to render it at lower speed. We need to do this in an independent manner, i.e. fps of entire game should remain same and only this spritesheet should be affected.
        let deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;

        ctx.clearRect(0,0,canvas.width,canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        if(!game.gameOver) requestAnimationFrame(animate);
    }
    animate(0);
});
import { Sitting, Running, Jumping, Falling } from "./playerState.js";

export class Player{
    constructor(game){
        this.game = game;
        this.width = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.image = player;
        this.frameX = 0;
        this.frameY = 0;
        this.speed = 0;
        this.maxSpeed = 10;
        this.vy = 0;
        this.weight = 1;

        //State Design Pattern
        this.states = [new Sitting(this), new Running(this), new Jumping(this), new Falling(this)]; //to store All the available states
        this.currentState = this.states[0];
        this.currentState.enter(); //to activate the inital default state

        //Sprite Animation
        this.maxFrame;
        this.fps = 30;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
    }
    update(input, deltaTime){
        this.checkCollision()
        this.currentState.handleInput(input);
        //Horizontal Movement
        this.x += this.speed;
        if(input.includes('ArrowRight')) this.speed = this.maxSpeed;
        else if(input.includes('ArrowLeft')) this.speed = -this.maxSpeed;
        else this.speed = 0;
        if(this.x<0) this.x = 0;
        else if(this.x > this.game.width - this.width) this.x = this.game.width - this.width;

        //vertical movement
        // this.y += this.vy; This doesn't work as intended
        this.y += this.vy;
        if(!this.onGround()) this.vy += this.weight;
        else this.vy = 0;

        //Sprite Animation
        if(this.frameTimer > this.frameInterval){
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        }
        else{
            this.frameTimer += deltaTime;
        }
    }
    draw(context){
        if(this.game.debug) context.strokeRect(this.x,this.y,this.width,this.height)
        context.drawImage(this.image,this.width * this.frameX, this.height * this.frameY, this.width, this.height,this.x,this.y,this.width,this.height);
    }
    onGround(){
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }
    setState(state, speed){
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }
    checkCollision(){
        this.game.enemies.forEach(enemy => {
            if ( enemy.x < this.x + this.width &&
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y
            ){
                enemy.markedForDeletion = true;
                this.game.scroe++;
            }
            else{

            }
        })
    }
}
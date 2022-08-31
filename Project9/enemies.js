class Enemy{
    constructor(){
        this.frameX = 0;
        this.framey = 0;
        this.fps = 20;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
    }
    update(){

    }
    draw(){

    }
}
class FlyingEnemy extends Enemy{

}
class GroundEnemy extends Enemy{

}
class ClimbingEnemy extends Enemy{
    
}
const states = {
    SITTING: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3
}

class State{
    constructor(state){
        this.state = state;
    }
}

export class Sitting extends State{
    constructor(player){
        super('SITTING'); //super will call the constructor method of the class from the the current class is extending from. In this case the State class. Its constructor is also expecting an argument so provided that as well.
        this.player = player;
    }
    enter(){
        this.player.frameY = 5;
    }
    handleInput(input){
        if(input.includes('ArrowLeft') || input.includes('ArrowRight')){
            this.player.setState(states.RUNNING)
        }
    }
}
export class Running extends State{
    constructor(player){
        super('RUNNING');
        this.player = player;
    }
    enter(){
        this.player.frameY = 3;
    }
    handleInput(input){
        if(input.includes('ArrowDown')){
            this.player.setState(states.SITTING);
        }
        else if(input.includes('ArrowUp')){
            this.player.setState(states.JUMPING);
        }
    }
}
export class Jumping extends State{
    constructor(player){
        super('JUMPING');
        this.player = player;
    }
    enter(){
        if(this.player.onGround()) this.player.vy = -30;
        this.player.frameY = 1;
    }
    handleInput(input){
        if(this.player.vy >0){
            this.player.setState(states.FALLING)
        }
    }
}
export class Falling extends State{
    constructor(player){
        super('FALLING');
        this.player = player;
    }
    enter(){
        this.player.frameY = 2;
    }
    handleInput(input){
        if(this.player.onGround()){
            this.player.setState(states.RUNNING);
        }
    }
}
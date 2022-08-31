import {Player} from './player.js';
import {InputHandler} from './input.js'

window.addEventListener('load',function(){
    const canvas = canvas1;
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;

    class Game{
        constructor(width,height){
            this.width = width;
            this.height = height;
            this.player = new Player(this);
            this.input = new InputHandler();
        }
        update(deltaTime){
            this.player.update(this.input.keys, deltaTime);
        }
        draw(context){
            this.player.draw(context)
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
        requestAnimationFrame(animate);
    }
    animate(0);
});
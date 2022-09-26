export class UI{
    constructor(game){
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'Creepster';
        this.livesImage = lives;
    }
    draw(context){
        context.save();
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = 'white';
        context.shadowBlur = 0;

        context.font = this.fontSize + 'px ' + this.fontFamily;//note the space after px
        context.textAlign = 'left';
        context.fillStyle = 'black';
        context.fillText('Score: ' + this.game.score, 20, 50);

        context.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
        context.fillText('Time: ' + (this.game.time * 0.001).toFixed(1), 20, 80);

        for(let i = 0; i<this.game.livesCount; i++){
            context.drawImage(this.livesImage,20 * i + 20,95,25,25);
        }
        if(this.game.gameOver){
            context.textAlign = 'center';
            context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
            if(this.game.score > 5){
                context.fillText('You Win', this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
                context.fillText('Creatures of the nights tremble at your sight.', this.game.width * 0.5, this.game.height * 0.5 + 20);
            }else{
                context.fillText('You Lose', this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = this.fontSize * 0.5 + 'px ' + this.fontFamily;
                context.fillText('Better luck next time.', this.game.width * 0.5, this.game.height * 0.5 + 20);
            }
        }
        context.restore();
    }
}
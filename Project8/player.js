class Player{
	constructor(gameWidth,gameHeight){
		this.gameWidth = gameWidth;
		this.gamHeight = gameHeight;
		this.state= [];
		this.currentState = this.state[0];
		this.image = dogImage;
		this.width = 200;
		this.height = 181.83;
		this.x = 0;
		this.y = 0;
	}
	draw(context){
		context.drawImage(this.image,this.x,this.y);
	}
}

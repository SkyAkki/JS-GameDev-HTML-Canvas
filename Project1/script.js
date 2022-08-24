playerState = 'idle';
const dropdown = document.getElementById('animations');
dropdown.addEventListener('change',function(e){
	playerState = e.target.value;
})

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
//Now we have all canvas 2d methods stored in our custom ctx variable

const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;
//By default canvas will be set to 300x350 px and our drawings can come out distorted. So manually setting it to 600x600 px (the same value given in style.css

const playerImage = new Image();
playerImage.src = 'shadow_dog.png';

const spriteWidth = 575;
//Take the width of entire image and divide it by number of columns, we get width of one frame
//Our spritesheet is 6876px wide and it has 12 columns. So 573px per frame 
const spriteHeight = 523;

/*
let frameX = 0;
let frameY = 0;
*/
//Removed after mapping sprite logic

let gameFrame = 0;
const staggerFrames = 5;

const spriteAnimations = [];
const animationStates = [
	{
		name: 'idle',
		frames : 7
	},
	{
		name: 'jump',
		frames : 7
	},
	{
		name: 'fall',
		frames : 7
	},
	{
		name: 'run',
		frames : 9
	},
	{
		name: 'dizzy',
		frames : 11
	},
	{
		name: 'sit',
		frames : 5
	},
	{
		name: 'roll',
		frames : 7
	},
	{
		name: 'bite',
		frames : 7
	},
	{
		name: 'ko',
		frames : 12
	},
	{
		name: 'gethit',
		frames : 4
	}
];
animationStates.forEach((state, index) => {
	let frames = {
		loc: [],
	}
	for (let j = 0; j < state.frames; j++){
		let positionX = j * spriteWidth;
		let positionY = index * spriteHeight;
		frames.loc.push({x:positionX, y:positionY})
	}
	spriteAnimations[state.name] = frames;
})
console.log(spriteAnimations);

function animate(){
	ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
	//Clear old paint from canvas between every animation frame

	//ctx.drawImage(playerImage,0,0);
	//Drawn from top-left corner of the canvas while keeping the original width and height of the image
	//ctx.drawImage(playerImage,0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
	//Scale our image horizontally and vertically. In this case, shrink the image to match the canvas area 600x600 Px.
	
	
	/*if(frameX < 6) frameX++;
	else frameX = 0;*/
	//If we use frameX < 7 then the animation will blink because the first frame is zero so last frame is actually 6th.
	//problem will arise for spriteRows which has less than or greater than 7 frames.
	//Also animation will go too fast with only this code.
	
	/*if(gameFrame%staggerFrames === 0){
		if(frameX < 6) frameX++;
		else frameX = 0;
	}*/
	//This statement will be true every 5 frames. So for every 5 frame we change the frameX once, slowing down the animation. i.e. this code block runs every 5 frame.
	
	let position =  Math.floor(gameFrame/staggerFrames) % spriteAnimations[playerState].loc.length;
	let frameX = spriteWidth * position;
	//position will be a whole number value and cycle according to number of frame in spriteRow.
	let frameY = spriteAnimations[playerState].loc[position].y;
	//We have to increase gameFrame 5 times before we get to position = 1. Math.floor will floor decimals values to decimals. So now we will spend 5 frames on each spriteRow frame until position variable reachs position = 6 which is position = 0 i.e. automatically cycles to start of idle animation spriteRow start.
	//Using 6 as in our idle animation spriteRow we have 6 frames counting from 0.
	//Using loc.length now instead of 6 now, as a generailzation which will work on each spriteRow regardless of number of frames it has.
	
	ctx.drawImage(playerImage, frameX, frameY , spriteWidth, spriteHeight, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	//first 4 argument denotes the rectangular area we want to cut out from the source image. Last four argument tells the JS where on the destination canvas we want to draw the cropped out part of source image.
	//Remember, the last four value in this case are used to position the cropped out image and not the original whole image.
	//the multiplication logic in source position is used to cycle horizontally and vertically in the spritesheet.
	
	gameFrame++;
	
	requestAnimationFrame(animate);
	//Call the animate function once
}
animate();
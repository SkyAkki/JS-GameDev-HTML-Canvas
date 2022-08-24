window.addEventListener('load',function(){
	const loadingElement = loading;
	loadingElement.style.display = 'none';
	const canvas = canvas1;
	const ctx = canvas.getContext('2d');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
})
$(document).ready(function(){
var canvas = document.getElementById('canvas'),
	context = canvas.getContext('2d'),
	gradient = context.createRadialGradient(canvas.width/2,canvas.height,10,canvas.width, 10, 50);	

console.log("here");	

gradient.addColorStop(0, "blue");
gradient.addColorStop(.25, "green");
gradient.addColorStop(.35, "white");
gradient.addColorStop(.45, "blue");
gradient.addColorStop(.75, "green");	

context.fillStyle = gradient;
context.rect(0,0,100,100);
context.rect(0,0,canvas.width, canvas.height);
context.fill();

});
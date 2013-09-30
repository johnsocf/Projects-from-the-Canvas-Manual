$(document).ready(function(){
	var canvas = document.getElementById("canvas"),
		context = canvas.getContext("2d");

	context.beginPath();
	context.moveTo(10,10);
	context.arc(canvas.width/2, canvas.height/4, 80, Math.PI/4, Math.PI, false);
	context.stroke();
});
$(document).ready(function(){
	var canvas = document.getElementById("canvas"),
		context = canvas.getContext("2d");

	context.strokeStyle = "blue";
	context.lineWidth = 0.5
	
	context.beginPath();
	context.rect(10,10,100,100);
	context.stroke();
	context.rect(50,50,100,100);
	context.stroke();	

});
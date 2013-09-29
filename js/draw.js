$(document).ready(function(){
	var canvas = document.getElementById('canvas'),
		context = canvas.getContext("2d");

	context.lineJoin = "round";
	context.lineWidth = 30;


	console.log("here");

	drawText();
	function drawRectangle () {

		context.strokeStyle = "goldenrod";
		context.fillStyle = "rgba(0,0,255,0.5)";

		context.strokeRect(75, 100, 200, 200);
		context.fillRect(325, 100, 200, 200);
	}
	function drawText() {
		context.font="24px Helvetica";
		context.fillText("clickanywhere to erase", 175, 200);
	}
	
	drawRectangle();
	

	context.canvas.onmousedown = function (e) {
		context.clearRect(0,0, canvas.width, canvas.height);
		setTimeout(function() {context.fillStyle = "black";drawText();},900);
		setTimeout(function() {drawRectangle();},1000);
		
	}	
});
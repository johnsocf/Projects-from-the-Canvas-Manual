$(document).ready(function(){
	var canvas = document.getElementById("canvas"),
		context = canvas.getContext("2d");

		function drawGrid (color, stepx, stepy){
			for (var i = stepx + 0.5; i < context.canvas.width; i +=stepx) {
				context.beginPath();
				context.moveTo(i, 0);
				context.lineTo(i, context.canvas.height);
				context.stroke();
			}

			for (var i = stepy + 0.5; i <context.canvas.height; i +=stepy) {
				context.beginPath();
				context.moveTo(0, i);
				context.lineTo(context.canvas.width, i);
				context.stroke();
			}
		}
	function drawTwoArcs() {
		var direction = true;
		context.beginPath();
		context.rect(0, 0, canvas.width, canvas.height);
		context.arc(300, 190, 150, 0, Math.PI*2, true);
		context.arc(500,500, 50, 0, Math.PI*2, true);
		rect(200, 500, 150, 150, direction);
		// context.arc(300, 190, 100, 0, Math.PI*2, false);
		context.fill();
		context.shadowColor = undefined;
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.beginPath();
		context.stroke();
		context.fill();
		
	}
	function draw() {
		context.clearRect(0,0, context.canvas.width, context.canvas.height);
		drawGrid("lightgray", 10, 10);
		context.save();
		context.shadowColor = "rgba(0,0,0,0.8)";
		context.shadowOffsetX = 12;
		context.shadowOffsetY = 12;
		context.shadowBlur = 15;

		drawTwoArcs();

		context.restore();
	}

	context.fillStyle = "rgba(100,140,230,1)";
	context.strokeStyle = context.fillStyle;
	draw();

	function drawCutouts() {
		context.beginPath();
		addOuterRectanglePath();
		addCirclePath();
		addRectanglePath();
		addTrianglePath();
		context.fill();
	}

	function rect(x, y, w, h, direction) {
		if (direction) {
			context.moveTo(x, y);
			context.lineTo(x, y + h);
			context.lineTo(x+w, y+h);
			context.lineTo(x+w, y);
		}
		else {
			context.moveTo(x,y);
			context.lineTo(x+w, y);
			context.lineTo(x+w, y+h);
			context.lineTo(x, y+h);
		}
		context.closePath();
	}

});
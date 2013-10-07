$(document).ready(function(){
	var canvas = document.getElementById("canvas");
		context = canvas.getContext("2d");
		fillCheckbox = document.getElementById("fillCheckbox"),
		strokeCheckbox = document.getElementById("strokeCheckbox"),
		shadowCheckbox = document.getElementById("shadowCheckbox"),
		text = "HTML5";

	function draw() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		drawBackground();

		if (shadowCheckbox.checked) turnShadowsOn();
		else						turnShadowsOff();

		drawText();
	}	

	function drawBackground() {
		var STEP_Y = 12,
			TOP_MARGIN = STEP_Y * 4,
			LEFT_MARGIN = STEP_Y * 3,
			i = context.canvas.height;

		context.strokeStyle = "lightgray";
		context.lineWidth = 0.5;

		while(i > TOP_MARGIN) {
			context.beginPath();
			context.moveTo(0, i);
			context.lineTo(context.canvas.width, i);
			context.stroke();
			i -= STEP_Y;
		}	
		context.strokeStyle = "rgba(100, 0, 0, 0.3)";
		context.lineWidth = 1;
		context.beginPath();
		context.moveTo(LEFT_MARGIN, 0);
		context.lineTo(LEFT_MARGIN, context.canvas.height);
		context.stroke();
	}

	function turnShadowsOn() {
		context.shadowColor = "rgba(0, 0, 0, 0.8)";
		context.shadowOffsetX = 5;
		context.shadowOffsetY = 5;
		context.shadowBlur = 10;
	}

	function turnShadowsOff() {
		context.shadowColor = undefined;
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 0;
	}

	function drawText() {
		var TEXT_X = 65,
			TEXT_Y = canvas.height/2 + 35;

		context.strokeStyle = "blue";
		
		if (fillCheckbox.checked) context.fillText (text, TEXT_X, TEXT_Y);	
		if (strokeCheckbox.checked) context.strokeText (text, TEXT_X, TEXT_Y);
	}

	context.font = "128px Palatino";
	context.lineWidth = 1.0;
	context.fillStyle = "cornflowerblue";

	turnShadowsOn();
	draw();





});
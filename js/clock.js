$(document).ready(function(){

var canvas = document.getElementById('canvas'),
	context = canvas.getContext('2d'),
	font_height = 15,
	margin = 35,
	snapshotButton = document.getElementById("snapshotButton"),
	snapshotImageElement = document.getElementById("snapshotImageElement"),
	loop,
	hand_truncation = canvas.width/25,
	hour_hand_truncation = canvas.width/10,
	numeral_spacing = 20,
	radius = canvas.width/2 - margin,
	hand_radius = radius + numeral_spacing;

function drawCircle() {
	context.beginPath();
	context.arc(canvas.width/2, canvas.height/2, radius, 0, Math.PI*2, true);
	context.stroke();
}	

snapshotButton.onclick = function (e) {
	var dataUrl;

	if(snapshotButton.value === "Take Snapshot") {
		dataUrl = canvas.toDataURL();
		clearInterval(loop);
		snapshotImageElement.src = dataUrl;
		snapshotImageElement.style.display = "inline";
		canvas.style.display = "none";
		snapshotButton.value = "Return to Canvas";
	}
	else {
		canvas.style.display = "inline";
		snapshotImageElement.style.display = "none";
		loop = setInterval(drawClock, 1000);
		snapshotButton.value = "Take Snapshot";
	}
}

function drawNumerals() {
	var numerals = [1,2,3,4,5,6,7,8,9,10,11,12],
		angle = 0,
		numeralWidth = 0;

		numerals.forEach(function(numeral){
			angle = Math.PI/6*(numeral-3);
			numeralWidth = context.measureText(numeral).width;
			context.fillText(numeral, 
				canvas.width/2 + Math.cos(angle)*(hand_radius)-numeralWidth/2,
				canvas.height/2 + Math.sin(angle)*(hand_radius) + font_height/3);

		});
}

function drawCenter() {
	context.beginPath();
	context.arc(canvas.Width/2, canvas.height/2, 5, 0, Math.PI*2, true);
	context.fill();
}

function drawHand(loc, isHour) {
	var angle = (Math.PI*2) * (loc/60) - Math.PI/2,
		handRadius = isHour ? radius - hand_truncation - hour_hand_truncation : radius - hand_truncation;
		context.moveTo(canvas.width/2, canvas.height/2);
		context.lineTo(canvas.width/2 + Math.cos(angle)*handRadius,
						canvas.height/2 + Math.sin(angle)*handRadius);
		context.stroke();
}

function drawHands() {
	var date = new Date,
	hour = date.getHours();

	hour = hour > 12 ? hour - 12 : hour;
	drawHand(hour*5 + (date.getMinutes()/60)*5, true, 0.5);
	drawHand(date.getMinutes(), false, 0.5);
	drawHand(date.getSeconds(), false, 0.2);
}

function drawClock() {
	context.clearRect(0,0,canvas.width, canvas.height);
	drawCircle();
	drawCenter();
	drawHands();
	drawNumerals();
}

context.font = font_height + 'px Arial';
loop = setInterval(drawClock, 1000);

});





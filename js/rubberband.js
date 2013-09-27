var canvas = getElementbyId("canvas"),
	context = canvas.getContext("2d"),
	rubberbandDiv = document.getElementbyId("rubberbandDiv"),
	resetButton = document.getElementbyId("resetButton"),
	image = new Image();
	mousedown = {},
	rubberbandRectangle = {},
	dragging = false;

function rubberbandStart(x,y) {
	mousedown.x = x;
	mousedown.y = y;
	rubberbandRectangle.left = mousedown.x;
	rubberbandRectangle.top = mousedown.y;
	moveRubberbandDiv();
	moveRubberbandDiv();
	dragging = true;
}	

function rubberbandStretch(x,y) {
	rubberbandRectangle.left = x < mousedown.x ? x : mousedown.x;
	rubberbandRectangle.top = y < mousedown.y ? y : mousedown.y;

	rubberbandRectangle.width = Math.abs(x - mousedown.x),
	rubberbandRectangle.height = Math.abs(y - mousedown.y);

	moveRubberbandDiv();
	resizeRubberbandDiv();
}

function rubberbandEnd() {
	var bbox = canvas.getBoundingClientRect();

	try {
		context.drawImage(canvas,
						rubberbandRectangle.left-bbox.left,
						rubberbandRectangle.top - bbox.top,
						rubberbandRectangle.width,
						rubberbandRectangle.height,
						0, 0, canvas.width, canvas, height);
	}
	catch (e) {
		// error message, outside of canvas
	}
	resetRubberbandRectangle();
	rubberbandDiv.style.width = 0;
	rubberbandDiv.style.height = 0;
	hideRubberbandDiv();
	dragging = false;
}

function moveRubberbandDiv() {
	rubberbandDiv.style.top = rubberbandRectangle.top + 'px';
	rubberbandDiv.style.left = rubberbandRectangle.left + 'px';
}

function resizeRubberbandDiv() {
	rubberbandDiv.style.width = rubberbandRectangle.width + 'px';
	rubberbandDiv.style.height = rubberbandRectangle.height + 'px';
}

function showRubberbandDiv() {
	rubberbandDiv.style.display = 'inline';
}

function hiderubberbandDiv() {
	rubberbandDiv.style.display = "none";
}

function resetRubberbandRectangle() {
	rubberbandRectangle = {top:0, left:0, width:0, height:0 };
}

canvas.onmousedown = function (e) {
	var x = e.clientX,
	var y = e.clientY;
	e.preventDefault();
	rubberbandStart(x,y);
};






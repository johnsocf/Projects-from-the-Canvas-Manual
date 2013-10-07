$(document).ready(function(){
	var canvas = document.getElementById("canvas"),
		context = canvas.getContext("2d"),
		strokeStyleSelect = document.getElementById("strokeStyleSelect"),
		fillStyleSelect = document.getElementById('fillStyleSelect'),
		drawRadio = document.getElementById("drawRadio"),
		eraserRadio = document.getElementById("eraserRadio"),
		eraserShapeSelect = document.getElementById("eraserShapeSelect"),
		eraserWidthSelect = document.getElementById("eraserWidthSelect"),

		ERASER_LINE_WIDTH = 1,
		ERASER_SHADOW_COLOR = "rgb(0, 0, 0)",
		ERASER_SHADOW_STYLE = "blue",
		ERASER_STROKE_STYLE = "rgb(0, 0, 255)",
		ERASER_SHADOW_OFFSET = -5,
		ERASER_SHADOW_BLUR = 20,

		GRID_HORIZONTAL_SPACING = 10,
		GRID_VERTICAL_SPACING = 10,
		GRID_LINE_COLOR = 'lightblue',
		drawingSurfaceImageData,

		lastX,
		lastY,
		mousedown = {},
		rubberbandRect = {},
		dragging = false,
		guidewires = true;


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

	function windowToCanvas(x, y) {
		var bbox = canvas.getBoundingClientRect();
		return {x: x - bbox.left * (canvas.width / bbox.width),
				y: y - bbox.top * (canvas.height / bbox.height)}
	}

	function saveDrawingSurface() {
		drawingSurfaceImageData = context.getImageData(0, 0, canvas.width, canvas.height);
	}

	function restoreDrawingSurface() {
		context.putImageData(drawingSurfaceImageData, 0, 0);
	}

	function updateRubberbandRectangle(loc) {
		rubberbandRect.width = Math.abs(loc.x - mousedown.x);
		rubberbandRect.height = Math.abs(loc.y - mousedown.x);

		if(loc.x > mousedown.x) rubberbandRect.left = mousedown.x;
		else 					rubberbandRect.left = loc.x;	

		if(loc.y > mousedown.y) rubberbandRect.top = mousedown.y;
		else 					rubberbandRect.top = loc.y;	
	}

	function drawRubberbandShape(loc) {
		var angle = Math.atan(rubberbandRect.height/rubberbandRect.width),
			radius = rubberbandRect.height / Math.sin(angle);
		if (mousedown.y === loc.y) {
			radius = Math.abs(loc.x - mousedown.x);
		}	

		context.beginPath();
		context.arc(mousedown.x, mousedown.y, radius, 0, Math.PI*2, false);
		context.stroke();
		context.fill();
	}

	function updateRubberband(loc) {
		updateRubberbandRectangle(loc);
		drawRubberbandShape(loc);
	}

	function drawHorizontalLine (y) {
		context.beginPath();
		context.moveTo(0, y+0.5);
		context.lineTo(context.canvas.width, y + 0.5);
		context.stroke();
	}

	function drawVerticalLine (x) {
		context.beginPath();
		context.moveTo(x+0.5, 0);
		context.lineTo(x+0.5, context.canvas.height);
		context.stroke();
	}

	function drawGuidewires(x, y) {
		context.save();
		context.strokeStyle = "rgba(0,0,230,0.4)";
		context.lineWidth = 0.5;
		drawVerticalLine(x);
		drawHorizontalLine(y);
		context.restore();
	}

	function setDrawPathForEraser(loc) {
		var eraserWidth = parseFloat(eraserWidthSelect.value);
		context.beginPath();

		if(eraserShapeSelect.value === "circle") {
			context.arc(loc.x, loc.y, eraserWidth/2, 0, Math.PI*2, false);
		}
		else { context.rect(loc.x - eraserWidth/2, loc.y - eraserWidth/2, eraserWidth, eraserWidth);}
		context.clip();
	}

	function setEraserPathForEraser() {
		var eraserWidth = parseFloat(eraserWidthSelect.value);
		context.beginPath();

		if(eraserShapeSelect.value === "circle") {
			context.arc(lastX, lastY, eraserWidth/2 + ERASER_LINE_WIDTH, 0, Math.PI*2, false);
		}
		else {
			context.rect(lastX - eraserWidth/2 - ERASER_LINE_WIDTH, lastY - eraserWidth/2 - ERASER_LINE_WIDTH, eraserWidth + ERASER_LINE_WIDTH * 2, eraserWidth + ERASER_LINE_WIDTH*2);
		}
		context.clip();
	}

	function setEraserAttributes() {
		context.lineWidth = ERASER_LINE_WIDTH;
		context.shadowColor = ERASER_SHADOW_STYLE;
		context.shadowOffsetX = ERASER_SHADOW_OFFSET;
		context.shadowOffsetY = ERASER_SHADOW_OFFSET;
		context.shadowBlur = ERASER_SHADOW_BLUR;
		context.strokeStyle = ERASER_STROKE_STYLE;
	}

	function eraseLast() {
		context.save();
		setEraserPathForEraser();
		drawGrid(GRID_LINE_COLOR, GRID_HORIZONTAL_SPACING, GRID_VERTICAL_SPACING);
		context.restore();
	}

	function drawEraser(loc) {
		context.save();
		setEraserAttributes();
		setDrawPathForEraser(loc);
		context.stroke();
		context.restore();
	}

	canvas.onmousedown = function (e) {
		var loc = windowToCanvas(e.clientX, e.clientY);

		e.preventDefault();

		if (drawRadio.checked) {
			saveDrawingSurface();
		}

		mousedown.x = loc.x;
		mousedown.y = loc.y;

		lastX = loc.x;
		lastY = loc.y;

		dragging = true;
	};

	canvas.onmousemove = function (e) {
		var loc;

		if (dragging) {
			e.preventDefault();

			loc = windowToCanvas(e.clientX, e.clientY);

			if (drawRadio.checked) {
				restoreDrawingSurface();
				updateRubberband(loc);

				if(guidewires) {
					drawGuidewires(loc.x, loc.y);
				}
			}
			else {
				eraseLast();
				drawEraser(loc);
			}
			lastX = loc.x;
			lastY = loc.y;
		}
	};

	canvas.onmouseup = function (e) {
		loc = windowToCanvas(e.clientX, e.clientY);

		if(drawRadio.checked) {
			restoreDrawingSurface();
			updateRubberband(loc);
		}
		if (eraserRadio.checked) {
			eraseLast();
		}
		dragging = false;
	};

	strokeStyleSelect.onchange = function (e) {
		context.strokeStyle = strokeStyleSelect.value;
	};

	fillStyleSelect.onchange = function (e) {
		context.fillStyle = fillStyleSelect.value;
	};

	context.strokeStyle = strokeStyleSelect.value;
	context.fillStyle = fillStyleSelect.value;
	drawGrid(GRID_LINE_COLOR, GRID_HORIZONTAL_SPACING, GRID_VERTICAL_SPACING);

});
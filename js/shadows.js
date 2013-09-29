var canvas = document.getElementById('canvas'),
	drawingContext = canvas.getContext("2d"),
	eraser_line_width = 1,
	eraser_shadow_style = "black",
	eraser_stroke_style = "rbga(0,0,255,.2)",
	eraser_shadow_offset = 1,
	eraser_shadow_blur = 10,
	eraser_radius = 60;

function setEraserAttributes() {
	drawingContext.lineWidth = eraser_line_width;
	drawingContext.shadowColor = eraser_shadow_style;
	drawingContext.shadowOffsetX = eraser_shadow_offset;
	drawingContext.shadowOffsetY = eraser_shadow_offset;
	drawingContext.shadowBlur = eraser_shadow_blur;
	drawingContext.strokeStyle = eraser_shadow_style;
}	

function drawText() {
	drawingContext.font="24px Helvetica";
	drawingContext.fillText("I am really cool.", 175, 200);
}

function drawEraser(loc) {
	var loc = e;
	drawingContext.save();
	setEraserAttributes();

	drawingContext.beginPath();
	drawingContext.arc(loc.x, loc.y, eraser_radius, 0, Math.PI*2, false);
	drawingContext.clip();
	drawingContext.stroke();
	drawingContext.restore();
}

setEraserAttributes();
drawText();
canvas.onmousedown = function (e) {

	drawEraser(e);
}
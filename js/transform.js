$(document).ready(function(){
	var sin = clockwise ? Math.sin(angle) : Math.sin(-angle),
		cos = clockwise ? Math.cos(angle) : Math.cos(-angle);

	if (!paused) {
		context.clearRect(-origin.x, -origin.y, canvas.width, canvas.height);
		context.transform(cos, sin, -sin, cos, 0, 0);
		context.transform(scale, 0, 0, scale, 0, 0);
		drawText();
	}

});
$(document).ready(function(){
	var canvas = document.getElementById("canvas"),
		context = canvas.getContext("2d"),
		repeatRadio = document.getElementById("repeatRadio"),
		noRepeatRadio = document.getElementById("noRepeatRadio"),
		repeatXRadio = document.getElementById("repeatXRadio"),
		repeatYRadio = document.getElementById("repeatYRadio"),
		image = new Image();
		image.src = "images/circle.png";

function fillCanvasWithPattern(repeatString) {
	var pattern = context.createPattern(image, repeatString);
	context.clearRect(0,0, canvas.width, canvas.height);
	context.fillStyle = pattern;
	context.fillRect(0,0,canvas.width, canvas.height);
	context.fill();
}

$(repeatRadio).click(function(){
	fillCanvasWithPattern('repeat');
});
// repeatRadio.onclick = function (e) {
// 	fillCanvasWithPattern('repeat');
// }
$(repeatXRadio).click(function(){
	fillCanvasWithPattern('repeat-x');
});
// repeatXRadio.onclick = function (e) {
// 	fillCanvasWithPattern('repeat-x');
// }

repeatYRadio.onclick = function (e) {
	fillCanvasWithPattern('repeat-y');
}

noRepeatRadio.onclick = function (e) {
	fillCanvasWithPattern('no-repeat');
}


image.onload= function (e) {
	fillCanvasWithPattern('repeat');
};

});
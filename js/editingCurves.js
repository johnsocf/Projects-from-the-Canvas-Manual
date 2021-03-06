$(document).ready(function(){
var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    eraseAllButton = document.getElementById('eraseAllButton'),
    strokeStyleSelect = document.getElementById('strokeStyleSelect'),
    guidewireCheckbox = document.getElementById('guidewireCheckbox'),
    instructions = document.getElementById('instructions'),
    instructionsOkayButton = document.getElementById('instructionsOkayButton'),
    instructionsNoMoreButton = document.getElementById('instructionsNoMoreButton'),

    showInstructions = true,
   
    GRID_STROKE_STYLE = 'lightblue',
    GRID_SPACING = 10,
   
    CONTROL_POINT_RADIUS = 5,
    CONTROL_POINT_STROKE_STYLE = 'blue',
    CONTROL_POINT_FILL_STYLE = 'rgba(255, 255, 0, 0.5)',

    END_POINT_STROKE_STYLE = 'navy',
    END_POINT_FILL_STYLE   = 'rgba(0, 255, 0, 0.5)',
 
    GUIDEWIRE_STROKE_STYLE = 'rgba(0,0,230,0.4)',

    drawingImageData,      // Image data stored on mouse down events
   
    mousedown = {},        // Cursor location for last mouse down event
    rubberbandRect = {},   // Constantly updated for mouse move events

    dragging = false,      // If true, user is dragging the cursor
    draggingPoint = false, // End- or control-point the user is dragging
   
    endPoints     = [ {}, {} ],  // end point locations (x, y)
    controlPoints = [ {}, {} ],  // control point locations (x, y)
    editing  = false,            // If true, user is editing the curve

    guidewires = guidewireCheckbox.checked;

// Functions..........................................................

function drawGrid(color, stepx, stepy) {
   context.save()

   context.strokeStyle = color;
   context.lineWidth = 0.5;
   context.clearRect(0, 0, context.canvas.width, context.canvas.height);

   for (var i = stepx + 0.5; i < context.canvas.width; i += stepx) {
     context.beginPath();
     context.moveTo(i, 0);
     context.lineTo(i, context.canvas.height);
     context.stroke();
   }

   for (var i = stepy + 0.5; i < context.canvas.height; i += stepy) {
     context.beginPath();
     context.moveTo(0, i);
     context.lineTo(context.canvas.width, i);
     context.stroke();
   }

   context.restore();
}

function windowToCanvas(x, y) {
   var bbox = canvas.getBoundingClientRect();

   return { x: x - bbox.left * (canvas.width  / bbox.width),
            y: y - bbox.top  * (canvas.height / bbox.height)
          };
}

// Save and restore drawing surface...................................

function saveDrawingSurface() {
   drawingImageData = context.getImageData(0, 0,
                         canvas.width, canvas.height);
}

function restoreDrawingSurface() {
   context.putImageData(drawingImageData, 0, 0);
}

	
function updateRubberbandRectangle(loc) {
   rubberbandRect.width  = Math.abs(loc.x - mousedown.x);
   rubberbandRect.height = Math.abs(loc.y - mousedown.y);

   if (loc.x > mousedown.x) rubberbandRect.left = mousedown.x;
   else                     rubberbandRect.left = loc.x;

   if (loc.y > mousedown.y) rubberbandRect.top = mousedown.y;
   else                     rubberbandRect.top = loc.y;
} 

function drawBezierCurve() {
   context.beginPath();
   context.moveTo(endPoints[0].x, endPoints[0].y);
   context.bezierCurveTo(controlPoints[0].x, controlPoints[0].y,
                         controlPoints[1].x, controlPoints[1].y,
                         endPoints[1].x, endPoints[1].y);
   context.stroke();
}

function updateEndAndControlPoints() {
   endPoints[0].x = rubberbandRect.left;
   endPoints[0].y = rubberbandRect.top;

   endPoints[1].x = rubberbandRect.left + rubberbandRect.width;
   endPoints[1].y = rubberbandRect.top  + rubberbandRect.height

   controlPoints[0].x = rubberbandRect.left;
   controlPoints[0].y = rubberbandRect.top  + rubberbandRect.height

   controlPoints[1].x = rubberbandRect.left + rubberbandRect.width;
   controlPoints[1].y = rubberbandRect.top;
}

function drawRubberbandShape(loc) {
   updateEndAndControlPoints();
   drawBezierCurve();
}

function updateRubberband(loc) {
   updateRubberbandRectangle(loc);
   drawRubberbandShape(loc);
}

// Guidewires.........................................................

function drawHorizontalGuidewire (y) {
   context.beginPath();
   context.moveTo(0, y + 0.5);
   context.lineTo(context.canvas.width, y + 0.5);
   context.stroke();
}

function drawVerticalGuidewire (x) {
   context.beginPath();
   context.moveTo(x + 0.5, 0);
   context.lineTo(x + 0.5, context.canvas.height);
   context.stroke();
}

function drawGuidewires(x, y) {
   context.save();
   context.strokeStyle = GUIDEWIRE_STROKE_STYLE;
   context.lineWidth = 0.5;
   drawVerticalGuidewire(x);
   drawHorizontalGuidewire(y);
   context.restore();
}

// End points and control points......................................

function drawControlPoint(index) {
   context.beginPath();
   context.arc(controlPoints[index].x, controlPoints[index].y,
               CONTROL_POINT_RADIUS, 0, Math.PI*2, false);
   context.stroke();
   context.fill();
}

function drawControlPoints() {
   context.save();
   context.strokeStyle = CONTROL_POINT_STROKE_STYLE;
   context.fillStyle   = CONTROL_POINT_FILL_STYLE;

   drawControlPoint(0);
   drawControlPoint(1);

   context.stroke();
   context.fill();
   context.restore();
}

	function drawEndPoint(index) {
		context.beginPath();
		context.arc(endPoints[index].x, endPoints[index].y, CONTROL_POINT_RADIUS, 0, Math.PI*2, false);
		context.stroke();
		context.fill();
	}

	function drawEndPoints() {
	   context.save();
	   context.strokeStyle = END_POINT_STROKE_STYLE;
	   context.fillStyle   = END_POINT_FILL_STYLE;

	   drawEndPoint(0);
	   drawEndPoint(1);

	   context.stroke();
	   context.fill();
	   context.restore();
	}

	function drawControlAndEndPoints() {
	   drawControlPoints();
	   drawEndPoints();
	}

	function cursorInEndPoint() {
		var pt;

		endPoints.forEach( function(point){
			context.beginPath();
			context.arc(point.x, point.y, CONTROL_POINT_RADIUS, 0, Math.PI*2, false);
			if (context.isPointInPath(loc.x, loc.y)) {
				pt = point;
			}
		});

		return pt;
	}

	function cursorInControlPoint(loc) {
		var pt;
		controlPoints.forEach( function(point){
			context.beginPath();
			context.arc(point.x, point.y, CONTROL_POINT_RADIUS, 0, Math.PI*2, false);
			if (context.isPointInPath(loc.x, loc.y)) {
				pt = point;
			}
		});
		return pt;
	}

	function updateDraggingPoint(loc) {
		draggingPoint.x = loc.x;
		draggingPoint.y = loc.y;
	}

	canvas.onmousedown = function (e) {
	   var loc = windowToCanvas(e.clientX, e.clientY);

	   e.preventDefault(); // prevent cursor change

	   if (!editing) {
	      saveDrawingSurface();
	      mousedown.x = loc.x;
	      mousedown.y = loc.y;
	      updateRubberbandRectangle(loc);
	      dragging = true;
	   }
	   else {
	      draggingPoint = cursorInControlPoint(loc);
	      
	      if (!draggingPoint) {
	         draggingPoint = cursorInEndPoint(loc);
	      }
	   }
	};

	canvas.onmousemove = function (e) {

		var loc = windowToCanvas(e.clientX, e.clientY);

		if (dragging || draggingPoint) {
			e.preventDefault();
			restoreDrawingSurface();

			if(guidewires) {
				drawGuidewires(loc.x, loc.y);
			}
		}	
		if (dragging) {
			updateRubberband(loc);
			drawControlAndEndPoints();
		}
		else if (draggingPoint) {
			updateDraggingPoint(loc);
			drawControlAndEndPoints();
			drawBezierCurve();
		}
	};

	canvas.onmouseup = function (e) {
		loc = windowToCanvas(e.clientX, e.clientY);

		restoreDrawingSurface();

		if (!editing) {
			updateRubberband(loc);
			drawControlAndEndPoints();
			dragging = false;
			editing = true;
			if (showInstructions) {
				instructions.style.display = 'inline';
			}
		}
		else {
			if (draggingPoint) drawControlPoint();
			else 			   editing = false;

			drawBezierCurve();
			draggingPoint = undefined;
		}
	}

	eraseAllButton.onclick = function (e) {
		context.clearRect(0, 0, canvas.width, canvas.height);
		drawGrid(GRID_STROKE_STYLE, GRID_SPACING, GRID_SPACING);

		saveDrawingSurface();

		editing = false;
		dragging = false;
		draggingPoint = undefined;
	};

	strokeStyleSelect.onchange = function (e) {
		context.strokeStyle = strokeStyleSelect.value;
	};

	guidewireCheckbox.onchange = function (e) {
		guidewires = guidewireCheckbox.checked;
	};

	instructionsOkayButton.onclick = function (e) {
		instructions.style.display = 'none';
	};

	instructionsNoMoreButton.onclick = function (e) {
		instructions.style.display = 'none';
		showInstructions = false;
	};

	context.strokeStyle = strokeStyleSelect.value;
	drawGrid(GRID_STROKE_STYLE, GRID_SPACING, GRID_SPACING);

	










});
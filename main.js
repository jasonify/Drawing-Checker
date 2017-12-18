window.onload = function() {

  // TODO: undo
  // Fix bugs
  // TODO: generate random drawings
  // "save"  / export out lines drawn. /import too

    var canvas = document.getElementById("canvas"),
    canvasRef = document.getElementById("canvas2"),
    context = canvas.getContext("2d"),
    contextRef = canvasRef.getContext("2d"),
    width = canvas.width = canvasRef.width = window.innerWidth / 2 - 50;
    height = canvas.height = canvasRef.height = window.innerHeight;
    var $startcopyButton = document.getElementById('startcopy');
    var $checkButton = document.getElementById('check');
    var $hideUnderlineButton = document.getElementById('hide-underline');
    var $resetButton = document.getElementById('reset');
    var $undoButton = document.getElementById('undo');

    context.fillStyle = 'cyan';
    context.fillRect(0, 0, width, height);
    contextRef.fillStyle = 'green';
    contextRef.fillRect(0, 0, width, height);

    // Tracking mouse
    var startingPoint = null;
    var currentPoint = null;
    var linesDrawn = [];
    var linesDrawnTwo = []; // this is the underline
    // ----------------------------------
    var underlineDrawin = [];

    function drawPoint(ctx) {
        if (currentPoint) {
            ctx.fillRect(currentPoint.x, currentPoint.y, 5, 5);
        }
    }

    function drawCurrentLine(ctx) {
        if(startingPoint && currentPoint) {
            drawLine(context, startingPoint, currentPoint, "blue")
        }
    }

    function drawLine(ctx,start, end, color) {
      context.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.strokeStyle = color;
      ctx.stroke();
    }

    function drawLines(context, lines, color) {
      for(var ii = 0; ii < lines.length; ii++) {
        var line = lines[ii];
        drawLine(context, line.start, line.end, color);
      }
    }

    function render() {
        context.restore();
        context.clearRect(0,0, width, height);
        context.save();
        /*
        context.beginPath();
        context.moveTo(100, 100);
        context.lineTo(200,200);
        context.strokeStyle="red";
        context.stroke();
        */

        drawPoint(context);
        drawCurrentLine(context);
        drawLines(context, linesDrawn, 'black');

        drawLines(context, underlineDrawin, 'red');

        setTimeout(function(){
            requestAnimationFrame(render);
        }, 1000/60);
    };

    $startcopyButton.addEventListener('click',function(event) {
      linesDrawnTwo = linesDrawn.slice(0);
      linesDrawn = [];
      drawLines(contextRef, linesDrawnTwo, 'black');
      startingPoint = null;
    },false);

    // Show underline
    $checkButton.addEventListener('click',function(event) {
      underlineDrawin = linesDrawnTwo.slice(0);
    });
    $hideUnderlineButton.addEventListener('click',function(event) {
      underlineDrawin = [];
    });


    $undoButton.addEventListener('click',function(event) {
      console.log('undo');
      if ( linesDrawn.length > 0) {
        console.log('pop', linesDrawn);
        linesDrawn.pop();
      }
    });

    $resetButton.addEventListener('click',function(event) {
      startingPoint = null;
      currentPoint = null;
      linesDrawn = [];
      linesDrawnTwo = [];
      underlineDrawin = [];
      contextRef.clearRect(0, 0, width, height);
      contextRef.fillStyle = 'green';
      contextRef.fillRect(0, 0, width, height);

    });

    canvas.addEventListener('mousemove', function(event) {
        currentPoint = { x: event.clientX, y: event.clientY };
    });

    canvas.addEventListener('mousedown', function(event){
        var point = { x: event.clientX, y: event.clientY };
        if (startingPoint) {
            // This means we already made one point so we have a line now:
            linesDrawn.push({start: startingPoint, end: point});
            startingPoint = null;
        } else {
            console.log('set point');
            startingPoint = point;
        }
    });

    render();
}

var canvas;       // reference to Canvas
var c;      // reference to Canvas drawing context
var pi = Math.PI;
var width;  // canvas width  ... convenience variable
var height; // canvas height .. convenience variable
var midX;
var midY;
var mouseX;
var mouseY;
var mouseFlag = false;
var H = 0;    // hue
var S = 100;   //saturation
var L = 50;  // luminance
var pointers = [];  // array of pointer objects

// Initializes program state and starts the animation.
function initialize() {

    canvas = document.getElementById("canvas");
    if (canvas && canvas.getContext) {

        c = canvas.getContext("2d");
        width = canvas.width;
        height = canvas.height;
        midX = width / 2;
        midY = height / 2;

        //    Initialize the array of pointer 
        var radius = 14;
        var padding = 5;
        var delta = radius * 2 + padding;

        for (var y = radius + padding; y < height; y += delta) {
            for (var x = radius + padding; x < width; x += delta) {
                var pointer = {};    // one pointer object
                pointer.x = x;
                pointer.y = y;
                pointer.radius = radius;
                pointer.angle = 0;
                pointer.color = "hsla(" + H + "," + S + "%," + L + "%,1.0)";
                pointers.push(pointer);    // push the object onto to array
            } // end for
        } // end for

        // check for a mouse move

        canvas.addEventListener("mousemove", mouseMove);

        window.setInterval("drawScreen()", 1000 / 60);  // call repeatedly

    } // end if
} // initialize()


// DrawScreen function
function drawScreen() {

    // Background color
    c.beginPath();
    c.fillStyle = "black";
    c.fillRect(0, 0, width, height);
    c.closePath();

    // Update and draw the arrows
    for (var i = 0; i < pointers.length; i++) {
        if (mouseFlag) {
            update(pointers[i]);
        }
        drawArrow(pointers[i]);
    } // end for

}  // end drawScreen

// Draw arrow function
function drawArrow(pt) {
    var r = pt.radius;
    var r2 = r / 2;

    c.save();
    c.beginPath();
    c.strokeStyle = pt.color;
    c.lineWidth = "3";
    c.lineCap = "round";
    c.lineJoin = "round";
    c.translate(pt.x, pt.y);
    c.rotate(-pt.angle);
    c.moveTo(-r, 0); // draw the arrow
    c.lineTo(r, 0);
    c.moveTo(r - r / 2, -r2);
    c.lineTo(r, 0);
    c.lineTo(r - r / 2, r2);
    c.stroke();
    c.closePath();
    c.restore();

}  // end drawArrow	


// Get current mouse location
function mouseMove(mouse) {
    mouseX = mouse.pageX - canvas.offsetLeft;
    mouseY = mouse.pageY - canvas.offsetTop;
    mouseFlag = true;

} // end mouseMove	

//  Update the angle of the arrow
function update(pt) {
    var dx = mouseX - pt.x;
    var dy = mouseY - pt.y;
    var radians = Math.atan2(dy, dx);

    pt.angle = -radians;
    H = radians * 180 / pi + 180 // the new color
    pt.color = "hsla(" + H + ", " + S + "%, " + L + "%, 1.0)";
} // end update
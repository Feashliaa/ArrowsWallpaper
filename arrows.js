var canvas;
var c;
var width;
var height;
var mouseX = 0;
var mouseY = 0;
var mouseFlag = false;
var pointers = [];
var animationId;

function initialize() {
    canvas = document.getElementById("canvas");
    if (!canvas || !canvas.getContext) return;

    c = canvas.getContext("2d");

    // Initial setup
    resizeCanvas();

    // Resize listener with debounce
    var resizeTimeout;
    window.addEventListener("resize", function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeCanvas, 100);
    });

    canvas.addEventListener("mousemove", mouseMove, { passive: true });

    drawScreen();
}

function resizeCanvas() {
    // Set canvas to full window size
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Rebuild pointer grid for new dimensions
    pointers = [];

    var radius = 14;
    var padding = 5;
    var delta = radius * 2 + padding;

    for (var y = radius + padding; y < height; y += delta) {
        for (var x = radius + padding; x < width; x += delta) {
            pointers.push({
                x: x,
                y: y,
                radius: radius,
                angle: 0,
                hue: 0
            });
        }
    }

    // Reset mouse flag so arrows point correctly after resize
    mouseFlag = false;
}

function drawScreen() {
    animationId = requestAnimationFrame(drawScreen);

    c.fillStyle = "black";
    c.fillRect(0, 0, width, height);

    c.lineWidth = 3;
    c.lineCap = "round";
    c.lineJoin = "round";

    for (var i = 0; i < pointers.length; i++) {
        var pt = pointers[i];

        if (mouseFlag) {
            var dx = mouseX - pt.x;
            var dy = mouseY - pt.y;
            var radians = Math.atan2(dy, dx);
            pt.angle = radians;
            pt.hue = radians * 57.2958 + 180;
        }

        var r = pt.radius;
        var r2 = r * 0.5;

        c.save();
        c.beginPath();
        c.strokeStyle = "hsl(" + pt.hue + ",100%,50%)";
        c.translate(pt.x, pt.y);
        c.rotate(pt.angle);
        c.moveTo(-r, 0);
        c.lineTo(r, 0);
        c.moveTo(r - r2, -r2);
        c.lineTo(r, 0);
        c.lineTo(r - r2, r2);
        c.stroke();
        c.restore();
    }
}

function mouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    mouseFlag = true;
}
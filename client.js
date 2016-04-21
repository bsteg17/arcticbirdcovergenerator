var image = new Image();
var title;
var author;
var color;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

//canvas initialization
ctx.fillStyle = 'blue';
ctx.fillRect(10,10,200,200);

function handleFileSelect(evt) {
    image.src = URL.createObjectURL(evt.target.files[0]);
}

function onImageLoad() {
    ctx.drawImage(image, 0, 0);
}

function onMouseDown() {
    console.log("mousedown");
}

function onMouseUp() {
    console.log("mouseup");
}

function onMouseMove() {
    console.log("mousemove");
}

//resize canvas to fit window
canvas.setAttribute('height', window.innerHeight);
canvas.setAttribute('width', window.innerWidth);

//event handler initializations
document.getElementById('image-upload').addEventListener('change', handleFileSelect, false);
image.onload = onImageLoad;
document.body.onmousedown = onMouseDown;
document.body.onmouseup = onMouseUp;
document.body.onmousemove = onMouseMove;

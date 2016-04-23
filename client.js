//initialize values for cover image

var image = {};
    image.img = new Image();
    image.width = 300;
    image.height = 300;
    image.borderWidth = 10;
    image.borderColor = 'blue';
    image.nodesInit();
var title;
var author;
var color;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

//canvas initialization
ctx.fillStyle = 'blue';
ctx.fillRect(10,10,200,200);

function handleFileSelect(evt) {
    image.img.src = URL.createObjectURL(evt.target.files[0]);
    console.log(image.img.src);
}

function onImageLoad() {
    console.log("imageLoaded");
    image.x = 100;
    image.y = 100;
    redraw();
}

function onMouseDown(e) {
    mouse = adjustClickPosition(e);
    if (mouse.withinImage) {
        console.log("within");
        image.drag = true;
        image.dragMousePositionX = mouse.imageX;
        image.dragMousePositionY = mouse.imageY;
    }
}

function onMouseUp(e) {
    mouse = adjustClickPosition(e);
    // console.log("mouseup");
    // console.log("page_x: "+e.pageX+" page_y: "+e.pageY);
    console.log("stopped dragging");
    image.drag = false;
    if (mouse.withinImage) {
        image.adjustableSize = true;
    } else {
        image.adjustableSize = false;
    }
    console.log("adjustableSize = "+image.adjustableSize);
}

function onMouseMove(e) {
    mouse = adjustClickPosition(e);
    // console.log("mousemove");
    console.log("imageX: "+mouse.imageX+" imageY: "+mouse.imageY);
    if (image.drag) {
        console.log("dragging");
        image.x = mouse.canvasX - image.dragMousePositionX;
        image.y = mouse.canvasY - image.dragMousePositionY;
        image.recalculateNodePositions();   
    }
    redraw();
}

function adjustClickPosition(e) {
    mouse = {};
    mouse.canvasX = e.pageX - canvas.x; //canvas.x/y represents the position of canvas itself on page
    mouse.canvasY = e.pageY - canvas.y; //
    mouse.imageX = mouse.canvasX - image.x;//represents position of cursor relative to position of cover image
    mouse.imageY = mouse.canvasY - image.y;
    cursorWithinImageRangeX = (mouse.imageX > 0) && (mouse.imageX < image.width);
    cursorWithinImageRangeY = (mouse.imageY > 0) && (mouse.imageY < image.height);
    mouse.withinImage = cursorWithinImageRangeX && cursorWithinImageRangeY;
    return mouse;
}

function storeCanvasPosition() {
    canvas.x = canvas.getBoundingClientRect().left;
    canvas.y = canvas.getBoundingClientRect().top;
}

function redraw() {
    clear(ctx, canvas);
    redrawImage();
}

function redrawImage() {
    //draw size-adjusting border
    ctx.strokeStyle = image.borderWidth;
    ctx.lineWidth = image.borderColor;
    ctx.rect(image.x, image.y, image.width, image.height);
    ctx.stroke();
    //draw size-adjusting border nodes
    image.drawNodes(ctx);
    ctx.stroke();
    //draw image
    ctx.drawImage(image.img, image.x, image.y, image.width, image.height);
}

function clear(context, canvas) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  var w = canvas.width;
  canvas.width = 1;
  canvas.width = w;
}

//resize canvas to fit window
canvas.setAttribute('height', window.innerHeight);
canvas.setAttribute('width', window.innerWidth);

//event handler initializations
storeCanvasPosition();
document.getElementById('image-upload').addEventListener('change', handleFileSelect, false);
image.img.onload = onImageLoad;
canvas.addEventListener("mousedown", onMouseDown, false);
canvas.addEventListener("mouseup", onMouseUp, false);
canvas.addEventListener("mousemove", onMouseMove, false);

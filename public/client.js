//initialize values for cover image

var mouse = {};
var title;
var author;
var color;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
ctx.canvas.width = document.getElementById('canvas-contain').clientWidth;
ctx.canvas.height = document.getElementById('canvas-contain').clientHeight;

var image = {};
    image.img = new Image();
    image.width = 300;
    image.height = 300;
    image.borderThickness = 6;
    image.borderColor = "black";
    image.nodesInit();
var cover = {};
    cover.img = new Image();
    cover.img.src = "/penguin_classics_black_bottom.png";
    cover.transparent = false;
    cover.borderThickness = 6;
    cover.borderColor = "black";
    cover.height = canvas.height - cover.borderThickness;
    cover.width = cover.img.width * (cover.height / cover.img.height);
    cover.x = (canvas.width / 2) - (cover.width / 2);
    cover.y = cover.borderThickness;

function handleFileSelect(evt) {
    image.img.src = URL.createObjectURL(evt.target.files[0]);
}

function onImageLoad() {
    image.x = 100;
    image.y = 100;
    redraw();
}

function onCoverLoad() {
    redraw();
}

function onMouseDown() {
    if (mouse.withinImage) {
        image.showNodes = true;
        image.translate = true;
        image.translateMousePositionX = mouse.imageX;
        image.translateMousePositionY = mouse.imageY;   
    }
    if (mouse.withinNode != null) {
        image.resize = true;
    }
    redraw();
}

function onMouseUp() {
    image.translate = false;
    image.resize = false;
    if (!mouse.withinImage && mouse.withinNode == null) {
        image.showNodes = false;
    }
    redraw();
}

function onMouseMove(e) {
    adjustClickPosition(e);
    if (image.translate) {
        translateImage(mouse);
        redraw();
    }
    if (image.resize) {
        resizeImage();
        redraw();
    }
}

function adjustClickPosition(e) {
    mouse.canvasX = e.pageX - canvas.x; //canvas.x/y represents the position of canvas itself on page
    mouse.canvasY = e.pageY - canvas.y; //
    mouse.imageX = mouse.canvasX - image.x;//represents position of cursor relative to position of cover image
    mouse.imageY = mouse.canvasY - image.y;
    if (!image.translate && !image.resize) {
        mouse.withinImage = mouseIsWithinImage();
        mouse.withinNode = getSelectedNode();   
    }
}

function mouseIsWithinImage() {
    mouseWithinImageRangeX = (mouse.imageX > 0) && (mouse.imageX < image.width);
    mouseWithinImageRangeY = (mouse.imageY > 0) && (mouse.imageY < image.height);
    return mouseWithinImageRangeX && mouseWithinImageRangeY;
}

function getSelectedNode() {
    if (mouse.withinImage) { return null; }
    var nodeNameReturn; 
    sizeAdjustNodeNames.forEach(function(nodeName) {
        nodeToCheck = image.sizeAdjustNodes[nodeName];
        mouseWithinNodeRangeX = mouse.canvasX > nodeToCheck.x && mouse.canvasX < (nodeToCheck.x + image.nodeSize);
        mouseWithinNodeRangeY = mouse.canvasY > nodeToCheck.y && mouse.canvasY < (nodeToCheck.y + image.nodeSize);
        if (mouseWithinNodeRangeX && mouseWithinNodeRangeY) {
             nodeNameReturn = nodeName;
        }
    });
    if (nodeNameReturn) {
        return nodeNameReturn;
    }
    return null;
}

function translateImage() {
    image.x = mouse.canvasX - image.translateMousePositionX;
    image.y = mouse.canvasY - image.translateMousePositionY;   
}

function resizeImage() {
    switch (mouse.withinNode) {
        case "topLeft":
            image.width = image.width - mouse.imageX;
            image.height = image.height - mouse.imageY;
            image.x = mouse.canvasX;
            image.y = mouse.canvasY;
            break;
        case "topMid":
            image.height = image.height - mouse.imageY;
            image.y = mouse.canvasY;
            break;
        case "topRight":
            image.width = mouse.imageX;
            image.height = image.height - mouse.imageY;
            image.y = mouse.canvasY;
            break;
        case "midRight":
            image.width = mouse.imageX;
            break;
        case "bottomRight":
            image.width = mouse.imageX;
            image.height = mouse.imageY;
            break;
        case "bottomMid":
            image.height = mouse.imageY;
            break;
        case "bottomLeft":
            image.width = image.width - mouse.imageX;
            image.height = mouse.imageY;
            image.x = mouse.canvasX;
            break;
        case "midLeft":
            image.width = image.width - mouse.imageX;
            image.x = mouse.canvasX;
            break;
    }
}

function storeCanvasPosition() {
    canvas.x = canvas.getBoundingClientRect().left;
    canvas.y = canvas.getBoundingClientRect().top;
}

function redraw() {
    clear(ctx, canvas);
    if (image.showNodes) {
        drawBorder();
        drawBorderNodes();
    }
    drawImage();
    drawCover();
}

function drawBorder() {
    ctx.strokeStyle = image.borderColor;
    ctx.lineWidth = image.borderThickness;
    recalculateBorderPosition();
    ctx.rect(image.borderX, image.borderY, image.borderWidth, image.borderHeight);
    ctx.stroke();
}

function drawBorderNodes() {
    image.recalculateNodePositions();
    ctx.fillStyle = image.nodeFillColor;
    ctx.strokeStyle = image.nodeOutlineColor;
    ctx.lineWidth = image.nodeOutlineWidth;
    image.drawNodes(ctx);
    ctx.stroke();
}

function recalculateBorderPosition() {
    image.borderX = image.x - (image.borderThickness / 2);
    image.borderY = image.y - (image.borderThickness / 2);
    image.borderWidth = image.width + (image.borderThickness);
    image.borderHeight = image.height + (image.borderThickness);
}

function drawImage() {
    ctx.drawImage(image.img, image.x, image.y, image.width, image.height);
}

function drawCover() {
    ctx.drawImage(cover.img, cover.x, cover.y, cover.width, cover.height);
    //draw cover border
    ctx.strokeStyle = cover.borderColor;
    ctx.lineWidth = cover.borderThickness;
    ctx.rect(cover.x, cover.y, cover.width, cover.height);
    ctx.stroke();
    // ct = new CanvasText( canvas, {
    //     x: 'center',
    //     y: 120,
    //     width: 300,
    //     placeholder:title; 
    // } );
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

//mouse listeners
canvas.addEventListener("mousedown", onMouseDown, false);
canvas.addEventListener("mouseup", onMouseUp, false);
canvas.addEventListener("mousemove", onMouseMove, false);

cover.img.onload = onCoverLoad;
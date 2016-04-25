//initialize values for cover image

var image = {};
    image.img = new Image();
    image.width = 300;
    image.height = 300;
    image.borderWidth = 3;
    image.borderColor = 'blue';
    image.nodesInit();
var mouse = {};
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
}

function onImageLoad() {
    image.x = 100;
    image.y = 100;
    redraw();
}

function onMouseDown() {
    if (mouse.withinImage) {
        console.log("dragging");
        image.showNodes = true;
        image.translate = true;
        image.translateMousePositionX = mouse.imageX;
        image.translateMousePositionY = mouse.imageY;   
    }
    // console.log(mouse.withinNode);
    if (mouse.withinNode != null) {
        console.log("resizing");
        image.resize = true;
    }
    redraw();
}

function onMouseUp() {
    // console.log("mouseup");
    // console.log("page_x: "+e.pageX+" page_y: "+e.pageY);
    console.log("stopped dragging/resizing");
    image.translate = false;
    image.resize = false;
    if (!mouse.withinImage && mouse.withinNode == null) {
        console.log("mouse not within image and withinnode is null");
        image.showNodes = false;
    }
    redraw();
    console.log("adjustableSize = "+image.showNodes);
}

function onMouseMove(e) {
    adjustClickPosition(e);
    // console.log("mousemove");
    if (image.translate) {
        translateImage(mouse);
        redraw();
    }
    if (image.resize) {
        console.log("resizing");
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
    if (mouse.withinImage) { console.log("withinimage");return null; }
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
    console.log(mouse.withinNode);
    switch (mouse.withinNode) {
        case "topLeft":
            resizeAnchorBottomRight();
            break;
        case "topMid":
            resizeAnchorBottomAndWidth();
            break;
        case "topRight":
            resizeAnchorBottomLeft();
            break;
        case "midRight":
            resizeAnchorLeftAndHeight();
            break;
        case "bottomRight":
            resizeAnchorTopLeft();
            break;
        case "bottomMid":
            resizeAnchorTopAndWidth();
            break;
        case "bottomLeft":
            resizeAnchorTopRight();
            break;
        case "midLeft":
            resizeAnchorRightAndHeight();
            break;
    }
}

function resizeAnchorBottomRight() {
    image.width = image.width - mouse.imageX;
    image.height = image.height - mouse.imageY;
    image.x = mouse.canvasX;
    image.y = mouse.canvasY;
}

function resizeAnchorBottomAndWidth() {
    image.height = image.height - mouse.imageY;
    image.y = mouse.canvasY;
}

function resizeAnchorBottomLeft() {
    image.width = mouse.imageX;
    image.height = image.height - mouse.imageY;
    image.y = mouse.canvasY;
}

function resizeAnchorLeftAndHeight() {
    image.width = mouse.imageX;
}

function resizeAnchorTopLeft() {
    image.width = mouse.imageX;
    image.height = mouse.imageY;
}

function resizeAnchorTopAndWidth() {
    image.height = mouse.imageY;
}

function resizeAnchorTopRight() {
    image.width = image.width - mouse.imageX;
    image.height = mouse.imageY;
    image.x = mouse.canvasX;
}

function resizeAnchorRightAndHeight() {
    image.width = image.width - mouse.imageX;
    image.x = mouse.canvasX;
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
    if (image.showNodes) {
        ctx.strokeStyle = image.borderColor;
        ctx.lineWidth = image.borderWidth;
        ctx.rect(image.x, image.y, image.width, image.height);
        ctx.stroke();
        //draw size-adjusting border nodes
        image.recalculateNodePositions();
        image.drawNodes(ctx);
        ctx.stroke();
    }
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

//mouse listeners
canvas.addEventListener("mousedown", onMouseDown, false);
canvas.addEventListener("mouseup", onMouseUp, false);
canvas.addEventListener("mousemove", onMouseMove, false);

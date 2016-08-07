var mouse;
var title;
var author;
var color;
var canvas;
var ctx;
var image;
var cover;

function initMouse() {
    mouse = {};
}

function initCanvas() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    ctx.canvas.width = document.getElementById('canvas-contain').clientWidth;
    ctx.canvas.height = document.getElementById('canvas-contain').clientHeight;
    storeCanvasPosition();
}

function initImage() {
    image = {};
    image.img = new Image();
    image.width = 300;
    image.height = 300;
    image.borderThickness = 6;
    image.borderColor = "black";
    image.nodesInit();
    image.img.onload = onImageLoad;
}

function initCover() {
    cover = {};
    cover.img = new Image();
    cover.img.src = "/penguin_classics_black_bottom.png";
    cover.transparent = false;
    cover.borderThickness = 6;
    cover.borderColor = "black";
    cover.height = canvas.height - cover.borderThickness * 2;
    cover.width = cover.img.width * (cover.height / cover.img.height);
    cover.x = (canvas.width / 2) - (cover.width / 2);
    cover.y = cover.borderThickness;
    cover.img.onload = onCoverLoad; //source of cover load issue?
}

function initTitle() {
  title = {};
  title.element = document.createElement("input");
  title.width = cover.width;
  title.x = canvas.x + cover.x;
  title.y = canvas.y + cover.y + (cover.height * .815);
  title.element.style = "position:absolute;left:"+title.x+"px;top:"+title.y+"px;width:"+title.width+";z-index:10;";
  title.element.style.border = "0";
  title.element.style.outline = "none";
  title.element.style.backgroundColor = "#011422";
  title.element.style.color = "#ff6833";
  title.element.style.textAlign = "center";
  title.element.style.fontSize = (cover.height * .031)+"px";
  title.element.style.fontFamily = "Georgia";
  title.element.style.fontWeight = "bold";
  title.element.value = "INFINITE JEST";
  document.getElementById("canvas-contain").appendChild(title.element);
}

function initAuthor() {
  author = {};
  author.element = document.createElement("input");
  author.width = cover.width;
  author.x = canvas.x + cover.x;
  author.y = canvas.y + cover.y + (cover.height * .875);
  author.element.style = "position:absolute;left:"+author.x+"px;top:"+author.y+"px;width:"+author.width+";z-index:10;";
  author.element.style.border = "0";
  author.element.style.outline = "none";
  author.element.style.backgroundColor = "#011422";
  author.element.style.color = "#ffffff";
  author.element.style.textAlign = "center";
  author.element.style.fontSize = (cover.height * .031)+"px";
  author.element.style.fontStyle = "italic";
  author.element.style.fontFamily = "Georgia";
  author.element.value = "David Foster Wallace";
  document.getElementById("canvas-contain").appendChild(author.element);
}

function initHandlers() {
  //event handler initializations
  document.getElementById('image-upload').addEventListener('change', handleFileSelect, false);
  document.getElementById('save-image').addEventListener('click', saveImage, false);
  //mouse listeners
  canvas.addEventListener("mousedown", onMouseDown, false);
  canvas.addEventListener("mouseup", onMouseUp, false);
  canvas.addEventListener("mousemove", onMouseMove, false);
}

function handleFileSelect(evt) {
  image.img.src = URL.createObjectURL(evt.target.files[0]);
}

function saveImage() {
  //temporarily remove nodes so that they aren't showing in the export image
  (image.showNodes) ? restoreNodes = true : restoreNodes = false;
  image.showNodes = false;
  //temporarily remove border so that it isn't showing in the export image
  redraw();
  imgData = ctx.getImageData(cover.x, cover.y, cover.width, cover.height);

  imageCanvas = document.createElement("canvas");
  imageCanvas.id = "image-canvas";
  imageCanvas.style.display = "none";
  imageCanvas.width = cover.width;
  imageCanvas.height = cover.height;

  imageCtx = imageCanvas.getContext('2d');
  imageCtx.putImageData(imgData, 0, 0);

  titleStyle = title.element.style;
  authorStyle = author.element.style;
  imageCtx.textAlign = "center";
  
  //write title on cover
  imageCtx.font = titleStyle.fontWeight+" "+titleStyle.fontSize+" "+titleStyle.fontFamily;
  imageCtx.fillStyle = titleStyle.color;
  imageCtx.fillText(title.element.value, cover.width / 2, title.y - (canvas.y / 2));

  // console.log("real title")
  // console.log(title.x, title.y)
  // console.log("real author")
  // console.log(author.x, author.y)
  // console.log("export title")
  // console.log(cover.width / 2, title.y - cover.y)
  // console.log("export author")
  // console.log(cover.width / 2, author.y - cover.y)s

  //write author on cover
  imageCtx.font = authorStyle.fontStyle+" "+authorStyle.fontSize+" "+authorStyle.fontFamily;//+" "+authorStyle.textAlign+" "+authorStyle.color;
  imageCtx.fillStyle = authorStyle.color;
  imageCtx.fillText(author.element.value, cover.width / 2, author.y - (canvas.y / 2));

  imgDataURL = imageCanvas.toDataURL("image/png");
  window.open(imgDataURL, "_blank");
  // console.log(document.getElementById('save-image').href);
  // restore nodes if they were visible prior to canvas snapshot
  if (restoreNodes) {
    image.showNodes = true;
  }
  redraw();
}

function onImageLoad() {
    image.x = 100;
    image.y = 100;
    redraw();
}

function onCoverLoad() {
    console.log("loaded");
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
    ctx.rect(cover.x - (cover.borderThickness / 2), cover.y - (cover.borderThickness / 2), cover.width + cover.borderThickness, cover.height + cover.borderThickness);
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

function init() {
    initMouse();
    initCanvas();
    initImage();
    initCover();
    initTitle();
    initAuthor();
    initHandlers();
    console.log(title);
}

//doc init
$(window).on('load', function() {
  init();
});

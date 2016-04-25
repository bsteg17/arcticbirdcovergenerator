sizeAdjustNodeNames = ["topLeft","topMid","topRight","midRight","bottomRight","bottomMid","bottomLeft","midLeft"];

Object.prototype.nodesInit = function() {
    image = this;
    image.nodeSize = image.borderWidth;
    image.nodeOutlineWidth = 1;
    image.nodeOutlineColor = "black";
    image.nodeFillColor = "white";
    //initialize nodes for this size adjustment
    image.sizeAdjustNodes = {};
    sizeAdjustNodeNames.forEach(function(nodeName) {
        image.sizeAdjustNodes[nodeName] = {x:null,y:null};
    });
}

Object.prototype.drawNodes = function(ctx) {
    image = this;
    ctx.strokeStyle = image.nodeOutlineColor;
    ctx.strokeWidth = image.nodeOutlineWidth;
    sizeAdjustNodeNames.forEach(function(nodeName) {
        node = image.sizeAdjustNodes[nodeName];
        ctx.rect(node.x, node.y, image.nodeSize, image.nodeSize);
    });
}

Object.prototype.recalculateNodePositions = function() {
    //top left
    this.sizeAdjustNodes["topLeft"].x = this.x - this.nodeSize - this.borderWidth;
    this.sizeAdjustNodes["topLeft"].y = this.y - this.nodeSize - this.borderWidth;
    //top mid
    this.sizeAdjustNodes["topMid"].x = this.x + ((this.width / 2) - (this.nodeSize / 2));
    this.sizeAdjustNodes["topMid"].y = this.y - this.nodeSize - this.borderWidth;
    //top right
    this.sizeAdjustNodes["topRight"].x = this.x + this.width + this.borderWidth;
    this.sizeAdjustNodes["topRight"].y = this.y - this.nodeSize - this.borderWidth;
    //mid right
    this.sizeAdjustNodes["midRight"].x = this.x + this.width + this.borderWidth;
    this.sizeAdjustNodes["midRight"].y = this.y + ((this.height / 2) - (this.nodeSize / 2));
    //bottom mid
    this.sizeAdjustNodes["bottomRight"].x = this.x + this.width + this.borderWidth;
    this.sizeAdjustNodes["bottomRight"].y = this.y + this.height + this.borderWidth;
    //bottom left
    this.sizeAdjustNodes["bottomMid"].x = this.x + ((this.width / 2) - (this.nodeSize / 2));
    this.sizeAdjustNodes["bottomMid"].y = this.y + this.height + this.borderWidth;
    //mid left
    this.sizeAdjustNodes["bottomLeft"].x = this.x - this.nodeSize - this.borderWidth;
    this.sizeAdjustNodes["bottomLeft"].y = this.y + this.height + this.borderWidth;
    //bottom right
    this.sizeAdjustNodes["midLeft"].x = this.x - this.nodeSize - this.borderWidth;
    this.sizeAdjustNodes["midLeft"].y = this.y + ((this.height / 2) - (this.nodeSize / 2));
};
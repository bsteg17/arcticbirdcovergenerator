sizeAdjustNodeNames = ["topLeft","topMid","topRight","midRight","bottomRight","bottomMid","bottomLeft","midLeft"];

Object.prototype.nodesInit = function() {
    image = this;
    image.nodeSize = 10;
    image.nodeOutlineWidth = 3;
    image.nodeOutlineColor = "black";
    image.nodeFillColor = "yellow";
    //initialize nodes for this size adjustment
    image.sizeAdjustNodes = {};
    sizeAdjustNodeNames.forEach(function(nodeName) {
        image.sizeAdjustNodes[nodeName] = {x:null,y:null};
    });
}

Object.prototype.drawNodes = function(ctx) {
  image = this;
  sizeAdjustNodeNames.forEach(function(nodeName) {
      node = image.sizeAdjustNodes[nodeName];
      ctx.strokeRect(node.x, node.y, image.nodeSize, image.nodeSize);
      ctx.fillRect(node.x, node.y, image.nodeSize, image.nodeSize);
  });
}

Object.prototype.recalculateNodePositions = function() {
    //top left
    this.sizeAdjustNodes["topLeft"].x = this.x - this.nodeSize - this.borderThickness;
    this.sizeAdjustNodes["topLeft"].y = this.y - this.nodeSize - this.borderThickness;
    //top mid
    this.sizeAdjustNodes["topMid"].x = this.x + ((this.width / 2) - (this.nodeSize / 2));
    this.sizeAdjustNodes["topMid"].y = this.y - this.nodeSize - this.borderThickness;
    //top right
    this.sizeAdjustNodes["topRight"].x = this.x + this.width + this.borderThickness;
    this.sizeAdjustNodes["topRight"].y = this.y - this.nodeSize - this.borderThickness;
    //mid right
    this.sizeAdjustNodes["midRight"].x = this.x + this.width + this.borderThickness;
    this.sizeAdjustNodes["midRight"].y = this.y + ((this.height / 2) - (this.nodeSize / 2));
    //bottom mid
    this.sizeAdjustNodes["bottomRight"].x = this.x + this.width + this.borderThickness;
    this.sizeAdjustNodes["bottomRight"].y = this.y + this.height + this.borderThickness;
    //bottom left
    this.sizeAdjustNodes["bottomMid"].x = this.x + ((this.width / 2) - (this.nodeSize / 2));
    this.sizeAdjustNodes["bottomMid"].y = this.y + this.height + this.borderThickness;
    //mid left
    this.sizeAdjustNodes["bottomLeft"].x = this.x - this.nodeSize - this.borderThickness;
    this.sizeAdjustNodes["bottomLeft"].y = this.y + this.height + this.borderThickness;
    //bottom right
    this.sizeAdjustNodes["midLeft"].x = this.x - this.nodeSize - this.borderThickness;
    this.sizeAdjustNodes["midLeft"].y = this.y + ((this.height / 2) - (this.nodeSize / 2));
};
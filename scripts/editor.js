class Editor {
  canvas;
  ctx;
  brushColour = "#000000";
  brushWidth = "2";
  xAxis = 0;
  yAxis = 0;

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = this.brushWidth;
    this.ctx.strokeStyle = this.brushColour;
  }

  foo(test) {
    console.log("canvas height = " + canvas.height);
    console.log("brushColour = " + this.brushColour);
    console.log("brushWidth = " + this.brushWidth);
  }

  setBrushColour(colour) {
    this.brushColour = colour;
    this.ctx.strokeStyle = colour;
  }

  setBrushWidth(width) {
    this.brushWidth = width;
    this.ctx.lineWidth = width;
    console.log("brushWidth = " + this.brushWidth);
  }

  draw(e) {
    console.log("DRAW! = " + e);
    this.ctx.lineTo(Math.floor((Math.random() * 900)), Math.floor((Math.random() * 900)));
    this.ctx.stroke();
  }

  foo2() {
    //on mouseup.
    console.log("in foo2");
    this.ctx.stroke();
    this.ctx.beginPath();
  }

}
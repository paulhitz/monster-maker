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
    // console.log("x = " + e.clientX + "and y =" + e.clientY);
    // console.log("this.canvas.offsetLeft = " + this.canvas.offsetLeft);
    // console.log("this.canvas.offsetTop = " + this.canvas.offsetTop);
    //TODO offset won't work correctly if the user scrolls. Need alternative.
    this.ctx.lineTo(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);
    this.ctx.stroke();
  }

  foo2() {
    //on mouseup.
    console.log("in foo2");
    this.ctx.stroke();
    this.ctx.beginPath();
  }

/*
TODO 
-only paint when mouse clicked
-solve offset issue
-check form elements work


*/


}
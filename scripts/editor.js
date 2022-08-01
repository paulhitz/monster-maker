/**
 * 
 */
class Editor {
  canvas;
  ctx;
  brushColour = "#000000";
  brushWidth = "5";
  xAxis = 0;
  yAxis = 0;
  drawing = false;

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = this.brushWidth;
    this.ctx.strokeStyle = this.brushColour;
  }

  //TODO check the recommended method of using getters/setters in JS.
  setBrushColour(colour) {
    this.brushColour = colour;
    this.ctx.strokeStyle = colour;
  }
  setBrushWidth(width) {
    this.brushWidth = width;
    this.ctx.lineWidth = width;
  }
  setDrawing(drawing) {
    console.log("drawing = " + drawing);
    this.drawing = drawing;
  }
  setXAxis(xAxis) {
    this.xAxis = xAxis;
  }
  setYAxis(yAxis) {
    this.yAxis = yAxis;
  }

  draw(e) {
    
    //TODO offset won't work correctly if the user scrolls. Need alternative.
    if (this.drawing) {
      console.log(e);
      console.log("Mouse DRAWING. pageX = " + e.pageX + "and pageY =" + e.pageY);
      this.ctx.lineTo(e.pageX - this.canvas.offsetLeft, e.pageY - this.canvas.offsetTop);
      this.ctx.stroke();
    }
  }

  //TODO combine this with the above function. if mouseevent if touchevent
  drawTouch(touchEvent) {
    
    if (this.drawing) {
      console.log(touchEvent);
      const event = touchEvent.touches[0];
      console.log("Touch DRAWING. x = " + event.pageX + "and y =" + event.pageY);
      this.ctx.lineTo(event.pageX - this.canvas.offsetLeft, event.pageY - this.canvas.offsetTop);
      this.ctx.stroke();
    }
  }

  //
  endDrawing() {
    //on mouseup.
    this.ctx.stroke();
    this.ctx.beginPath();
  }

/*
TODO 
-recommended way of using setters in JS?
-tidy, tidy, tidy.


*/


}
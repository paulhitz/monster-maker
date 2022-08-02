/**
 * Works with the HTML Canvas API to allow the user to draw on a canvas.
 */
class Editor {
  canvas;
  ctx;
  drawing = false;

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.lineCap = 'round';
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.lineWidth = "5";
  }

  setBrushColour(colour) {
    this.ctx.strokeStyle = colour;
  }
  setBrushWidth(width) {
    this.ctx.lineWidth = width;
  }
  setDrawing(drawing) {
    this.drawing = drawing;
  }

  //
  draw(e) {
    if (this.drawing) {
      //console.log(e);
      this.ctx.lineTo(e.pageX - this.canvas.offsetLeft, e.pageY - this.canvas.offsetTop);
      this.ctx.stroke();
    }
  }

  //
  endDrawing() {
    //on mouseup.
    this.ctx.stroke();
    this.ctx.beginPath();
  }

  //
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

/*
TODO 
-tidy, tidy, tidy.
-add comments to this. done.
*/


}
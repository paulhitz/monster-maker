/**
 * Works with the HTML Canvas API to allow the user to draw on a canvas.
 */
class Editor {
  canvas;
  ctx;
  drawing = false;

  //Initialise and set defaults.
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.lineCap = 'round';
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.lineWidth = "10";
    this.ctx.strokeStyle = "#a739db";
  }

  setBrushColour(colour) {
    this.ctx.strokeStyle = colour;
  }

  setBrushWidth(width) {
    this.ctx.lineWidth = width;
  }

  setDrawing(drawing) {
    this.drawing = drawing;
    if (drawing) {
      this.ctx.beginPath();
    }
  }

  //Add the current mouse or touch co-ordinates to the current line (lineTo) and render it (stroke) immediately.
  draw(e) {
    if (this.drawing) {
      let event = e;
      if (event.type === "touchmove") {
        event = event.touches[0];
      }
      this.ctx.lineTo(event.pageX - this.canvas.offsetLeft, event.pageY - this.canvas.offsetTop);
      this.ctx.stroke();
    }
  }

  //Clear the entire canvas. Retains transparency.
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  //Return a base64 encoded PNG of the canvas content.
  export() {
    return this.canvas.toDataURL();
  }

  //Add the provided image to the canvas. It doesn't clear the canvas first.
  import(dataUrl) {
    const img = new Image();
    img.onload = () => {
      this.ctx.drawImage(img, 0, 0);
    };
    img.src = dataUrl;
  }

}

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

  //
  export() {
    //This generates a 20mb response.
    //return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

    return this.canvas.toDataURL();

  }

  //
  import(dataUrl) {
    const img = new Image();
    //TODO Why do we need to use a listener for a base64 encoded image? 
    img.onload = function() {
      ctx.drawImage(img, 0, 0); //TODO needs to use the correct ctx. Pass it in.
    };
    img.src = dataUrl;

    // const img = new Image();
    // img.src = dataUrl;
    // this.ctx.drawImage(img, 0, 0);
  }


}

/*
TODO
-solve ctx issue. 
-confirm works reliably.
-read some more.
-tidy. hook up to the correct buttons.
-add upload functionality
-add gallery (from local storage) below canvas.
-add delete functionality.
-tidy the UI
-fix line thickness mobile issue
*/
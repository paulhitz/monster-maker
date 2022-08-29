/**
 * Works with the HTML Canvas API to allow the user to draw on a canvas.
 */
class Editor {
  canvas;
  ctx;
  drawing = false;

  /**
   * Initialise and set defaults.
   */
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

  /**
   * Add the current mouse or touch co-ordinates to the current line (lineTo) and render it (stroke) immediately.
   *
   * Note on offsets: The canvas will be resized on devices with small viewports (e.g. from 600px to 400px).
   * Consequently we need an offset percentage to account for that. We have an additional offset to account
   * for padding, margins etc.
   */
  draw(e) {
    if (this.drawing) {
      let event = e;
      if (event.type === "touchmove") {
        event = event.touches[0];
      }

      let offsetWidthPercentage = this.canvas.width / this.canvas.offsetWidth;
      this.ctx.lineTo((event.pageX - this.canvas.offsetLeft) * offsetWidthPercentage, event.pageY - this.canvas.offsetTop);
      this.ctx.stroke();
    }
  }

  /**
   * Clear the entire canvas. Retains transparency.
   */
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Return a base64 encoded PNG of the canvas content.
   */
  export() {
    return this.canvas.toDataURL();
  }

  /**
   * Add the provided image to the canvas.
   */
  import(dataUrl) {
    this.clear();
    const img = new Image();
    img.onload = () => {
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    };
    img.src = dataUrl;
  }
}

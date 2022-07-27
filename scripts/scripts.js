const NUMBER_OF_IMAGES = 9;
const SECTION_HEIGHT = 250;
let canvas;
let ctx;
let images = [];
let monster = {};

/**
 * Initialise the canvas, pre-load the images and display a monster.
 */
function init() {
  //When all images have loaded, render a random monster.
  if (images.length == 0) {
    loadImages(function() {
      drawRandomMonster();
    });
  } else {
    drawRandomMonster();
  }

  //Add an event listener to the canvas. Allows the user to load individual monster parts.
  if (canvas == null) {
    canvas = document.getElementById('canvas');
    canvas.addEventListener('mousedown', e => {
      const yAxis = e.offsetY;
      switch (true) {
        case yAxis < SECTION_HEIGHT:
          monster.head = randomImage(images);
          break;
        case yAxis > SECTION_HEIGHT * 2:
          monster.legs = randomImage(images);
          break;
        default:
          monster.torso = randomImage(images);
      }
      drawMonster(monster);
    });
    ctx = canvas.getContext('2d');
  }

  //Generate a gallery of all the monster images. The gallery is hidden until selected.
  generateGallery();
}

/**
 * Pre-load images so they can be rendered on the canvas.
 */
function loadImages(callback) {
  let loadedImages = 0;
  for (let i = 0; i < NUMBER_OF_IMAGES; i++) {
    const img = new Image();
    img.src = `images/monsters/${i}.png`;
    img.onload = function() {
      if(++loadedImages >= NUMBER_OF_IMAGES) {
          callback();
      }
    };
    images[i] = img;
  }
}

/**
 * Return a random entry from the supplied array.
 */
function randomImage(images) {
  let randomNumber = Math.floor((Math.random() * images.length));
  return images[randomNumber];
}

/**
 * Draw a monster with a random head, torso and legs.
 */
function drawRandomMonster() {
  drawMonster({
    "head" : randomImage(images),
    "torso" : randomImage(images),
    "legs" : randomImage(images)
  });
}

/**
 * Draw the monster stored at the specified position in the monster array.
 */
 function drawSpecificMonster(id) {
  drawMonster({
    "head" : images[id],
    "torso" : images[id],
    "legs" : images[id]
  });
}

/**
 * Draw the supplied monster on the canvas. A monster consists of a random head, torso and legs.
 * 
 * TODO consider adding the body part height and the 'y' co-ord to the monster object rather than specifying it here.
 */
function drawMonster(myMonster) {
  monster = myMonster;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(myMonster.head, 0, 0, canvas.width, SECTION_HEIGHT, 0, 0, canvas.width, SECTION_HEIGHT);
  ctx.drawImage(myMonster.torso, 0, SECTION_HEIGHT, canvas.width, SECTION_HEIGHT, 0, SECTION_HEIGHT, canvas.width, SECTION_HEIGHT);
  ctx.drawImage(myMonster.legs, 0, SECTION_HEIGHT * 2, canvas.width, SECTION_HEIGHT, 0, SECTION_HEIGHT * 2, canvas.width, SECTION_HEIGHT);
  //Reference: drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
}

/**
 * Download the current monster as a PNG.
 */
function download() {
  let userConfirmed = confirm('Download the current monster?');
  if (userConfirmed) {
    const dataURL = canvas.toDataURL();
    const downloadLink = document.createElement('a');
    downloadLink.href = dataURL;
    downloadLink.download = "my_monster.png";
    downloadLink.click();
  }
}

/**
 * Toggle between the monster and gallery view.
 */
function toggleView(view) {
  if (view === "gallery") {
    //Hide the monster canvas and associated UI elements. Show the gallery elements.
    document.getElementById("gallery").style.display = "block";
    document.getElementById("back-button").style.display = "block";
    document.getElementById("canvas").style.display = "none";
    document.getElementById("reload-button").style.display = "none";
    document.getElementById("option-buttons").style.display = "none";
  } else {
    document.getElementById("gallery").style.display = "none";
    document.getElementById("back-button").style.display = "none";
    document.getElementById("canvas").style.display = "block";
    document.getElementById("reload-button").style.display = "block";
    document.getElementById("option-buttons").style.display = "block";
  }
}

/**
 * Generate a gallery of all the monster images.
 */
function generateGallery() {
  let gallery = document.getElementById("gallery");
  for (let i = 0; i < images.length; i++) {
    images[i].onclick = function() {
      drawSpecificMonster(i);
      toggleView("monster");
    }
    gallery.appendChild(images[i]);
  }
}

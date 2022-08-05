const NUMBER_OF_EXAMPLES = 11;
const SECTION_HEIGHT = 250;
let monsterEditor;
let canvas;
let ctx;
let images = [];
let monster = {};
let settings;

/**
 * Initialise the canvas, pre-load the images and display a monster.
 */
function init() {
  //Load application settings (if any).
  settings = JSON.parse(localStorage.getItem("monsters.settings"));
  if (settings == null || settings.deletedExamples == null) {
    settings = {deletedExamples : []};
    localStorage.setItem("monsters.settings", JSON.stringify(settings));
  }

  //When all images have loaded, render a random monster.
  if (images.length == 0) {
    loadImages(function() {
      drawRandomMonster();
    });
  } else {
    drawRandomMonster();
  }

  //Add an event listener to the canvas.
  addMonsterListeners(canvas);
  ctx = canvas.getContext('2d');

  //Generate a gallery of all the monster images. The gallery is hidden until selected.
  generateGallery();

  //Initialise the editor canvas.
  let editorCanvas = document.getElementById('make-canvas');
  monsterEditor = new Editor(editorCanvas);
  addEditorListeners(editorCanvas);
}

/**
 * Pre-load images so they can be rendered on the canvas. A certain number of example
 * images are used and localStorage is used for user generated images.
 */
function loadImages(callback) {
  //First add the example images. (stored on the server)
  let loadedImages = 0;
  for (let i = 0; i < NUMBER_OF_EXAMPLES; i++) {
    //Ignore example images that the user has marked as deleted.
    if (settings.deletedExamples.indexOf("" + i) === -1) {
      const img = createImage(i, `images/monsters/${i}.png`);
      img.onload = function() {
        if(++loadedImages >= (NUMBER_OF_EXAMPLES - settings.deletedExamples.length)) {
          callback();
        }
      };
      images.push(img);
    }
  }

  //Add the images from localStorage (if any).
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (isValidKey(key)) {
      images.push(createImage(key));
    }
  }
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
 * TODO consider adding the body part height and the 'y' co-ord to the monster object rather
 * than specifying it here.
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
  notie.confirm({
    text: 'Download the current monster?',
    submitCallback: function () {
      try {
        const dataURL = canvas.toDataURL();
        const downloadLink = document.createElement('a');
        downloadLink.href = dataURL;
        downloadLink.download = "my_monster.png";
        downloadLink.click();
        notie.alert({ type: "success", position: "bottom", text: "Downloading monster..." });
      } catch(e) {
        console.error(e);
        notie.alert({ type: "error", position: "bottom", text: "Failed to download monster :(" });
      }
    }
  });
}

/**
 * Toggle between the different views (e.g. Monster view, gallery etc.).
 */
function toggleView(view) {
  switch (true) {
    case view === "gallery":
      document.getElementById("gallery").style.display = "block";
      document.getElementById("back-button").style.display = "block";
      document.getElementById("canvas").style.display = "none";
      document.getElementById("create").style.display = "none";
      document.getElementById("reload-button").style.display = "none";
      document.getElementById("option-buttons").style.display = "none";
      break;
    case view === "editor":
      document.getElementById("gallery").style.display = "none";
      document.getElementById("back-button").style.display = "block";
      document.getElementById("canvas").style.display = "none";
      document.getElementById("create").style.display = "block";
      document.getElementById("reload-button").style.display = "none";
      document.getElementById("option-buttons").style.display = "none";
      break;
    default:
      //Display monster view.
      document.getElementById("gallery").style.display = "none";
      document.getElementById("back-button").style.display = "none";
      document.getElementById("canvas").style.display = "block";
      document.getElementById("create").style.display = "none";
      document.getElementById("reload-button").style.display = "block";
      document.getElementById("option-buttons").style.display = "block";
  }
}

/**
 * Generate a gallery of all the monster images.
 */
function generateGallery() {
  document.getElementById("gallery-preview").style.display = "none";

  //Remove any previous images since they may have been deleted.
  let gallery = document.getElementById("gallery-images");
  while (gallery.hasChildNodes()) {
    gallery.removeChild(gallery.firstChild);
  }

  //Add each image.
  for (const image of images) {
    gallery.appendChild(image);
  }
}

/**
 * Display the gallery preview area and configure it for the selected image.
 */
function displayGalleryPreview(img) {
  document.getElementById("gallery-preview").style.display = "block";
  document.getElementById("preview-image").src = img.src;
  document.getElementById("preview-view-button").onclick = function() {
    drawSpecificMonster(images.indexOf(img));
    toggleView('monster');
  };
  document.getElementById("preview-edit-button").onclick = function() {
    editMonster(img.id);
  };
  document.getElementById("preview-delete-button").onclick = function() {
    deleteMonster(img.id);
  };
  scroll(0, 0);
}

/**
 * Add a listener to the main monster canvas. The listener allows the
 * user to load individual monster parts.
 */
function addMonsterListeners(canvas) {
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
  }
}

/**
 * Add mouse and touch event listeners to the Editor canvas.
 */
function addEditorListeners(editorCanvas) {
  ['mouseup', 'mouseout', 'touchend', 'touchcancel'].forEach(function(e) {
    editorCanvas.addEventListener(e, function(event) {
      monsterEditor.setDrawing(false);
    });
  });
  ['mousedown', 'touchstart'].forEach(function(e) {
    editorCanvas.addEventListener(e, function(event) {
      monsterEditor.setDrawing(true);
    });
  });
  ['mousemove', 'touchmove'].forEach(function(e) {
    editorCanvas.addEventListener(e, function(event) {
      //Prevent normal browser processing of the event. e.g. scrolling instead of drawing.
      event.preventDefault();
      monsterEditor.draw(event);
    });
  });
}

/**
 * Save the current monster to localStorage.
 */
function saveMonster() {
  try {
    //Generate a key and save the image.
    const key = "monsters.image." + Date.now();
    const src = monsterEditor.export();
    localStorage.setItem(key, src);
    notie.alert({ type: "success", position: "bottom", text: "Your monster has been successfully saved. You can view it in the gallery." });

    //Add it to the images array and update the gallery.
    images.push(createImage(key, src));
    generateGallery();

  } catch(e) {
    console.error(e);
    notie.alert({ type: "error", position: "bottom", text: "An error occurred while saving the monster." });
  }
}

/**
 * Delete the specified monster from localStorage and from the UI. It's not possible to
 * delete the example images so they need to be handled differently.
 */
function deleteMonster(id) {
  notie.confirm({
    text: 'Are you sure?',
    submitCallback: function() {
      if (isValidKey(id)) {
        localStorage.removeItem(id);
      } else {
        AddToIgnoredExamples(id);
      }
      images.splice(findArrayIndex(id, images), 1);
      generateGallery();
      notie.alert({ type: "success", position: "bottom", text: "Success! The monster decided to go home..." });
    }
  });
}

/**
 * Allow the user to upload an image and add it to the editor canvas.
 */
function uploadMonster() {
  const files = (document.getElementById("monster-upload")).files;
  if (files.length === 0) {
    notie.alert({ type: "warning", position: "bottom", text: "No image selected. Please select an image to upload." });
  } else {
    const file = files[0];
    if (file.type === "image/png" || file.type === "image/jpeg") {
      monsterEditor.import(URL.createObjectURL(file));
      notie.alert({ type: "success", position: "bottom", text: "Monster Uploaded: " + file.name });
    } else {
      notie.alert({ type: "error", position: "bottom", text: "This is an invalid file type (" + file.type + "). Please select an image of type PNG or JPEG." });
    }
  }
}

/**
 * Add the monster with the specified ID to the editor canvas.
 */
function editMonster(id) {
  if (isValidKey(id)) {
    monsterEditor.import(localStorage.getItem(id));
  } else {
    const img = images[findArrayIndex(id, images)];
    monsterEditor.import(img.src);
  }
  toggleView("editor");
}



/*
 * Various helper functions
 */


/**
 * Return a random entry from the supplied array.
 */
 function randomImage(images) {
  let randomNumber = Math.floor((Math.random() * images.length));
  return images[randomNumber];
}

/**
 * Check if the supplied key matches the expected format.
 */
 function isValidKey(key) {
  if (key.indexOf("monsters.image") > -1) {
    return true;
  }
}

/**
 * Given an array and an ID, find the array index that matches that ID.
 */
function findArrayIndex(id, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) {
      return i;
    }
  }
}

/**
 * Create and return a new Image element with the specified id and src.
 */
function createImage(key, src) {
  //If src is null then use the key to retrieve it from localStorage.
  if (src == null) {
    src = localStorage.getItem(key);
  }
  const img = new Image();
  img.id = key;
  img.src = src;
  img.onclick = function() {
    displayGalleryPreview(img);
  }
  return img;
}

/**
 * Since we can't actually delete the example images, we track what ones have been deleted.
 */
 function AddToIgnoredExamples(id) {
  settings.deletedExamples.push(id);
  localStorage.setItem("monsters.settings", JSON.stringify(settings));
}


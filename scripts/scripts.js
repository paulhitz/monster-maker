const NUMBER_OF_IMAGES = 9;
const SECTION_HEIGHT = 250;
let monsterEditor;
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

  //Initialise the editor canvas.
  let editorCanvas = document.getElementById('make-canvas');
  monsterEditor = new Editor(editorCanvas);
  addEditorListeners(editorCanvas);
}

/**
 * Pre-load images so they can be rendered on the canvas.
 * 
 * TODO lots of duplication here. refactor.
 */
function loadImages(callback) {
  //First add the example images. (stored on the server)
  let loadedImages = 0;
  for (let i = 0; i < NUMBER_OF_IMAGES; i++) {
    const img = new Image();
    img.id = i;
    img.src = `images/monsters/${i}.png`;
    img.onload = function() {
      if(++loadedImages >= NUMBER_OF_IMAGES) {
          callback();
      }
    };
    img.onclick = function() {
      displayGalleryPreview(img);
    }
    images[i] = img;
  }

  //Add the images in localStorage (if any).
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (isValidKey(key)) {
      images.push(createImage(key));
      // const img = new Image();
      // img.id = key;
      // img.src = localStorage.getItem(key);
      // img.onclick = function() {
      //   displayGalleryPreview(key);
      // }
      // images.push(img);
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
        console.log(e);
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
      //TODO Rather than all the generateGallery calls everywhere, should we just do it here?
      // if (galleryUpdated) {
      //   //refresh the page
      // }
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
  const index = images.indexOf(img);

  document.getElementById("gallery-preview").style.display = "block";
  document.getElementById("preview-image").src = img.src;
  document.getElementById("preview-view-button").onclick = function() {
    drawSpecificMonster(index);
    toggleView('monster');
  };
  document.getElementById("preview-edit-button").onclick = function() {
    editMonster(img.id);
  };
  document.getElementById("preview-delete-button").onclick = function() {
    deleteMonster(img.id);
  };
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
      event.preventDefault(); //Prevent normal browser processing of the event. e.g. scrolling instead of drawing.
      monsterEditor.draw(event);
    });
  });
}

/**
 * Save the current monster to localStorage.
 * 
 * TODO Consider disabling the save button to avoid multiple clicks.
 */
function saveMonster() {
  try {
    //Generate a key and save the image.
    const key = "monsters.image." + Date.now();
    const src = monsterEditor.export();
    localStorage.setItem(key, src);
    notie.alert({ type: "success", position: "bottom", text: "Your monster has been successfully saved. You can view it in the gallery." });

    //Add it to the images array and the gallery.
    images.push(createImage(key, src));
    generateGallery();
  } catch(e) {
    console.log(e);
    notie.alert({ type: "error", position: "bottom", text: "An error occurred while saving the monster." });
  }
}

/**
 * Delete the specified monster from localStorage and from the UI.
 * 
 * TODO permanently handle deleted example images. Use localStorage? monsters.settings
 */
function deleteMonster(id) {
  notie.confirm({
    text: 'Are you sure?',
    submitCallback: function() {
      localStorage.removeItem(id);
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

//Given an array and an ID, find the array index that matches that ID.
function findArrayIndex(id, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) {
      return i;
    }
  }
}

//
function createImage(key, src) {
  //If src is null then use the key to retrieve from localStorage.
  //if (isValidKey(key)) {
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









/*
TODO
-Integrate with existing monster (main and gallery) functionality. Move away from the default images. Add settings to localstorage. Copy default images to local storage.

-Sort out what to do with the default images. consider options. toggle for them? add to localstorage? delete them? handle them seamlessly behind the scenes (some images from localstorage, some from directory with fake delete)? Handle them seamlessly is the way to go.

-Only refresh gallery when gallery view selected and localStorage modified?

*/

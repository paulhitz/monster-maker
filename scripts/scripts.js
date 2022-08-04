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
  displaySavedMonsters();
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
  let gallery = document.getElementById("gallery");
  for (let i = 0; i < images.length; i++) {
    images[i].onclick = function() {
      // drawSpecificMonster(i);
      // toggleView("monster");
      displayGalleryPreview(i); //TODO need to use localStorage key?
    }
    gallery.appendChild(images[i]);
  }
}

/**
 * Display the gallery preview area and configure it for the selected image.
 * 
 * TODO Need to replace the keys below with valid localStorage keys.
 */
function displayGalleryPreview(id) {
  document.getElementById("gallery-preview").style.display = "block";
  document.getElementById("preview-image").src = images[id].src;
  document.getElementById("preview-view-button").onclick = function() {
    drawSpecificMonster(id);
    toggleView('monster');
  };
  document.getElementById("preview-edit-button").onclick = function() {
    editMonster('monsters.image.1659603629924');
  };
  document.getElementById("preview-delete-button").onclick = function() {
    deleteMonster('test');
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
    localStorage.setItem("monsters.image." + Date.now(), monsterEditor.export());
    notie.alert({ type: "success", position: "bottom", text: "Your monster has been successfully saved. You can view it in the gallery." });
    displaySavedMonsters();
  } catch(e) {
    notie.alert({ type: "error", position: "bottom", text: "An error occurred while saving the monster." });
  }
}

/**
 * Delete the specified monster from localStorage and from the UI.
 */
function deleteMonster(id) {
  notie.confirm({
    text: 'Are you sure?',
    submitCallback: function() {
      localStorage.removeItem(id);
      //TODO also remove it from the javascript array.
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
  monsterEditor.import(localStorage.getItem(id));
  toggleView("editor");
}

/**
 * TODO reconsider this approcah. Combine with gallery view?
 */
function displaySavedMonsters() {
  const savedMonsters = document.getElementById("saved-monsters");

  //Remove the previous entries. TODO cleaner way of doing this?
  while (savedMonsters.hasChildNodes()) {
    savedMonsters.removeChild(savedMonsters.firstChild);
  }

  //
  for (let i = 0; i < localStorage.length; i++) {
    //TODO Extract the timestamp and sort by timestamp?
    //TODO cleanest method of adding to the doc? 
    const key = localStorage.key(i);
    if (isValidKey(key)) {
      const img = new Image();
      img.src = localStorage.getItem(key);
      img.onclick = function() {
        editMonster(key);
      }
      savedMonsters.appendChild(img);
      //TODO innerHTML removes listeners. Re-implement.
      //savedMonsters.innerHTML += "<button class=\"btn btn-danger\" type=\"button\" onclick=\"deleteMonster('" + key + "');\">Delete</button>";
    }
  }
}

/**
 * Check if the supplied key matches the expected format.
 */
function isValidKey(key) {
  if (key.indexOf("monsters.image") > -1) {
    return true;
  }
};
















/*
TODO
-Integrate with existing monster (main and gallery) functionality. Move away from the default images. Add settings to localstorage. Copy default images to local storage.

-Sort out what to do with the default images. consider options. toggle for them? add to localstorage? delete them? handle them seamlessly behind the scenes (some images from localstorage, some from directory with fake delete)? Handle them seamlessly is the way to go.

-Only refresh gallery when gallery view selected and localStorage modified?

*/

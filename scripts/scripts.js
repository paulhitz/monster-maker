/**
 * Display a random image.
 */
function refreshAll() {
    refreshHead();
    refreshTorso();
    refreshLegs();
}
function refreshHead() {
    refresh(document.getElementById('head'));
}
function refreshTorso() {
    refresh(document.getElementById('torso'));
}
function refreshLegs() {
    refresh(document.getElementById('legs'));
}
function refresh(element) {
    const NUMBER_OF_IMAGES = 3;
    if (element !== null) {
        var random = Math.floor((Math.random() * NUMBER_OF_IMAGES) + 1);
        element.src = `images/${element.id}/${random}.png`;
    }
}

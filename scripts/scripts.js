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
    const NUMBER_OF_IMAGES = 9;
    if (element !== null) {
        var random = Math.floor((Math.random() * NUMBER_OF_IMAGES) + 1);
        element.style.backgroundImage = "url('images/monsters/" + random + ".png')";
    }
}

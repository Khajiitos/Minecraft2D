let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

window.minecraft2d.updateCameraOffset = function() {
    const style = document.getElementById('cameraoffsets');

    let pxX = -(window.minecraft2d.player.position.x * 64) + (windowWidth / 2);
    let pxY = 0;
    style.innerHTML = `
    .blockstack, .entity {
        transform: translate(${pxX}px, ${pxY}px);
    }
    `;
};

window.addEventListener('resize', (ev) => {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    window.minecraft2d.updateCameraOffset();
});
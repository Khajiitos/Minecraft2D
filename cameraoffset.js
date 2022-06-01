window.minecraft2d.cameraOffset = {
    x: 0.0,
    y: 0.0
};

window.minecraft2d.updateCameraOffset = function() {
    const style = document.getElementById('cameraoffsets');

    window.minecraft2d.cameraOffset.x = -(window.minecraft2d.player.position.x * 64) + (window.innerWidth / 2);
    window.minecraft2d.cameraOffset.y = 0; // Y offset will be added later
    style.innerHTML = `
    .blockstack, .entity {
        transform: translate(${window.minecraft2d.cameraOffset.x}px, ${window.minecraft2d.cameraOffset.y}px);
    }
    `;
};

window.addEventListener('resize', (ev) => {
    window.minecraft2d.updateCameraOffset();
});
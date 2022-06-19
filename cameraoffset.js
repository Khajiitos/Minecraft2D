minecraft2d.cameraOffset = {
    x: 0.0,
    y: 0.0
};

minecraft2d.updateCameraOffset = function() {
    const style = document.getElementById('cameraoffsets');

    minecraft2d.cameraOffset.x = -(minecraft2d.player.position.x * 64) + (window.innerWidth / 2);
    minecraft2d.cameraOffset.y = Math.max(0, (minecraft2d.player.position.y * 64) - (window.innerHeight / 2))
    style.innerHTML = `
    .blockstack, .entity {
        transform: translate(${minecraft2d.cameraOffset.x}px, ${minecraft2d.cameraOffset.y}px);
    }
    `;
};

minecraft2d.getVisibleStacks = function() {
    let stacks = [];

    for (let pos = -Math.floor(minecraft2d.cameraOffset.x) - 128; pos <= window.innerWidth - minecraft2d.cameraOffset.x + 128; pos += 64) {
        stacks.push(Math.floor(pos / 64.0));
    }

    return stacks;
};

window.addEventListener('resize', (ev) => {
    minecraft2d.updateCameraOffset();
});
let player = new window.minecraft2d.Player;
window.minecraft2d.createEntity(player);
window.minecraft2d.player = player;
window.minecraft2d.player.position.y = 8;
window.minecraft2d.keysPressed = {};
window.minecraft2d.mousePos = {
    x: 0.0,
    y: 0.0
};

window.minecraft2d.isKeyPressed = function(key) {
    return typeof window.minecraft2d.keysPressed[key] === 'undefined' ? false : window.minecraft2d.keysPressed[key] === true;
};

window.addEventListener('keydown', (ev) => {

    if (ev.key === 'x') {
        window.minecraft2d.toggleDebugScreen();
        window.minecraft2d.updateDebugScreen();
    }

    window.minecraft2d.keysPressed[ev.key.toLowerCase()] = true;
});

window.addEventListener('keyup', (ev) => {
    window.minecraft2d.keysPressed[ev.key.toLowerCase()] = false;
});

window.addEventListener('mousemove', (ev) => {
    window.minecraft2d.mousePos = {
        x: ev.clientX,
        y: ev.clientY
    };
});

window.minecraft2d.getGameCursorPosition = function() {
    return {
        x: (window.minecraft2d.mousePos.x - window.minecraft2d.cameraOffset.x) / 64.0,
        y: (window.innerHeight - window.minecraft2d.mousePos.y - window.minecraft2d.cameraOffset.y) / 64.0
    };
};

function tick() {

    window.minecraft2d.handleWorldGeneration();

    if (window.minecraft2d.isKeyPressed('d')) {
        window.minecraft2d.player.position.x += 0.175;
    }
    if (window.minecraft2d.isKeyPressed('a')) {
        window.minecraft2d.player.position.x -= 0.175;
    }
    if (window.minecraft2d.isKeyPressed(' ')) {
        window.minecraft2d.player.position.y += 0.3;
    }
    if (window.minecraft2d.isKeyPressed('f')) {
        let blockUnderFeet = window.minecraft2d.getBlockAt(Math.floor(window.minecraft2d.player.position.x), Math.floor(window.minecraft2d.player.position.y));
        if (blockUnderFeet !== null && blockUnderFeet.blockTypeId !== 0 && blockUnderFeet.blockTypeId !== 4) {
            window.minecraft2d.updateBlock(Math.floor(window.minecraft2d.player.position.x), Math.floor(window.minecraft2d.player.position.y), new window.minecraft2d.Block(0));
        }
    }

    for (let entityElement of window.minecraft2d.entitiesDOM) {
        entityElement.entity.tick();
    }

    window.minecraft2d.updateCameraOffset();
    window.minecraft2d.updateDebugScreen();
}

setInterval(tick, 50);
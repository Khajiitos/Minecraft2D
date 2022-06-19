let player = new minecraft2d.Player;
minecraft2d.createEntity(player);
minecraft2d.player = player;
minecraft2d.player.position.y = 8;
minecraft2d.keysPressed = {};
minecraft2d.leftMousePressed = false;
minecraft2d.rightMousePressed = false;
minecraft2d.mousePos = {
    x: 0.0,
    y: 0.0
};

minecraft2d.isKeyPressed = function(key) {
    return typeof minecraft2d.keysPressed[key] === 'undefined' ? false : minecraft2d.keysPressed[key] === true;
};

window.addEventListener('keydown', (ev) => {

    if (ev.key === 'x') {
        minecraft2d.toggleDebugScreen();
        minecraft2d.updateDebugScreen();
    }

    minecraft2d.keysPressed[ev.key.toLowerCase()] = true;
});

window.addEventListener('keyup', (ev) => {
    minecraft2d.keysPressed[ev.key.toLowerCase()] = false;
});

window.addEventListener('mousemove', (ev) => {
    minecraft2d.mousePos = {
        x: ev.clientX,
        y: ev.clientY
    };
});

window.addEventListener('mousedown', (ev) => {
    if (ev.button === 0) { // LMB
        minecraft2d.leftMousePressed = true;
    } else if (ev.button === 2) { // RMB
        minecraft2d.rightMousePressed = true;
    }
});

window.addEventListener('mouseup', (ev) => {
    if (ev.button === 0) { // LMB
        minecraft2d.leftMousePressed = false;
    } else if (ev.button === 2) { // RMB
        minecraft2d.rightMousePressed = false;
    }
});

window.addEventListener('contextmenu', (ev) => ev.preventDefault());

minecraft2d.getGameCursorPosition = function() {
    return {
        x: (minecraft2d.mousePos.x - minecraft2d.cameraOffset.x) / 64.0,
        y: (window.innerHeight - minecraft2d.mousePos.y + minecraft2d.cameraOffset.y) / 64.0
    };
};

function tick() {

    for (let entityElement of minecraft2d.entities) {
        entityElement.tick();
    }

    minecraft2d.handleDayNightCycle();
    minecraft2d.updateCameraOffset();
    minecraft2d.handleWorldGeneration();
    minecraft2d.updateDebugScreen();
}

tick();
setInterval(tick, 50);
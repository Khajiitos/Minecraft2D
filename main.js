let player = new window.minecraft2d.Player;
window.minecraft2d.createEntity(player);
window.minecraft2d.player = player;
window.minecraft2d.player.position.y = 8;
window.minecraft2d.keysPressed = {};
window.minecraft2d.leftMousePressed = false;
window.minecraft2d.rightMousePressed = false;
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

window.addEventListener('mousedown', (ev) => {
    if (ev.button === 0) { // LMB
        window.minecraft2d.leftMousePressed = true;
    } else if (ev.button === 2) { // RMB
        window.minecraft2d.rightMousePressed = true;
    }
});

window.addEventListener('mouseup', (ev) => {
    if (ev.button === 0) { // LMB
        window.minecraft2d.leftMousePressed = false;
    } else if (ev.button === 2) { // RMB
        window.minecraft2d.rightMousePressed = false;
    }
});

window.addEventListener('contextmenu', (ev) => ev.preventDefault());

window.minecraft2d.getGameCursorPosition = function() {
    return {
        x: (window.minecraft2d.mousePos.x - window.minecraft2d.cameraOffset.x) / 64.0,
        y: (window.innerHeight - window.minecraft2d.mousePos.y - window.minecraft2d.cameraOffset.y) / 64.0
    };
};

function tick() {

    for (let entityElement of window.minecraft2d.entitiesDOM) {
        entityElement.entity.tick();
    }

    window.minecraft2d.handleDayNightCycle();
    window.minecraft2d.updateCameraOffset();
    window.minecraft2d.handleWorldGeneration();
    window.minecraft2d.updateDebugScreen();
}

tick();
setInterval(tick, 50);
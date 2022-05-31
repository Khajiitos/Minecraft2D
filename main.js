for (let i = 0; i < 64; i++) {
    window.minecraft2d.updateBlock(i, 0, new window.minecraft2d.Block(4));
    window.minecraft2d.updateBlock(i, 1, new window.minecraft2d.Block(2));
    window.minecraft2d.updateBlock(i, 2, new window.minecraft2d.Block(2));
    window.minecraft2d.updateBlock(i, 3, new window.minecraft2d.Block(2));
    window.minecraft2d.updateBlock(i, 4, new window.minecraft2d.Block(1));
}

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

function tick() {
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
}

setInterval(tick, 50);
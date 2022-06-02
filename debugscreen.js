window.minecraft2d.debugScreenEnabled = false;

window.minecraft2d.toggleDebugScreen = function() {
    window.minecraft2d.debugScreenEnabled = !window.minecraft2d.debugScreenEnabled;
    document.getElementById('debugscreen').style.display = window.minecraft2d.debugScreenEnabled ? 'block' : 'none';
};

window.minecraft2d.updateDebugScreen = function() {
    if (!window.minecraft2d.debugScreenEnabled) return;
    document.getElementById('debugposition').innerText = `XY: ${window.minecraft2d.player.position.x.toFixed(3)} / ${window.minecraft2d.player.position.y.toFixed(3)}`;
    document.getElementById('debugrotation').innerText = `Rotation: ${window.minecraft2d.player.rotation.toFixed(2)}`;
    document.getElementById('debugcursorposition').innerText = `Cursor XY: ${window.minecraft2d.getGameCursorPosition().x.toFixed(2)} / ${window.minecraft2d.getGameCursorPosition().y.toFixed(2)}`;
};
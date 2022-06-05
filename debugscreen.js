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
    let hour = (Math.floor(window.minecraft2d.gameTime / 1000) % 24).toString();
    if (hour.length === 1) hour = '0' + hour;
    let minute = Math.floor((window.minecraft2d.gameTime % 1000) / (1000 / 60)).toString();
    if (minute.length === 1) minute = '0' + minute;
    let day = 1 + Math.floor(window.minecraft2d.gameTime / 24000);
    document.getElementById('debuggametime').innerText = `Game time: ${hour}:${minute} (Day ${day})`;
};
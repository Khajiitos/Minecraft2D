minecraft2d.debugScreenEnabled = false;

minecraft2d.toggleDebugScreen = function() {
    minecraft2d.debugScreenEnabled = !minecraft2d.debugScreenEnabled;
    document.getElementById('debugscreen').style.display = minecraft2d.debugScreenEnabled ? 'block' : 'none';
};

minecraft2d.updateDebugScreen = function() {
    if (!minecraft2d.debugScreenEnabled) return;
    document.getElementById('debugposition').innerText = `XY: ${minecraft2d.player.position.x.toFixed(3)} / ${minecraft2d.player.position.y.toFixed(3)}`;
    document.getElementById('debugrotation').innerText = `Rotation: ${minecraft2d.player.rotation.toFixed(2)}`;
    document.getElementById('debugcursorposition').innerText = `Cursor XY: ${minecraft2d.getGameCursorPosition().x.toFixed(2)} / ${minecraft2d.getGameCursorPosition().y.toFixed(2)}`;
    let hour = (Math.floor(minecraft2d.gameTime / 1000) % 24).toString();
    if (hour.length === 1) hour = '0' + hour;
    let minute = Math.floor((minecraft2d.gameTime % 1000) / (1000 / 60)).toString();
    if (minute.length === 1) minute = '0' + minute;
    let day = 1 + Math.floor(minecraft2d.gameTime / 24000);
    document.getElementById('debuggametime').innerText = `Game time: ${hour}:${minute} (Day ${day})`;
    document.getElementById('debugticksinair').innerText = `Ticks in air: ${minecraft2d.player.ticksInAir}`;
};
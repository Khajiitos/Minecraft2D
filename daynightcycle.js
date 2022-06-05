window.minecraft2d.gameTime = 6000; // 06:00

function mergeRGB(rgb1, rgb2, progress) {
    return {
        r: Math.floor(rgb1.r + ((rgb2.r - rgb1.r) * progress)),
        g: Math.floor(rgb1.g + ((rgb2.g - rgb1.g) * progress)),
        b: Math.floor(rgb1.b + ((rgb2.b - rgb1.b) * progress)),
    };
}

function progress(start, goal, current) {
    return (start - current) / (start - goal);
}

window.minecraft2d.setBlockEntityBrightness = function(brightness) {
    const style = document.getElementById('lightcorrections');
    style.innerHTML = `
    .block, .entity {
        filter: brightness(${brightness});
    }
    `;
}

window.minecraft2d.handleDayNightCycle = function() {
    window.minecraft2d.gameTime++;
    const timeOfDay = window.minecraft2d.gameTime % 24000;

    let rgb = {};
    let brightness = 1.0;
    
    if (timeOfDay >= 21000) {
        rgb = {r: 8, g: 8, b: 35};
        brightness = 0.25;
    } else if (timeOfDay >= 18500) { // 18:30 
        rgb = mergeRGB({r: 100, g: 149, b: 237}, {r: 8, g: 8, b: 35}, progress(18500, 21000, timeOfDay));
        brightness = 1.0 - (progress(18500, 21000, timeOfDay) * 0.75);
    } else if (timeOfDay >= 6500) { // 06:30
        rgb = {r: 100, g: 149, b: 237};
    } else if (timeOfDay >= 4000) { // 04:00
        rgb = mergeRGB({r: 8, g: 8, b: 35}, {r: 100, g: 149, b: 237}, progress(4000, 6500, timeOfDay));
        brightness = 0.25 + (progress(4000, 6500, timeOfDay) * 0.75);
    } else {
        rgb = {r: 8, g: 8, b: 35};
        brightness = 0.25;
    }
    document.body.style.backgroundColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    window.minecraft2d.setBlockEntityBrightness(brightness);
};
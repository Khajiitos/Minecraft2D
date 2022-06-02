window.minecraft2d.selectedHotbarItem = 0;

window.minecraft2d.updateHotbarSelectionOnDOM = function() {
    for (let i = 0; i < 9; i++) {
        let item = document.getElementById(`hotbaritem${i}`);
        if (i === window.minecraft2d.selectedHotbarItem) {
            item.classList.add('hotbaritemselected');
        } else {
            item.classList.remove('hotbaritemselected');
        }
    }
};

window.addEventListener('wheel', (ev) => {
    if (ev.wheelDelta < 0) {
        window.minecraft2d.selectedHotbarItem = (window.minecraft2d.selectedHotbarItem + 1) % 9;
    }
    else if (ev.wheelDelta > 0) {
        window.minecraft2d.selectedHotbarItem = window.minecraft2d.selectedHotbarItem - 1;
        if (window.minecraft2d.selectedHotbarItem < 0) {
            window.minecraft2d.selectedHotbarItem = 8;
        }
    }
    window.minecraft2d.updateHotbarSelectionOnDOM();
});

window.addEventListener('keydown', (ev) => {
    switch(ev.key) {
        case '1': window.minecraft2d.selectedHotbarItem = 0; break;
        case '2': window.minecraft2d.selectedHotbarItem = 1; break;
        case '3': window.minecraft2d.selectedHotbarItem = 2; break;
        case '4': window.minecraft2d.selectedHotbarItem = 3; break;
        case '5': window.minecraft2d.selectedHotbarItem = 4; break;
        case '6': window.minecraft2d.selectedHotbarItem = 5; break;
        case '7': window.minecraft2d.selectedHotbarItem = 6; break;
        case '8': window.minecraft2d.selectedHotbarItem = 7; break;
        case '9': window.minecraft2d.selectedHotbarItem = 8; break;
    }
    window.minecraft2d.updateHotbarSelectionOnDOM();
});
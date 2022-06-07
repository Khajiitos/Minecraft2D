window.minecraft2d.inventory = [];
window.minecraft2d.inventoryOpen = false;

window.minecraft2d.toggleInventory = function() {
    window.minecraft2d.inventoryOpen = !window.minecraft2d.inventoryOpen;
    document.getElementById('inventory').style.display = window.minecraft2d.inventoryOpen ? 'block' : 'none';
}

window.addEventListener('keydown', (ev) => {
    if (ev.key.toLowerCase() === 'e') {
        window.minecraft2d.toggleInventory();
    }
})
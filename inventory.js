window.minecraft2d.inventory = new Array(36).fill(null);
window.minecraft2d.inventoryOpen = false;

window.minecraft2d.toggleInventory = function() {
    window.minecraft2d.inventoryOpen = !window.minecraft2d.inventoryOpen;
    document.getElementById('inventory').style.display = window.minecraft2d.inventoryOpen ? 'block' : 'none';
}

window.minecraft2d.updateInventory = function() {
    for (let i = 0; i < 36; i++) {
        const element = document.getElementById(`inventoryitem${i}`);
        const hotbarElement = i < 9 ? document.getElementById(`hotbaritem${i}`) : null;

        if (!element) {
            console.error('Inventory gone :(');
            return;
        }
        element.innerHTML = '';

        if (hotbarElement) {
            hotbarElement.innerHTML = '';
        }

        const inventoryItem = window.minecraft2d.inventory[i];
        if (inventoryItem !== null) {
            let imgElement = document.createElement('img');
            imgElement.classList.add(inventoryItem instanceof BlockItemStack ? 'blockiteminslot' : 'iteminslot');
            imgElement.src = inventoryItem.getFullTexture();
            let itemCountElement = document.createElement('p');
            itemCountElement.classList.add('itemcount');
            itemCountElement.innerText = inventoryItem.count === 1 ? '' : inventoryItem.count;
            element.appendChild(imgElement);
            element.appendChild(itemCountElement);
            if (hotbarElement) {
                hotbarElement.appendChild(imgElement);
                hotbarElement.appendChild(itemCountElement);
            }
        }
    }
}

window.minecraft2d.areSameType = function(itemStack1, itemStack2) {
    if (itemStack1 instanceof BlockItemStack && itemStack2 instanceof BlockItemStack) {
        return itemStack1.blockTypeId === itemStack2.blockTypeId;
    } else if (!(itemStack1 instanceof BlockItemStack) && !(itemStack2 instanceof BlockItemStack)) {
        return itemStack1.itemTypeId === itemStack2.itemTypeId;
    } else {
        return false;
    }
}

window.minecraft2d.addItem = function(itemStack) {
    let count = itemStack.count;
    let firstNullElement = null;
    for (let i = 0; i < 36; i++) {
        const inventoryItem = window.minecraft2d.inventory[i];
        if (!inventoryItem) {
            if (firstNullElement === null) firstNullElement = i;
            continue;
        }
        if (count > 0) {
            if (window.minecraft2d.areSameType(inventoryItem, itemStack)) {
                const maxMore = inventoryItem.getMaxCount() - inventoryItem.count;
                const transferAmount = Math.min(maxMore, count);
                count -= transferAmount;
                inventoryItem.count += transferAmount;
            }
        } else {
            window.minecraft2d.updateInventory();
            return true;
        }
    }
    if (count > 0 && firstNullElement !== null) {
        window.minecraft2d.inventory[firstNullElement] = itemStack;
        window.minecraft2d.updateInventory();
        return true;
    }
    window.minecraft2d.updateInventory();
    return false;
};

window.addEventListener('keydown', (ev) => {
    if (ev.key.toLowerCase() === 'e') {
        window.minecraft2d.toggleInventory();
        window.minecraft2d.updateInventory();
    }
})
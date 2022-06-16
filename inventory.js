window.minecraft2d.inventory = new Array(36).fill(null);
window.minecraft2d.inventoryOpen = false;
window.minecraft2d.itemStackOnCursor = null;

window.minecraft2d.toggleInventory = function() {
    window.minecraft2d.hideInventoryTooltip();
    window.minecraft2d.inventoryOpen = !window.minecraft2d.inventoryOpen;
    document.getElementById('inventory').style.display = window.minecraft2d.inventoryOpen ? 'flex' : 'none';
}

window.minecraft2d.showInventoryTooltip = function(toolTip) {
    const element = document.getElementById('inventorytooltip');
    element.style.display = 'block';
    element.innerText = toolTip;
    window.minecraft2d.updateInventoryTooltipPosition(window.minecraft2d.mousePos.x, window.minecraft2d.mousePos.y);
};

window.minecraft2d.hideInventoryTooltip = function() {
    const element = document.getElementById('inventorytooltip');
    element.style.display = 'none';
    element.innerText = '';
}

window.minecraft2d.updateInventoryTooltipPosition = function(x ,y) {
    const element = document.getElementById('inventorytooltip');
    element.style.left = x + 3 + 'px';
    element.style.top = y + 3 + 'px';
}

window.minecraft2d.showItemOnCursor = function(itemStack) {
    const element = document.getElementById('inventoryitemoncursor');
    element.style.display = 'block';
    element.innerText = '';

    let imgElement = document.createElement('img');
    imgElement.classList.add(itemStack instanceof BlockItemStack ? 'blockiteminslot' : 'iteminslot');
    imgElement.src = itemStack.getFullTexture();

    let itemCountElement = document.createElement('p');
    itemCountElement.classList.add('itemcount');
    itemCountElement.innerText = itemStack.count === 1 ? '' : itemStack.count;
    element.appendChild(imgElement);
    element.appendChild(itemCountElement);

    window.minecraft2d.updateItemOnCursorPosition(window.minecraft2d.mousePos.x, window.minecraft2d.mousePos.y);
}

window.minecraft2d.hideItemOnCursor = function() {
    const element = document.getElementById('inventoryitemoncursor');
    element.style.display = 'none';
    element.innerHTML = '';
}

window.minecraft2d.updateItemOnCursorPosition = function(x, y) {
    const element = document.getElementById('inventoryitemoncursor');
    element.style.left = x + 3 + 'px';
    element.style.top = y + 3 + 'px';
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

            imgElement.addEventListener('mouseover', (ev) => {
                window.minecraft2d.showInventoryTooltip(inventoryItem.getName());
                window.minecraft2d.updateInventoryTooltipPosition(ev.x, ev.y);
            });

            imgElement.addEventListener('mouseout', (ev) => {
                window.minecraft2d.hideInventoryTooltip();
            });

            imgElement.addEventListener('mousemove', (ev) => {
                window.minecraft2d.updateInventoryTooltipPosition(ev.x, ev.y);
            });

            let itemCountElement = document.createElement('p');
            itemCountElement.classList.add('itemcount');
            itemCountElement.innerText = inventoryItem.count === 1 ? '' : inventoryItem.count;
            element.appendChild(imgElement);
            element.appendChild(itemCountElement);
            
            if (hotbarElement) {
                hotbarElement.appendChild(imgElement.cloneNode(true));
                hotbarElement.appendChild(itemCountElement.cloneNode(true));
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
        if (window.minecraft2d.itemStackOnCursor !== null) {
            window.minecraft2d.addItem(window.minecraft2d.itemStackOnCursor);
            window.minecraft2d.itemStackOnCursor = null;
        }
        window.minecraft2d.toggleInventory();
        window.minecraft2d.updateInventory();
        window.minecraft2d.hideItemOnCursor();
    }
});

window.addEventListener('mousemove', (ev) => {
    if (window.minecraft2d.itemStackOnCursor !== null) {
        window.minecraft2d.updateItemOnCursorPosition(ev.x, ev.y);
    }
})

window.addEventListener('load', (ev) => {
    for (let i = 0; i < 36; i++) {
        const element = document.getElementById(`inventoryitem${i}`);

        element.addEventListener('click', (ev) => {
            const tmp = window.minecraft2d.itemStackOnCursor;
            window.minecraft2d.itemStackOnCursor = window.minecraft2d.inventory[i];
            window.minecraft2d.inventory[i] = tmp;
            if (window.minecraft2d.itemStackOnCursor !== null) {
                window.minecraft2d.showItemOnCursor(window.minecraft2d.itemStackOnCursor);
            } else {
                window.minecraft2d.hideItemOnCursor();
            }
            window.minecraft2d.updateInventory();
            window.minecraft2d.hideInventoryTooltip();
        });
    }
})
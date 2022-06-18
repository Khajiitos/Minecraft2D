window.minecraft2d.inventory = new Array(36).fill(null);
window.minecraft2d.craftingInventory = new Array(4).fill(null);
window.minecraft2d.inventoryOpen = false;
window.minecraft2d.itemStackOnCursor = null;
window.minecraft2d.craftResultItemStack = null;

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

window.minecraft2d.updateInventorySlot = function(slotElement, itemStack, withEvents = true) {
    slotElement.innerHTML = '';

    if (itemStack !== null) {
        let imgElement = document.createElement('img');
        imgElement.classList.add(itemStack instanceof BlockItemStack ? 'blockiteminslot' : 'iteminslot');
        imgElement.src = itemStack.getFullTexture();

        if (withEvents) {
            imgElement.addEventListener('mouseover', (ev) => {
                if (window.minecraft2d.itemStackOnCursor === null) {
                    window.minecraft2d.showInventoryTooltip(itemStack.getName());
                    window.minecraft2d.updateInventoryTooltipPosition(ev.x, ev.y);
                }
            });

            imgElement.addEventListener('mouseout', (ev) => {
                window.minecraft2d.hideInventoryTooltip();
            });

            imgElement.addEventListener('mousemove', (ev) => {
                window.minecraft2d.updateInventoryTooltipPosition(ev.x, ev.y);
            });
        }

        let itemCountElement = document.createElement('p');
        itemCountElement.classList.add('itemcount');
        itemCountElement.innerText = itemStack.count === 1 ? '' : itemStack.count;
        slotElement.appendChild(imgElement);
        slotElement.appendChild(itemCountElement);
    }
}

window.minecraft2d.updateInventory = function() {
    for (let i = 0; i < 36; i++) {
        const element = document.getElementById(`inventoryitem${i}`);
        const hotbarElement = i < 9 ? document.getElementById(`hotbaritem${i}`) : null;

        if (!element) {
            console.error('Inventory gone :(');
            return;
        }

        window.minecraft2d.updateInventorySlot(element, window.minecraft2d.inventory[i]);

        if (hotbarElement) {
            window.minecraft2d.updateInventorySlot(hotbarElement, window.minecraft2d.inventory[i], false);
        }
    }
};

window.minecraft2d.updateCraftingInventory = function() {
    for (let i = 0; i < 4; i++) {
        const element = document.getElementById(`inventorycraftingitem${i}`);
        window.minecraft2d.updateInventorySlot(element, window.minecraft2d.craftingInventory[i]);
    }
    window.minecraft2d.craftResultItemStack = window.minecraft2d.getCraft(window.minecraft2d.craftingInventory);
    window.minecraft2d.updateInventorySlot(document.getElementById('inventorycraftingresult'), window.minecraft2d.craftResultItemStack);
};

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
        for (let i = 0; i < 4; i++) {
            if (window.minecraft2d.craftingInventory[i] !== null) {
                window.minecraft2d.addItem(window.minecraft2d.craftingInventory[i]);
                window.minecraft2d.craftingInventory[i] = null;
            }
            window.minecraft2d.updateCraftingInventory();
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

    for (let i = 0; i < 4; i++) {
        const element = document.getElementById(`inventorycraftingitem${i}`);

        element.addEventListener('click', (ev) => {
            const tmp = window.minecraft2d.itemStackOnCursor;
            window.minecraft2d.itemStackOnCursor = window.minecraft2d.craftingInventory[i];
            window.minecraft2d.craftingInventory[i] = tmp;
            if (window.minecraft2d.itemStackOnCursor !== null) {
                window.minecraft2d.showItemOnCursor(window.minecraft2d.itemStackOnCursor);
            } else {
                window.minecraft2d.hideItemOnCursor();
            }
            window.minecraft2d.updateCraftingInventory();
            window.minecraft2d.hideInventoryTooltip();
        });
    }

    document.getElementById('inventorycraftingresult').addEventListener('click', (ev) => {
        if (window.minecraft2d.craftResultItemStack === null) {
            return;
        }
        if (window.minecraft2d.itemStackOnCursor !== null && (!window.minecraft2d.areSameType(window.minecraft2d.itemStackOnCursor, window.minecraft2d.craftResultItemStack) || window.minecraft2d.itemStackOnCursor.count + window.minecraft2d.craftResultItemStack.count > window.minecraft2d.itemStackOnCursor.getMaxCount())) {
            return;
        }
        
        if (window.minecraft2d.itemStackOnCursor === null) {
            window.minecraft2d.itemStackOnCursor = window.minecraft2d.craftResultItemStack;
        } else {
            window.minecraft2d.itemStackOnCursor.count += window.minecraft2d.craftResultItemStack.count;
        }

        for (let i = 0; i < window.minecraft2d.craftingInventory.length; i++) {
            if (window.minecraft2d.craftingInventory[i] !== null) {
                window.minecraft2d.craftingInventory[i].count--;
                if (window.minecraft2d.craftingInventory[i].count <= 0) {
                    window.minecraft2d.craftingInventory[i] = null;
                }
            }
        }

        window.minecraft2d.showItemOnCursor(window.minecraft2d.itemStackOnCursor);
        window.minecraft2d.updateCraftingInventory();
        window.minecraft2d.hideInventoryTooltip();
    });
})
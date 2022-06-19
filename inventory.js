minecraft2d.inventory = new Array(36).fill(null);
minecraft2d.craftingInventory = new Array(4).fill(null);
minecraft2d.inventoryOpen = false;
minecraft2d.itemStackOnCursor = null;
minecraft2d.craftResultItemStack = null;

minecraft2d.toggleInventory = function() {
    minecraft2d.hideInventoryTooltip();
    minecraft2d.inventoryOpen = !minecraft2d.inventoryOpen;
    document.getElementById('inventory').style.display = minecraft2d.inventoryOpen ? 'flex' : 'none';
}

minecraft2d.showInventoryTooltip = function(toolTip) {
    const element = document.getElementById('inventorytooltip');
    element.style.display = 'block';
    element.innerText = toolTip;
    minecraft2d.updateInventoryTooltipPosition(minecraft2d.mousePos.x, minecraft2d.mousePos.y);
};

minecraft2d.hideInventoryTooltip = function() {
    const element = document.getElementById('inventorytooltip');
    element.style.display = 'none';
    element.innerText = '';
}

minecraft2d.updateInventoryTooltipPosition = function(x ,y) {
    const element = document.getElementById('inventorytooltip');
    element.style.left = x + 3 + 'px';
    element.style.top = y + 3 + 'px';
}

minecraft2d.showItemOnCursor = function(itemStack) {
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

    minecraft2d.updateItemOnCursorPosition(minecraft2d.mousePos.x, minecraft2d.mousePos.y);
}

minecraft2d.hideItemOnCursor = function() {
    const element = document.getElementById('inventoryitemoncursor');
    element.style.display = 'none';
    element.innerHTML = '';
}

minecraft2d.updateItemOnCursorPosition = function(x, y) {
    const element = document.getElementById('inventoryitemoncursor');
    element.style.left = x + 3 + 'px';
    element.style.top = y + 3 + 'px';
}

minecraft2d.updateInventorySlot = function(slotElement, itemStack, withEvents = true) {
    slotElement.innerHTML = '';

    if (itemStack !== null) {
        let imgElement = document.createElement('img');
        imgElement.classList.add(itemStack instanceof BlockItemStack ? 'blockiteminslot' : 'iteminslot');
        imgElement.src = itemStack.getFullTexture();

        if (withEvents) {
            imgElement.addEventListener('mouseover', (ev) => {
                if (minecraft2d.itemStackOnCursor === null) {
                    minecraft2d.showInventoryTooltip(itemStack.getName());
                    minecraft2d.updateInventoryTooltipPosition(ev.x, ev.y);
                }
            });

            imgElement.addEventListener('mouseout', (ev) => {
                minecraft2d.hideInventoryTooltip();
            });

            imgElement.addEventListener('mousemove', (ev) => {
                minecraft2d.updateInventoryTooltipPosition(ev.x, ev.y);
            });
        }

        let itemCountElement = document.createElement('p');
        itemCountElement.classList.add('itemcount');
        itemCountElement.innerText = itemStack.count === 1 ? '' : itemStack.count;
        slotElement.appendChild(imgElement);
        slotElement.appendChild(itemCountElement);
    }
}

minecraft2d.updateInventory = function() {
    for (let i = 0; i < 36; i++) {
        const element = document.getElementById(`inventoryitem${i}`);
        const hotbarElement = i < 9 ? document.getElementById(`hotbaritem${i}`) : null;

        if (!element) {
            console.error('Inventory gone :(');
            return;
        }

        minecraft2d.updateInventorySlot(element, minecraft2d.inventory[i]);

        if (hotbarElement) {
            minecraft2d.updateInventorySlot(hotbarElement, minecraft2d.inventory[i], false);
        }
    }
};

minecraft2d.updateCraftingInventory = function() {
    for (let i = 0; i < 4; i++) {
        const element = document.getElementById(`inventorycraftingitem${i}`);
        minecraft2d.updateInventorySlot(element, minecraft2d.craftingInventory[i]);
    }
    minecraft2d.craftResultItemStack = minecraft2d.getCraft(minecraft2d.craftingInventory);
    minecraft2d.updateInventorySlot(document.getElementById('inventorycraftingresult'), minecraft2d.craftResultItemStack);
};

minecraft2d.areSameType = function(itemStack1, itemStack2) {
    if (itemStack1 instanceof BlockItemStack && itemStack2 instanceof BlockItemStack) {
        return itemStack1.blockTypeId === itemStack2.blockTypeId;
    } else if (!(itemStack1 instanceof BlockItemStack) && !(itemStack2 instanceof BlockItemStack)) {
        return itemStack1.itemTypeId === itemStack2.itemTypeId;
    } else {
        return false;
    }
}

minecraft2d.addItem = function(itemStack) {
    let count = itemStack.count;
    let firstNullElement = null;
    for (let i = 0; i < 36; i++) {
        const inventoryItem = minecraft2d.inventory[i];
        if (!inventoryItem) {
            if (firstNullElement === null) firstNullElement = i;
            continue;
        }
        if (count > 0) {
            if (minecraft2d.areSameType(inventoryItem, itemStack)) {
                const maxMore = inventoryItem.getMaxCount() - inventoryItem.count;
                const transferAmount = Math.min(maxMore, count);
                count -= transferAmount;
                inventoryItem.count += transferAmount;
            }
        } else {
            minecraft2d.updateInventory();
            return true;
        }
    }
    if (count > 0 && firstNullElement !== null) {
        minecraft2d.inventory[firstNullElement] = itemStack;
        minecraft2d.updateInventory();
        return true;
    }
    minecraft2d.updateInventory();
    return false;
};

window.addEventListener('keydown', (ev) => {
    if (ev.key.toLowerCase() === 'e') {
        if (minecraft2d.itemStackOnCursor !== null) {
            minecraft2d.addItem(minecraft2d.itemStackOnCursor);
            minecraft2d.itemStackOnCursor = null;
        }
        for (let i = 0; i < 4; i++) {
            if (minecraft2d.craftingInventory[i] !== null) {
                minecraft2d.addItem(minecraft2d.craftingInventory[i]);
                minecraft2d.craftingInventory[i] = null;
            }
            minecraft2d.updateCraftingInventory();
        }
        minecraft2d.toggleInventory();
        minecraft2d.updateInventory();
        minecraft2d.hideItemOnCursor();
    }
});

window.addEventListener('mousemove', (ev) => {
    if (minecraft2d.itemStackOnCursor !== null) {
        minecraft2d.updateItemOnCursorPosition(ev.x, ev.y);
    }
})

window.addEventListener('load', (ev) => {
    for (let i = 0; i < 36; i++) {
        const element = document.getElementById(`inventoryitem${i}`);

        element.addEventListener('click', (ev) => {
            const tmp = minecraft2d.itemStackOnCursor;
            minecraft2d.itemStackOnCursor = minecraft2d.inventory[i];
            minecraft2d.inventory[i] = tmp;
            if (minecraft2d.itemStackOnCursor !== null) {
                minecraft2d.showItemOnCursor(minecraft2d.itemStackOnCursor);
            } else {
                minecraft2d.hideItemOnCursor();
            }
            minecraft2d.updateInventory();
            minecraft2d.hideInventoryTooltip();
        });
    }

    for (let i = 0; i < 4; i++) {
        const element = document.getElementById(`inventorycraftingitem${i}`);

        element.addEventListener('click', (ev) => {
            const tmp = minecraft2d.itemStackOnCursor;
            minecraft2d.itemStackOnCursor = minecraft2d.craftingInventory[i];
            minecraft2d.craftingInventory[i] = tmp;
            if (minecraft2d.itemStackOnCursor !== null) {
                minecraft2d.showItemOnCursor(minecraft2d.itemStackOnCursor);
            } else {
                minecraft2d.hideItemOnCursor();
            }
            minecraft2d.updateCraftingInventory();
            minecraft2d.hideInventoryTooltip();
        });
    }

    document.getElementById('inventorycraftingresult').addEventListener('click', (ev) => {
        if (minecraft2d.craftResultItemStack === null) {
            return;
        }
        if (minecraft2d.itemStackOnCursor !== null && (!minecraft2d.areSameType(minecraft2d.itemStackOnCursor, minecraft2d.craftResultItemStack) || minecraft2d.itemStackOnCursor.count + minecraft2d.craftResultItemStack.count > minecraft2d.itemStackOnCursor.getMaxCount())) {
            return;
        }
        
        if (minecraft2d.itemStackOnCursor === null) {
            minecraft2d.itemStackOnCursor = minecraft2d.craftResultItemStack;
        } else {
            minecraft2d.itemStackOnCursor.count += minecraft2d.craftResultItemStack.count;
        }

        for (let i = 0; i < minecraft2d.craftingInventory.length; i++) {
            if (minecraft2d.craftingInventory[i] !== null) {
                minecraft2d.craftingInventory[i].count--;
                if (minecraft2d.craftingInventory[i].count <= 0) {
                    minecraft2d.craftingInventory[i] = null;
                }
            }
        }

        minecraft2d.showItemOnCursor(minecraft2d.itemStackOnCursor);
        minecraft2d.updateCraftingInventory();
        minecraft2d.hideInventoryTooltip();
    });
})
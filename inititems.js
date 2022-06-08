let itemTypeIds = 0;

class ItemType {
    name = '';
    texture = '';
    maxCount = 64;
    id = -1;

    constructor(name, texture, maxCount) {
        this.name = name;
        this.texture = texture;
        this.maxCount = maxCount;
        this.id = itemTypeIds++;
    }
}

class BlockItem extends ItemType {
    constructor() {
        super('Block', '', 64);
    }
}

class ToolItem extends ItemType {
    toolType = '';
    constructor(name, texture, toolType) {
        super(name, texture, 1);
        this.toolType = toolType;
    }
}

class ItemStack {
    itemTypeId = -1;
    count = 1;

    constructor(itemType, count) {
        this.itemTypeId = itemType.id;
        this.count = count;
    }

    getItemType() {
        return window.minecraft2d.itemTypes[this.itemTypeId];
    }

    getTexture() {
        return this.getItemType().texture;
    }

    getFullTexture() {
        return 'assets/items/' + this.getTexture();
    }

    getMaxCount() {
        return window.minecraft2d.itemTypes[this.itemTypeId].maxCount;
    }
}

class BlockItemStack extends ItemStack {
    blockTypeId = -1;

    constructor(blockType, count) {
        super(0, count);
        this.blockTypeId = blockType.id;
    }

    getBlockType() {
        return window.minecraft2d.blockTypes[this.blockTypeId];
    }

    getTexture() {
        return this.getBlockType().texture;
    }

    getFullTexture() {
        return 'assets/blocks/' + this.getTexture();
    }

    getMaxCount() {
        return window.minecraft2d.itemTypes[0].maxCount;
    }
}

window.minecraft2d.ItemType = ItemType;
window.minecraft2d.BlockItem = BlockItem;
window.minecraft2d.ItemStack = ItemStack;
window.minecraft2d.BlockItemStack = BlockItemStack;

window.minecraft2d.itemTypes = [
    new BlockItem(),
    new ItemType('Stick', 'stick.png', 64),
    new ToolItem('Wooden pickaxe', 'wooden_pickaxe.png', 64),
]
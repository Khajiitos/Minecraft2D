let blockTypeIds = 0;

class BlockType {
    name = "";
    texture = ""
    id = 0;

    constructor(name, texture) {
        this.id = blockTypeIds++;
        this.name = name;
        this.texture = texture;
    }

    createItemStack() {
        return new window.minecraft2d.BlockItemStack(this, 1);
    }
}

class Block {
    blockTypeId = 0;
    domElement = null;
    x = null;
    y = null;

    constructor(blockTypeId) {
        this.blockTypeId = blockTypeId;
    }

    createItemStack() {
        return window.minecraft2d.blockTypes[this.blockTypeId].createItemStack();
    }
}

window.minecraft2d.BlockType = BlockType;
window.minecraft2d.Block = Block;

window.minecraft2d.blockStacks = [];

window.minecraft2d.hoveredBlock = null;
window.minecraft2d.hoveredBlockDestroyProgress = -1.0;

window.minecraft2d.createDOMBlock = function(block) {
    let domblock = document.createElement('img');
    domblock.classList.add('block');
    domblock.block = block;
    domblock.src = 'assets/blocks/' + window.minecraft2d.blockTypes[block.blockTypeId].texture;
    if (block.blockTypeId !== 0) {
        domblock.addEventListener('mouseover', (ev) => {
            window.minecraft2d.stopBreakingHoveredBlock();
            window.minecraft2d.hoveredBlock = block;
            domblock.classList.add('blockhovered');
            domblock.parentNode.classList.add('hasblockhovered');
        });
        domblock.addEventListener('mouseout', (ev) => {
            window.minecraft2d.stopBreakingHoveredBlock();
            window.minecraft2d.hoveredBlock = null;
            domblock.classList.remove('blockhovered');
            domblock.parentNode.classList.remove('hasblockhovered');
        });
    }
    domblock.addEventListener('dragstart', (ev) => ev.preventDefault());
    block.domElement = domblock;
    return domblock;    
};

window.minecraft2d.updateBlock = function(x, y, block) {
    window.minecraft2d.ensureBlockStack(x);
    if (window.minecraft2d.blockStacks[x].blocks.length <= y) {
        for (let i = window.minecraft2d.blockStacks[x].blocks.length; i < y; i++) {
            let airblock = new Block(0);
            airblock.x = x;
            airblock.y = y + i;
            window.minecraft2d.blockStacks[x].blocks.push(airblock);
            window.minecraft2d.blockStacks[x].appendChild(window.minecraft2d.createDOMBlock(airblock));
        }
        window.minecraft2d.blockStacks[x].blocks.push(block);
        window.minecraft2d.blockStacks[x].appendChild(window.minecraft2d.createDOMBlock(block));
    } else {
        window.minecraft2d.blockStacks[x].blocks[y] = block;
        window.minecraft2d.blockStacks[x].children[y].replaceWith(window.minecraft2d.createDOMBlock(block));
    }
    block.x = x;
    block.y = y;
};

window.minecraft2d.ensureBlockStack = function(x) {
    if (typeof window.minecraft2d.blockStacks[x] === 'undefined') {
        let blockStack = document.createElement('div');
        blockStack.classList.add('blockstack');
        blockStack.setAttribute('x', x);
        blockStack.style.left = x * 64 + 'px';
        document.getElementById('blockstacks').appendChild(blockStack);
        blockStack.blocks = [];
        window.minecraft2d.blockStacks[x] = blockStack;
        return false;
    } else {
        return true;
    }
};

window.minecraft2d.getBlockAt = function(x, y) {

    if (typeof window.minecraft2d.blockStacks[x] === 'undefined')
        return null;

    if (typeof window.minecraft2d.blockStacks[x].blocks[y] === 'undefined')
        return null;

    return window.minecraft2d.blockStacks[x].blocks[y];
};

window.minecraft2d.isAir = function(x, y) {
    const block = window.minecraft2d.getBlockAt(x, y);
    return block === null || block.blockTypeId === 0;
}

window.minecraft2d.isBlockAir = function(block) {
    return block === null || block.blockTypeId === 0; 
}

window.minecraft2d.getBlocksIn = function(x0, y0, x1, y1) {
    const blocks = [];
    for (let x = Math.floor(x0); x < Math.ceil(x1); x++) {
        for (let y = Math.floor(y0); y < Math.ceil(y1); y++) {
            const block = window.minecraft2d.getBlockAt(x, y);
            if (!window.minecraft2d.isBlockAir(block)) {
                blocks.push(block);
            }
        }
    }
    return blocks;
}

window.minecraft2d.blockTypes = [
    new BlockType('Air', 'air.png'),
    new BlockType('Grass Block', 'grass_block_side.png'),
    new BlockType('Dirt', 'dirt.png'),
    new BlockType('Stone', 'stone.png'),
    new BlockType('Bedrock', 'bedrock.png'),
];
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
        return new minecraft2d.BlockItemStack(this, 1);
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
        return minecraft2d.blockTypes[this.blockTypeId].createItemStack();
    }
}

minecraft2d.BlockType = BlockType;
minecraft2d.Block = Block;

minecraft2d.blockStacks = [];

minecraft2d.hoveredBlock = null;
minecraft2d.hoveredBlockDestroyProgress = -1.0;

minecraft2d.createDOMBlock = function(block) {
    let domblock = document.createElement('img');
    domblock.classList.add('block');
    domblock.block = block;
    domblock.src = 'assets/blocks/' + minecraft2d.blockTypes[block.blockTypeId].texture;
    if (block.blockTypeId !== 0) {
        domblock.addEventListener('mouseover', (ev) => {
            minecraft2d.stopBreakingHoveredBlock();
            minecraft2d.hoveredBlock = block;
            domblock.classList.add('blockhovered');
            domblock.parentNode.classList.add('hasblockhovered');
        });
        domblock.addEventListener('mouseout', (ev) => {
            minecraft2d.stopBreakingHoveredBlock();
            minecraft2d.hoveredBlock = null;
            domblock.classList.remove('blockhovered');
            domblock.parentNode.classList.remove('hasblockhovered');
        });
    }
    domblock.addEventListener('dragstart', (ev) => ev.preventDefault());
    block.domElement = domblock;
    return domblock;    
};

minecraft2d.updateBlock = function(x, y, block) {
    minecraft2d.ensureBlockStack(x);
    if (minecraft2d.blockStacks[x].blocks.length <= y) {
        for (let i = minecraft2d.blockStacks[x].blocks.length; i < y; i++) {
            let airblock = new Block(0);
            airblock.x = x;
            airblock.y = y + i;
            minecraft2d.blockStacks[x].blocks.push(airblock);
            minecraft2d.blockStacks[x].appendChild(minecraft2d.createDOMBlock(airblock));
        }
        minecraft2d.blockStacks[x].blocks.push(block);
        minecraft2d.blockStacks[x].appendChild(minecraft2d.createDOMBlock(block));
    } else {
        minecraft2d.blockStacks[x].blocks[y] = block;
        minecraft2d.blockStacks[x].children[y].replaceWith(minecraft2d.createDOMBlock(block));
    }
    block.x = x;
    block.y = y;
};

minecraft2d.ensureBlockStack = function(x) {
    if (typeof minecraft2d.blockStacks[x] === 'undefined') {
        let blockStack = document.createElement('div');
        blockStack.classList.add('blockstack');
        blockStack.setAttribute('x', x);
        blockStack.style.left = x * 64 + 'px';
        document.getElementById('blockstacks').appendChild(blockStack);
        blockStack.blocks = [];
        minecraft2d.blockStacks[x] = blockStack;
        return false;
    } else {
        return true;
    }
};

minecraft2d.getBlockAt = function(x, y) {

    if (typeof minecraft2d.blockStacks[x] === 'undefined')
        return null;

    if (typeof minecraft2d.blockStacks[x].blocks[y] === 'undefined')
        return null;

    return minecraft2d.blockStacks[x].blocks[y];
};

minecraft2d.isAir = function(x, y) {
    const block = minecraft2d.getBlockAt(x, y);
    return block === null || block.blockTypeId === 0;
}

minecraft2d.isBlockAir = function(block) {
    return block === null || block.blockTypeId === 0; 
}

minecraft2d.getBlocksIn = function(x0, y0, x1, y1) {
    const blocks = [];
    for (let x = Math.floor(x0); x < Math.ceil(x1); x++) {
        for (let y = Math.floor(y0); y < Math.ceil(y1); y++) {
            const block = minecraft2d.getBlockAt(x, y);
            if (!minecraft2d.isBlockAir(block)) {
                blocks.push(block);
            }
        }
    }
    return blocks;
}

minecraft2d.blockTypes = [
    new BlockType('Air', 'air.png'),
    new BlockType('Grass Block', 'grass_block_side.png'),
    new BlockType('Dirt', 'dirt.png'),
    new BlockType('Stone', 'stone.png'),
    new BlockType('Bedrock', 'bedrock.png'),
];
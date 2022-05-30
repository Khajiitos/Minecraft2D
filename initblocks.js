let ids = 0;

class BlockType {
    name = "";
    texture = ""
    id = 0;

    constructor(name, texture) {
        this.id = ids++;
        this.name = name;
        this.texture = texture;
    }
}

class Block {
    blockTypeId = 0;

    constructor(blockTypeId) {
        this.blockTypeId = blockTypeId;
    }
}

window.minecraft2d.BlockType = BlockType;
window.minecraft2d.Block = Block;

window.minecraft2d.blockStacks = [];

window.minecraft2d.createDOMBlock = function(block) {
    let domblock = document.createElement('img');
    domblock.classList.add('block');
    domblock.block = block;
    domblock.src = 'assets/blocks/' + window.minecraft2d.blocktypes[block.blockTypeId].texture;
    return domblock;
};

window.minecraft2d.updateBlock = function(x, y, block) {
    window.minecraft2d.ensureBlockStack(x);
    if (window.minecraft2d.blockStacks[x].blocks.length <= y) {
        for (let i = window.minecraft2d.blockStacks[x].blocks.length; i < y; i++) {
            let airblock = new Block(0);
            window.minecraft2d.blockStacks[x].blocks.push(airblock);
            window.minecraft2d.blockStacks[x].appendChild(window.minecraft2d.createDOMBlock(airblock));
        }
        window.minecraft2d.blockStacks[x].blocks.push(block);
        window.minecraft2d.blockStacks[x].appendChild(window.minecraft2d.createDOMBlock(block));
    } else {
        window.minecraft2d.blockStacks[x].blocks[y] = block;
        window.minecraft2d.blockStacks[x].children[y].replaceWith(window.minecraft2d.createDOMBlock(block));
    }
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
    }
};

window.minecraft2d.getBlockAt = (x, y) => {

    if (typeof window.minecraft2d.blockStacks[x] === 'undefined')
        return null;

    if (typeof window.minecraft2d.blockStacks[x].blocks[y] === 'undefined')
        return null;

    return window.minecraft2d.blockStacks[x].blocks[y];
}

window.minecraft2d.blocktypes = [
    new BlockType('Air', 'air.png'),
    new BlockType('Grass Block', 'grass_block_side.png'),
    new BlockType('Dirt', 'dirt.png'),
    new BlockType('Stone', 'stone.png'),
    new BlockType('Bedrock', 'bedrock.png'),
];
class Entity {
    entityId = 0;
    health = 20;
    position = {
        x: 0.0,
        y: 0.0
    };
    rotation = 0.0;
    boundingBoxHeight = 1.0;
    boundingBoxWidth = 1.0;
    eyePosYOffset = 0.8;
    texture = '';
    domElement = null;
    ticksInAir = 0;
    jumped = false;

    tick() {
        if (minecraft2d.getBlocksIn(this.position.x - (this.boundingBoxWidth / 2.0), this.position.y - 0.05, this.position.x + (this.boundingBoxWidth / 2.0), this.position.y).length === 0) {
            this.ticksInAir++;
        } else {
            this.ticksInAir = 0;
            this.jumped = false;
        }

        if (this.ticksInAir > 0) {
            const fallSpeed = Math.pow(Math.min(this.ticksInAir / 20, 0.9), 2) + 0.15;
            if (minecraft2d.getBlocksIn(this.position.x - (this.boundingBoxWidth / 2.0), this.position.y - fallSpeed, this.position.x + (this.boundingBoxWidth / 2.0), this.position.y).length === 0) {
                this.position.y -= fallSpeed;
            } else {
                const distanceToBlock = this.position.y - Math.floor(this.position.y);
                this.position.y -= distanceToBlock;
            }
        }
        
        this.domElement.style.left = (this.position.x - (this.boundingBoxWidth / 2.0)) * 64 + 'px';
        this.domElement.style.bottom = this.position.y * 64 + 'px';
    }
}

class Player extends Entity {
    food = 20;
    
    constructor() {
        super();
        this.boundingBoxHeight = 1.75;
        this.boundingBoxWidth = 0.9;
        this.eyePosYOffset = 1.55;
        this.texture = 'player.png';
    }

    tick() {
        const eyePosX = this.position.x;
        const eyePosY = this.position.y + this.eyePosYOffset;
        const mouseX = minecraft2d.getGameCursorPosition().x;
        const mouseY = minecraft2d.getGameCursorPosition().y;
        this.rotation = Math.atan2(mouseY - eyePosY, mouseX - eyePosX) * 180.0 / Math.PI;
        const horizontalSpeed = 0.17 + (Math.random() * 0.01);
        if (minecraft2d.isKeyPressed('d')) {
            if (minecraft2d.getBlocksIn(this.position.x + (this.boundingBoxWidth / 2.0), this.position.y, this.position.x + (this.boundingBoxWidth / 2.0) + horizontalSpeed, this.position.y + this.boundingBoxHeight).length === 0) {
                minecraft2d.player.position.x += horizontalSpeed;
            } else {
                const distanceToBlock = Math.ceil(this.position.x + (this.boundingBoxWidth / 2.0)) - (this.position.x + (this.boundingBoxWidth / 2.0));
                minecraft2d.player.position.x += distanceToBlock;
            }
        }
        if (minecraft2d.isKeyPressed('a')) {
            if (minecraft2d.getBlocksIn(this.position.x - (this.boundingBoxWidth / 2.0) - horizontalSpeed, this.position.y, this.position.x - (this.boundingBoxWidth / 2.0), this.position.y + this.boundingBoxHeight).length === 0) {
                minecraft2d.player.position.x -= horizontalSpeed;
            } else {
                const distanceToBlock = Math.floor(this.position.x - (this.boundingBoxWidth / 2.0)) - (this.position.x - (this.boundingBoxWidth / 2.0));
                minecraft2d.player.position.x += distanceToBlock;
            }
        }
        if (minecraft2d.isKeyPressed(' ')) {
            if (!this.jumped) {
                const blocks = minecraft2d.getBlocksIn(this.position.x - (this.boundingBoxWidth / 2.0), this.position.y + this.boundingBoxHeight, this.position.x + (this.boundingBoxWidth / 2.0), this.position.y + this.boundingBoxHeight + 1.35);
                if (blocks.length === 0) {
                    minecraft2d.player.position.y += 1.35;
                } else {
                    let lowestY = blocks[0].y;
                    for (const block of blocks) {
                        if (block.y < lowestY) {
                            lowestY = block.y;
                        }
                    }
                    const distanceToBlock = lowestY - (this.position.y + this.boundingBoxHeight);
                    minecraft2d.player.position.y += distanceToBlock;
                }
                this.jumped = true;
            }
        }
        minecraft2d.handleBreakingBlocks();

        super.tick();
    }
}

minecraft2d.startBreakingHoveredBlock = function() {
    if (!minecraft2d.hoveredBlock) return;
    if (!minecraft2d.hoveredBlock.domElement.parentNode) return;
    let imgBreak = document.createElement('img');
    imgBreak.classList.add('block');
    imgBreak.classList.add('blockbreak');
    imgBreak.src = 'assets/blocks/destroy_stage_0.png';
    minecraft2d.hoveredBlock.domElement.parentNode.appendChild(imgBreak);
    imgBreak.style.transform = `translateY(${(minecraft2d.hoveredBlock.domElement.parentNode.childElementCount - minecraft2d.hoveredBlock.y - 1) * 64}px)`;
    minecraft2d.hoveredBlock.imgBreak = imgBreak;
    minecraft2d.hoveredBlockDestroyProgress = 0.0;
}

minecraft2d.stopBreakingHoveredBlock = function() {

    minecraft2d.hoveredBlockDestroyProgress = -1.0;
    if (!minecraft2d.hoveredBlock) return;
    if (!minecraft2d.hoveredBlock.imgBreak) return;
    
    minecraft2d.hoveredBlock.imgBreak.remove();
    minecraft2d.hoveredBlock.imgBreak = undefined;
}

minecraft2d.progressBreakingHoveredBlock = function(by) {
    minecraft2d.hoveredBlockDestroyProgress += by;

    if (minecraft2d.hoveredBlockDestroyProgress >= 0.9) {
        minecraft2d.hoveredBlock.imgBreak.src = 'assets/blocks/destroy_stage_9.png';
    } else if (minecraft2d.hoveredBlockDestroyProgress >= 0.8) {
        minecraft2d.hoveredBlock.imgBreak.src = 'assets/blocks/destroy_stage_8.png';
    } else if (minecraft2d.hoveredBlockDestroyProgress >= 0.7) {
        minecraft2d.hoveredBlock.imgBreak.src = 'assets/blocks/destroy_stage_7.png';
    } else if (minecraft2d.hoveredBlockDestroyProgress >= 0.6) {
        minecraft2d.hoveredBlock.imgBreak.src = 'assets/blocks/destroy_stage_6.png';
    } else if (minecraft2d.hoveredBlockDestroyProgress >= 0.5) {
        minecraft2d.hoveredBlock.imgBreak.src = 'assets/blocks/destroy_stage_5.png';
    } else if (minecraft2d.hoveredBlockDestroyProgress >= 0.4) {
        minecraft2d.hoveredBlock.imgBreak.src = 'assets/blocks/destroy_stage_4.png';
    } else if (minecraft2d.hoveredBlockDestroyProgress >= 0.3) {
        minecraft2d.hoveredBlock.imgBreak.src = 'assets/blocks/destroy_stage_3.png';
    } else if (minecraft2d.hoveredBlockDestroyProgress >= 0.2) {
        minecraft2d.hoveredBlock.imgBreak.src = 'assets/blocks/destroy_stage_2.png';
    } else if (minecraft2d.hoveredBlockDestroyProgress >= 0.1) {
        minecraft2d.hoveredBlock.imgBreak.src = 'assets/blocks/destroy_stage_1.png';
    } else {
        minecraft2d.hoveredBlock.imgBreak.src = 'assets/blocks/destroy_stage_0.png';
    }
}

minecraft2d.handleBreakingBlocks = function() {
    if (!minecraft2d.hoveredBlock ||
    minecraft2d.hoveredBlock.blockTypeId === 0 ||
    minecraft2d.hoveredBlock.blockTypeId === 4 ||
    !minecraft2d.leftMousePressed) {
        minecraft2d.stopBreakingHoveredBlock();
        return;
    }

    const blockCenterX = minecraft2d.hoveredBlock.x + 0.5;
    const blockCenterY = minecraft2d.hoveredBlock.y + 0.5;

    const eyePosX = minecraft2d.player.position.x;
    const eyePosY = minecraft2d.player.position.y + minecraft2d.player.eyePosYOffset;

    if (Math.sqrt(Math.pow(blockCenterX - eyePosX, 2) + Math.pow(blockCenterY - eyePosY, 2)) > 3.0) {
        minecraft2d.stopBreakingHoveredBlock();
        return;
    }

    if (minecraft2d.hoveredBlockDestroyProgress === -1.0) {
        minecraft2d.startBreakingHoveredBlock();
    }
    minecraft2d.progressBreakingHoveredBlock(0.06);
    if (minecraft2d.hoveredBlockDestroyProgress >= 1.0) {
        minecraft2d.stopBreakingHoveredBlock();
        minecraft2d.updateBlock(minecraft2d.hoveredBlock.x, minecraft2d.hoveredBlock.y, new Block(0));
        minecraft2d.addItem(minecraft2d.hoveredBlock.createItemStack());
        minecraft2d.blockStacks[minecraft2d.hoveredBlock.x].classList.remove('hasblockhovered');
        minecraft2d.hoveredBlock = null;
    }
}

minecraft2d.Entity = Entity;
minecraft2d.Player = Player;

minecraft2d.entities = [];

minecraft2d.createDOMEntity = function(entity) {
    let entityimg = document.createElement('img');
    entityimg.src = 'assets/entities/' + entity.texture;
    entityimg.classList.add('entity');
    entityimg.entity = entity;
    entityimg.style.width = 64 * entity.boundingBoxWidth + 'px';
    entityimg.style.height = 64 * entity.boundingBoxHeight + 'px';
    entity.domElement = entityimg;
    return entityimg;
};

minecraft2d.createEntity = function(entity) {
    let domEntity = minecraft2d.createDOMEntity(entity);
    document.getElementById('entities').appendChild(domEntity);
    minecraft2d.entities.push(entity);
}

minecraft2d.getEntitiesIn = function(x0, y0, x1, y1) {
    const entities = [];
    for (const entity of minecraft2d.entities) {
        const x0_ent = entity.position.x - (entity.boundingBoxWidth / 2.0);
        const y0_ent = entity.position.y;
        const x1_ent = entity.position.x + (entity.boundingBoxWidth / 2.0);
        const y1_ent = entity.position.y + entity.boundingBoxHeight;

        if (x1 > x0_ent && x0 < x1_ent && y1_ent > y0 && y0_ent < y1) {
            entities.push(entity);
        }
    }
    return entities;
}

window.addEventListener('mousedown', (ev) => {
    if (ev.button === 2) {
        const cursorPosX = minecraft2d.getGameCursorPosition().x;
        const cursorPosY = minecraft2d.getGameCursorPosition().y;
        const eyePosX = minecraft2d.player.position.x;
        const eyePosY = minecraft2d.player.position.y + minecraft2d.player.eyePosYOffset;

        if (Math.sqrt(Math.pow(cursorPosX - eyePosX, 2) + Math.pow(cursorPosY - eyePosY, 2)) > 3.0) {
            return;
        }

        const hotbarItem = minecraft2d.inventory[minecraft2d.selectedHotbarItem];

        if (!hotbarItem || !(hotbarItem instanceof BlockItemStack)) {
            return;
        }

        const blockX = Math.floor(cursorPosX);
        const blockY = Math.floor(cursorPosY);

        const selectedBlock = minecraft2d.getBlockAt(blockX, blockY);

        if (selectedBlock && selectedBlock.blockTypeId !== 0) {
            return;
        }

        if (minecraft2d.isAir(blockX - 1, blockY) &&
            minecraft2d.isAir(blockX, blockY + 1) &&
            minecraft2d.isAir(blockX + 1, blockY) &&
            minecraft2d.isAir(blockX, blockY-1)) {
            return;
        }

        if (minecraft2d.getEntitiesIn(blockX, blockY, blockX + 1, blockY + 1).length !== 0) {
            return;
        }

        minecraft2d.updateBlock(blockX, blockY, new Block(hotbarItem.blockTypeId));
        hotbarItem.count--;
        if (hotbarItem.count <= 0) {
            minecraft2d.inventory[minecraft2d.selectedHotbarItem] = null;
        }
        minecraft2d.updateInventory();
    }
});
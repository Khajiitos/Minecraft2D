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
        if (window.minecraft2d.getBlocksIn(this.position.x - (this.boundingBoxWidth / 2.0), this.position.y - 0.05, this.position.x + (this.boundingBoxWidth / 2.0), this.position.y).length === 0) {
            this.ticksInAir++;
        } else {
            this.ticksInAir = 0;
            this.jumped = false;
        }

        if (this.ticksInAir > 0) {
            const fallSpeed = Math.pow(Math.min(this.ticksInAir / 20), 2) + 0.15;
            if (window.minecraft2d.getBlocksIn(this.position.x - (this.boundingBoxWidth / 2.0), this.position.y - fallSpeed, this.position.x + (this.boundingBoxWidth / 2.0), this.position.y).length === 0) {
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
        const mouseX = window.minecraft2d.getGameCursorPosition().x;
        const mouseY = window.minecraft2d.getGameCursorPosition().y;
        this.rotation = Math.atan2(mouseY - eyePosY, mouseX - eyePosX) * 180.0 / Math.PI;
        const horizontalSpeed = 0.17 + (Math.random() * 0.01);
        if (window.minecraft2d.isKeyPressed('d')) {
            if (window.minecraft2d.getBlocksIn(this.position.x + (this.boundingBoxWidth / 2.0), this.position.y, this.position.x + (this.boundingBoxWidth / 2.0) + horizontalSpeed, this.position.y + this.boundingBoxHeight).length === 0) {
                window.minecraft2d.player.position.x += horizontalSpeed;
            } else {
                const distanceToBlock = Math.ceil(this.position.x + (this.boundingBoxWidth / 2.0)) - (this.position.x + (this.boundingBoxWidth / 2.0));
                window.minecraft2d.player.position.x += distanceToBlock;
            }
        }
        if (window.minecraft2d.isKeyPressed('a')) {
            if (window.minecraft2d.getBlocksIn(this.position.x - (this.boundingBoxWidth / 2.0) - horizontalSpeed, this.position.y, this.position.x - (this.boundingBoxWidth / 2.0), this.position.y + this.boundingBoxHeight).length === 0) {
                window.minecraft2d.player.position.x -= horizontalSpeed;
            } else {
                const distanceToBlock = Math.floor(this.position.x - (this.boundingBoxWidth / 2.0)) - (this.position.x - (this.boundingBoxWidth / 2.0));
                window.minecraft2d.player.position.x += distanceToBlock;
            }
        }
        if (window.minecraft2d.isKeyPressed(' ')) {
            if (!this.jumped) {
                const blocks = window.minecraft2d.getBlocksIn(this.position.x - (this.boundingBoxWidth / 2.0), this.position.y + this.boundingBoxHeight, this.position.x + (this.boundingBoxWidth / 2.0), this.position.y + this.boundingBoxHeight + 1.35);
                if (blocks.length === 0) {
                    window.minecraft2d.player.position.y += 1.35;
                } else {
                    let lowestY = blocks[0].y;
                    for (const block of blocks) {
                        if (block.y < lowestY) {
                            lowestY = block.y;
                        }
                    }
                    const distanceToBlock = lowestY - (this.position.y + this.boundingBoxHeight);
                    window.minecraft2d.player.position.y += distanceToBlock;
                }
                this.jumped = true;
            }
        }
        window.minecraft2d.handleBreakingBlocks();

        super.tick();
    }
}

window.minecraft2d.startBreakingHoveredBlock = function() {
    if (!window.minecraft2d.hoveredBlock) return;
    if (!window.minecraft2d.hoveredBlock.domElement.parentNode) return;
    let imgBreak = document.createElement('img');
    imgBreak.classList.add('block');
    imgBreak.classList.add('blockbreak');
    imgBreak.src = 'assets/blocks/destroy_stage_0.png';
    window.minecraft2d.hoveredBlock.domElement.parentNode.appendChild(imgBreak);
    imgBreak.style.transform = `translateY(${(window.minecraft2d.hoveredBlock.domElement.parentNode.childElementCount - window.minecraft2d.hoveredBlock.y - 1) * 64}px)`;
    window.minecraft2d.hoveredBlock.imgBreak = imgBreak;
    window.minecraft2d.hoveredBlockDestroyProgress = 0.0;
}

window.minecraft2d.stopBreakingHoveredBlock = function() {

    window.minecraft2d.hoveredBlockDestroyProgress = -1.0;
    if (!window.minecraft2d.hoveredBlock) return;
    if (!window.minecraft2d.hoveredBlock.imgBreak) return;
    
    window.minecraft2d.hoveredBlock.imgBreak.remove();
    window.minecraft2d.hoveredBlock.imgBreak = undefined;
}

window.minecraft2d.progressBreakingHoveredBlock = function(by) {
    window.minecraft2d.hoveredBlockDestroyProgress += by;

    if (window.minecraft2d.hoveredBlockDestroyProgress >= 0.9) {
        window.minecraft2d.hoveredBlock.imgBreak.src = 'assets/blocks/destroy_stage_9.png';
    } else if (window.minecraft2d.hoveredBlockDestroyProgress >= 0.8) {
        window.minecraft2d.hoveredBlock.imgBreak.src = 'assets/blocks/destroy_stage_8.png';
    } else if (window.minecraft2d.hoveredBlockDestroyProgress >= 0.7) {
        window.minecraft2d.hoveredBlock.imgBreak.src = 'assets/blocks/destroy_stage_7.png';
    } else if (window.minecraft2d.hoveredBlockDestroyProgress >= 0.6) {
        window.minecraft2d.hoveredBlock.imgBreak.src = 'assets/blocks/destroy_stage_6.png';
    } else if (window.minecraft2d.hoveredBlockDestroyProgress >= 0.5) {
        window.minecraft2d.hoveredBlock.imgBreak.src = 'assets/blocks/destroy_stage_5.png';
    } else if (window.minecraft2d.hoveredBlockDestroyProgress >= 0.4) {
        window.minecraft2d.hoveredBlock.imgBreak.src = 'assets/blocks/destroy_stage_4.png';
    } else if (window.minecraft2d.hoveredBlockDestroyProgress >= 0.3) {
        window.minecraft2d.hoveredBlock.imgBreak.src = 'assets/blocks/destroy_stage_3.png';
    } else if (window.minecraft2d.hoveredBlockDestroyProgress >= 0.2) {
        window.minecraft2d.hoveredBlock.imgBreak.src = 'assets/blocks/destroy_stage_2.png';
    } else if (window.minecraft2d.hoveredBlockDestroyProgress >= 0.1) {
        window.minecraft2d.hoveredBlock.imgBreak.src = 'assets/blocks/destroy_stage_1.png';
    } else {
        window.minecraft2d.hoveredBlock.imgBreak.src = 'assets/blocks/destroy_stage_0.png';
    }
}

window.minecraft2d.handleBreakingBlocks = function() {
    if (!window.minecraft2d.hoveredBlock ||
    window.minecraft2d.hoveredBlock.blockTypeId === 0 ||
    window.minecraft2d.hoveredBlock.blockTypeId === 4 ||
    !window.minecraft2d.leftMousePressed) {
        window.minecraft2d.stopBreakingHoveredBlock();
        return;
    }

    const blockCenterX = window.minecraft2d.hoveredBlock.x + 0.5;
    const blockCenterY = window.minecraft2d.hoveredBlock.y + 0.5;

    const eyePosX = window.minecraft2d.player.position.x;
    const eyePosY = window.minecraft2d.player.position.y + window.minecraft2d.player.eyePosYOffset;

    if (Math.sqrt(Math.pow(blockCenterX - eyePosX, 2) + Math.pow(blockCenterY - eyePosY, 2)) > 3.0) {
        window.minecraft2d.stopBreakingHoveredBlock();
        return;
    }

    if (window.minecraft2d.hoveredBlockDestroyProgress === -1.0) {
        window.minecraft2d.startBreakingHoveredBlock();
    }
    window.minecraft2d.progressBreakingHoveredBlock(0.06);
    if (window.minecraft2d.hoveredBlockDestroyProgress >= 1.0) {
        window.minecraft2d.stopBreakingHoveredBlock();
        window.minecraft2d.updateBlock(window.minecraft2d.hoveredBlock.x, window.minecraft2d.hoveredBlock.y, new Block(0));
        window.minecraft2d.addItem(window.minecraft2d.hoveredBlock.createItemStack());
        window.minecraft2d.hoveredBlock = null;
    }
}

window.minecraft2d.Entity = Entity;
window.minecraft2d.Player = Player;

window.minecraft2d.entities = [];

window.minecraft2d.createDOMEntity = function(entity) {
    let entityimg = document.createElement('img');
    entityimg.src = 'assets/entities/' + entity.texture;
    entityimg.classList.add('entity');
    entityimg.entity = entity;
    entityimg.style.width = 64 * entity.boundingBoxWidth + 'px';
    entityimg.style.height = 64 * entity.boundingBoxHeight + 'px';
    entity.domElement = entityimg;
    return entityimg;
};

window.minecraft2d.createEntity = function(entity) {
    let domEntity = window.minecraft2d.createDOMEntity(entity);
    document.getElementById('entities').appendChild(domEntity);
    window.minecraft2d.entities.push(entity);
}

window.minecraft2d.getEntitiesIn = function(x0, y0, x1, y1) {
    const entities = [];
    for (const entity of window.minecraft2d.entities) {
        const x0_ent = entity.position.x - (entity.boundingBoxWidth / 2.0);
        const y0_ent = entity.position.y;
        const x1_ent = entity.position.x + (entity.boundingBoxWidth / 2.0);
        const y1_ent = entity.position.y + entity.boundingBoxHeight;

        if (x1 >= x0_ent && x0 <= x1_ent && y1_ent >= y0 && y0_ent <= y1) {
            entities.push(entity);
        }
    }
    return entities;
}

window.addEventListener('mousedown', (ev) => {
    if (ev.button === 2) {
        const cursorPosX = window.minecraft2d.getGameCursorPosition().x;
        const cursorPosY = window.minecraft2d.getGameCursorPosition().y;
        const eyePosX = window.minecraft2d.player.position.x;
        const eyePosY = window.minecraft2d.player.position.y + window.minecraft2d.player.eyePosYOffset;

        if (Math.sqrt(Math.pow(cursorPosX - eyePosX, 2) + Math.pow(cursorPosY - eyePosY, 2)) > 3.0) {
            return;
        }

        const hotbarItem = window.minecraft2d.inventory[window.minecraft2d.selectedHotbarItem];

        if (!hotbarItem || !(hotbarItem instanceof BlockItemStack)) {
            return;
        }

        const blockX = Math.floor(cursorPosX);
        const blockY = Math.floor(cursorPosY);

        const selectedBlock = window.minecraft2d.getBlockAt(blockX, blockY);

        if (selectedBlock && selectedBlock.blockTypeId !== 0) {
            return;
        }

        if (window.minecraft2d.isAir(blockX - 1, blockY) &&
            window.minecraft2d.isAir(blockX, blockY + 1) &&
            window.minecraft2d.isAir(blockX + 1, blockY) &&
            window.minecraft2d.isAir(blockX, blockY-1)) {
            return;
        }

        if (window.minecraft2d.getEntitiesIn(blockX, blockY, blockX + 1, blockY + 1).length !== 0) {
            return;
        }

        window.minecraft2d.updateBlock(blockX, blockY, new Block(hotbarItem.blockTypeId));
        hotbarItem.count--;
        if (hotbarItem.count <= 0) {
            window.minecraft2d.inventory[window.minecraft2d.selectedHotbarItem] = null;
        }
        window.minecraft2d.updateInventory();
    }
});
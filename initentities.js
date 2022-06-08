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

    tick() {
        // Gravity, also makes sure to fall right on the block and not float a little bit above it
        let blockUnderFeetLeft = window.minecraft2d.getBlockAt(Math.floor(this.position.x - (this.boundingBoxWidth / 2.0)), Math.floor(this.position.y));
        let blockUnderFeetRight = window.minecraft2d.getBlockAt(Math.floor(this.position.x + (this.boundingBoxWidth / 2.0)), Math.floor(this.position.y));
        if ((blockUnderFeetLeft === null || blockUnderFeetLeft.blockTypeId === 0) && (blockUnderFeetRight === null || blockUnderFeetRight.blockTypeId === 0)) {
            this.position.y -= 0.15;
            let blockUnderFeetLeftNow = window.minecraft2d.getBlockAt(Math.floor(this.position.x - (this.boundingBoxWidth / 2.0)), Math.floor(this.position.y));
            let blockUnderFeetRightNow = window.minecraft2d.getBlockAt(Math.floor(this.position.x + (this.boundingBoxWidth / 2.0)), Math.floor(this.position.y));
            if ((blockUnderFeetLeftNow !== null && blockUnderFeetLeftNow.blockTypeId !== 0) || (blockUnderFeetRightNow !== null && blockUnderFeetRightNow.blockTypeId !== 0)) {
                this.position.y = Math.ceil(this.position.y);
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
        this.boundingBoxHeight = 1.85;
        this.boundingBoxWidth = 0.925;
        this.eyePosYOffset = 1.55;
        this.texture = 'player.png';
    }

    tick() {
        super.tick();
        const eyePosX = this.position.x;
        const eyePosY = this.position.y + this.eyePosYOffset;
        const mouseX = window.minecraft2d.getGameCursorPosition().x;
        const mouseY = window.minecraft2d.getGameCursorPosition().y;
        this.rotation = Math.atan2(mouseY - eyePosY, mouseX - eyePosX) * 180.0 / Math.PI;

        if (window.minecraft2d.isKeyPressed('d')) {
            window.minecraft2d.player.position.x += 0.175;
        }
        if (window.minecraft2d.isKeyPressed('a')) {
            window.minecraft2d.player.position.x -= 0.175;
        }
        if (window.minecraft2d.isKeyPressed(' ')) {
            window.minecraft2d.player.position.y += 0.3;
        }
        window.minecraft2d.handleBreakingBlocks();
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

window.minecraft2d.entitiesDOM = [];

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
    window.minecraft2d.entitiesDOM.push(domEntity);
}
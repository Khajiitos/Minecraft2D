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
        this.texture = 'player.png';
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
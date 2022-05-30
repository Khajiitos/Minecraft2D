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
    return entityimg;
};

window.minecraft2d.createEntity = function(entity) {
    let domEntity = window.minecraft2d.createDOMEntity(entity);
    document.getElementById('entities').appendChild(domEntity);
    window.minecraft2d.entitiesDOM.push(domEntity);
}
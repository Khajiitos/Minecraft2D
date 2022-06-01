window.minecraft2d.generateBlockStack = function(x) {
    window.minecraft2d.updateBlock(x, 0, new window.minecraft2d.Block(4));
    window.minecraft2d.updateBlock(x, 1, new window.minecraft2d.Block(2));
    window.minecraft2d.updateBlock(x, 2, new window.minecraft2d.Block(2));
    window.minecraft2d.updateBlock(x, 3, new window.minecraft2d.Block(2));
    window.minecraft2d.updateBlock(x, 4, new window.minecraft2d.Block(1));
};

window.minecraft2d.handleWorldGeneration = function() {
    const visibleStacks = window.minecraft2d.getVisibleStacks();

    for (let stack of visibleStacks) {
        if (!window.minecraft2d.ensureBlockStack(stack)) {
            window.minecraft2d.generateBlockStack(stack);
        }
    }
};
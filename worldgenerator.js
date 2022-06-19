minecraft2d.generateBlockStack = function(x) {
    minecraft2d.updateBlock(x, 0, new minecraft2d.Block(4));
    minecraft2d.updateBlock(x, 1, new minecraft2d.Block(2));
    minecraft2d.updateBlock(x, 2, new minecraft2d.Block(2));
    minecraft2d.updateBlock(x, 3, new minecraft2d.Block(2));
    minecraft2d.updateBlock(x, 4, new minecraft2d.Block(1));
};

minecraft2d.handleWorldGeneration = function() {
    const visibleStacks = minecraft2d.getVisibleStacks();

    for (let stack of visibleStacks) {
        if (!minecraft2d.ensureBlockStack(stack)) {
            minecraft2d.generateBlockStack(stack);
        }
    }
};
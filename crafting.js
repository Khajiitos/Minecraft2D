minecraft2d.craftingRecipes = [];

minecraft2d.loadRecipes = function() {
    const req = new XMLHttpRequest();
    req.open('GET', 'crafting_recipes.json');

    req.onload = (ev) => {
        minecraft2d.craftingRecipes = JSON.parse(req.responseText);
    }

    req.send();
}

minecraft2d.loadRecipes();

function shapelessIngredientsMatch(currentIngredients, craftIngredients) {
    if (currentIngredients.length !== craftIngredients.length) {
        return false;
    }

    let craftIngredientsCopy = [...craftIngredients];
    for (const currentIngredient of currentIngredients) {
        for (let i = 0; i < craftIngredientsCopy.length; i++) {
            if (currentIngredient.itemTypeId === craftIngredientsCopy[i].itemTypeId && (currentIngredient.itemTypeId !== 0 || currentIngredient.blockTypeId === craftIngredientsCopy[i].blockTypeId)) {
                craftIngredientsCopy.splice(i, 1);
                break;   
            }
        }
    }

    return craftIngredientsCopy.length === 0;
};

minecraft2d.getCraft = function(ingredients) {
    for (const recipe of minecraft2d.craftingRecipes) {
        if (recipe.pattern) {
            // later
        } else {
            if (shapelessIngredientsMatch(ingredients.filter(item => item !== null), recipe.ingredients)) {
                if (recipe.result.itemTypeId === 0) {
                    return new minecraft2d.BlockItemStack(minecraft2d.blockTypes[recipe.result.blockTypeId], recipe.result.count);
                } else {
                    return new minecraft2d.ItemStack(minecraft2d.itemTypes[recipe.result.itemTypeId], recipe.result.count);
                }
            }
        }
    }
    return null;
};
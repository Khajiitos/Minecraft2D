window.minecraft2d.craftingRecipes = [];

window.minecraft2d.loadRecipes = function() {
    const req = new XMLHttpRequest();
    req.open('GET', 'crafting_recipes.json');

    req.onload = (ev) => {
        window.minecraft2d.craftingRecipes = JSON.parse(req.responseText);
    }

    req.send();
}

window.minecraft2d.loadRecipes();

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

window.minecraft2d.getCraft = function(ingredients) {
    for (const recipe of window.minecraft2d.craftingRecipes) {
        if (recipe.pattern) {
            // later
        } else {
            if (shapelessIngredientsMatch(ingredients.filter(item => item !== null), recipe.ingredients)) {
                if (recipe.result.itemTypeId === 0) {
                    return new window.minecraft2d.BlockItemStack(window.minecraft2d.blockTypes[recipe.result.blockTypeId], recipe.result.count);
                } else {
                    return new window.minecraft2d.ItemStack(window.minecraft2d.itemTypes[recipe.result.itemTypeId], recipe.result.count);
                }
            }
        }
    }
    return null;
};
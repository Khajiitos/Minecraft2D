window.minecraft2d.loadRecipes = function() {
    const req = new XMLHttpRequest();
    req.open('GET', 'crafting_recipes.json');

    req.onload = (ev) => {
        window.minecraft2d.craftingRecipes = JSON.parse(req.responseText);
    }

    req.send();
}

window.minecraft2d.loadRecipes();
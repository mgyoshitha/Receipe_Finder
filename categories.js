const API_KEY = '';
const categoriesContainer = document.getElementById('categories');

const categories = [
    { name: 'Main Course', icon: 'bi-egg-fried' },
    { name: 'Side Dish', icon: 'bi-layout-sidebar' },
    { name: 'Dessert', icon: 'bi-cake2' },
    { name: 'Appetizer', icon: 'bi-dice-1' },
    { name: 'Salad', icon: 'bi-flower1' },
    { name: 'Bread', icon: 'bi-bread-slice' },
    { name: 'Breakfast', icon: 'bi-cup-hot' },
    { name: 'Soup', icon: 'bi-cup-straw' },
    { name: 'Beverage', icon: 'bi-cup' },
    { name: 'Sauce', icon: 'bi-droplet' },
    { name: 'Marinade', icon: 'bi-droplet-half' },
    { name: 'Snack', icon: 'bi-dice-2' }
];

function displayCategories() {
    categoriesContainer.innerHTML = categories.map(category => `
        <div class="col-md-3 col-sm-6">
            <div class="card h-100 category-card" onclick="searchByCategory('${category.name}')">
                <div class="card-body text-center">
                    <i class="bi ${category.icon} category-icon"></i>
                    <h5 class="card-title mt-3">${category.name}</h5>
                </div>
            </div>
        </div>
    `).join('');
}

async function searchByCategory(category) {
    try {
        const response = await fetch(
            `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&type=${category.toLowerCase()}&number=8`
        );
        const data = await response.json();
        displayCategoryRecipes(data.results, category);
    } catch (error) {
        console.error('Error fetching category recipes:', error);
    }
}

function displayCategoryRecipes(recipes, category) {
    categoriesContainer.innerHTML = `
        <div class="col-12 mb-4">
            <button class="btn btn-outline-primary" onclick="displayCategories()">
                <i class="bi bi-arrow-left"></i> Back to Categories
            </button>
            <h2 class="mt-4">${category} Recipes</h2>
        </div>
        ${recipes.map(recipe => `
            <div class="col-md-3">
                <div class="card h-100">
                    <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}">
                    <div class="card-body">
                        <h5 class="card-title">${recipe.title}</h5>
                        <button class="btn btn-primary mt-3" onclick="window.location.href='index.html?recipe=${recipe.id}'">
                            View Recipe
                        </button>
                    </div>
                </div>
            </div>
        `).join('')}
    `;
}

displayCategories();

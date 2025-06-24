const API_KEY = '';
const weeklyPlanContainer = document.getElementById('weeklyPlan');
const shoppingListContainer = document.getElementById('shoppingList');
const clearShoppingListButton = document.getElementById('clearShoppingList');

// Load saved meal plan and shopping list from localStorage
let mealPlan = JSON.parse(localStorage.getItem('mealPlan')) || {};
let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const meals = ['Breakfast', 'Lunch', 'Dinner'];

function initializeMealPlanner() {
    generateWeeklyPlanStructure();
    displayShoppingList();
    setupEventListeners();
}

function generateWeeklyPlanStructure() {
    weeklyPlanContainer.innerHTML = days.map(day => `
        <div class="card mb-4">
            <div class="card-header bg-light">
                <h5 class="mb-0">${day}</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    ${meals.map(meal => `
                        <div class="col-md-4">
                            <div class="meal-slot mb-3">
                                <h6>${meal}</h6>
                                <div id="${day}-${meal}" class="meal-container">
                                    ${getMealHtml(day, meal)}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

function getMealHtml(day, meal) {
    const mealKey = `${day}-${meal}`;
    const savedMeal = mealPlan[mealKey];
    
    if (savedMeal) {
        return `
            <div class="meal-item">
                <p class="mb-1">${savedMeal.title}</p>
                <button class="btn btn-sm btn-outline-danger" onclick="removeMeal('${mealKey}')">
                    Remove
                </button>
            </div>
        `;
    }
    
    return `
        <button class="btn btn-outline-primary btn-sm" onclick="searchRecipe('${mealKey}')">
            Add Meal
        </button>
    `;
}

async function searchRecipe(mealKey) {
    try {
        const response = await fetch(
            `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=1`
        );
        const data = await response.json();
        const recipe = data.recipes[0];
        
        addMealToPlan(mealKey, {
            id: recipe.id,
            title: recipe.title,
            ingredients: recipe.extendedIngredients
        });
    } catch (error) {
        console.error('Error fetching recipe:', error);
    }
}

function addMealToPlan(mealKey, recipe) {
    mealPlan[mealKey] = recipe;
    localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
    
    // Add ingredients to shopping list
    recipe.ingredients.forEach(ingredient => {
        if (!shoppingList.some(item => item.id === ingredient.id)) {
            shoppingList.push({
                id: ingredient.id,
                name: ingredient.original
            });
        }
    });
    
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
    
    // Update UI
    document.getElementById(mealKey).innerHTML = getMealHtml(
        mealKey.split('-')[0],
        mealKey.split('-')[1]
    );
    displayShoppingList();
}

function removeMeal(mealKey) {
    delete mealPlan[mealKey];
    localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
    
    // Update UI
    document.getElementById(mealKey).innerHTML = getMealHtml(
        mealKey.split('-')[0],
        mealKey.split('-')[1]
    );
}

function displayShoppingList() {
    shoppingListContainer.innerHTML = shoppingList.length
        ? shoppingList.map(item => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${item.name}
                <button class="btn btn-sm btn-outline-danger" onclick="removeFromShoppingList(${item.id})">
                    <i class="bi bi-x"></i>
                </button>
            </li>
        `).join('')
        : '<li class="list-group-item text-muted">No items in shopping list</li>';
}

function removeFromShoppingList(ingredientId) {
    shoppingList = shoppingList.filter(item => item.id !== ingredientId);
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
    displayShoppingList();
}

function setupEventListeners() {
    clearShoppingListButton.addEventListener('click', () => {
        shoppingList = [];
        localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
        displayShoppingList();
    });
}

initializeMealPlanner();
